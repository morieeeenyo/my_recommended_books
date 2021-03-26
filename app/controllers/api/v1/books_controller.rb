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
    # return render status: 404, json: {errors: 'Failed. No Book found.'} if @books.length == 0
    render json: { books: @books }  
    #  検索で使うデータ(候補)
    #   authorKana→author
    #   title
    #   publisherName
    #   mediumImageUrl
    #   smallImageUrl
    #   itemPrice
    #   affiliateUrl
    #   itemUrl
    #   genreId
    #   salesDate
  end
end
