require 'rails_helper'

RSpec.describe "Books", type: :request do
  let(:book) { build(:book) }
  let(:book_search_params) { {keyword: '７つの習慣'} }
  describe "書籍の検索" do
    context "検索に成功" do
      it "タイトルが存在すれば検索に成功する" do
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
    end
  end
end
