class Api::V1::BooksController < ApplicationController
  before_action :user_authentification
  def create 
    @book = Book.where(isbn: book_params[:isbn]).first_or_initialize(book_params) #同じデータを保存しないためにisbnで識別
    if @book.valid?
      @book.save
      @user.books << @book #ユーザーと書籍を紐付ける。ここで書籍が投稿済みの場合は中間テーブルにのみデータが入る。
      render status: 201, json: {book: @book} #ステータスは手動で入れないと反映されない？
    else
      render status: 404, json: {errors: @book.errors.full_messages}
    end
  end

  def search
    return render status: 400, json: { errors: "タイトルを入力してください" } if params[:keyword] == "" #何も入力しなくても空文字列が送られる想定
    @books = RakutenWebService::Books::Book.search(title: params[:keyword])  #Todo: 複数のパラメータで同時に検索できないか検証
    render json: { books: @books }  
  end

  private 

  def book_params 
    params.require(:book).permit(
       :isbn, 
       :title, 
       :author, 
       :author_kana, 
       :publisher_name, 
       :sales_date, 
       :item_price, 
       :item_url, 
    )
  end

  def user_authentification
    @user = User.find_for_database_authentication(uid: request.headers['uid']) #NewBookModal.jsxでLocalStorageからログインしているuidを抜き出し、request.headerに仕込む
    @token = request.headers['access-token']
    @client = request.headers['client']
    return nil unless @user && @token && @client
  end
end
