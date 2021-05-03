require 'rails_helper'

RSpec.describe "OmniauthUsers", type: :system do
  before do
    OmniAuth.config.test_mode = true # これがないと実際にツイッターと通信してしまう
    OmniAuth.config.mock_auth[:twitter] = nil # テストごとに認証情報を初期化する
    Rails.application.env_config['omniauth.auth'] = twitter_mock
    visit root_path
    click_link '新規登録'
  end

  describe "Twitter認証ログイン" do
    context "認証に成功する" do
      it "初回ログイン時はユーザーのカウントが1増える" do        
        expect do 
          click_link 'SignUp with Twitter'
        end.to change(User, :count).by(1)
      end

      it "初回ログイン時はCookieに認証情報と初回ログインを示すtmpデータが保存される" do        
        click_link 'SignUp with Twitter'
        cookies = page.driver.browser.manage.all_cookies
        authToken = cookies.find { |c| c[:name] == 'authToken' }
        expect(authToken[:value]).not_to eq nil        
        first_session = cookies.find { |c| c[:name] == 'first_session' }
        expect(first_session[:value]).to eq 'true'
      end
      
      it "ユーザーが認証済みの場合ユーザーのカウントは増えない", js: true do
        # 本来は2回リンク踏ませるのが正しいがなんかうまくいかないので代わりに事前にユーザーを作っておく
        create(:user, uid: twitter_mock['uid'], provider: twitter_mock['provider'])
        expect do
          find('a', text: 'SignUp with Twitter').click # reactで作ったaタグはhref属性がつかないのでfindで検出する
        end.not_to change(User, :count)
      end

      it "ユーザーが認証済みの場合時はCookieに認証情報のみが保存される" do        
        create(:user, uid: twitter_mock['uid'], provider: twitter_mock['provider'])
        click_link 'SignUp with Twitter'
        cookies = page.driver.browser.manage.all_cookies
        authToken = cookies.find { |c| c[:name] == 'authToken' }
        expect(authToken[:value]).not_to eq nil        
        first_session = cookies.find { |c| c[:name] == 'first_session' }
        expect(first_session).to eq nil
      end
    end
  end
end
