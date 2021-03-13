require 'rails_helper'

RSpec.describe "Users", type: :request do
  let(:user) { build(:user) }

  describe "新規登録" do
    context "新規登録に成功する時" do
      it "全てのカラムに値がある場合新規登録ができる" do
        user.avatar = fixture_file_upload('spec/fixtures/test_image.jpg', filename: 'test_image.jpg', content_type: 'image/jpg') 
        post api_v1_user_registration_path, xhr: true, params: { registration: user.attributes } #paramsとして送るためにattributesを使用
        expect(response).to have_http_status(200)
      end

      it "画像は空でも新規登録ができる" do
        post api_v1_user_registration_path, xhr: true, params: { registration: user.attributes }
        expect(response).to have_http_status(200)
      end
    end
  end
end
