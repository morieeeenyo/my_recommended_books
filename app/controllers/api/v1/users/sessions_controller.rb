class Api::V1::Users::SessionsController < DeviseTokenAuth::SessionsController

  private

  def respond_with(resource, _opts = {})
    render json: { user: resource }
  end

  def respond_to_on_destroy
    head :no_content
  end
end