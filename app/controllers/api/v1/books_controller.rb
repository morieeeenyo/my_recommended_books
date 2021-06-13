# frozen_string_literal: true

module Api
  module V1
    class BooksController < ApplicationController
      before_action :user_authentification
      # ユーザーが認証済みかどうかチェック
      before_action :set_twitter_client, only: :create

      def index
        # アウトプット投稿数が多い順にソート(これは検索機能で使う)
        # render json: { books: Book.left_joins(:awarenesses).group(:id).order('count(book_id) DESC') }
        render json: { books: Book.order('created_at DESC') }
      end

      def create
        # ユーザー認証に引っかかった際のステータスは401(Unautorized)
        return render status: 401, json: { errors: '推薦図書の投稿にはログインが必要です' } unless @user && @token && @client

        @book = Book.where(isbn: book_params[:isbn]).first_or_initialize(book_params) # 同じデータを保存しないためにisbnで識別
      
        return render status: 422, json: { errors: @book.errors.full_messages } unless @book.valid? # バリデーションに引っかかった際のステータスは422(Unprocessable entity)

        # バリデーション突破時
        @book.save
        user_book_relation = UserBook.find_by(user_id: @user.id, book_id: @book.id)
        if user_book_relation
          render status: 422, json: { errors: ['その書籍はすでに追加されています'] } # すでに同じ書籍が投稿されていればエラーメッセージを表示。書籍が空だった場合と合わせるために配列で定義
        else
          @user.books << @book # ユーザーと書籍を紐付ける。
          render status: 201, json: { book: @book } # ステータスは手動で入れないと反映されない。リソース保存時のステータスは201
          post_tweet  # ツイートの投稿。書籍追加失敗時にツイートされるのを防ぐ
        end
      end

      def search
        # params[:query]の値に応じて検索対象のカラムやエラーメッセージを変更する
        case params[:query]
        when 'title'
          return render status: 406, json: { errors: 'タイトルを入力してください' } if params[:keyword] == '' # 何も入力しなくても空文字列が送られる想定

          @books = RakutenWebService::Books::Book.search(title: params[:keyword]) # TODO: 複数のパラメータで同時に検索できないか検証
        when 'author'
          return render status: 406, json: { errors: '著者名を入力してください' } if params[:keyword] == '' # 何も入力しなくても空文字列が送られる想定

          @books = RakutenWebService::Books::Book.search(author: params[:keyword]) # TODO: 複数のパラメータで同時に検索できないか検証
        end

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
        # ユーザーがsns認証済みではない場合には何もせず処理を終了
        return nil unless @user.sns_token

        @twitter_client = Twitter::REST::Client.new do |config|
          # @userからsns認証情報を渡すことで任意のユーザーでツイート可能になる
          config.access_token        = @user.sns_token
          config.access_token_secret = @user.sns_secret
          config.consumer_key        = ENV['TWITTER_CONSUMER_KEY']
          config.consumer_secret = ENV['TWITTER_CONSUMER_SECRET']
        end
      end

      def post_tweet
        return nil if !@twitter_client || !params[:to_be_shared_on_twitter]
        if Rails.env.production?
          @twitter_client.update!("
            \n『#{@book.title}』を推薦図書に追加しました！ 
            \n #{root_url(only_path: false)}books/#{@book.isbn}/outputs
            \n #読書 #読書好きとつながりたい #Kaidoku 
          ")
        else
          @twitter_client.update!("
            【API 連携テスト】
            \n『#{@book.title}』を推薦図書に追加しました！ 
            \n #{root_url(only_path: false)}books/#{@book.isbn}/outputs
            \n #読書 #読書好きとつながりたい #Kaidoku
          ")
          # ↑アプリURLへの導線を貼る(一通り出来上がってから)
        end
      end
    end
  end
end
