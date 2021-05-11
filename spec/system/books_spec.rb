# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Books', type: :system do
  let(:user) { build(:user) }
  let(:another_user) { build(:user) }
  let(:book) { build(:book) }
  let(:book_params) { attributes_for(:book) } # paramsとして送るためにattributes_forを使用
  let(:invalid_book_params) { attributes_for(:book, title: '') } # コントローラーで空のキーワードに対してnilを返すようにしている
  let(:book_search_params) { { keyword: '７つの習慣' } } # 検索したらヒットしそうな本にしてます

  describe '書籍の投稿' do
    context '投稿に成功' do
      it '検索結果から書籍を選択すると書籍の投稿ができる' do
        sign_in(user) # ログインする
        click_link href: '/books/new'
        expect(page).to  have_content '推薦図書を投稿する'
        fill_in 'title',	with: book.title
        find('.search-button').click
        sleep 2
        expect(all('#search_result > div').length).not_to eq 0 # 検索結果が0件ではないことを検証
        all('#search_result > div')[0].click
        expect do
          find('input[type="submit"]').click
          sleep 2
        end.to change(user.books, :count).by(1) # ユーザーと紐付いているかどうかも検証
        expect(page).not_to have_content '推薦図書を投稿する' # トップページに戻ることを検証
      end

      it '一人のユーザーは複数の書籍の投稿ができる' do
        sign_in(user) # ログインする
        click_link href: '/books/new'
        expect(page).to  have_content '推薦図書を投稿する'
        fill_in 'title',	with: book.title
        find('.search-button').click
        sleep 2
        expect(all('#search_result > div').length).not_to eq 0 # 検索結果が0件ではないことを検証
        all('#search_result > div')[0].click
        expect do
          find('input[type="submit"]').click
          sleep 2
        end.to change(user.books, :count).by(1) # ユーザーと紐付いているかどうかも検証
        expect(page).not_to have_content '推薦図書を投稿する' # トップページに戻ることを検証
        click_link href: '/books/new'
        expect(page).to  have_content '推薦図書を投稿する'
        fill_in 'title',	with: book.title
        find('.search-button').click
        sleep 2
        expect(all('#search_result > div').length).not_to eq 0 # 検索結果が0件ではないことを検証
        all('#search_result > div')[1].click
        expect do
          find('input[type="submit"]').click
          sleep 2
        end.to change(user.books, :count).by(1)
        expect(page).not_to have_content '推薦図書を投稿する' # トップページに戻ることを検証
      end

      it '同じ書籍は複数のユーザーから投稿ができる' do
        sign_in(user) # ログインする
        click_link href: '/books/new'
        expect(page).to  have_content '推薦図書を投稿する'
        fill_in 'title',	with: book.title
        find('.search-button').click
        sleep 2
        expect(all('#search_result > div').length).not_to eq 0 # 検索結果が0件ではないことを検証
        all('#search_result > div')[0].click
        expect do
          find('input[type="submit"]').click
          sleep 2
        end.to change(user.books, :count).by(1) # ユーザーと紐付いているかどうかも検証
        expect(page).not_to have_content '推薦図書を投稿する' # トップページに戻ることを検証
        find('.header-link', text: 'ログアウト').click
        expect(page).to have_content 'SignOut'
        click_button 'SignOut'
        sign_in(another_user) # 別のユーザーでログイン
        click_link href: '/books/new'
        expect(page).to  have_content '推薦図書を投稿する'
        fill_in 'title',	with: book.title
        find('.search-button').click
        sleep 2
        expect(all('#search_result > div').length).not_to eq 0 # 検索結果が0件ではないことを検証
        all('#search_result > div')[0].click
        expect do
          find('input[type="submit"]').click
          sleep 3
        end.to change(another_user.books, :count).by(1).and change(user.books, :count).by(0) # 投稿したユーザーにのみ紐付いているかどうか検証
        expect(page).not_to have_content '推薦図書を投稿する' # トップページに戻ることを検証
      end
    end
    
    context '投稿に失敗' do
      it '書籍が選択されていないとき投稿に失敗する' do
        sign_in(user)
        click_link href: '/books/new'
        expect(page).to  have_content '推薦図書を投稿する'
        fill_in 'title',	with: book.title
        find('.search-button').click
        expect(all('#search_result > div').length).not_to eq 0 # 検索結果が0件ではないことを検証
        expect do
          find('input[type="submit"]').click # 書籍を選択せずに送信
          sleep 2
        end.to change(Book, :count).by(0)
        expect(page).to have_content "Author can't be blank"
      end

      it '同じ書籍を2回投稿すると投稿に失敗する' do
        sign_in(user) # ログインする
        click_link href: '/books/new'
        expect(page).to  have_content '推薦図書を投稿する'
        fill_in 'title',	with: book.title
        find('.search-button').click
        sleep 2
        expect(all('#search_result > div').length).not_to eq 0 # 検索結果が0件ではないことを検証
        all('#search_result > div')[0].click
        expect do
          find('input[type="submit"]').click
          sleep 2
        end.to change(user.books, :count).by(1) # ユーザーと紐付いているかどうかも検証
        expect(page).not_to have_content '推薦図書を投稿する' # トップページに戻ることを検証
        click_link href: '/books/new'
        expect(page).to  have_content '推薦図書を投稿する'
        fill_in 'title',	with: book.title
        find('.search-button').click
        sleep 2
        expect(all('#search_result > div').length).not_to eq 0 # 検索結果が0件ではないことを検証
        all('#search_result > div')[0].click
        expect do
          find('input[type="submit"]').click
          sleep 2
        end.to change(user.books, :count).by(0) # ユーザーと紐付いているかどうかも検証
        expect(page).to  have_content 'その書籍はすでに追加されています'
      end

      it 'ユーザーがログインしていない場合書籍投稿のモーダルが開かずアラートが出る' do
        visit root_path
        click_link href: '/books/new'
        sleep 5
        expect(page.driver.browser.switch_to.alert.text).to eq '推薦図書の投稿にはログインが必要です'
        sleep 2
        page.driver.browser.switch_to.alert.accept
        expect(page).not_to have_content '推薦図書を投稿する' # トップページにとどまることを検証
      end
    end

    context 'モーダルの開閉' do
      it 'エラーメッセージはモーダルを開閉すると消える' do
        sign_in(user) # ログインする
        click_link href: '/books/new'
        expect(page).to  have_content '推薦図書を投稿する'
        find('input[type="submit"]').click
        sleep 2
        expect(page).to have_content "Author can't be blank"
        click_button 'x'
        click_link href: '/books/new'
        expect(page).to  have_content '推薦図書を投稿する'
        expect(page).not_to have_content "Author can't be blank"
      end

      it '入力内容および検索結果はモーダルを開閉すると消える' do
        sign_in(user) # ログインする
        click_link href: '/books/new'
        expect(page).to  have_content '推薦図書を投稿する'
        fill_in 'title',	with: book.title
        find('.search-button').click
        sleep 2
        expect(all('#search_result > div').length).not_to eq 0 # 検索結果が0件ではないことを検証
        click_button 'x'
        click_link href: '/books/new'
        expect(page).to  have_content '推薦図書を投稿する'
        expect(all('#search_result > div').length).to eq 0 # 検索結果が0件ではないことを検証
        expect(page).to have_field 'title', with: ''
      end
    end
  end

  describe '書籍の検索' do
    context '検索に成功' do
      it '何も入力せずに検索ボタンを入力すると検索結果が0件である' do
        sign_in(user)
        click_link href: '/books/new'
        expect(page).to  have_content '推薦図書を投稿する'
        fill_in 'title',	with: ''
        find('.search-button').click
        sleep 5
        expect(page.driver.browser.switch_to.alert.text).to eq 'タイトルを入力してください'
        sleep 2
        page.driver.browser.switch_to.alert.accept
        expect(find('#search_result').text).to eq '' # 検索結果が0件になることを検証
        expect(page).to have_content '推薦図書を投稿する' # モーダルにとどまっていることを検証
      end

      it '検索がヒットしない場合検索結果が0件である' do
        # 検索処理としては成功しているので正常形として記述
        sign_in(user)
        click_link href: '/books/new'
        expect(page).to  have_content '推薦図書を投稿する'
        fill_in 'title',	with: 'hogefugahoge'
        find('.search-button').click
        sleep 5
        expect(page.driver.browser.switch_to.alert.text).to eq '検索結果が見つかりませんでした'
        sleep 2
        page.driver.browser.switch_to.alert.accept
        expect(find('#search_result').text).to eq '' # 検索結果が0件になることを検証
        expect(page).to have_content '推薦図書を投稿する' # モーダルにとどまっていることを検証
      end
    end
  end
end
