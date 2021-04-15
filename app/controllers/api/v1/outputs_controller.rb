module Api
  module V1
    class OutputsController < ApplicationController
      before_action :user_authentification

      def create
        # ユーザー認証に引っかかった際のステータスは401(Unautorized)
        return render status: 401, json: { errors: 'ユーザーが見つかりませんでした' } unless @user && @token && @client
        @output = Output.new(output_params)
        if @output.valid?
          output_save_result =  @output.save  
          # ステータスは手動で設定する。リソース保存時のステータスは201
          render status: 201, json: { awareness: output_save_result[:awareness], action_plans: output_save_result[:action_plans] } 
        else
          render status: 422, json: { errors: @output.errors.full_messages } #バリデーションに引っかかった際のステータスは422(Unprocessable entity)
        end
      end

      private 

      def output_params 
        params.require(:output).permit(awareness: [:content], action_plans: [:time_of_execution, :what_to_do, :how_to_do]).merge(book_id: params[:book_id], user_id: @user.id)
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
