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

      private 

      def output_params 
        params.require(:output).permit(:content, :time_of_execution, :what_to_do, :how_to_do).merge(book_id: params[:book_id])
      end
    end
  end
end
