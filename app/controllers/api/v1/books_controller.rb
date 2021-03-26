class Api::V1::BooksController < ApplicationController
  def search
    @books = RakutenWebService::Books::Book.search(booksGenreId: "001005")
     render json: { status: 'success', data: @books }  
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
