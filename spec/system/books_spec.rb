require 'rails_helper'

RSpec.describe "Books", type: :system do
  let(:user) { build(:user) }
  let(:book) { build(:book) }
  let(:book_params) { attributes_for(:book) } #paramsとして送るためにattributes_forを使用
  let(:invalid_book_params) { attributes_for(:book, title: "") } #コントローラーで空のキーワードに対してnilを返すようにしている
  let(:book_search_params) { {keyword: '７つの習慣'} } #検索したらヒットしそうな本にしてます

  describe "書籍の投稿" do
    context "投稿に成功" do
      it "検索結果から書籍を選択すると書籍の投稿ができる" do
        sign_in(user) #ログインする
        click_link href: '/books/new'
        expect(page).to  have_content '推薦図書を投稿する'
        fill_in "title",	with: book.title
        find('.search-button').click
        expect(all('#search_result > div').length).not_to eq 0 #検索結果が0件ではないことを検証
        all('#search_result > div')[0].click
        expect {
          find('input[type="submit"]').click
          sleep 2
        }.to change(user.books, :count).by(1)  #ユーザーと紐付いているかどうかも検証
        expect(page).not_to  have_content '推薦図書を投稿する' #トップページに戻ることを検証
      end     
    end
    
    context "投稿に失敗" do
      it "書籍が選択されていないとき投稿に失敗する" do
        sign_in(user) 
        click_link href: '/books/new'
        expect(page).to  have_content '推薦図書を投稿する'
        fill_in "title",	with: book.title
        find('.search-button').click
        expect(all('#search_result > div').length).not_to eq 0 #検索結果が0件ではないことを検証
        expect {
          find('input[type="submit"]').click
          sleep 2
        }.to change(Book, :count).by(0) 
        expect(page).to  have_content "Author can't be blank"
      end

      it "ユーザーがログインしていない場合書籍投稿のモーダルが開かずアラートが出る" do
        visit root_path
        click_link href: '/books/new'
        sleep 5
        expect(page.driver.browser.switch_to.alert.text).to eq "推薦図書の投稿にはログインが必要です" 
        sleep 2
        page.driver.browser.switch_to.alert.accept 
        expect(page).not_to  have_content '推薦図書を投稿する' #トップページにとどまることを検証
      end
    end
  end
  
  describe "書籍の検索" do
    context "検索に成功" do
      it "何も入力せずに検索ボタンを入力すると検索結果が0件である" do
        sign_in(user) 
        click_link href: '/books/new'
        expect(page).to  have_content '推薦図書を投稿する'
        fill_in "title",	with: ''
        find('.search-button').click
        expect(find('#search_result').text).to eq '' #検索結果が0件になることを検証
        expect(page).to  have_content '推薦図書を投稿する' #モーダルにとどまっていることを検証
      end
    end
  end
  
end
