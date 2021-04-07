require 'rails_helper'

RSpec.describe "Users", type: :system do
  let(:user) { build(:user) }
  let(:book) { build(:book) }
  
  describe "新規登録" do
    before do
      visit root_path
      find('a', text: '新規登録').click #reactで作ったaタグはhref属性がつかないのでfindで検出する
      expect(page).to have_content 'SignUp'  
    end
    
    context "新規登録できるとき" do
      it "全てのフォームに値を入力すると新規登録できる" do
        fill_in "nickname",	with: user.nickname
        fill_in "email",	with: user.email
        fill_in "password",	with: user.password
        fill_in "password_confirmation",	with: user.password_confirmation
        attach_file "avatar", "spec/fixtures/test_avatar.png"
        expect{
          click_button "SignUp"
          sleep 2 #sleepしないと間に合わない
        }.to  change(User, :count).by(1) #Userのデータが1つ増える
        # ログインすると表示が切り替わる
        expect(page).to  have_content 'ログアウト'
        expect(page).to  have_content 'マイページ'
      end

      it "画像はなしでも新規登録できる" do
        fill_in "nickname",	with: user.nickname
        fill_in "email",	with: user.email
        fill_in "password",	with: user.password
        fill_in "password_confirmation",	with: user.password_confirmation
        expect{
          click_button "SignUp"
          sleep 2 #sleepしないと間に合わない
        }.to  change(User, :count).by(1) #Userのデータが1つ増える
        # ログインすると表示が切り替わる
        expect(page).to  have_content 'ログアウト'
        expect(page).to  have_content 'マイページ'
      end
    end

    context "新規登録できない時" do
      #バリデーションの詳細なテストはmoodels/user_spec.rbにて
      # 今回はuniqueness, presence, formatの3つに分けて検証
      it "同じnickname, emailのユーザーが既に登録されている場合登録できない" do
        user.save
        fill_in "nickname",	with: user.nickname
        fill_in "email",	with: user.email
        fill_in "password",	with: user.password
        fill_in "password_confirmation",	with: user.password_confirmation
        expect{
          click_button "SignUp"
          sleep 2 #sleepしないと間に合わない
        }.to  change(User, :count).by(0) #Userのデータが増えていない
        #正しいエラーメッセージが出てくる
        expect(page).to have_content 'Nickname has already been taken'
        expect(page).to have_content 'Email has already been taken'
      end

      it "空のデータを送った場合登録できない" do
        fill_in "nickname",	with: ""
        fill_in "email",	with: ""
        fill_in "password",	with: ""
        fill_in "password_confirmation",	with: ""
        expect{
          click_button "SignUp"
          sleep 2 #sleepしないと間に合わない
        }.to  change(User, :count).by(0) #Userのデータが増えていない
        expect(page).to have_content "Nickname can't be blank"
        expect(page).to have_content "Email can't be blank"
        expect(page).to have_content "Password can't be blank"
      end

      it "パスワードが半角英大文字・小文字・数字を全て含まない形式の場合登録できない" do
        fill_in "nickname",	with: user.nickname
        fill_in "email",	with: user.email
        fill_in "password",	with: 'test1234'
        fill_in "password_confirmation",	with: 'test1234'
        expect{
          click_button "SignUp"
          sleep 2 #sleepしないと間に合わない
        }.to  change(User, :count).by(0) #Userのデータが増えていない
        expect(page).to have_content "Password must include half-width number, lowercase alphabet, and uppercase alphabet"
      end
    end
  end

  describe "ログイン" do
    before do
      user.save    
      visit root_path
      find('a', text: 'ログイン').click #href属性がないaタグはclick_link, click_onで検出できないのでfindで検出する
      expect(page).to have_content 'SignIn' 
    end

    context "ログインできる時" do
      it "emailとpasswordを入力すればログインできる" do
        fill_in "email",	with: user.email
        fill_in "password",	with: user.password
        click_button "SignIn"
        sleep 2 #sleepしないと間に合わない
        # ログインすると表示が切り替わる
        expect(page).to  have_content 'ログアウト'
        expect(page).to  have_content 'マイページ'
      end
    end

    context "ログインできない時" do
      it "emailだけではログインできない" do
        fill_in "email",	with: user.email
        click_button "SignIn"
        sleep 2 #sleepしないと間に合わない
        #正しいエラーメッセージが出てくる
        expect(page).to  have_content 'Authorization failed. Invalid password'
      end

      it "パスワードだけではログインできない" do
        fill_in "password",	with: user.password
        click_button "SignIn"
        sleep 2 #sleepしないと間に合わない
        #正しいエラーメッセージが出てくる
        expect(page).to  have_content 'Authorization failed. Invalid email' #todo:なぜかエラーメッセージ出てこない
      end

      it "emailとパスワード両方空の場合ログインできない。emailのエラーメッセージのみ出てくる" do
        click_button "SignIn"
        sleep 2 #sleepしないと間に合わない
        #正しいエラーメッセージが出てくる
        expect(page).to  have_content 'Authorization failed. Invalid email'
      end
    end  
  end

  describe "ログアウト" do
    before do
      sign_in(user) #ログインする
    end
    
    context "ログアウトできる時" do
      it "ログインしているユーザーはヘッダーのボタンからログアウトできる" do
        find('a', text: 'ログアウト').click 
        expect(page).to have_content 'SignOut' 
        click_button "SignOut"
        # ログインすると表示が切り替わる
        expect(page).to  have_content '新規登録'
        expect(page).to  have_content 'ログイン'
      end
    end
  end

  describe "マイページの表示" do
    context "マイページの表示に成功" do
      it "ログイン状態のユーザーがマイページにアクセスすると正しくマイページが読み込める" do
        sign_in(user) #ログインする
        find('a', text: 'マイページ').click
        expect(page).to have_content "#{user.nickname}さんのマイページ"
      end
      
      it "アバターが添付されている場合アバター画像が表示されている" do
        user.avatar.attach(fixture_file_upload('spec/fixtures/test_avatar.png', filename: 'test_avatar.png', content_type: 'image/png')) #厳密にいうと新規登録で画像添付すべき
        sign_in(user) #ログインする
        find('a', text: 'マイページ').click
        expect(page).to have_content "#{user.nickname}さんのマイページ"
        expect(page).to have_selector "img[src*='test_avatar.png']" #実際には画像URLが入るのでもっと長い。ファイル名は必ず含むので部分一致で検索
        sleep 2
      end

      it "マイページから推薦図書一覧をクリックすると投稿した推薦図書が一覧で表示されている。新しく推薦図書を追加すると一番下に追加される" do
        user.save
        create_list(:user_book, 5, user_id: user.id)
        sign_in(user) #ログインする
        find('a', text: 'マイページ').click
        expect(page).to have_content "#{user.nickname}さんのマイページ"
        click_link '推薦図書一覧'
        expect(all(".book-list-item").length).to eq 5  
        sleep 1
        click_link href: '/books/new'
        expect(page).to  have_content '推薦図書を投稿する'
        fill_in "title",	with: book.title
        sleep 1
        find('.search-button').click
        sleep 2
        expect(all('#search_result > div').length).not_to eq 0 #検索結果が0件ではないことを検証
        all('#search_result > div')[0].click
        expect {
          find('input[type="submit"]').click
          sleep 2
        }.to change(user.books, :count).by(1)  #ユーザーと紐付いているかどうかも検証
        expect(page).not_to  have_content '推薦図書を投稿する' #トップページに戻ることを検証
        click_link '推薦図書一覧'
        expect(all(".book-list-item > .book-title")[-1].text).not_to eq 'test' #テストデータではない、つまり新しく追加したデータは一番うしろに追加される
      end

      it "マイページからサインアウトするとアラートが出てトップページに戻る" do
        sign_in(user) #ログインする
        find('a', text: 'マイページ').click
        expect(page).to have_content "#{user.nickname}さんのマイページ"
        find('a', text: 'ログアウト').click 
        expect(page).to have_content 'SignOut' 
        click_button "SignOut"
        # ログインすると表示が切り替わる
        sleep 5
        expect(page.driver.browser.switch_to.alert.text).to eq "ユーザーがサインアウトしました。" 
        sleep 2
        page.driver.browser.switch_to.alert.accept 
        expect(page).to  have_content '新規登録'
        expect(page).to  have_content 'ログイン'
      end

      it "マイページからサインアウトモーダル、推薦図書投稿モーダルを開き、何もせず閉じるとマイページに戻る" do
        sign_in(user) #ログインする
        find('a', text: 'マイページ').click
        expect(page).to have_content "#{user.nickname}さんのマイページ"
        find('a', text: 'ログアウト').click 
        expect(page).to have_content 'SignOut' 
        click_button 'x'
        expect(page).to have_content "#{user.nickname}さんのマイページ"
        expect(page).not_to have_content 'SignOut' 
        click_link href: '/books/new'
        expect(page).to  have_content '推薦図書を投稿する'
        click_button 'x'
        expect(page).to have_content "#{user.nickname}さんのマイページ"
        expect(page).not_to  have_content '推薦図書を投稿する'
      end
    end
  end
end
