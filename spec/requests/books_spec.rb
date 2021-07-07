# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Books', type: :request do
  let(:user) { create(:user) }
  let(:another_user) { create(:user) }
  let(:book) { build(:book) }
  let(:book_params) { attributes_for(:book) } # paramsとして送るためにattributes_forを使用
  let(:another_book_params) { attributes_for(:book) } # paramsとして送るためにattributes_forを使用
  let(:invalid_book_params) { attributes_for(:book, title: '') } # コントローラーで空のキーワードに対してnilを返すようにしている
  let(:book_search_params) { { keyword: '７つの習慣', query: 'title' } } # 検索したらヒットしそうな本にしてます
  let(:headers) do
    { 'uid' => user.uid, 'access-token' => 'ABCDEFGH12345678', 'client' => 'H-12345678' }
  end

  describe '書籍一覧' do
    context '一覧表示に成功(書籍が投稿済み)' do
      # インスタンスはbeforeで生成するとidがずれる。
      # letで生成するとそもそもテーブルにレコードがないって言われる
      it '書籍が投稿済みの場合、リクエストに成功する' do
        create_list(:book, 5)
        get api_v1_books_path, xhr: true
        expect(response).to have_http_status(200)
      end

      it '書籍が投稿済みの場合、投稿した分と同じ数書籍が返却される' do
        book_list = create_list(:book, 5)
        get api_v1_books_path, xhr: true
        json = JSON.parse(response.body)
        expect(json['books'].length).to eq book_list.length
      end

      it '書籍が投稿済みの場合、書籍が新しい順に一覧で返却される' do
        book_list = create_list(:book, 5)
        get api_v1_books_path, xhr: true
        json = JSON.parse(response.body)
        # 添字を使って順番も検証
        expect(json['books'][0]['id']).to eq book_list[4].id
        expect(json['books'][3]['id']).to eq book_list[1].id
        expect(json['books'][4]['id']).to eq book_list[0].id
      end
    end

    context '一覧表示に成功(書籍が投稿済みではない場合)' do
      it '書籍が投稿済みではない場合もリクエストに成功する' do
        get api_v1_books_path, xhr: true
        expect(response).to have_http_status(200)
      end

      it '書籍が投稿済みの場合、書籍が新しい順に一覧で返却される' do
        get api_v1_books_path, xhr: true
        json = JSON.parse(response.body)
        # レスポンスは0件
        expect(json['books'].length).to eq 0
      end
    end
  end

  describe '書籍の検索' do
    context '検索に成功(タイトル検索)' do
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
        book_search_params[:keyword] = 'hogefugahoge'
        # 検索処理そのものは正しく行われている、という意味で正常形に分類
        get search_api_v1_books_path, xhr: true, params: book_search_params, headers: headers # headersは認証用のヘッダー
        json = JSON.parse(response.body)
        expect(json['books'].length).to eq 0
      end
    end

    context '検索に成功(著者名検索)' do
      before do
        book_search_params[:query] = 'author'
      end

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
        book_search_params[:keyword] = 'hogefugahoge'
        # 検索処理そのものは正しく行われている、という意味で正常形に分類
        get search_api_v1_books_path, xhr: true, params: book_search_params, headers: headers # headersは認証用のヘッダー
        json = JSON.parse(response.body)
        expect(json['books'].length).to eq 0
      end
    end

    context '検索に失敗(タイトル検索)' do
      it 'パラメータが空文字列の時ステータス406が返却される' do
        book_search_params[:keyword] = ''
        get search_api_v1_books_path, xhr: true, params: book_search_params, headers: headers # headersは認証用のヘッダー
        expect(response).to have_http_status(406)
      end

      it 'パラメータが空文字列の時レスポンスでエラーメッセージが返却される' do
        book_search_params[:keyword] = ''
        get search_api_v1_books_path, xhr: true, params: book_search_params, headers: headers # headersは認証用のヘッダー
        json = JSON.parse(response.body)
        expect(json['errors']).to include 'タイトルを入力してください'
      end
    end

    context '検索に失敗(著者名検索)' do
      before do
        book_search_params[:query] = 'author'
      end

      it 'パラメータが空文字列の時ステータス406が返却される' do
        book_search_params[:keyword] = ''
        get search_api_v1_books_path, xhr: true, params: book_search_params, headers: headers # headersは認証用のヘッダー
        expect(response).to have_http_status(406)
      end

      it 'パラメータが空文字列の時レスポンスでエラーメッセージが返却される' do
        book_search_params[:keyword] = ''
        get search_api_v1_books_path, xhr: true, params: book_search_params, headers: headers # headersは認証用のヘッダー
        json = JSON.parse(response.body)
        expect(json['errors']).to include '著者名を入力してください'
      end

      it 'パラメータが空文字列の時レスポンスでエラーメッセージが返却される(queryがauthor)' do
        book_search_params[:keyword] = ''
        get search_api_v1_books_path, xhr: true, params: book_search_params, headers: headers # headersは認証用のヘッダー
        json = JSON.parse(response.body)
        expect(json['errors']).to include '著者名を入力してください'
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

      it 'パラメータが正しければ正しくレスポンスが返却される' do
        post api_v1_books_path, xhr: true, params: { book: book_params }, headers: headers # headersは認証用のヘッダー
        json = JSON.parse(response.body)
        expect(json['book']['title']).to eq book_params[:title]
      end

      it '同じユーザーは複数の書籍を投稿可能である' do
        post api_v1_books_path, xhr: true, params: { book: book_params }, headers: headers # headersは認証用のヘッダー
        post api_v1_books_path, xhr: true, params: { book: another_book_params }, headers: headers # headersは認証用のヘッダー
        expect(response).to have_http_status(201) # ステータスはコントローラーで設定している
      end

      it '一つの書籍は複数のユーザーから投稿可能である' do
        post api_v1_books_path, xhr: true, params: { book: book_params }, headers: headers # headersは認証用のヘッダー
        headers['uid'] = another_user.uid
        post api_v1_books_path, xhr: true, params: { book: book_params }, headers: headers # headersは認証用のヘッダー
        expect(response).to have_http_status(201) # ステータスはコントローラーで設定している
      end
    end

    context '書籍が投稿できない時' do
      it 'パラメータの中に空の値が含まれる場合リクエストに失敗する' do
        post api_v1_books_path, xhr: true, params: { book: invalid_book_params }, headers: headers # headersは認証用のヘッダー
        expect(response).to have_http_status(422) # ステータスはコントローラーで設定している
      end

      it 'パラメータの中に空の値が含まれる場合エラーメッセージが返却される' do
        post api_v1_books_path, xhr: true, params: { book: invalid_book_params }, headers: headers # headersは認証用のヘッダー
        json = JSON.parse(response.body)
        expect(json['errors']).to include "Title can't be blank"
      end

      it '同じ書籍を2度以上投稿しようとするとエラーメッセージが返却される' do
        post api_v1_books_path, xhr: true, params: { book: book_params }, headers: headers # headersは認証用のヘッダー
        post api_v1_books_path, xhr: true, params: { book: book_params }, headers: headers # headersは認証用のヘッダー
        json = JSON.parse(response.body)
        expect(json['errors']).to include 'その書籍はすでに追加されています'
      end
    end

    context "管理者ユーザーで投稿した時" do
      before do
        user.is_admin = true
        user.save # uidを取り出すために保存
        @headers = { uid: user.uid } # ユーザーと書籍を紐付ける処理ではrequest.headersからuidを抜き出しているため
        sleep 1
      end

      it "書籍の投稿に成功した場合Slackに通知される" do
        allow(SlackNotification).to receive(:notify_book_post).and_return(true)
        post api_v1_books_path, xhr: true, params: { book: book_params }, headers: headers # headersは認証用のヘッダー
        expect(SlackNotification).to have_received(:notify_book_post).once        
      end

      it "書籍の投稿に失敗した場合Slackに通知されない" do
        allow(SlackNotification).to receive(:notify_book_post).and_return(true)
        post api_v1_books_path, xhr: true, params: { book: invalid_book_params }, headers: headers # headersは認証用のヘッダー
        expect(SlackNotification).to have_received(:notify_book_post).exactly(0).times        
      end
    end
    
  end
end
