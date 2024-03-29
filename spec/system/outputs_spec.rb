require 'rails_helper'

RSpec.describe 'Outputs', type: :system, js: true do
  let(:user) { build(:user) }
  let(:output_user_one) { create(:user) }
  let(:output_user_two) { create(:user) }
  let(:book) { create(:book) }
  let(:user_book) { build(:user_book, user: user, book: book) }
  let(:user_another_book) { build(:user_book, user: user) }
  let(:output_user_one_book) { build(:user_book, user_id: output_user_one.id, book_id: book.id) }
  let(:output_user_two_book) { build(:user_book, user_id: output_user_two.id, book_id: book.id) }
  let(:output) { build(:output) }
  let(:user_1_output) { build(:output, user_id: output_user_one.id, book_id: book.id) }
  let(:user_2_output) { build(:output, user_id: output_user_two.id, book_id: book.id) }

  # metaタグの設定を一時的にonにしてcsrf-tokenを取り出せるようにする。
  # フロントではsetAxiosDefaultsメソッドでエラーが発生しなくなる
  before do
    ActionController::Base.allow_forgery_protection = true
  end
  
  after do
    ActionController::Base.allow_forgery_protection = false
  end

  describe 'アウトプット一覧' do
    before do
      # 中間テーブルのデータの保存はletでやるとなんかアソシエーションがうまくいかなかった
      output_user_one_book.save
      output_user_two_book.save

      # 検証のためにあえて保存する数を別々にしてます
      3.times do
        user_1_output.save
      end

      2.times do
        user_2_output.save
      end
    end

    context 'ログアウト時' do
      before do
        visit root_path
        expect(page).to have_content 'Kaidoku - 会読' # welcomeページにいることを検証
        click_link 'みんなのアウトプットを見る' # welcomeページから一覧へのリンク
        sleep 1
        expect(page).to have_content '新着書籍一覧' # 一覧にいるかどうか検証
        sleep 1
        click_link href: "/books/#{book.isbn}/outputs"
        expect(page).to have_content "『#{book.title}』のアウトプット"
      end

      it '「自分のアウトプット」という文字列および「推薦図書に追加する」「アウトプットを投稿する」ボタンが表示されていない' do
        expect(page).not_to have_content '自分のアウトプット'
        expect(page).not_to have_link '推薦図書に追加する'
        expect(page).not_to have_link 'アウトプットを投稿する'
      end

      it '投稿されているアウトプットが「みんなのアウトプット」として掲載されている' do
        expect(page).to have_content 'みんなのアウトプット'
        expect(all('.output-list-header').length).to eq book.awarenesses.length
        expect(all('.awareness')[0].text).to eq book.awarenesses[-1].content # 一番新しいものが一番上に来る
      end
    end

    context 'ログイン時' do
      context 'ログイン中のユーザーが推薦図書に追加していないとき' do
        before do
          sign_in(user)
          all('a', text: 'アウトプット一覧')[0].click
          expect(page).to  have_content "『#{book.title}』のアウトプット"
        end

        it '「推薦図書に追加する」ボタンが表示されている。「アウトプットを投稿する」ボタンは表示されていない' do
          expect(page).to  have_selector 'a', text: '推薦図書に追加する' # href属性がないリンクなのでhave_linkが使えない
          expect(page).not_to have_link 'アウトプットを投稿する' # 推薦図書に追加すると出てくるボタン
        end

        it '他のユーザーが投稿したアウトプットが「みんなのアウトプット」として掲載されている' do
          expect(page).to have_content 'みんなのアウトプット'
          expect(all('.output-list-header').length).to eq book.awarenesses.length
          expect(all('.awareness')[0].text).to eq book.awarenesses[-1].content # 一番新しいものが一番上に来る
        end
      end

      context 'ログイン中のユーザーが推薦図書に追加しているがアウトプットを投稿していないとき' do
        before do
          sign_in(user)
          user_book.save
          all('a', text: 'アウトプット一覧')[0].click
          expect(page).to have_content "『#{book.title}』のアウトプット"
        end

        it '「アウトプットを投稿する」ボタンが表示されている。「推薦図書に追加する」ボタンは表示されていない' do
          expect(page).not_to have_selector 'a', text: '推薦図書に追加する'
          expect(page).to have_link 'アウトプットを投稿する'
        end

        it '他のユーザーが投稿したアウトプットが「みんなのアウトプット」として掲載されている' do
          expect(page).to have_content 'みんなのアウトプット'
          expect(all('.output-list-header').length).to eq book.awarenesses.length
          expect(all('.awareness')[0].text).to eq book.awarenesses[-1].content # 一番新しいものが一番上に来る
        end
      end

      context 'ログイン中のユーザーがアウトプットを投稿しているとき' do
        before do
          sign_in(output_user_one)
          all('a', text: 'アウトプット一覧')[0].click
          expect(page).to  have_content "『#{book.title}』のアウトプット"
          # puts page.driver.browser.manage.logs.get(:browser).collect(&:message) # コンソールの内容を出力
        end

        it '「アウトプットを投稿する」ボタンが表示されている' do
          expect(page).to  have_link 'アウトプットを投稿する'
        end

        it '自分が投稿したアウトプットが「自分のアウトプット」として掲載されている' do
          expect(page).to have_content '自分のアウトプット'
          # 一番新しいものが一番上に来る
          expect(all('.myoutputs').length).to eq book.awarenesses.where(user_id: output_user_one.id).length
          expect(all('.myoutputs .awareness')[0].text).to eq book.awarenesses.where(user_id: output_user_one.id)[-1].content 
        end

        it '他のユーザーが投稿したアウトプットが「みんなのアウトプット」として掲載されている' do
          expect(page).to have_content 'みんなのアウトプット'
          # 一番新しいものが一番上に来る
          expect(all('.outputs-of-others').length).to eq book.awarenesses.where.not(user_id: output_user_one.id).length
          expect(all('.outputs-of-others .awareness')[0].text).to eq book.awarenesses.where.not(user_id: output_user_one.id)[-1].content 
        end
      end
    end
  end

  describe 'アウトプット投稿' do
    before do
      sign_in(user)
      sleep 1
      user_book.save
      sleep 1
      user_another_book.save
      sleep 1
      find('.header-link', text: 'マイページ').click
      expect(page).to have_content "#{user.nickname}さんのマイページ"
      find('a', text: '推薦図書一覧').click
      sleep 1
      all('a', text: 'アウトプット')[0].click
      sleep 1
      find('a', text: 'アウトプットを投稿する').click
      expect(page).to have_content 'アウトプットを投稿する'
    end

    context 'アウトプットの投稿に成功する' do
      it 'アクションプランが1つの時アウトプットの投稿に成功し、マイページのアウトプット一覧にアウトプットが1つ追加される' do
        fill_in 'output_content',	with: output.content
        fill_in 'output_time_of_execution_0',	with: output.action_plans[0][:time_of_execution]
        fill_in 'output_what_to_do_0',	with: output.action_plans[0][:what_to_do]
        fill_in 'output_how_to_do_0',	with: output.action_plans[0][:how_to_do]
        expect do
          click_button 'この内容で投稿する'
          sleep 1
        end.to change(Awareness, :count).by(1).and change(ActionPlan, :count).by(1) # ユーザーや書籍との紐付も同時に検証する
        expect(page).to have_content "『#{user.books[-1].title}』のアウトプット"
        sleep 1
        expect(all('.output-list-header').length).to eq 1 # アウトプットは1件
        expect(all('.action-plan').length).to eq 1 # アクションプランは1件
      end

      it 'アクションプランが2つの時アウトプットの投稿に成功し、マイページのアウトプット一覧にアウトプットが1つ追加される' do
        fill_in 'output_content',	with: output.content
        click_button 'アクションプランを追加'
        2.times do |fill_form_index|
          fill_in "output_time_of_execution_#{fill_form_index}",	with: output.action_plans[fill_form_index][:time_of_execution]
          fill_in "output_what_to_do_#{fill_form_index}",	with: output.action_plans[fill_form_index][:what_to_do]
          fill_in "output_how_to_do_#{fill_form_index}",	with: output.action_plans[fill_form_index][:how_to_do]
        end
        expect do
          click_button 'この内容で投稿する'
          sleep 1
        end.to change(Awareness, :count).by(1).and change(ActionPlan, :count).by(2)
        expect(page).to have_content "『#{user.books[-1].title}』のアウトプット"
        sleep 1
        expect(all('.output-list-header').length).to eq 1 # アウトプットは1件
        expect(all('.action-plan').length).to eq 2 # アクションプランは2件
      end

      it 'アクションプランが3つの時アウトプットの投稿に成功し、マイページのアウトプット一覧にアウトプットが1つ追加される' do
        fill_in 'output_content',	with: output.content
        2.times do
          click_button 'アクションプランを追加'
        end
        3.times do |fill_form_index|
          fill_in "output_time_of_execution_#{fill_form_index}",	with: output.action_plans[fill_form_index][:time_of_execution]
          fill_in "output_what_to_do_#{fill_form_index}",	with: output.action_plans[fill_form_index][:what_to_do]
          fill_in "output_how_to_do_#{fill_form_index}",	with: output.action_plans[fill_form_index][:how_to_do]
        end
        expect do
          click_button 'この内容で投稿する'
          sleep 1
        end.to change(Awareness, :count).by(1).and change(ActionPlan, :count).by(3)
        expect(page).to have_content "『#{user.books[-1].title}』のアウトプット"
        sleep 1
        expect(all('.output-list-header').length).to eq 1 # アウトプットは1件
        expect(all('.action-plan').length).to eq 3 # アクションプランは3件
      end

      it 'アクションプランを3つ記入した後、取り消しボタンを1回押すと保存されるアクションプランの数が2になる' do
        fill_in 'output_content',	with: output.content
        2.times do
          click_button 'アクションプランを追加'
        end
        3.times do |fill_form_index|
          fill_in "output_time_of_execution_#{fill_form_index}",	with: output.action_plans[fill_form_index][:time_of_execution]
          fill_in "output_what_to_do_#{fill_form_index}",	with: output.action_plans[fill_form_index][:what_to_do]
          fill_in "output_how_to_do_#{fill_form_index}",	with: output.action_plans[fill_form_index][:how_to_do]
        end
        all('span', text: '取り消し')[0].click
        expect do
          click_button 'この内容で投稿する'
          sleep 1
        end.to change(Awareness, :count).by(1).and change(ActionPlan, :count).by(2)
      end

      it 'アクションプランを3つ記入した後、取り消しボタンを2回押すと保存されるアクションプランの数が1になる' do
        fill_in 'output_content',	with: output.content
        2.times do
          click_button 'アクションプランを追加'
        end
        3.times do |fill_form_index|
          fill_in "output_time_of_execution_#{fill_form_index}",	with: output.action_plans[fill_form_index][:time_of_execution]
          fill_in "output_what_to_do_#{fill_form_index}",	with: output.action_plans[fill_form_index][:what_to_do]
          fill_in "output_how_to_do_#{fill_form_index}",	with: output.action_plans[fill_form_index][:how_to_do]
        end
        2.times do
          all('span', text: '取り消し')[0].click
        end
        expect do
          click_button 'この内容で投稿する'
          sleep 1
        end.to change(Awareness, :count).by(1).and change(ActionPlan, :count).by(1)
      end

      it '管理者でログイン時アウトプットを投稿するとSlackに通知される' do
        user.update(is_admin: true)
        user.reload
        allow(SlackNotification).to receive(:notify_output_post).and_return(true)
        fill_in 'output_content',	with: output.content
        fill_in 'output_time_of_execution_0',	with: output.action_plans[0][:time_of_execution]
        fill_in 'output_what_to_do_0',	with: output.action_plans[0][:what_to_do]
        fill_in 'output_how_to_do_0',	with: output.action_plans[0][:how_to_do]
        expect do
          click_button 'この内容で投稿する'
          sleep 1
        end.to change(Awareness, :count).by(1).and change(ActionPlan, :count).by(1) # ユーザーや書籍との紐付も同時に検証する
        expect(page).to have_content "『#{user.books[-1].title}』のアウトプット"
        sleep 1
        expect(all('.output-list-header').length).to eq 1 # アウトプットは1件
        expect(all('.action-plan').length).to eq 1 # アクションプランは1件
        expect(SlackNotification).to have_received(:notify_output_post).once  
      end
    end
    context 'アウトプットの投稿に失敗する' do
      it '気づきが空のとき投稿に失敗し、エラーメッセージが表示される' do
        fill_in 'output_content',	with: ''
        fill_in 'output_time_of_execution_0',	with: output.action_plans[0][:time_of_execution]
        fill_in 'output_what_to_do_0',	with: output.action_plans[0][:what_to_do]
        fill_in 'output_how_to_do_0',	with: output.action_plans[0][:how_to_do]
        expect do
          click_button 'この内容で投稿する'
          sleep 1
        end.to change(Awareness, :count).by(0).and change(ActionPlan, :count).by(0)
        expect(page).to have_content "Content of awareness can't be blank"
      end

      it 'いつやるかが、2つ中1つ空のとき投稿に失敗し、エラーメッセージが表示される' do
        click_button 'アクションプランを追加'
        2.times do |fill_form_index|
          # まず3つとも値を入力する
          fill_in "output_time_of_execution_#{fill_form_index}",	with: output.action_plans[fill_form_index][:time_of_execution]
          fill_in "output_what_to_do_#{fill_form_index}",	with: output.action_plans[fill_form_index][:what_to_do]
          fill_in "output_how_to_do_#{fill_form_index}",	with: output.action_plans[fill_form_index][:how_to_do]
        end

        2.times do |fill_empty_value_index|
          fill_in "output_time_of_execution_#{fill_empty_value_index}",	with: '' # 1つだけ空にする
          expect do
            click_button 'この内容で投稿する'
            sleep 1
          end.to change(Awareness, :count).by(0).and change(ActionPlan, :count).by(0)
          expect(page).to have_content "Time of execution of action plan #{fill_empty_value_index + 1} can't be blank"
        end
      end

      it 'いつやるかが、2つ中2つ空のとき投稿に失敗し、エラーメッセージが表示される' do
        click_button 'アクションプランを追加'
        2.times do |fill_form_index|
          # まず3つとも値を入力する
          fill_in "output_time_of_execution_#{fill_form_index}",	with: output.action_plans[fill_form_index][:time_of_execution]
          fill_in "output_what_to_do_#{fill_form_index}",	with: output.action_plans[fill_form_index][:what_to_do]
          fill_in "output_how_to_do_#{fill_form_index}",	with: output.action_plans[fill_form_index][:how_to_do]
        end

        2.times do |fill_empty_value_index|
          fill_in "output_time_of_execution_#{fill_empty_value_index}",	with: '' # 2つとも空にする
        end

        expect do
          click_button 'この内容で投稿する'
          sleep 1
        end.to change(Awareness, :count).by(0).and change(ActionPlan, :count).by(0)

        2.times do |error_message_index|
          expect(page).to have_content "Time of execution of action plan #{error_message_index + 1} can't be blank"
        end
      end

      it 'いつやるかが、3つ中1つ空のとき投稿に失敗し、エラーメッセージが表示される' do
        2.times do
          click_button 'アクションプランを追加'
        end

        3.times do |fill_form_index|
          # まず3つとも値を入力する
          fill_in "output_time_of_execution_#{fill_form_index}",	with: output.action_plans[fill_form_index][:time_of_execution]
          fill_in "output_what_to_do_#{fill_form_index}",	with: output.action_plans[fill_form_index][:what_to_do]
          fill_in "output_how_to_do_#{fill_form_index}",	with: output.action_plans[fill_form_index][:how_to_do]
        end

        3.times do |fill_empty_value_index|
          fill_in "output_time_of_execution_#{fill_empty_value_index}",	with: '' # 1つだけ空にする
          expect do
            click_button 'この内容で投稿する'
            sleep 1
          end.to change(Awareness, :count).by(0).and change(ActionPlan, :count).by(0)
          expect(page).to have_content "Time of execution of action plan #{fill_empty_value_index + 1} can't be blank"
        end
      end

      it 'いつやるかが、3つ中2つ空のとき投稿に失敗し、エラーメッセージが表示される' do
        2.times do
          click_button 'アクションプランを追加'
        end

        3.times do |fill_form_index_for_two_values_empty_expectation|
          3.times do |fill_empty_value_index|
            # まず3つとも空にする
            fill_in "output_time_of_execution_#{fill_empty_value_index}",	with: ''
          end
          fill_in "output_time_of_execution_#{fill_form_index_for_two_values_empty_expectation}",
                  with: output.action_plans[fill_form_index_for_two_values_empty_expectation][:time_of_execution] # １つだけ入力する
          fill_in "output_what_to_do_#{fill_form_index_for_two_values_empty_expectation}",
                  with: output.action_plans[fill_form_index_for_two_values_empty_expectation][:time_of_execution]
          fill_in "output_how_to_do_#{fill_form_index_for_two_values_empty_expectation}",
                  with: output.action_plans[fill_form_index_for_two_values_empty_expectation][:time_of_execution]
          expect do
            click_button 'この内容で投稿する'
            sleep 1
          end.to change(Awareness, :count).by(0).and change(ActionPlan, :count).by(0)
          test_index_list = [1, 2, 3].reject { |index| index == fill_form_index_for_two_values_empty_expectation + 1 } # 入力されていないinpuタグの番号を抽出
          test_index_list.each do |test_index|
            expect(page).to  have_content "Time of execution of action plan #{test_index} can't be blank"
          end
        end
      end

      it 'いつやるかが、3つ中3つ空のとき投稿に失敗し、エラーメッセージが表示される' do
        2.times do
          click_button 'アクションプランを追加'
        end

        3.times do |fill_form_index|
          # まず3つとも値を入力する
          fill_in "output_time_of_execution_#{fill_form_index}",	with: output.action_plans[fill_form_index][:time_of_execution]
          fill_in "output_what_to_do_#{fill_form_index}",	with: output.action_plans[fill_form_index][:what_to_do]
          fill_in "output_how_to_do_#{fill_form_index}",	with: output.action_plans[fill_form_index][:how_to_do]
        end

        3.times do |fill_empty_value_index|
          fill_in "output_time_of_execution_#{fill_empty_value_index}",	with: '' # 3つとも空にする
        end

        expect do
          click_button 'この内容で投稿する'
          sleep 1
        end.to change(Awareness, :count).by(0).and change(ActionPlan, :count).by(0)

        3.times do |error_message_index|
          expect(page).to have_content "Time of execution of action plan #{error_message_index + 1} can't be blank"
        end
      end

      it '何をやるかが、2つ中1つ空のとき投稿に失敗し、エラーメッセージが表示される。' do
        # １つだけ空のとき
        click_button 'アクションプランを追加'
        2.times do |fill_form_index|
          fill_in "output_time_of_execution_#{fill_form_index}",	with: output.action_plans[fill_form_index][:time_of_execution]
          fill_in "output_what_to_do_#{fill_form_index}",	with: output.action_plans[fill_form_index][:what_to_do]
          fill_in "output_how_to_do_#{fill_form_index}",	with: output.action_plans[fill_form_index][:how_to_do]
        end
        2.times do |fill_empty_value_index|
          fill_in "output_what_to_do_#{fill_empty_value_index}",	with: ''
          expect do
            click_button 'この内容で投稿する'
            sleep 1
          end.to change(Awareness, :count).by(0).and change(ActionPlan, :count).by(0)
          expect(page).to have_content "What to do of action plan #{fill_empty_value_index + 1} can't be blank"
        end
      end

      it '何をやるかが、2つ中2つ空のとき投稿に失敗し、エラーメッセージが表示される' do
        # １つだけ空のとき
        click_button 'アクションプランを追加'
        2.times do |fill_form_index|
          fill_in "output_time_of_execution_#{fill_form_index}",	with: output.action_plans[fill_form_index][:time_of_execution]
          fill_in "output_what_to_do_#{fill_form_index}",	with: output.action_plans[fill_form_index][:what_to_do]
          fill_in "output_how_to_do_#{fill_form_index}",	with: output.action_plans[fill_form_index][:how_to_do]
        end
        2.times do |fill_empty_value_index|
          fill_in "output_what_to_do_#{fill_empty_value_index}",	with: ''
        end

        expect do
          click_button 'この内容で投稿する'
          sleep 1
        end.to change(Awareness, :count).by(0).and change(ActionPlan, :count).by(0)

        2.times do |error_message_index|
          expect(page).to have_content "What to do of action plan #{error_message_index + 1} can't be blank"
        end
      end

      it '何をやるかが、3つ中1つ空のとき投稿に失敗し、エラーメッセージが表示される。' do
        # １つだけ空のとき
        2.times do
          click_button 'アクションプランを追加'
        end
        3.times do |fill_form_index|
          fill_in "output_time_of_execution_#{fill_form_index}",	with: output.action_plans[fill_form_index][:time_of_execution]
          fill_in "output_what_to_do_#{fill_form_index}",	with: output.action_plans[fill_form_index][:what_to_do]
          fill_in "output_how_to_do_#{fill_form_index}",	with: output.action_plans[fill_form_index][:how_to_do]
        end
        3.times do |fill_empty_value_index|
          fill_in "output_what_to_do_#{fill_empty_value_index}",	with: ''
          expect do
            click_button 'この内容で投稿する'
            sleep 1
          end.to change(Awareness, :count).by(0).and change(ActionPlan, :count).by(0)
          expect(page).to have_content "What to do of action plan #{fill_empty_value_index + 1} can't be blank"
        end
      end

      it '何をやるかが、3つ中2つ空のとき投稿に失敗し、エラーメッセージが表示される。' do
        # 2つ空のとき
        2.times do
          click_button 'アクションプランを追加'
        end

        3.times do |fill_form_index_for_two_values_empty_expectation|
          3.times do |fill_empty_value_index|
            fill_in "output_what_to_do_#{fill_empty_value_index}",	with: ''
          end
          fill_in "output_time_of_execution_#{fill_form_index_for_two_values_empty_expectation}",
                  with: output.action_plans[fill_form_index_for_two_values_empty_expectation][:time_of_execution]
          fill_in "output_what_to_do_#{fill_form_index_for_two_values_empty_expectation}",
                  with: output.action_plans[fill_form_index_for_two_values_empty_expectation][:time_of_execution]
          fill_in "output_how_to_do_#{fill_form_index_for_two_values_empty_expectation}",
                  with: output.action_plans[fill_form_index_for_two_values_empty_expectation][:time_of_execution]
          expect do
            click_button 'この内容で投稿する'
            sleep 1
          end.to change(Awareness, :count).by(0).and change(ActionPlan, :count).by(0)
          test_index_list = [1, 2, 3].reject { |index| index == fill_form_index_for_two_values_empty_expectation + 1 } # 入力されていないinpuタグの番号を抽出
          test_index_list.each do |test_index|
            expect(page).to  have_content "What to do of action plan #{test_index} can't be blank"
          end
        end
      end
      it '何をやるかが、3つ中3つ空のとき投稿に失敗し、エラーメッセージが表示される。' do
        2.times do
          click_button 'アクションプランを追加'
        end
        3.times do |fill_form_index|
          fill_in "output_time_of_execution_#{fill_form_index}",	with: output.action_plans[fill_form_index][:time_of_execution]
          fill_in "output_what_to_do_#{fill_form_index}",	with: output.action_plans[fill_form_index][:what_to_do]
          fill_in "output_how_to_do_#{fill_form_index}",	with: output.action_plans[fill_form_index][:how_to_do]
        end
        3.times do |fill_empty_value_index|
          fill_in "output_what_to_do_#{fill_empty_value_index}",	with: ''
        end

        expect do
          click_button 'この内容で投稿する'
          sleep 1
        end.to change(Awareness, :count).by(0).and change(ActionPlan, :count).by(0)

        3.times do |error_message_index|
          expect(page).to have_content "What to do of action plan #{error_message_index + 1} can't be blank"
        end
      end

      it '管理者でログイン時アウトプット投稿に失敗するとSlackに通知されない' do
        user.update(is_admin: true)
        user.reload
        allow(SlackNotification).to receive(:notify_output_post).and_return(true)
        fill_in 'output_content',	with: ''
        fill_in 'output_time_of_execution_0',	with: output.action_plans[0][:time_of_execution]
        fill_in 'output_what_to_do_0',	with: output.action_plans[0][:what_to_do]
        fill_in 'output_how_to_do_0',	with: output.action_plans[0][:how_to_do]
        expect do
          click_button 'この内容で投稿する'
          sleep 1
        end.to change(Awareness, :count).by(0).and change(ActionPlan, :count).by(0)
        expect(page).to have_content "Content of awareness can't be blank"
        expect(SlackNotification).to have_received(:notify_output_post).exactly(0).times     
      end
    end

    context 'モーダルの操作' do
      it '入力内容はモーダルを閉じ再び開くと消える' do
        fill_in 'output_content',	with: output.content
        2.times do
          click_button 'アクションプランを追加'
        end
        3.times do |fill_form_index|
          fill_in "output_time_of_execution_#{fill_form_index}",	with: output.action_plans[fill_form_index][:time_of_execution]
          fill_in "output_what_to_do_#{fill_form_index}",	with: output.action_plans[fill_form_index][:what_to_do]
          fill_in "output_how_to_do_#{fill_form_index}",	with: output.action_plans[fill_form_index][:how_to_do]
        end
        click_button 'x' # モーダル外部をクリックしたときも挙動は同じ。
        find('a', text: 'アウトプットを投稿する').click
        # 入力値はあるけど値は空であること検証
        expect(page).to have_field 'output_content', with: ''
        expect(page).to have_field 'output_what_to_do_0', with: ''
        expect(page).to have_field 'output_time_of_execution_0', with: ''
        expect(page).to have_field 'output_how_to_do_0', with: ''
        # 追加した入力欄は消えていることを検証
        [1, 2].each do |index|
          expect(page).not_to have_field "output_what_to_do_#{index}"
          expect(page).not_to have_field "output_time_of_execution_#{index}"
          expect(page).not_to have_field "output_how_to_do_#{index}"
        end
      end

      it 'エラーメッセージはモーダルを閉じ再び開くと消える' do
        fill_in 'output_content',	with: output.content
        2.times do
          click_button 'アクションプランを追加'
        end
        3.times do |fill_form_index|
          fill_in "output_time_of_execution_#{fill_form_index}",	with: ''
          fill_in "output_what_to_do_#{fill_form_index}",	with: ''
          fill_in "output_how_to_do_#{fill_form_index}",	with: ''
        end
        click_button 'この内容で投稿する'
        sleep 1
        3.times do |error_message_index|
          expect(page).to  have_content "Time of execution of action plan #{error_message_index + 1} can't be blank"
          expect(page).to  have_content "What to do of action plan #{error_message_index + 1} can't be blank"
        end
        click_button 'x' # モーダル外部をクリックしたときも挙動は同じ
        find('a', text: 'アウトプットを投稿する').click
        3.times do |error_message_index|
          expect(page).not_to  have_content "Time of execution of action plan #{error_message_index + 1} can't be blank"
          expect(page).not_to  have_content "What to do of action plan #{error_message_index + 1} can't be blank"
        end
      end

      it 'アクションプランが0個の時に取り消し操作をするとアラートが出て消せない' do
        find('span', text: '取り消し').click
        sleep 1
        expect(page.driver.browser.switch_to.alert.text).to eq 'アクションプランは最低1つ必要です'
        sleep 1
        page.driver.browser.switch_to.alert.accept
        expect(page).to have_content 'アウトプットを投稿する' # モーダルにとどまることを検証
      end
    end

    context 'アウトプット一覧からアウトプットを投稿する' do
      it 'アウトプット一覧から「アウトプットを投稿する」ボタンを押すとアウトプットモーダルが開き、投稿できる' do
        click_button 'x'
        click_link nil, href: '/books'
        sleep 1
        expect(page).to have_content '新着書籍一覧' # 一覧にいるかどうか検証
        all('a', text: 'アウトプット一覧')[-1].click
        expect(page).to have_content "『#{Book.all[0].title}』のアウトプット"
        expect(page).not_to have_content '自分のアウトプット'
        prev_output_length = Book.all[0].awarenesses.where(user_id: user.id).length
        expect(all('.myoutputs').length).to  eq prev_output_length
        click_link 'アウトプットを投稿する'
        fill_in 'output_content',	with: output.content
        fill_in 'output_time_of_execution_0',	with: output.action_plans[0][:time_of_execution]
        fill_in 'output_what_to_do_0',	with: output.action_plans[0][:what_to_do]
        fill_in 'output_how_to_do_0',	with: output.action_plans[0][:how_to_do]
        expect do
          click_button 'この内容で投稿する'
          sleep 1
        end.to change(Awareness, :count).by(1).and change(ActionPlan, :count).by(1) # ユーザーや書籍との紐付も同時に検証する
        expect(page).to have_content "『#{Book.all[0].title}』のアウトプット" # もとのページに返ってくる
        expect(page).to have_content '自分のアウトプット'
        sleep 1
        expect(all('.myoutputs .awareness')[0].text).to eq Book.all[0].awarenesses.where(user_id: user.id)[-1].content # 一番新しいものが一番上に来る
        expect(all('.myoutputs').length).to eq prev_output_length + 1 # 画面上に即座にアウトプットの投稿が反映されている
      end
    end
  end
end
