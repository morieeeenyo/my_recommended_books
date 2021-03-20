class Api::V1::Users::RegistrationsController < DeviseTokenAuth::RegistrationsController
  skip_before_action :verify_authenticity_token, only: [:create] # APIではCSRFチェックをしない
  after_action :set_csrf_token_header
  
  respond_to :json

  def create 
    @user = User.new(sign_up_params)
    if @user.valid?
      if params[:user][:avatar][:data] != "" && params[:user][:avatar][:filename] != "" #画像データ自体は送られてくるので中身の判定をする
        blob = ActiveStorage::Blob.create_after_upload!(
          io: StringIO.new(decode(params[:user][:avatar][:data]) + "\n"),
          filename: params[:user][:avatar][:filename]
        )
        @user.avatar.attach(blob)
      end
      @user.save 
      update_auth_header
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

  def decode(str)
    Base64.decode64(str.split(',').last)
  end

  def update_auth_header 
    @token = @user.create_token
    return unless @user && @token.client
    @token.client = nil unless @used_auth_by_token
    if @used_auth_by_token && !DeviseTokenAuth.change_headers_on_each_request
      auth_header = @user.build_auth_header(@token.token, @token.client)
      response.headers.merge!(auth_header)  
    else
      unless @user.reload.valid?
        @user = @user.class.find(@user.to_param) 
        unless @user.valid?
          raise DeviseTokenAuth::Errors::InvalidModel, "Cannot set auth token in invalid model. Errors: #{@resource.errors.full_messages}"
        end
      end
      refresh_headers
    end
  end

end