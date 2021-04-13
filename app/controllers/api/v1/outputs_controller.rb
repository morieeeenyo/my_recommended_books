module Api
  module V1
    class OutputsController < ApplicationController
      before_action :user_authentification

      def create
        return render status: 404, json: { errors: 'ユーザーが見つかりませんでした' } unless @user && @token && @client
        @output = Output.new(output_params)
        if @output.valid?
          result =  @output.save
          render json {awareness: result[:awareness], action_plan: result[:action_plan]}
        else
          render json: { errors: @output.errors.full_messages }
        end
      end

      private 

      def output_params 
        params.require(:output).permit(:content, :time_of_execution, :what_to_do, :how_to_do).merge(book_id: params[:book_id], user_id: @user.id)
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
