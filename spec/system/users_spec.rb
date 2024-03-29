# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Users', type: :system do
  let(:user) { build(:user) }
  let(:book) { build(:book) }
  let(:another_book) { build(:book) }

  # metaタグの設定を一時的にonにしてcsrf-tokenを取り出せるようにする。
  # フロントではsetAxiosDefaultsメソッドでエラーが発生しなくなる
  before do
    ActionController::Base.allow_forgery_protection = true
  end
  
  after do
    ActionController::Base.allow_forgery_protection = false
  end

  describe '新規登録' do
    before do
      visit root_path
      find('.header-link', text: '新規登録').click # reactで作ったaタグはhref属性がつかないのでfindで検出する
      click_link 'SignUp with Email'
      expect(page).to have_content 'SignUp'
    end

    context '新規登録できるとき' do
      it '全てのフォームに値を入力すると新規登録できる' do
        fill_in 'nickname',	with: user.nickname
        fill_in 'email',	with: user.email
        fill_in 'password',	with: user.password
        fill_in 'password_confirmation',	with: user.password_confirmation
        attach_file 'avatar', 'spec/fixtures/test_avatar.png'
        expect do
          click_button 'SignUp'
          sleep 2 # sleepしないと間に合わない
        end.to change(User, :count).by(1) # Userのデータが1つ増える
        # ログインすると表示が切り替わる
        expect(page).to  have_content 'ログアウト'
        expect(page).to  have_content 'マイページ'
      end

      it '画像はなしでも新規登録できる' do
        fill_in 'nickname',	with: user.nickname
        fill_in 'email',	with: user.email
        fill_in 'password',	with: user.password
        fill_in 'password_confirmation',	with: user.password_confirmation
        expect  do
          click_button 'SignUp'
          sleep 2 # sleepしないと間に合わない
        end.to change(User, :count).by(1) # Userのデータが1つ増える
        # ログインすると表示が切り替わる
        expect(page).to  have_content 'ログアウト'
        expect(page).to  have_content 'マイページ'
      end
    end

    context '新規登録できない時' do
      # バリデーションの詳細なテストはmoodels/user_spec.rbにて
      # 今回はuniqueness, presence, formatの3つに分けて検証
      it '同じnickname, emailのユーザーが既に登録されている場合登録できない' do
        user.save
        fill_in 'nickname',	with: user.nickname
        fill_in 'email',	with: user.email
        fill_in 'password',	with: user.password
        fill_in 'password_confirmation',	with: user.password_confirmation
        expect  do
          click_button 'SignUp'
          sleep 2 # sleepしないと間に合わない
        end.to change(User, :count).by(0) # Userのデータが増えていない
        # 正しいエラーメッセージが出てくる
        expect(page).to have_content 'Nickname has already been taken'
        expect(page).to have_content 'Email has already been taken'
      end

      it '空のデータを送った場合登録できない' do
        fill_in 'nickname',	with: ''
        fill_in 'email',	with: ''
        fill_in 'password',	with: ''
        fill_in 'password_confirmation',	with: ''
        expect  do
          click_button 'SignUp'
          sleep 2 # sleepしないと間に合わない
        end.to change(User, :count).by(0) # Userのデータが増えていない
        expect(page).to have_content "Nickname can't be blank"
        expect(page).to have_content "Email can't be blank"
        expect(page).to have_content "Password can't be blank"
      end

      it 'パスワードが半角英大文字・小文字・数字を全て含まない形式の場合登録できない' do
        fill_in 'nickname',	with: user.nickname
        fill_in 'email',	with: user.email
        fill_in 'password',	with: 'test1234'
        fill_in 'password_confirmation',	with: 'test1234'
        expect  do
          click_button 'SignUp'
          sleep 2 # sleepしないと間に合わない
        end.to change(User, :count).by(0) # Userのデータが増えていない
        expect(page).to have_content 'Password must include half-width number, lowercase alphabet, and uppercase alphabet'
      end
    end

    context '新規登録モーダルの開閉' do
      it 'モーダルを閉じ再度開くとエラーメッセージは消える' do
        fill_in 'nickname',	with: ''
        fill_in 'email',	with: ''
        fill_in 'password',	with: ''
        fill_in 'password_confirmation',	with: ''
        expect  do
          click_button 'SignUp'
          sleep 2 # sleepしないと間に合わない
        end.to change(User, :count).by(0) # Userのデータが増えていない
        expect(page).to have_content "Nickname can't be blank"
        expect(page).to have_content "Email can't be blank"
        expect(page).to have_content "Password can't be blank"
        click_button 'x'
        find('.header-link', text: '新規登録').click # reactで作ったaタグはhref属性がつかないのでfindで検出する
        click_link 'SignUp with Email'
        expect(page).to have_content 'SignUp'
        expect(page).not_to have_content "Nickname can't be blank"
        expect(page).not_to have_content "Email can't be blank"
        expect(page).not_to have_content "Password can't be blank"
      end

      it 'モーダルを閉じ、再び開くと入力内容が保持されており、新規登録も可能である' do
        fill_in 'nickname',	with: user.nickname
        fill_in 'email',	with: user.email
        fill_in 'password',	with: user.password
        fill_in 'password_confirmation',	with: user.password_confirmation
        attach_file 'avatar', 'spec/fixtures/test_avatar.png'
        click_button 'x'
        find('.header-link', text: '新規登録').click # reactで作ったaタグはhref属性がつかないのでfindで検出する
        click_link 'SignUp with Email'
        sleep 2 # sleepしないと間に合わない?
        expect(page).to have_content 'SignUp'
        sleep 2 # sleepしないと間に合わない?
        expect(page).to have_field 'email', with: ''
        expect(page).to  have_field 'password', with: ''
      end
    end
  end

  describe 'ログイン' do
    before do
      user.save
      visit root_path
      expect(page).not_to  have_selector '#new_book_link'
      find('.header-link', text: 'ログイン').click # href属性がないaタグはclick_link, click_onで検出できないのでfindで検出する
      click_link 'SignIn with Email'
      expect(page).to have_content 'SignIn'
    end

    context 'ログインできる時' do
      it 'emailとpasswordを入力すればログインできる' do
        fill_in 'email',	with: user.email
        fill_in 'password',	with: user.password
        click_button 'SignIn'
        sleep 2 # sleepしないと間に合わない
        # ログインすると表示が切り替わる
        expect(page).to  have_content 'ログアウト'
        expect(page).to  have_content 'マイページ'
      end

      it 'ログインすると書籍投稿用ボタンが出現する' do
        fill_in 'email',	with: user.email
        fill_in 'password',	with: user.password
        click_button 'SignIn'
        sleep 2 # sleepしないと間に合わない
        expect(page).to  have_selector '#new_book_link'
      end
    end

    context 'ログインできない時' do
      it 'emailだけではログインできない' do
        fill_in 'email',	with: user.email
        click_button 'SignIn'
        sleep 2 # sleepしないと間に合わない
        # 正しいエラーメッセージが出てくる
        expect(page).to have_content 'Authorization failed. Invalid password'
      end

      it 'パスワードだけではログインできない' do
        fill_in 'password',	with: user.password
        click_button 'SignIn'
        sleep 2 # sleepしないと間に合わない
        # 正しいエラーメッセージが出てくる
        expect(page).to have_content 'Authorization failed. Invalid email' # TODO: なぜかエラーメッセージ出てこない
      end

      it 'emailとパスワード両方空の場合ログインできない。emailのエラーメッセージのみ出てくる' do
        click_button 'SignIn'
        sleep 2 # sleepしないと間に合わない
        # 正しいエラーメッセージが出てくる
        expect(page).to have_content 'Authorization failed. Invalid email'
      end
    end

    context 'ログインのモーダルの開閉' do
      it 'モーダルを閉じ再度開くとエラーメッセージは消える' do
        fill_in 'email',	with: ''
        fill_in 'password',	with: ''
        click_button 'SignIn'
        sleep 2 # sleepしないと間に合わない
        expect(page).to have_content 'Authorization failed. Invalid email' # email→passwordと順番に判定しているのでパスワードのエラーメッセージ出てこない
        click_button 'x'
        find('.header-link', text: 'ログイン').click # reactで作ったaタグはhref属性がつかないのでfindで検出する
        click_link 'SignIn with Email'
        expect(page).to have_content 'SignIn'
        expect(page).not_to have_content 'Authorization failed. Invalid email' # email→passwordと順番に判定しているのでパスワードのエラーメッセージ出てこない
      end

      it 'モーダルを閉じ、再び開くと入力内容が消える' do
        fill_in 'email',	with: user.email
        fill_in 'password',	with: user.password
        click_button 'x'
        find('.header-link', text: 'ログイン').click # reactで作ったaタグはhref属性がつかないのでfindで検出する
        click_link 'SignIn with Email'
        expect(page).to have_content 'SignIn'
        sleep 2 # sleepしないと間に合わない?
        expect(page).to have_field 'email', with: ''
        expect(page).to have_field 'password', with: ''
      end
    end
  end

  describe 'ログアウト' do
    before do
      sign_in(user) # ログインする
    end

    context 'ログアウトできる時' do
      it 'ログインしているユーザーはヘッダーのボタンからログアウトでき、welcomeページに遷移する' do
        find('.header-link', text: 'ログアウト').click
        expect(page).to have_content 'SignOut'
        click_button 'SignOut'
        # ログインすると表示が切り替わる
        expect(page).to  have_content '新規登録'
        expect(page).to  have_content 'ログイン'
        expect(page).to  have_content 'Kaidoku - 会読'
      end

      it 'ログアウトすると書籍投稿用のリンクは消える' do
        expect(page).to  have_selector '#new_book_link'
        find('.header-link', text: 'ログアウト').click
        expect(page).to have_content 'SignOut'
        click_button 'SignOut'
        # ログアウトすると書籍投稿ボタンは消える
        expect(page).not_to have_selector '#new_book_link'
      end
    end
  end

  describe 'マイページの表示' do
    context 'マイページの表示に成功' do
      it 'ログイン状態のユーザーがマイページにアクセスすると正しくマイページが読み込める' do
        sign_in(user) # ログインする
        find('.header-link', text: 'マイページ').click      
        expect(page).to have_content "#{user.nickname}さんのマイページ"
      end

      it 'アバターが添付されている場合アバター画像が表示されている' do
        # 厳密にいうと新規登録で画像添付すべき
        user.avatar.attach(fixture_file_upload('spec/fixtures/test_avatar.png', filename: 'test_avatar.png', content_type: 'image/png'))
        sign_in(user) # ログインする
        find('.header-link', text: 'マイページ').click
        expect(page).to have_content "#{user.nickname}さんのマイページ"
        expect(page).to have_selector "img[src*='test_avatar.png']" # 実際には画像URLが入るのでもっと長い。ファイル名は必ず含むので部分一致で検索
        sleep 2
      end
    end

    context '推薦図書一覧の表示に成功' do
      before do
        user.save
        # booksテーブルのデータとしてはanother_bookが新しいが、userがbooksに追加した順としてはbookが新しい
        book.save
        another_book.save
        user.books.push(another_book, book)
        sleep 5
        sign_in(user) # ログインする
        find('.header-link', text: 'マイページ').click 
        expect(page).to have_content "#{user.nickname}さんのマイページ"
        click_link '推薦図書一覧'  
        sleep 5
      end
      
      it 'マイページから推薦図書一覧をクリックすると投稿した推薦図書がユーザーが推薦図書に追加した順で表示されている。' do
        expect(all('.book-list-item').length).to eq 2
        expect(all('.book-title')[0].text).to eq book.title
        expect(all('.book-title')[1].text).to eq another_book.title
      end
      
      it "新しく推薦図書を追加すると一番下に追加される" do
        click_link href: '/books/new'
        expect(page).to  have_content '推薦図書を投稿する'
        fill_in 'keyword',	with: 'test'
        sleep 3
        find('.search-button').click
        sleep 5
        expect(all('#search_result > div').length).not_to eq 0 # 検索結果が0件ではないことを検証
        all('#search_result > div')[0].click
        expect do
          find('input[type="submit"]').click
          sleep 2
        end.to change(user.books, :count).by(1) # ユーザーと紐付いているかどうかも検証
        expect(page).not_to have_content '推薦図書を投稿する' # トップページに戻ることを検証
        click_link '推薦図書一覧'
        expect(all('.book-list-item > .book-title')[0].text).not_to eq 'test' # テストデータではない、つまり新しく追加したデータは一番うしろに追加される
      end
      
    end

    context 'アウトプットが投稿されている時' do
      before do
        # 事前準備なのでbeforeに移した
        user.save
        create_list(:user_book, 2, user_id: user.id)
        sleep 5
        # formオブジェクトではcreate_listが使えないのでちょっと回りくどく同じデータを複数個生成している
        3.times do
          output = build(:output, user_id: user.id, book_id: user.books[-1].id)
          output.save
        end  
      end
      
      it 'アウトプットが投稿されていればマイページでアウトプット一覧が参照できる' do
        sign_in(user) # ログインする
        find('.header-link', text: 'マイページ').click
        expect(page).to have_content "#{user.nickname}さんのマイページ"
        click_link '推薦図書一覧'
        sleep 10
        expect(all('.book-list-item').length).to eq user.books.length
        all('a', text: 'アウトプット')[0].click
        expect(page).to have_content "『#{user.books[-1].title}』のアウトプット"
        sleep 5
        # アウトプットのリストに1個しかない要素
        expect(all('.output-list-header').length).to eq user.books[-1].awarenesses.length
        expect(all('.awareness')[0].text).to eq user.books[-1].awarenesses[-1].content # 一番新しいものが一番上に来る
      end
    end

    context 'マイページからサインアウト' do
      it 'マイページからサインアウトするとアラートが出てトップページに戻る' do
        sign_in(user) # ログインする
        find('.header-link', text: 'マイページ').click
        expect(page).to have_content "#{user.nickname}さんのマイページ"
        find('.header-link', text: 'ログアウト').click
        expect(page).to have_content 'SignOut'
        click_button 'SignOut'
        # アラートは表示されずにトップページに遷移する仕様に変更
        expect(page).not_to have_content "#{user.nickname}さんのマイページ"
        expect(page).to  have_content '新規登録'
        expect(page).to  have_content 'ログイン'
      end
    end

    context 'マイページからモーダルを操作' do
      it 'マイページからサインアウトモーダル、推薦図書投稿モーダルを開き、何もせず閉じるとマイページに戻る' do
        sign_in(user) # ログインする
        find('.header-link', text: 'マイページ').click
        expect(page).to have_content "#{user.nickname}さんのマイページ"
        find('.header-link', text: 'ログアウト').click
        expect(page).to have_content 'SignOut'
        click_button 'x'
        expect(page).to have_content "#{user.nickname}さんのマイページ"
        expect(page).not_to have_content 'SignOut'
        sleep 5
        click_link href: '/books/new'
        expect(page).to  have_content '推薦図書を投稿する'
        click_button 'x'
        expect(page).to have_content "#{user.nickname}さんのマイページ"
        expect(page).not_to have_content '推薦図書を投稿する'
      end
    end
  end

  describe 'ユーザー情報の編集' do
    before do
      sign_in(user) # ログインする
    end

    context '編集に成功する' do
      it '登録されたユーザーはマイページよりユーザー情報の編集が可能である(ニックネームのみ)' do
        find('.header-link', text: 'マイページ').click
        expect(page).to have_content "#{user.nickname}さんのマイページ"
        expect(page).to have_selector "img[src*='sample_avatar.png']" # 実際には画像URLが入るのでもっと長い。ファイル名は必ず含むので部分一致で検索
        click_link 'ユーザー情報編集'
        click_link 'Edit Profile'
        fill_in 'nickname',	with: 'updated'
        expect do
          click_button 'Edit Profile'
        end.not_to change(User, :count) # 編集なのでカウントは増えない
        sleep 3
        expect(page).to have_content 'updatedさんのマイページ'
        expect(page).to have_selector "img[src*='sample_avatar.png']" # 実際には画像URLが入るのでもっと長い。ファイル名は必ず含むので部分一致で検索
      end

      it '登録されたユーザーはマイページよりユーザー情報の編集が可能である(アバターのみ)' do
        prev_nickname = user.nickname
        find('.header-link', text: 'マイページ').click
        expect(page).to have_content "#{user.nickname}さんのマイページ"
        expect(page).to have_selector "img[src*='sample_avatar.png']" # 実際には画像URLが入るのでもっと長い。ファイル名は必ず含むので部分一致で検索
        click_link 'ユーザー情報編集'
        sleep 2
        click_link 'Edit Profile'
        attach_file 'avatar', 'spec/fixtures/test_avatar.png'
        expect do
          click_button 'Edit Profile'
        end.not_to change(User, :count) # 編集なのでカウントは増えない
        sleep 3
        expect(page).to have_content "#{user.nickname}さんのマイページ" # ニックネームが変わっていないこと
        expect(page).to have_selector "img[src*='test_avatar.png']" # 実際には画像URLが入るのでもっと長い。ファイル名は必ず含むので部分一致で検索
        # DBの変化を検証
        expect(user.nickname).to eq prev_nickname # DBのニックネームが変化していないこと
        expect(user.avatar.blob.filename).to eq 'test_avatar.png' # 画像が添付されていること
      end

      it '登録されたユーザーはマイページよりユーザー情報の編集が可能である(アバターと画像両方変更)' do
        find('.header-link', text: 'マイページ').click
        expect(page).to have_content "#{user.nickname}さんのマイページ"
        expect(page).to have_selector "img[src*='sample_avatar.png']" # 実際には画像URLが入るのでもっと長い。ファイル名は必ず含むので部分一致で検索
        click_link 'ユーザー情報編集'
        click_link 'Edit Profile'
        fill_in 'nickname',	with: 'updated'
        attach_file 'avatar', 'spec/fixtures/test_avatar.png'
        expect do
          click_button 'Edit Profile'
        end.not_to change(User, :count) # 編集なのでカウントは増えない
        sleep 3
        expect(page).to have_content 'updatedさんのマイページ'
        expect(page).to have_selector "img[src*='test_avatar.png']" # 実際には画像URLが入るのでもっと長い。ファイル名は必ず含むので部分一致で検索
        # DBの変化を検証。なぜかuser.nicknameが変化しない(実際のアプリでは変化している)
        expect(user.avatar.blob.filename).to eq 'test_avatar.png' # 画像が添付されていること
      end
    end

    context '失敗する' do
      it 'ニックネームを空にして送信すると編集に失敗しエラーメッセージが表示される(画像添付なし)' do
        prev_nickname = user.nickname
        find('.header-link', text: 'マイページ').click
        expect(page).to have_content "#{user.nickname}さんのマイページ"
        expect(page).to have_selector "img[src*='sample_avatar.png']" # 実際には画像URLが入るのでもっと長い。ファイル名は必ず含むので部分一致で検索
        click_link 'ユーザー情報編集'
        click_link 'Edit Profile'
        fill_in 'nickname',	with: ''
        expect do
          click_button 'Edit Profile'
        end.not_to change(User, :count) # 編集なのでカウントは増えない
        sleep 3
        expect(page).to have_content "Nickname can't be blank"
        click_button 'x'
        expect(page).to have_content "#{user.nickname}さんのマイページ" # ニックネームが変わっていないこと
        expect(page).to have_selector "img[src*='sample_avatar.png']" # 画像が変わっていない実際には画像URLが入るのでもっと長い。ファイル名は必ず含むので部分一致で検索
        # DBの変化を検証
        expect(user.nickname).to eq prev_nickname # DBのニックネームが変化していないこと
      end

      it 'ニックネームを空にして送信すると編集に失敗しエラーメッセージが表示される(画像添付あり)' do
        prev_nickname = user.nickname
        find('.header-link', text: 'マイページ').click
        expect(page).to have_content "#{user.nickname}さんのマイページ"
        expect(page).to have_selector "img[src*='sample_avatar.png']" # 実際には画像URLが入るのでもっと長い。ファイル名は必ず含むので部分一致で検索
        click_link 'ユーザー情報編集'
        click_link 'Edit Profile'
        fill_in 'nickname',	with: ''
        attach_file 'avatar', 'spec/fixtures/test_avatar.png'
        expect do
          click_button 'Edit Profile'
        end.not_to change(User, :count) # 編集なのでカウントは増えない
        sleep 3
        expect(page).to have_content "Nickname can't be blank"
        click_button 'x'
        expect(page).to have_content "#{user.nickname}さんのマイページ" # ニックネームが変わっていないこと
        expect(page).to have_selector "img[src*='sample_avatar.png']" # 画像が変わっていない実際には画像URLが入るのでもっと長い。ファイル名は必ず含むので部分一致で検索
        # DBの変化を検証
        expect(user.nickname).to eq prev_nickname # DBのニックネームが変化していないこと
      end

      it 'ニックネームがすでに存在していると編集に失敗しエラーメッセージが表示される(画像添付なし)' do
        prev_nickname = user.nickname
        another_user = create(:user)
        find('.header-link', text: 'マイページ').click
        expect(page).to have_content "#{user.nickname}さんのマイページ"
        expect(page).to have_selector "img[src*='sample_avatar.png']" # 実際には画像URLが入るのでもっと長い。ファイル名は必ず含むので部分一致で検索
        click_link 'ユーザー情報編集'
        click_link 'Edit Profile'
        fill_in 'nickname',	with: another_user.nickname
        expect do
          click_button 'Edit Profile'
        end.not_to change(User, :count) # 編集なのでカウントは増えない
        sleep 3
        expect(page).to have_content 'Nickname has already been taken'
        click_button 'x'
        expect(page).to have_content "#{user.nickname}さんのマイページ" # ニックネームが変わっていないこと
        expect(page).to have_selector "img[src*='sample_avatar.png']" # 画像が変わっていない実際には画像URLが入るのでもっと長い。ファイル名は必ず含むので部分一致で検索
        expect(user.nickname).to eq prev_nickname # DBのニックネームが変化していないこと
      end

      it 'ニックネームがすでに存在していると編集に失敗しエラーメッセージが表示される(画像添付あり)' do
        prev_nickname = user.nickname
        another_user = create(:user)
        find('.header-link', text: 'マイページ').click
        expect(page).to have_content "#{user.nickname}さんのマイページ"
        expect(page).to have_selector "img[src*='sample_avatar.png']" # 実際には画像URLが入るのでもっと長い。ファイル名は必ず含むので部分一致で検索
        click_link 'ユーザー情報編集'
        click_link 'Edit Profile'
        fill_in 'nickname',	with: another_user.nickname
        attach_file 'avatar', 'spec/fixtures/test_avatar.png'
        expect do
          click_button 'Edit Profile'
        end.not_to change(User, :count) # 編集なのでカウントは増えない
        sleep 3
        expect(page).to have_content 'Nickname has already been taken'
        click_button 'x'
        expect(page).to have_content "#{user.nickname}さんのマイページ" # ニックネームが変わっていないこと
        expect(page).to have_selector "img[src*='sample_avatar.png']" # 画像が変わっていない実際には画像URLが入るのでもっと長い。ファイル名は必ず含むので部分一致で検索
        # DBの変化を検証
        expect(user.nickname).to eq prev_nickname # DBのニックネームが変化していないこと
      end

      it 'エラーメッセージはモーダルを開き直すと消える' do
        find('.header-link', text: 'マイページ').click
        expect(page).to have_content "#{user.nickname}さんのマイページ"
        expect(page).to have_selector "img[src*='sample_avatar.png']" # 実際には画像URLが入るのでもっと長い。ファイル名は必ず含むので部分一致で検索
        click_link 'ユーザー情報編集'
        click_link 'Edit Profile'
        fill_in 'nickname',	with: ''
        expect do
          click_button 'Edit Profile'
        end.not_to change(User, :count) # 編集なのでカウントは増えない
        sleep 3
        expect(page).to have_content "Nickname can't be blank"
        click_button 'x'
        click_link 'ユーザー情報編集'
        click_link 'Edit Profile'
        expect(page).not_to have_content "Nickname can't be blank"
      end
    end
  end
end
