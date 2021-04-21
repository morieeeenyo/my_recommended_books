# frozen_string_literal: true

module Api
  module V1
    class UsersController < ApplicationController
      before_action :user_authentification

      def show
        # ユーザー認証に引っかかった際のステータスは401(Unautorized)
        return render status: 401, json: { errors: 'ユーザーが見つかりませんでした' } unless @user && @token && @client

        if @user.avatar.attached? # 添付されていないときにエラーが出るのを防ぐ
          avatar_path = Rails.application.routes.url_helpers.rails_representation_url(@user.avatar.variant({}),
                                                                                      only_path: true)
          render json: { user: @user, books: @user.books, avatar: avatar_path }
        else
          render json: { user: @user, books: @user.books }
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
