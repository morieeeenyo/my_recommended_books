require 'rails_helper'

RSpec.describe "OmniauthUsers", type: :request do
  # before { request.env["omniauth.auth"] = twitter_mock }

  before do
    OmniAuth.config.mock_auth[:twitter] = nil
    Rails.application.env_config['omniauth.auth'] = twitter_mock
  end

  describe "omniauthを用いたTwitterでのログイン" do
    context "ログインに成功" do
      it "oauthのデータが存在する場合ログインに成功する" do
        get api_v1_users_failure_path
        expect(response).to have_http_status(200)
      end

      it "oauthのデータが存在する場合mockのデータに応じたレスポンスが返却される" do
        
      end
    end

    context "ログイン失敗" do
      
    end
  end
end
