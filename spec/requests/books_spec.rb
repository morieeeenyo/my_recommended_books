require 'rails_helper'

RSpec.describe "Books", type: :request do
  let(:book) { build(:book) }
  let(:book_params) { attributes_for(:book) }
  let(:invalid_book_params) { attributes_for(:book, title: "") }
  let(:book_search_params) { {keyword: '７つの習慣'} }
  describe "書籍の検索" do
    context "検索に成功" do
      it "パラメータが存在すればリクエストに成功する" do
        get search_api_v1_books_path, xhr: true, params: book_search_params 
        expect(response).to have_http_status(200)
      end

      
      it "レスポンスがJSON形式で返却される" do
        get search_api_v1_books_path, xhr: true, params: book_search_params 
        json = JSON.parse(response.body) 
        expect(json['books']).not_to eq nil
      end

    end

    context "検索に失敗" do
      it "パラメータが空文字列の時ステータス204が返却される" do
        get search_api_v1_books_path, xhr: true, params: {keyword: ""} 
        expect(response).to have_http_status(204)
      end

      it "パラメータが空文字列の時レスポンスは空文字列である" do
        get search_api_v1_books_path, xhr: true, params: {keyword: ""} 
        expect(response.body).to eq ""
      end
    end
  end

  describe "書籍の投稿" do
    context "書籍が投稿できる時" do
      it "パラメータが正しければリクエストに成功する" do
        post api_v1_books_path, xhr: true, params: {book: book_params}
        expect(response).to have_http_status(201)
      end

      it "パラメータが正しければリクエストに成功する" do
        post api_v1_books_path, xhr: true, params: {book: book_params}
        json = JSON.parse(response.body) 
        expect(json['book']['title']).to eq book_params[:title]
      end
    end

    context "書籍が投稿できない時" do
      it "パラメータの中に空の値が含まれる場合リクエストに失敗する" do
        post api_v1_books_path, xhr: true, params: {book: invalid_book_params}
        expect(response).to have_http_status(404)
      end

      it "パラメータの中に空の値が含まれる場合エラーメッセージが返却される" do
        post api_v1_books_path, xhr: true, params: {book: invalid_book_params}
        json = JSON.parse(response.body) 
        expect(json['errors']).to include "Title can't be blank"
      end
    end
    
  end
  
end
