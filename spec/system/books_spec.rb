# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Books', type: :system do
  let(:user) { build(:user) }
  let(:another_user) { build(:user) }
  let(:book) { build(:book) }
  let(:book_params) { attributes_for(:book) } # paramsとして送るためにattributes_forを使用
  let(:invalid_book_params) { attributes_for(:book, title: '') } # コントローラーで空のキーワードに対してnilを返すようにしている
  let(:book_search_params) { { keyword: '７つの習慣' } } # 検索したらヒットしそうな本にしてます

  describe "書籍一覧" do
    before do
      @book_list = create_list(:book, 15)
    end

    context "一覧表示に成功(ログイン時)" do
      it "ログイン時にトップページにアクセスするとすでに投稿された書籍が新しい順に12件一覧で表示されている" do
        sign_in(user) # ログインする
        expect(page).to  have_content '新着書籍一覧'
        sleep 3
        # どれだけ投稿しても表示されるのは12件
        expect(all('.book-list-item').length).to  eq 12
        # 新しい順になっていることを検証
        expect(all('.book-title')[0].text).to  eq @book_list[14].title
        expect(all('.book-title')[1].text).to  eq @book_list[13].title
      end

      it "書籍が12件に満たない場合は投稿されている分だけ書籍が表示されている" do
        Book.delete_all
        create_list(:book, 6)
        sign_in(user) # ログインする
        expect(page).to  have_content '新着書籍一覧'
        sleep 3
        expect(all('.book-list-item').length).to  eq 6
      end

      it "書籍が0件の場合は投稿されている分だけ書籍が表示されている" do
        Book.delete_all
        sign_in(user) # ログインする
        expect(page).to  have_content '新着書籍一覧'
        sleep 3
        expect(all('.book-list-item').length).to  eq 0
      end

      it "新しく書籍を追加しても一覧の表示数は12件であり、一番上に最新の投稿が追加される" do
        sign_in(user) # ログインする
        expect(page).to  have_content '新着書籍一覧'
        sleep 3
        expect(all('.book-list-item').length).to  eq 12
        click_link href: '/books/new'
        expect(page).to  have_content '推薦図書を投稿する'
        fill_in 'title',	with: 'test'
        find('.search-button').click
        sleep 2
        expect(all('#search_result > div').length).not_to eq 0 # 検索結果が0件ではないことを検証
        all('#search_result > div')[0].click
        # 検索結果のタイトルと一覧に追加された書籍のタイトルが一致するか検証
        new_book_title = all('#search_result h3')[0].text
        expect do
          find('input[type="submit"]').click
          sleep 2
        end.to change(user.books, :count).by(1) # ユーザーと紐付いているかどうかも検証
        expect(page).not_to have_content '推薦図書を投稿する' # トップページに戻ることを検証
        # 書籍を追加しても表示されるのは12件
        expect(all('.book-list-item').length).to  eq 12
        expect(all('.book-title')[0].text).to  eq new_book_title
        expect(all('.book-title')[1].text).to  eq @book_list[14].title
        # 一番古い書籍の情報は表示されなくなる
        expect(page).not_to  have_content @book_list[0].title
      end
    end

    context "一覧表示に成功(ログアウト時)" do
      it "welcomeページより「みんなのアウトプットを見る」ボタンを押すとすでに投稿された書籍が一覧で表示されている" do
        visit root_path
        expect(page).to  have_content 'Kaidoku - 会読'
        click_link 'みんなのアウトプットを見る'
        sleep 3
        expect(page).to  have_content '新着書籍一覧'
        expect(all('.book-list-item').length).to  eq 12
      end
    end
  end
  

  describe '書籍の投稿' do
    context '投稿に成功' do
      it '検索結果から書籍を選択すると書籍の投稿ができる' do
        sign_in(user) # ログインする
        click_link href: '/books/new'
        expect(page).to  have_content '推薦図書を投稿する'
        fill_in 'title',	with: 'test'
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
        fill_in 'title',	with: 'test'
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
        fill_in 'title',	with: 'test'
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
        fill_in 'title',	with: 'test'
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
        fill_in 'title',	with: 'test'
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
        fill_in 'title',	with: 'test'
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
        fill_in 'title',	with: 'test'
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
        fill_in 'title',	with: 'test'
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
        fill_in 'title',	with: 'test'
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
