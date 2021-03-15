class Api::V1::Users::SessionsController < DeviseTokenAuth::SessionsController
  respond_to :json

  def create
    @user = User.find_for_database_authentication(email: params[:email])
    return invalid_email unless @user

    if @user.valid_password?(params[:password])
      sign_in :user, @user
      render json: {user: @user}
    else
      invalid_password
    end
  end

  private
  # パスワードで引っかかったのかメールアドレスで引っかかったのかわかるようにする
  def invalid_email
    warden.custom_failure!
    render status: 401, json: { errors: 'Authorization failed. Invalid email' }
  end

  def invalid_password
    warden.custom_failure!
    render status: 401, json: { errors: 'Authorization failed. Invalid password' }
  end
end