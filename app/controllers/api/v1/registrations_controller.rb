module Api
  module V1
    class RegistrationsController < DeviseTokenAuth::RegistrationsController
      respond_to :json

      def create 
        @user = User.new(sign_up_params)
        if @user.valid?
          @user.save 
          render json: {user: @user}
        else
           render json: {errors: @user.errors.full_messages}
        end
      end

      private

      def sign_up_params
        params.require(:registration).permit(:nickname, :email, :avatar, :password, :password_confirmation)
      end

    end
  end
end