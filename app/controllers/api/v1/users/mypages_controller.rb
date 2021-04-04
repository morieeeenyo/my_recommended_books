class Api::V1::Users::MypagesController < ApplicationController
  def show 
    @user = User.find_by(uid: request.header['uid'])
    render json: {user: @user, books: @user.books}
  end
end
