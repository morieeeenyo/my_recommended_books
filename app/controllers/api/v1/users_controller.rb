class Api::V1::UsersController < ApplicationController
  before_action :user_authentification

  def show 
    render json: {user: @user, books: @user.books}
  end

  def user_authentification
    @user = User.find_for_database_authentication(uid: request.headers['uid']) #NewBookModal.jsxでLocalStorageからログインしているuidを抜き出し、request.headerに仕込む
    @token = request.headers['access-token']
    @client = request.headers['client']
    return nil unless @user && @token && @client
  end
end
