# frozen_string_literal: true

module Api
  module V1
    module Users
      class RegistrationsController < DeviseTokenAuth::RegistrationsController
        skip_before_action :verify_authenticity_token, only: [:create] # APIではCSRFチェックをしない
        skip_before_action :validate_account_update_params, only: :update # 自前でユーザー認証するので不要
        skip_before_action :set_user_by_token, only: :update
        skip_after_action :update_auth_header
        before_action :user_authentification, only: :update
        after_action :set_csrf_token_header # csrf-tokenの更新

        respond_to :json

        def create
          @user = User.new(sign_up_params)
          if @user.valid?
            if params[:user][:avatar][:data].present? && params[:user][:avatar][:filename].present? # 画像データ自体は送られてくるので中身が空かどうか判定をする
              avatar_attach
            end
            @user.save
            update_auth_header # access-token, clientの発行
            render json: { user: @user }
          else
            render status: 422, json: { errors: @user.errors.full_messages } # バリデーションに引っかかった際のステータスは422(Unprocessable entity)
          end
        end

        
        def update # rubocop:disable Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity
          # ユーザー認証に引っかかった際のステータスは401(Unautorized)
          return render status: 401, json: { errors: 'ユーザーが存在しません' } unless @user && @token && @client
          
          return nil unless params[:user]
          # ニックネームがバリデーションに引っかかるかどうかを検証
          return render status: 422, json: { errors: @user.errors.full_messages }  unless @user.update(nickname: params[:user][:nickname])
          if params[:user][:avatar][:data].present? && params[:user][:avatar][:filename].present?
            # アバターが変更されたときの挙動
            @user.avatar.detach if @user.avatar.attached? #すでにavatarが紐付いていれば外す
            avatar_attach 
            avatar_path = Rails.application.routes.url_helpers.rails_representation_url(@user.avatar.variant({}),
                                                                                      only_path: true)
          end
          update_auth_header # access-token, clientの発行
          # 最後に更新した結果をフロントに返す
          return render json: { user: @user, avatar: avatar_path }  
          
        end

        private

        def sign_up_params
          params.require(:user).permit(:nickname, :email, :password, :password_confirmation)
        end

        def avatar_attach
          # アバター画像が送られてきた際にユーザーと紐付ける
          blob = ActiveStorage::Blob.create_after_upload!(
            io: StringIO.new("#{decode(params[:user][:avatar][:data])}\n"), # UserModal.jsxでfilereaderを使って取得した文字列を復号する
            filename: params[:user][:avatar][:filename] # filenameはUserModal.jsxで取得
          )
          @user.avatar.attach(blob) # 先に作っておいた画像とuserを紐付ける
        end

        def set_csrf_token_header
          response.set_header('X-CSRF-Token', form_authenticity_token)
        end

        def decode(str)
          Base64.decode64(str.split(',').last)
        end

        def update_auth_header
          @token = @user.create_token
          return unless @user && @token.client

          @token.client = nil unless @used_auth_by_token
          if @used_auth_by_token && !DeviseTokenAuth.change_headers_on_each_request
            auth_header = @user.build_auth_header(@token.token, @token.client)
            response.headers.merge!(auth_header)  # access-tokenとclientをresponse.headersにマージ
          else
            refresh_headers
          end
        end

        def user_authentification
          # NewBookModal.jsxでLocalStorageからログインしているuidを抜き出し、request.headerに仕込む
          @user = User.find_for_database_authentication(uid: request.headers['uid'])
          # 同様にaccess-token, clientについてもrequest.headersから抜き出して変数に代入
          @token = request.headers['access-token']
          @client = request.headers['client']
        end
      end
    end
  end
end
