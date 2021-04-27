require 'rails_helper'

RSpec.describe "OmniauthUsers", type: :request do
  describe "GET /omniauth_users" do
    it "works! (now write some real specs)" do
      get omniauth_users_path
      expect(response).to have_http_status(200)
    end
  end
end
