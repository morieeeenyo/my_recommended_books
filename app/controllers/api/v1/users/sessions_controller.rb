class Api::V1::Users::SessionsController < DeviseTokenAuth::SessionsController
  skip_before_action :verify_authenticity_token, only: [:create] # APIではCSRFチェックをしない
  before_action :set_user_by_token, only: [:destroy]
  after_action :set_csrf_token_header
  after_action :reset_session, only: [:destroy]
  respond_to :json

  def create
    @user = User.find_for_database_authentication(email: params[:user][:email])
    return invalid_email unless @user

    if @user.valid_password?(params[:user][:password])
      sign_in :user, @user
      update_auth_header
      render json: {user: @user}
    else
      invalid_password
    end
  end

  def destroy  
    @user = User.find_for_database_authentication(uid: request.headers['uid'])
    @token = request.headers['access-token']
    @client = request.headers['client']
    if @user && @client && @token
      @token.clear # todo: client削除の記述を入れる
      render_destroy_success
    else
      render_destroy_error
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

  def set_csrf_token_header
    response.set_header("X-CSRF-Token", form_authenticity_token)
  end

  def update_auth_header 
    @token = @user.create_token
    # cannot save object if model has invalid params
    return unless @user && @token.client
    # Generate new client with existing authentication
    @token.client = nil unless @used_auth_by_token
    if @used_auth_by_token && !DeviseTokenAuth.change_headers_on_each_request
      auth_header = @user.build_auth_header(@token.token, @token.client)
      # update the response header
      response.headers.merge!(auth_header)  
    else
      unless @user.reload.valid?
        @user = @user.class.find(@user.to_param) # errors remain after reload
        # if we left the model in a bad state, something is wrong in our app
        unless @user.valid?
          raise DeviseTokenAuth::Errors::InvalidModel, "Cannot set auth token in invalid model. Errors: #{@resource.errors.full_messages}"
        end
      end
      refresh_headers
    end
  end
end