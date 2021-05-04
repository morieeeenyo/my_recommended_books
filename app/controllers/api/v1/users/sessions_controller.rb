# frozen_string_literal: true

module Api
  module V1
    module Users
      class SessionsController < DeviseTokenAuth::SessionsController
        skip_before_action :verify_authenticity_token, only: [:create] # ログイン時はCSRFチェックをしない
        after_action :set_csrf_token_header # csrf-tokenの更新
        after_action :reset_session, only: [:destroy] # session情報を削除
        respond_to :json

        def create
          @user = User.find_by(email: params[:user][:email])
          # 厳密にemailとpassword同時に判定しているわけではない
          return invalid_email unless @user

          if @user.valid_password?(params[:user][:password])
            sign_in :user, @user
            render json: { user: @user }
          else
            invalid_password
          end
        end

        def destroy
          @user = User.find_for_database_authentication(uid: request.headers['uid'])
          @token = request.headers['access-token']
          @client = request.headers['client']
          if @user && @client && @token # uid, client, access-tokenの3つが揃ったときだけログアウトできる。これはdevise-auth-tokenのデフォルトの処理でもある
            @token = +@token # 凍結しているので解凍する
            @token.clear
            @client = nil
            @user = nil
            render_destroy_success
          else
            render_destroy_error
          end
        end

        private

        # パスワードで引っかかったのかメールアドレスで引っかかったのかわかるようにする
        def invalid_email
          warden.custom_failure!
          # ユーザー認証に引っかかった際のステータスは401(Unautorized)
          render status: 401, json: { errors: ['Authorization failed. Invalid email'] } #新規登録時とエラーメッセージの表示の処理をあわせるために配列で定義
        end

        def invalid_password
          warden.custom_failure!
          render status: 401, json: { errors: ['Authorization failed. Invalid password'] }
        end

        def set_csrf_token_header
          response.set_header('X-CSRF-Token', form_authenticity_token)
        end

        def update_auth_header
          return unless @user # nilClassエラーを防ぐ

          @token = @user.create_token
          return unless @user && @token.client

          @token.client = nil unless @used_auth_by_token
          if @used_auth_by_token && !DeviseTokenAuth.change_headers_on_each_request
            auth_header = @user.build_auth_header(@token.token, @token.client)
            response.headers.merge!(auth_header)  # ここでheaderにaccess-token, clientをマージ
          else
            refresh_headers
          end
        end
      end
    end
  end
end
