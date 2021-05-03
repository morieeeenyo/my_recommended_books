require 'rails_helper'

RSpec.describe "OmniauthUsers", type: :system do
  before do
    OmniAuth.config.test_mode = true # これがないと実際にツイッターと通信してしまう
    OmniAuth.config.mock_auth[:twitter] = nil # テストごとに認証情報を初期化する
    Rails.application.env_config['omniauth.auth'] = twitter_mock
    visit root_path
  end

  describe "Twitter認証ログイン" do
    context "認証に成功する" do
      it "初回ログイン時はユーザーのカウントが1増える" do
        
      end

      it "2回目以降のログイン時にはユーザーのカウントは増えない" do
        
      end
      
      
      
    end

    context "認証に失敗する" do
      it "request.env['omniauth.auth']がnilの場合エラーが発生する" do
        
      end
      
      
    end
  end
end
