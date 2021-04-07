# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Books', type: :request do
  let(:user) { create(:user) }
  let(:book) { build(:book) }
  let(:book_params) { attributes_for(:book) } # paramsとして送るためにattributes_forを使用
  let(:invalid_book_params) { attributes_for(:book, title: '') } # コントローラーで空のキーワードに対してnilを返すようにしている
  let(:book_search_params) { { keyword: '７つの習慣' } } # 検索したらヒットしそうな本にしてます
  let(:headers) do
    { 'uid' => user.uid, 'access-token' => 'ABCDEFGH12345678', 'client' => 'H-12345678' }
  end

  describe '書籍の検索' do
    context '検索に成功' do
      it 'パラメータが存在すればリクエストに成功する' do
        get search_api_v1_books_path, xhr: true, params: book_search_params, headers: headers # headersは認証用のヘッダー
        expect(response).to have_http_status(200)
      end

      it '検索結果が存在する時JSON形式で検索結果が返却される' do
        get search_api_v1_books_path, xhr: true, params: book_search_params, headers: headers # headersは認証用のヘッダー
        json = JSON.parse(response.body)
        expect(json['books'].length).not_to eq 0 # 検索結果が0のときはlengthが0になる
      end

      it '検索結果がない時レスポンスが0件になる' do
        # 検索処理そのものは正しく行われている、という意味で正常形に分類
        get search_api_v1_books_path, xhr: true, params: { keyword: 'hogefugahogefugahoge' }, headers: headers # headersは認証用のヘッダー
        json = JSON.parse(response.body)
        expect(json['books'].length).to eq 0
      end
    end

    context '検索に失敗' do
      it 'パラメータが空文字列の時ステータス400が返却される' do
        get search_api_v1_books_path, xhr: true, params: { keyword: '' }, headers: headers # headersは認証用のヘッダー
        expect(response).to have_http_status(400)
      end

      it 'パラメータが空文字列の時レスポンスでエラーメッセージが返却される' do
        get search_api_v1_books_path, xhr: true, params: { keyword: '' }, headers: headers # headersは認証用のヘッダー
        json = JSON.parse(response.body)
        expect(json['errors']).to include 'タイトルを入力してください'
      end
    end
  end

  describe '書籍の投稿' do
    context '書籍が投稿できる時' do
      before do
        user.save # uidを取り出すために保存
        @headers = { uid: user.uid } # ユーザーと書籍を紐付ける処理ではrequest.headersからuidを抜き出しているため
      end

      it 'パラメータが正しければリクエストに成功する' do
        post api_v1_books_path, xhr: true, params: { book: book_params }, headers: headers # headersは認証用のヘッダー
        expect(response).to have_http_status(201) # ステータスはコントローラーで設定している
      end

      it 'パラメータが正しければリクエストに成功する' do
        post api_v1_books_path, xhr: true, params: { book: book_params }, headers: headers # headersは認証用のヘッダー
        json = JSON.parse(response.body)
        expect(json['book']['title']).to eq book_params[:title]
      end
    end

    context '書籍が投稿できない時' do
      it 'パラメータの中に空の値が含まれる場合リクエストに失敗する' do
        post api_v1_books_path, xhr: true, params: { book: invalid_book_params }, headers: headers # headersは認証用のヘッダー
        expect(response).to have_http_status(404) # ステータスはコントローラーで設定している
      end

      it 'パラメータの中に空の値が含まれる場合エラーメッセージが返却される' do
        post api_v1_books_path, xhr: true, params: { book: invalid_book_params }, headers: headers # headersは認証用のヘッダー
        json = JSON.parse(response.body)
        expect(json['errors']).to include "Title can't be blank"
      end
    end
  end
end
