# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Users', type: :request do
  let(:user) { create(:user) }
  let(:book) { create(:book) }
  let(:user_params) { attributes_for(:user) } # paramsとして送るためにattributes_forを使用。.attributesだとpasswordが整形されてしまう。
  let(:invalid_user_params) do
    attributes_for(:user, email: user.email)
  end
  let(:user_book) { build(:user_book) }
  let(:output) { build(:output) }
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

      it 'リクエストに失敗する' do
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
        user_book.user_id = user.id
        user_book.save
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
      before do
        headers['uid'] = nil
      end

      it 'ヘッダーのuidが存在しない時ステータスが404' do
        get api_v1_user_mypage_path, xhr: true, headers: headers
        expect(response).to have_http_status(401)
      end

      it 'ヘッダーのuidが存在しない時レスポンスとしてエラーメッセージが返却される' do
        get api_v1_user_mypage_path, xhr: true, headers: headers
        json = JSON.parse(response.body)
        expect(json['errors']).to eq 'ユーザーが見つかりませんでした'
      end
    end
  end

  describe '自分が投稿したアウトプット一覧の表示' do

    context 'アウトプット一覧の表示に成功する時(アウトプット投稿済み)' do
      before do
        output.user_id = user.id
        user_book.user_id = user.id
        user_book.save # ユーザーと書籍の紐付け
        output.book_id = user_book.book.id # アウトプットとユーザーと書籍の紐付け
        @my_outputs = []
        # 2個保存することで複数データの取得が可能かどうか、順番は正しいかを検証
        2.times do
          output_save_result = output.save
          @my_outputs << output_save_result
        end
      end

      it 'リクエストに成功する' do
        get api_v1_user_mypage_book_outputs_path(user_book.book.isbn), xhr: true, headers: headers
        expect(response).to have_http_status(200)
      end

      it '自分が投稿したアウトプットのみレスポンスとして返却される' do
        get api_v1_user_mypage_book_outputs_path(user_book.book.isbn), xhr: true, headers: headers
        sleep 2 # sleepしないとレスポンスの返却が間に合わない
        json = JSON.parse(response.body)
        sleep 2
        expect(json['outputs'].length).to eq 2 # 自分以外のアウトプットを含む場合4つになるはずなので正しくレスポンスが返ってきてそう
        json['outputs'].each_with_index do |output, output_index|
          expect(output['awareness']['user_id']).to eq user.id # 自分が投稿したアウトプットかどうか検証
          expect(output['awareness']['content']).to eq @my_outputs[output_index][:awareness].content
          output['action_plans'].each_with_index do |action_plan, action_plan_index|
            expect(action_plan['what_to_do']).to eq @my_outputs[output_index][:action_plans][action_plan_index][:what_to_do]
            expect(action_plan['how_to_do']).to eq @my_outputs[output_index][:action_plans][action_plan_index][:how_to_do]
            expect(action_plan['time_of_execution']).to eq @my_outputs[output_index][:action_plans][action_plan_index][:time_of_execution]
          end
        end
      end
    end

    context 'アウトプット一覧の表示に成功する時(アウトプットが投稿されていない)' do
      before do
        user_book.user_id = user.id
        user_book.save # ユーザーと書籍は紐付いているがアウトプットは投稿されていない
      end

      it 'アウトプットが投稿されていない時レスポンスが0件になる' do
        get api_v1_user_mypage_book_outputs_path(user_book.book.isbn), xhr: true, headers: headers
        sleep 2 # sleepしないとレスポンスの返却が間に合わない
        json = JSON.parse(response.body)
        sleep 2
        expect(json['outputs'].length).to eq 0
      end
    end

    context 'アウトプット一覧の表示に失敗する時(ユーザーが存在しない)' do
      before do
        user_book.user_id = user.id
        user_book.save
        headers['uid'] = nil # そもそもユーザーが存在しない
      end

      it 'ヘッダーのユーザーが存在しないときリクエストに失敗する' do
        get api_v1_user_mypage_book_outputs_path(user_book.book.isbn), xhr: true, headers: headers
        sleep 2 # sleepしないとレスポンスの返却が間に合わない
        expect(response).to have_http_status(401)
      end
      it 'ヘッダーのユーザーが存在しないときエラーメッセージが返却される' do
        get api_v1_user_mypage_book_outputs_path(user_book.book.isbn), xhr: true, headers: headers
        sleep 2 # sleepしないとレスポンスの返却が間に合わない
        json = JSON.parse(response.body)
        expect(json['errors']).to eq 'ユーザーが見つかりませんでした'
      end
    end

    context 'アウトプット一覧の表示に失敗する時(ユーザーの推薦図書に存在しないページにアクセスした場合)' do
      before do
        user_book.user_id = user.id
        user_book.save
        output.book_id = book.id # アウトプットと書籍は紐付いているが、書籍とユーザーが紐付いていない
      end

      it '書籍が推薦図書として追加されていない場合、ステータスが422になる' do
        get api_v1_user_mypage_book_outputs_path(book.id), xhr: true, headers: headers
        sleep 2 # sleepしないとレスポンスの返却が間に合わない
        expect(response).to have_http_status(422)
      end

      it '書籍が推薦図書として追加されていない場合、エラーメッセージが返却される' do
        get api_v1_user_mypage_book_outputs_path(book.id), xhr: true, headers: headers
        sleep 2 # sleepしないとレスポンスの返却が間に合わない
        json = JSON.parse(response.body)
        expect(json['errors']).to eq '書籍が推薦図書として追加されていません'
      end
    end
  end

  describe 'ユーザー情報の更新' do
    context '更新に成功する時(nicknameのみ更新)' do
      it 'パラメータが正しい時ステータスが200で返却される' do
        put api_v1_user_registration_path, xhr: true, headers: headers, params: { user: { nickname: 'updated', avatar: { data: '', filename: '' } } }
        expect(response).to have_http_status(200) # 成功時ステータスは200
      end

      it 'リクエストに成功した場合ユーザーの数は増加しない' do
        expect do
          put api_v1_user_registration_path, xhr: true, headers: headers,
                                             params: { user: { nickname: 'updated', avatar: { data: '', filename: '' } } }
        end.to change(User, :count)
      end

      it 'パラメータが正しい時更新されたユーザーの情報がレスポンスとして返却される' do
        put api_v1_user_registration_path, xhr: true, headers: headers, params: { user: { nickname: 'updated', avatar: { data: '', filename: '' } } }
        sleep 3
        json = JSON.parse(response.body)
        expect(json['user']['nickname']).to eq request.params[:user][:nickname] # 値が更新されているかどうか
        expect(json['user']['email']).to eq user.email # emailは更新されていない
        expect(user.avatar.attached?).to eq false # avatarが添付されていないままかどうか
      end
    end

    context '更新に成功する時(avatarのみ更新)' do
      it 'パラメータが正しい時更新されたユーザーの情報がレスポンスとして返却される' do
        put api_v1_user_registration_path,
            xhr: true,
            headers: headers,
            params: { user: { nickname: user.nickname,
                              avatar: { data: File.read('spec/fixtures/test_avatar.png.bin'), filename: 'test_avatar.png' } } }
        sleep 3
        json = JSON.parse(response.body)
        # 更新していないカラムの情報が維持されているかどうか
        expect(json['user']['uid']).to eq user.uid
        expect(json['user']['nickname']).to eq user.nickname
        expect(json['avatar']).to include 'test_avatar.png'
        expect(user.avatar.blob.filename).to eq 'test_avatar.png' # 値が変更されているかどうか
      end
    end

    context '更新に成功する時(nickname, avatarともに更新)' do
      it 'パラメータが正しい時ユーザー情報の編集に成功する' do
        put api_v1_user_registration_path,
            xhr: true,
            headers: headers,
            params: { user: { nickname: 'update', avatar: { data: File.read('spec/fixtures/test_avatar.png.bin'), filename: 'test_avatar.png' } } }
        json = JSON.parse(response.body)
        expect(json['user']['nickname']).to eq request.params[:user][:nickname] # 値が変更されているかどうか
        expect(json['user']['email']).to eq user.email # 更新していないカラムの情報が維持されているかどうか
        expect(user.avatar.blob.filename).to eq 'test_avatar.png' # 値が変更されているかどうか
      end
    end

    context '更新に失敗するする時' do
      it 'ヘッダーのユーザー情報が存在しない場合リクエストに失敗する' do
        headers['uid'] = nil # そもそもユーザーが存在しない
        put api_v1_user_registration_path, xhr: true, headers: headers, params: { user: { nickname: '', avatar: { data: '', filename: '' } } }
        expect(response).to have_http_status(401) # コントローラーで422を返すよう設定。レコードの処理に失敗する、という意味で422
      end

      it 'ヘッダーのユーザー情報が存在しない場合エラーメッセージが返却される' do
        headers['uid'] = nil # そもそもユーザーが存在しない
        put api_v1_user_registration_path, xhr: true, headers: headers, params: { user: { nickname: '', avatar: { data: '', filename: '' } } }
        json = JSON.parse(response.body)
        expect(json['errors']).to eq 'ユーザーが存在しません'
      end

      it 'nicknameとavatarがともに空の場合リクエストに失敗する' do
        put api_v1_user_registration_path, xhr: true, headers: headers, params: { user: { nickname: '', avatar: { data: '', filename: '' } } }
        expect(response).to have_http_status(422) # コントローラーで422を返すよう設定。レコードの処理に失敗する、という意味で422
      end

      it 'nicknameとavatarがともに空の場合エラーメッセージが返却される' do
        put api_v1_user_registration_path, xhr: true, headers: headers, params: { user: { nickname: '', avatar: { data: '', filename: '' } } }
        # レスポンスの中身を検証
        json = JSON.parse(response.body)
        expect(json['errors']).to include "Nickname can't be blank"
      end

      it 'nicknameがすでに登録されている場合リクエストに失敗する' do
        another_user = create(:user)
        put api_v1_user_registration_path, xhr: true, headers: headers,
                                           params: { user: { nickname: another_user.nickname, avatar: { data: '', filename: '' } } }
        expect(response).to have_http_status(422) # コントローラーで422を返すよう設定。レコードの処理に失敗する、という意味で422
      end

      it 'nicknameがすでに登録されている場合エラーメッセージが返却される' do
        another_user = create(:user)
        put api_v1_user_registration_path, xhr: true, headers: headers,
                                           params: { user: { nickname: another_user.nickname, avatar: { data: '', filename: '' } } }
        # レスポンスの中身を検証
        json = JSON.parse(response.body)
        expect(json['errors']).to include 'Nickname has already been taken'
      end
    end
  end
end
