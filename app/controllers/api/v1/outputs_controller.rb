module Api
  module V1
    class OutputsController < ApplicationController
      before_action :user_authentification
      # ユーザーが認証済みかどうかチェック
      before_action :set_twitter_client, only: :create
      # ツイートの投稿
      after_action :post_tweet, only: :create

      def index
        @book = Book.find_by(isbn: params[:book_isbn])
        # ログアウト時
        unless @user 
          @my_outputs, @outputs = Output.fetch_resources(@book.id, nil)
          # フロントでの条件分岐をへらすためにmy_outputsも返却。フロント側ではuserがいるかどうかで条件分岐
          return render json: { myoutputs: @my_outputs, outputs: @outputs } 
        end
        
        @book_is_posted_by_user = UserBook.find_by(book_id: @book.id, user_id: @user.id)

        @my_outputs, @outputs = Output.fetch_resources(@book.id, @user.id) 
        # フロント側で自分のアウトプットをまず一番上に出し、その後他人のアウトプットを表示させる
        render json: { myoutputs: @my_outputs, outputs: @outputs, user: @user, posted: @book_is_posted_by_user.present? } 
      end

      def create
        # ユーザー認証に引っかかった際のステータスは401(Unautorized)
        return render status: 401, json: { errors: 'ユーザーが見つかりませんでした' } unless @user && @token && @client

        @output = Output.new(output_params)

        if @output.valid?
          output_save_result = @output.save
          # ステータスは手動で設定する。リソース保存時のステータスは201
          render status: 201, json: { awareness: output_save_result[:awareness], action_plans: output_save_result[:action_plans] }
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

      def post_tweet
        # ユーザーが認証済みではない、もしくはフォームでTwitterでのシェアをオンにしていない場合には何もしない
        return nil if !@twitter_client || !params[:to_be_shared_on_twitter]

        if !Rails.env.test? # rubocop:disable Style/NegatedIf, Style/GuardClause
          book = Book.find_by(isbn: params[:book_isbn])
          @twitter_client.update!("API連携のテストです。\n『#{book.title}』のアウトプットを投稿しました！ \n #読書 #読書好きとつながりたい #Kaidoku") # アプリURLへの導線を貼る(一通り出来上がってから)
        end
      end
    end
  end
end
