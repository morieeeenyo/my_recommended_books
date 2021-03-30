require 'rails_helper'

RSpec.describe "Books", type: :system do
  let(:user) { build(:user) }
  let(:book) { build(:book) }
  let(:book_params) { attributes_for(:book) } #paramsとして送るためにattributes_forを使用
  let(:invalid_book_params) { attributes_for(:book, title: "") } #コントローラーで空のキーワードに対してnilを返すようにしている
  let(:book_search_params) { {keyword: '７つの習慣'} } #検索したらヒットしそうな本にしてます

  describe "書籍の投稿" do
    context "投稿に成功" do
      before do
        user.save    
        visit root_path
        find('a', text: 'ログイン').click #href属性がないaタグはclick_link, click_onで検出できないのでfindで検出する
        expect(page).to have_content 'SignIn' 
        fill_in "email",	with: user.email
        fill_in "password",	with: user.password
        click_button "SignIn"
        sleep 2 #sleepしないと間に合わない
        # ログインすると表示が切り替わる
        expect(page).to  have_content 'ログアウト'
        expect(page).to  have_content 'マイページ'
      end

      it "検索結果から書籍を選択すると書籍の投稿ができる" do
        click_link href: '/books/new'
        expect(page).to  have_content '推薦図書を投稿する'
        fill_in "title",	with: book.title
        find('.search-button').click
        expect(all('#search_result > div').length).not_to eq 0
        all('#search_result > div')[0].click
        expect {
          find('input[type="submit"]').click
          sleep 2
        }.to change(Book, :count).by(1)  
      end
      
    end
    
    context "投稿に失敗" do
      
    end
    
    
  end
  
end
