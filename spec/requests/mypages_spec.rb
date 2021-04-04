require 'rails_helper'

RSpec.describe "Mypages", type: :request do
  let(:user) { build(:user) }
  let(:user_book) { build(:user_book) }

  describe "マイページの表示" do
    context "書籍情報が紐付いていない場合" do
      before do
        user.save
      end
      
      it "ヘッダーにuidがあればリクエストに成功する" do
        get api_v1_mypage_path(user.id), headers: { uid: user.uid }
        expect(response).to have_http_status(200)
      end

      it "ヘッダーにuidがあれば正しくユーザー情報がレスポンスとして返却される" do
        get api_v1_mypage_path(user.id), headers: { uid: user.uid }
        json = JSON.parse(response.body) 
        expect(json['user']['uid']).to eq user.uid
      end

      it "ヘッダーにuidがあれば正しくユーザー情報がレスポンスとして返却される" do
        get api_v1_mypage_path(user.id), headers: { uid: user.uid }
        json = JSON.parse(response.body) 
        expect(json['books'].length).to eq 0 
      end

      
    end
    
    context "書籍が投稿済みの場合" do
      before do
        user_book.save
      end
      
      it "ヘッダーにuidがあればリクエストに成功する" do
        get api_v1_mypage_path(user_book.user.id), headers: { uid: user_book.user.uid } #紐付けた中からuserを取り出す
        expect(response).to have_http_status(200)
      end

      it "ヘッダーにuidがあれば正しく書籍情報がレスポンスとして返却される" do
        get api_v1_mypage_path(user_book.user.id), headers: { uid: user_book.user.uid } #紐付けた中からuserを取り出す
        json = JSON.parse(response.body) 
        expect(json['books'][0]['title']).to eq user_book.book.title #booksは配列なので添字を使う
      end

      it "ヘッダーにuidがあれば正しくユーザー情報がレスポンスとして返却される" do
        get api_v1_mypage_path(user_book.user.id), headers: { uid: user_book.user.uid } #紐付けた中からuserを取り出す
        json = JSON.parse(response.body) 
        expect(json['user']['uid']).to eq user_book.user.uid
      end
      
    end
    
  end
end
