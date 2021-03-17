class Api::V1::Users::RegistrationsController < DeviseTokenAuth::RegistrationsController
  skip_before_action :verify_authenticity_token, only: [:create] # APIではCSRFチェックをしない
  after_action :set_csrf_token_header
  
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

  def set_csrf_token_header
    response.set_header("X-CSRF-Token", form_authenticity_token)
  end

end