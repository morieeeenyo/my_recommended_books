module Api
  module V1
    class OutputsController < ApplicationController
      def create
        @output = Output.new(output_params)
        if @output.valid?
          @output.save
        else
          render json: { errors: @output.errors.full_messages }
        end
      end

      
    end
  end
end
