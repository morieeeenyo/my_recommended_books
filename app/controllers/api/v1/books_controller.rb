class Api::V1::BooksController < ApplicationController
  def search
    @books = RakutenWebService::Books::Book.search(booksGenreId: "001005")
     render json: { status: 'success', data: @books }  
  end
end
