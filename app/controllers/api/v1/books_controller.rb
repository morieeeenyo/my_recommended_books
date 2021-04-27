# frozen_string_literal: true

module Api
  module V1
    class BooksController < ApplicationController
      before_action :user_authentification
      before_action :set_twitter_client, only: :create

      def create
        # ユーザー認証に引っかかった際のステータスは401(Unautorized)
        return render status: 401, json: { errors: '推薦図書の投稿にはログインが必要です' } unless @user && @token && @client

        @book = Book.where(isbn: book_params[:isbn]).first_or_initialize(book_params) # 同じデータを保存しないためにisbnで識別
        if @book.valid?
          @book.save
          @user.books << @book # ユーザーと書籍を紐付ける。ここで書籍が投稿済みの場合は中間テーブルにのみデータが入る。
          render status: 201, json: { book: @book } # ステータスは手動で入れないと反映されない。リソース保存時のステータスは201
          @twitter_client.update!("API連携のテストです。\n『#{@book.title}』を推薦図書に追加しました！ \n #読書 #読書好きとつながりたい #Kaidoku") # アプリURLへの導線を貼る
        else
          render status: 422, json: { errors: @book.errors.full_messages } # バリデーションに引っかかった際のステータスは422(Unprocessable entity)
        end
      end

      def search
        return render status: 401, json: { errors: '書籍の検索にはログインが必要です' } unless @user && @token && @client
        return render status: 406, json: { errors: 'タイトルを入力してください' } if params[:keyword] == '' # 何も入力しなくても空文字列が送られる想定

        @books = RakutenWebService::Books::Book.search(title: params[:keyword]) # TODO: 複数のパラメータで同時に検索できないか検証
        render json: { books: @books }
      end

      private

      def book_params
        params.require(:book).permit(
          :isbn,
          :title,
          :author,
          :author_kana,
          :publisher_name,
          :sales_date,
          :item_price,
          :item_url,
          :image_url
        )
      end

      def user_authentification
        # NewBookModal.jsxでLocalStorageからログインしているuidを抜き出し、request.headerに仕込む
        @user = User.find_for_database_authentication(uid: request.headers['uid'])
        # 同様にaccess-token, clientについてもrequest.headersから抜き出して変数に代入
        @token = request.headers['access-token']
        @client = request.headers['client']
      end

      def set_twitter_client
        @twitter_client = Twitter::REST::Client.new do |config|
          config.access_token        = ENV['TWITTER_ACCESS_TOKEN']
          config.access_token_secret = ENV['TWITTER_ACCESS_TOKEN_SECRET']
          config.consumer_key        = ENV['TWITTER_CONSUMER_KEY']
          config.consumer_secret = ENV['TWITTER_CONSUMER_SECRET']
        end
      end
    end
  end
end
