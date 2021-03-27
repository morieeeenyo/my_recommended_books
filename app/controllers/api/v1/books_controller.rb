class Api::V1::BooksController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:create] # APIではCSRFチェックをしない
  def create 
    @book = Book.new(book_params)
    if @book.valid?
      @book.save
      render status: 201, json: {book: @book} #ステータスは手動で入れないと反映されない
    else
      render status: 404, json: {errors: @book.errors.full_messages}
    end
  end

  def search
    return nil if params[:keyword] == "" #何も入力しなくても空文字列が送られる想定
    @books = RakutenWebService::Books::Book.search(title: params[:keyword])  #Todo: 複数のパラメータで同時に検索できないか検証
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
