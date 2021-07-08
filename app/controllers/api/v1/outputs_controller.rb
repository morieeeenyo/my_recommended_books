module Api
  module V1
    class OutputsController < ApplicationController
      before_action :set_book
      before_action :user_authentification
      # ユーザーが認証済みかどうかチェック
      before_action :set_twitter_client, only: :create

      def index
        # ログアウト時
        unless @user
          @my_outputs, @outputs = Output.fetch_resources(@book.id, nil)
          # フロントでの条件分岐をへらすためにmy_outputsも返却。フロント側ではuserがいるかどうかで条件分岐
          return render json: { book: @book, myoutputs: @my_outputs, outputs: @outputs }
        end

        # ユーザーが書籍を投稿済みかどうか
        @book_is_posted_by_user = UserBook.find_by(book_id: @book.id, user_id: @user.id)

        # アウトプット一覧を取得
        @my_outputs, @outputs = Output.fetch_resources(@book.id, @user.id)
        # フロント側で自分のアウトプットをまず一番上に出し、その後他人のアウトプットを表示させる
        # postedは書籍をユーザーが投稿済みかどうかを管理しているキー
        # 書籍が投稿済みの場合アウトプット投稿ボタンが、投稿済みではない場合推薦図書追加ボタンが表示される
        render json: { book: @book, myoutputs: @my_outputs, outputs: @outputs, user: @user, posted: @book_is_posted_by_user.present? }
      end

      def create
        # ユーザー認証に引っかかった際のステータスは401(Unautorized)
        return render status: 401, json: { errors: 'ユーザーが見つかりませんでした' } unless @user && @token && @client

        @output = Output.new(output_params)

        if @output.valid?
          output_save_result = @output.save
          # ステータスは手動で設定する。リソース保存時のステータスは201
          render status: 201, json: { awareness: output_save_result[:awareness], action_plans: output_save_result[:action_plans] }
          post_tweet(@book) if @twitter_client && params[:to_be_shared_on_twitter]
          puts @user.is_admin
          SlackNotification.notify_output_post(@book, @output) if @user.is_admin
        else
          render status: 422, json: { errors: @output.errors.full_messages } # バリデーションに引っかかった際のステータスは422(Unprocessable entity)
        end
      end

      private

      def output_params
        params.require(:output).permit(:content, :book_id, action_plans: [:time_of_execution, :what_to_do, :how_to_do]).merge(
          user_id: @user.id
        )
      end

      def user_authentification
        # NewBookModal.jsxでLocalStorageからログインしているuidを抜き出し、request.headerに仕込む
        @user = User.find_for_database_authentication(uid: request.headers['uid'])
        # 同様にaccess-token, clientについてもrequest.headersから抜き出して変数に代入
        @token = request.headers['access-token']
        @client = request.headers['client']
      end

      def set_book
        @book = Book.find_by(isbn: params[:book_isbn])
      end

      def set_twitter_client
        # ユーザーがsns認証済みではない場合には何もせず処理を終了
        @twitter_client = Twitter::REST::Client.new do |config|
          # @userからsns認証情報を渡すことで任意のユーザーでツイート可能になる
          config.access_token        = @user.sns_token
          config.access_token_secret = @user.sns_secret
          config.consumer_key        = ENV['TWITTER_CONSUMER_KEY']
          config.consumer_secret = ENV['TWITTER_CONSUMER_SECRET']
        end
      end

      def post_tweet(book)
        if Rails.env.production?
          @twitter_client.update!("
            \n『#{book.title}』のアウトプットを投稿しました！
            \n #{root_url(only_path: false)}books/#{book.isbn}/outputs
            \n #読書 #読書好きとつながりたい #Kaidoku 
          ")
        else
          @twitter_client.update!("
            【API 連携テスト】
            \n『#{book.title}』のアウトプットを投稿しました！
            \n #{root_url(only_path: false)}books/#{book.isbn}/outputs
            \n #読書 #読書好きとつながりたい #Kaidoku
          ")
        end
      end
    end
  end
end
