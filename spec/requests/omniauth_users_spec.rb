require 'rails_helper'

RSpec.describe 'OmniauthUsers', type: :request do
  before do
    # これがないと実際にツイッターと通信してしまう
    OmniAuth.config.test_mode = true
    OmniAuth.config.mock_auth[:twitter] = nil
    Rails.application.env_config['omniauth.auth'] = twitter_mock
    Rails.application.env_config['omniauth.params'] = { 'resource_class' => 'User', 'namespace_name' => 'api_v1' } # No resource_class foundというエラーを避ける
  end

  describe 'omniauthを用いたTwitterでのログイン' do
    context 'ログインに成功' do
      it 'oauthのデータが存在する場合ログインに成功する' do
        get '/api/v1/users/twitter/callback'
        expect(response).to have_http_status(200)
      end

      it 'oauthのデータが存在する場合mockのデータに応じたレスポンスが返却される' do
        get '/api/v1/users/twitter/callback'
        json = JSON.parse(response.body)
        expect(json['uid']).to eq request.env['omniauth.auth']['uid'] # 念の為一意性のカラムで検証
        expect(json['email']).to eq request.env['omniauth.auth']['info']['email'] # 念の為一意性のカラムで検証
        expect(json['provider']).to eq request.env['omniauth.auth']['provider'] # 念の為一意性のカラムで検証
      end
    end

    context 'ログイン失敗' do
      it "request.env['omniauth.auth']がnilの場合リクエストに失敗する" do
        Rails.application.env_config['omniauth.auth'] = nil
        expect do
          get '/api/v1/users/twitter/callback'
        end.to raise_error NoMethodError
      end
    end
  end
end
