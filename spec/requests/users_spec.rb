require 'rails_helper'

RSpec.describe "Users", type: :request do
  let(:user) { create(:user) }
  let(:user_params) { attributes_for(:user) } #paramsとして送るためにattributes_forを使用。.attributesだとpasswordが整形されてしまう。
  let(:invalid_user_params) { attributes_for(:user, nickname: '') } #不正なパラメータのパターンの1つとしてnicknameが空の場合を検証

  describe "新規登録" do
    context "パラメータが正しい時" do
      it "リクエストに成功する(画像なし)" do #念の為ありなし検証してます
        post api_v1_user_registration_path, xhr: true, params: { registration: user_params }
        expect(response).to have_http_status(200) #成功時ステータスは200
      end

      it "リクエストに成功する(画像あり)" do
        user_params[:avatar] = fixture_file_upload('spec/fixtures/test_image.jpg', filename: 'test_image.jpg', content_type: 'image/jpg') 
        post api_v1_user_registration_path, xhr: true, params: { registration: user_params }
        expect(response).to have_http_status(200) 
      end
      
      it "ユーザーのカウントが1増える" do 
        expect {
          post api_v1_user_registration_path, xhr: true, params: { registration: user_params }
        }.to change(User, :count).by(1) 
      end
      
      it "正しくレスポンスが返却される" do
        post api_v1_user_registration_path, xhr: true, params: { registration: user_params }
        #レスポンスの中身を検証
        json = JSON.parse(response.body) 
        expect(json['user']['nickname']).to eq user_params[:nickname] #念の為一意性のカラムで検証  
      end
      
    end
    
    context "パラメータが不正な時" do
      it "リクエストに失敗する" do
        post api_v1_user_registration_path, xhr: true, params: { registration: invalid_user_params }
        expect(response).to have_http_status(422) #コントローラーで422を返すよう設定
      end
      
      it "ユーザーのカウントが増えていない" do 
        expect {
          post api_v1_user_registration_path, xhr: true, params: { registration: invalid_user_params }
        }.not_to change(User, :count) 
      end

      it "レスポンスに正しいエラーメッセージが含まれている" do
        post api_v1_user_registration_path, xhr: true, params: { registration: invalid_user_params }
        #レスポンスの中身を検証
        json = JSON.parse(response.body) 
        expect(json['errors']).to include "Nickname can't be blank"
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
        expect(json['data']['email']).to  eq user.email #コントローラーでrender json: { user: @user }としている
      end
    end

    context "パラメータが不正な時" do
      it "リクエストに失敗する" do
        post api_v1_user_session_path, xhr: true, params: { session: { email: nil, password: nil } }
        expect(response).to have_http_status(401) 
      end
    end
  end
  
end
