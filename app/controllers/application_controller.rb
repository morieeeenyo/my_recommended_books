class ApplicationController < ActionController::Base
  include DeviseTokenAuth::Concerns::SetUserByToken
  skip_before_action :verify_authenticity_token, if: :devise_controller? # APIではCSRFチェックをしない
  include ActionController::RequestForgeryProtection
  protect_from_forgery with: :exception

end
