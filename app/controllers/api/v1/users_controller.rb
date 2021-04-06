class Api::V1::UsersController < ApplicationController
  before_action :user_authentification

  def show 
    if @user.avatar.attached? #添付されていないときにエラーが出るのを防ぐ
      avatar_path = Rails.application.routes.url_helpers.rails_representation_url(@user.avatar.variant({}), only_path: true) 
    end
    render json: {user: @user, books: @user.books, avatar: avatar_path}
  end

  def user_authentification
    @user = User.find_for_database_authentication(uid: request.headers['uid']) #NewBookModal.jsxでLocalStorageからログインしているuidを抜き出し、request.headerに仕込む
    #同様にaccess-token, clientについてもrequest.headersから抜き出して変数に代入
    @token = request.headers['access-token'] 
    @client = request.headers['client']
    return nil unless @user && @token && @client #どれか一つでもなかったらreturn nil
  end
end
