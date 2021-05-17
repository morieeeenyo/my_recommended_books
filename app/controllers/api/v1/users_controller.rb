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

      def my_outputs
        # ユーザー認証に引っかかった際のステータスは401(Unautorized)
        return render status: 401, json: { errors: 'ユーザーが見つかりませんでした' } unless @user && @token && @client
        @book = Book.find_by(isbn: params[:book_isbn])
        user_book_relation = UserBook.find_by(book_id: @book.id, user_id: @user.id) # ユーザーが書籍を投稿していない場合に処理を失敗させるために中間テーブルを参照
        if user_book_relation
          outputs = Output.fetch_resources(@book.id, @user.id, true) # fect_resourcesメソッドはoutput.rbにて定義
          render json: { outputs: outputs }
        else
          render status: 422, json: { errors: '書籍が推薦図書として追加されていません' }
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
