# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Users', type: :request do
  let(:user) { create(:user) }
  let(:user_params) { attributes_for(:user) } # paramsとして送るためにattributes_forを使用。.attributesだとpasswordが整形されてしまう。
  let(:invalid_user_params) do
    attributes_for(:user, email: user.email)
  end
  let(:user_book) { build(:user_book) }
  let(:headers) do
    { 'uid' => user.uid, 'access-token' => 'ABCDEFGH12345678', 'client' => 'H-12345678' }
  end

  describe '新規登録' do
    before do
      user_params[:avatar] = { data: '', filename: '' } # 実行環境でも画像未選択の場合空文字列が送られる
    end

    context 'パラメータが正しい時' do
      it 'リクエストに成功する(画像なし)' do # 念の為画像ありなし検証してます
        post api_v1_user_registration_path, xhr: true, params: { user: user_params }
        expect(response).to have_http_status(200) # 成功時ステータスは200
      end

      it 'リクエストに成功する(画像あり)' do
        user_params[:avatar][:data] = File.read('spec/fixtures/test_avatar.png.bin') # base64形式でコントローラーで扱うため、encode舌文字列をパラメータにセット
        user_params[:avatar][:filename] = 'test_avatar.png'
        post api_v1_user_registration_path, xhr: true, params: { user: user_params }
        expect(response).to have_http_status(200)
      end

      it 'ユーザーのカウントが1増える' do
        expect do
          post api_v1_user_registration_path, xhr: true, params: { user: user_params }
        end.to change(User, :count).by(1)
      end

      it '正しくレスポンスが返却される' do
        post api_v1_user_registration_path, xhr: true, params: { user: user_params }
        # レスポンスの中身を検証
        json = JSON.parse(response.body)
        expect(json['user']['nickname']).to eq user_params[:nickname] # 念の為一意性のカラムで検証
      end
    end

    context 'パラメータが不正な時' do
      it 'リクエストに失敗する' do
        post api_v1_user_registration_path, xhr: true, params: { user: invalid_user_params }
        expect(response).to have_http_status(422) # コントローラーで422を返すよう設定。レコードの処理に失敗する、という意味で422
      end

      it 'ユーザーのカウントが増えていない' do
        user # 1回userを呼び出しておくことでemailの重複を発生させる
        expect do
          post api_v1_user_registration_path, xhr: true, params: { user: invalid_user_params }
        end.not_to change(User, :count)
      end

      it 'レスポンスに正しいエラーメッセージが含まれている' do
        post api_v1_user_registration_path, xhr: true, params: { user: invalid_user_params }
        # レスポンスの中身を検証
        json = JSON.parse(response.body)
        expect(json['errors']).to include 'Email has already been taken'
      end
    end
  end

  describe 'ログイン' do
    context 'パラメータが正しい時' do
      it 'リクエストに成功する' do
        post api_v1_user_session_path, xhr: true, params: { user: { email: user.email, password: user.password } }
        expect(response).to have_http_status(200)
      end

      it '正しくレスポンスが返却される' do
        post api_v1_user_session_path, xhr: true, params: { user: { email: user.email, password: user.password } }
        json = JSON.parse(response.body)
        expect(json['user']['email']).to eq user.email
      end
    end

    # メールアドレスが先に判定される仕様のため両方不正な値の場合は検証しない

    context 'パラメータが不正な時(メールアドレス)' do
      it 'リクエストに失敗する' do
        post api_v1_user_session_path, xhr: true, params: { user: { email: '', password: user.password } }
        expect(response).to have_http_status(401)
      end

      it 'エラーメッセージが返却される' do
        post api_v1_user_session_path, xhr: true, params: { user: { email: '', password: user.password } }
        json = JSON.parse(response.body)
        expect(json['errors']).to include 'Authorization failed. Invalid email'
      end
    end

    context 'パラメータが不正な時(パスワード)' do
      it 'リクエストに失敗する' do
        post api_v1_user_session_path, xhr: true, params: { user: { email: user.email, password: '' } }
        expect(response).to have_http_status(401)
      end

      it 'エラーメッセージが返却される' do
        post api_v1_user_session_path, xhr: true, params: { user: { email: user.email, password: '' } }
        json = JSON.parse(response.body)
        expect(json['errors']).to include 'Authorization failed. Invalid password'
      end
    end
  end

  describe 'ログアウト' do
    context 'ヘッダーの情報が正しい時' do
      it 'リクエストに成功する' do
        delete destroy_api_v1_user_session_path, xhr: true, headers: headers # headersは認証用のヘッダー
        expect(response).to have_http_status(200)
      end

      it 'リクエストに成功する' do
        delete destroy_api_v1_user_session_path, xhr: true, headers: headers # headersは認証用のヘッダー
        json = JSON.parse(response.body)
        expect(json['success']).to  eq true # headersのuid, access-token, clientが全て揃っているときのみtrueを返す
      end
    end

    context 'ヘッダーの情報が不正な時' do
      it 'リクエストに成功する' do
        delete destroy_api_v1_user_session_path, xhr: true
        expect(response).to have_http_status(404)
      end

      it 'リクエストに成功する' do
        delete destroy_api_v1_user_session_path
        json = JSON.parse(response.body)
        expect(json['success']).to eq false # headersのuid, access-token, clientが全て揃っているときのみtrueを返す
      end
    end
  end

  describe 'マイページの表示' do
    context '書籍情報が投稿済みではない場合' do
      it 'ヘッダーにuidがあればリクエストに成功する' do
        get api_v1_user_mypage_path, headers: headers # headersは認証用のヘッダー
        expect(response).to have_http_status(200)
      end

      it 'ヘッダーにuidがあれば正しくユーザー情報がレスポンスとして返却される' do
        get api_v1_user_mypage_path, headers: headers
        json = JSON.parse(response.body)
        expect(json['user']['uid']).to eq user.uid
      end

      it 'ヘッダーにuidがあれば正しくユーザー情報がレスポンスとして返却される' do
        get api_v1_user_mypage_path, headers: headers
        json = JSON.parse(response.body)
        expect(json['books'].length).to eq 0
      end
    end

    context '画像あり' do
      before do
        user.avatar.attach(fixture_file_upload('spec/fixtures/test_avatar.png', filename: 'test_avatar.png',
                                                                                content_type: 'image/png'))
      end

      it 'ヘッダーにuidがあればリクエストに成功する' do
        get api_v1_user_mypage_path, headers: headers # headersは認証用のヘッダー
        expect(response).to have_http_status(200)
      end

      it 'ヘッダーにuidがあれば正しくユーザー情報がレスポンスとして返却される' do
        get api_v1_user_mypage_path, headers: headers
        json = JSON.parse(response.body)
        expect(json['user']['uid']).to eq user.uid
      end

      it 'ヘッダーにuidがあれば正しくユーザー情報がレスポンスとして返却される' do
        get api_v1_user_mypage_path, headers: headers
        json = JSON.parse(response.body)
        expect(json['books'].length).to eq 0
      end
    end

    context '書籍が投稿済みの場合' do
      before do
        user_book.save
        headers['uid'] = user_book.user.uid # 中間テーブルを介して取り出す形式に変更
      end

      it 'ヘッダーにuidがあればリクエストに成功する' do
        # 中間テーブル起点のアソシエーションでuserを取り出す
        get api_v1_user_mypage_path, headers: headers
        expect(response).to have_http_status(200)
      end

      it 'ヘッダーにuidがあれば正しく書籍情報がレスポンスとして返却される' do
        get api_v1_user_mypage_path, headers: headers
        json = JSON.parse(response.body)
        expect(json['books'][0]['title']).to eq user_book.book.title # booksは配列なので添字を使う
      end

      it 'ヘッダーにuidがあれば正しくユーザー情報がレスポンスとして返却される' do
        get api_v1_user_mypage_path, headers: headers
        json = JSON.parse(response.body)
        expect(json['user']['uid']).to eq user_book.user.uid
      end
    end

    context 'マイページの表示に失敗する' do
      it 'ヘッダーのuidが存在しない時ステータスが404' do
        headers['uid'] = nil
        get api_v1_user_mypage_path, xhr: true, headers: headers
        expect(response).to have_http_status(401)
      end

      it 'ヘッダーのuidが存在しない時レスポンスとしてエラーメッセージが返却される' do
        headers['uid'] = nil
        get api_v1_user_mypage_path, xhr: true, headers: headers
        json = JSON.parse(response.body)
        expect(json['errors']).to eq 'ユーザーが見つかりませんでした'
      end
    end
  end
end
