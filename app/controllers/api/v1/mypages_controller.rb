class Api::V1::MypagesController < ApplicationController
  def show 
    @user = User.find_by(uid: request.headers['uid'])
    render json: {user: @user, books: @user.books}
  end
end
