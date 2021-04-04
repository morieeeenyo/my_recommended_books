require 'rails_helper'

RSpec.describe "Mypages", type: :request do
  let(:user) { create(:user) }
  describe "マイページの表示" do
    context "リクエストに成功する時" do
      it "ヘッダーにuidがあればリクエストに成功する" do
        get api_v1_mypage_path(user.id), headers: { uid: user.uid }
        expect(response).to have_http_status(200)
      end

      it "ヘッダーにuidがあれば正しく書籍情報がレスポンスとして返却される" do
        user_book = create(:user_book)
        get api_v1_mypage_path(user.id), headers: { uid: user_book.user.uid }
        json = JSON.parse(response.body) 
        expect(json['books'][0]['title']).to eq user_book.book.title
      end

      it "ヘッダーにuidがあれば正しくユーザー情報がレスポンスとして返却される" do
        get api_v1_mypage_path(user.id), headers: { uid: user.uid }
        json = JSON.parse(response.body) 
        expect(json['user']['uid']).to eq user.uid
      end
    end
  end
end
