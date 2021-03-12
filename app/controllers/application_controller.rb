class ApplicationController < ActionController::Base
  include DeviseTokenAuth::Concerns::SetUserByToken
  before_action :configure_permitted_parameters, if: :devise_controller? 

  respond_to :json

  private

  def configure_permitted_parameters
     devise_parameter_sanitizer.permit(:sign_up, keys: [:nickname])
  end 
end
