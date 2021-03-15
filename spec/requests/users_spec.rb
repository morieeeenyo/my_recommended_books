require 'rails_helper'

RSpec.describe "Users", type: :request do
  let(:user) { create(:user) }
  let(:user_params) { attributes_for(:user) } #paramsとして送るためにattributes_forを使用。.attributesだとpasswordが整形されてしまう。
  let(:invalid_user_params) { attributes_for(:user, email: user.email) } #不正なパラメータのパターンの1つとしてemailが重複している場合を検証する(deviseのデフォルトの設定が動くことを確かめたい)

  describe "新規登録" do
    context "パラメータが正しい時" do
      it "リクエストに成功する(画像なし)" do #念の為画像ありなし検証してます
        post api_v1_user_registration_path, xhr: true, params: { user: user_params }
        expect(response).to have_http_status(200) #成功時ステータスは200
      end

      it "リクエストに成功する(画像あり)" do
        user_params[:avatar] = fixture_file_upload('spec/fixtures/test_image.jpg', filename: 'test_image.jpg', content_type: 'image/jpg') 
        post api_v1_user_registration_path, xhr: true, params: { user: user_params }
        expect(response).to have_http_status(200) 
      end
      
      it "ユーザーのカウントが1増える" do 
        expect {
          post api_v1_user_registration_path, xhr: true, params: { user: user_params }
        }.to change(User, :count).by(1) 
      end
      
      it "正しくレスポンスが返却される" do
        post api_v1_user_registration_path, xhr: true, params: { user: user_params }
        #レスポンスの中身を検証
        json = JSON.parse(response.body) 
        expect(json['user']['nickname']).to eq user_params[:nickname] #念の為一意性のカラムで検証  
      end
      
    end
    
    context "パラメータが不正な時" do
      it "リクエストに失敗する" do
        post api_v1_user_registration_path, xhr: true, params: { user: invalid_user_params }
        expect(response).to have_http_status(422) #コントローラーで422を返すよう設定。レコードの処理に失敗する、という意味で422
      end
      
      it "ユーザーのカウントが増えていない" do 
        user #1回userを呼び出しておくことでemailの重複を発生させる
        expect {
          post api_v1_user_registration_path, xhr: true, params: { user: invalid_user_params }
        }.not_to change(User, :count) 
      end

      it "レスポンスに正しいエラーメッセージが含まれている" do
        post api_v1_user_registration_path, xhr: true, params: { user: invalid_user_params }
        #レスポンスの中身を検証
        json = JSON.parse(response.body) 
        expect(json['errors']).to include "Email has already been taken"
      end
    end
  end

  describe "ログイン" do
    context "パラメータが正しい時" do
      it "リクエストに成功する" do
        post api_v1_user_session_path, xhr: true, params: { email: user.email, password: user.password }
        expect(response).to have_http_status(200) 
      end
      
      it "正しくレスポンスが返却される" do
        post api_v1_user_session_path, xhr: true, params:{ email: user.email, password: user.password }
        json = JSON.parse(response.body) 
        expect(json['user']['email']).to  eq user.email 
      end
    end

    #メールアドレスが先に判定される仕様のため両方不正な値の場合は検証しない

    context "パラメータが不正な時(メールアドレス)" do
      it "リクエストに失敗する" do
        post api_v1_user_session_path, xhr: true, params: { email: '', password: user.password } 
        expect(response).to have_http_status(401) 
      end

      it "エラーメッセージが返却される" do
        post api_v1_user_session_path, xhr: true, params: { email: '', password: user.password } 
        json = JSON.parse(response.body) 
        expect(json['errors']).to include "Authorization failed. Invalid email"
      end
    end

    context "パラメータが不正な時(パスワード)" do
      it "リクエストに失敗する" do
        post api_v1_user_session_path, xhr: true, params: { email: user.email, password: '' } 
        expect(response).to have_http_status(401) 
      end

      it "エラーメッセージが返却される" do
        post api_v1_user_session_path, xhr: true, params: { email: user.email, password: '' } 
        json = JSON.parse(response.body) 
        expect(json['errors']).to include "Authorization failed. Invalid password"
      end
    end
  end
  
end
