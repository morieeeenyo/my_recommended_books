class Api::V1::BooksController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:create] # APIではCSRFチェックをしない
  def create 
    @book = Book.new(book_params)
    if @book.valid?
      @book.save
      render json: {book: @book}
    else
      render json: {errors: @book.errors.full_messages}
    end
  end

  def search
    return nil if params[:keyword] == ""
    @books = RakutenWebService::Books::Book.search(title: params[:keyword])    
    render json: { books: @books }  
  end

  private 

  def book_params 
    params.require(:book).permit(
       :title, 
       :author, 
       :author_kana, 
       :publisher_name, 
       :sales_date, 
       :item_price, 
       :genre_id, 
       :item_url, 
       :description, 
       :recommends, 
    )
  end
end
