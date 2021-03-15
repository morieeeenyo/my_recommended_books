class Api::V1::Users::RegistrationsController < DeviseTokenAuth::RegistrationsController
  respond_to :json

  def create 
    @user = User.new(sign_up_params)
    if @user.valid?
      @user.save 
      render json: { user: @user }
    else
      render status: 422, json: { errors: @user.errors.full_messages } #手動でステータス入れないと200になるぽい
    end
  end

  private

  def sign_up_params
    params.require(:user).permit(:nickname, :email, :avatar, :password, :password_confirmation)
  end

end