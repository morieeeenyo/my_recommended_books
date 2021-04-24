require 'rails_helper'

RSpec.describe 'Outputs', type: :system, js: true do
  let(:user) { build(:user) }
  let(:book) { build(:book) }
  let(:output) { build(:output) }

  before do
    sign_in(user)
    sleep 5
    create_list(:user_book, 2, user_id: user.id) 
    sleep 5
    find('a', text: 'マイページ').click
    expect(page).to have_content "#{user.nickname}さんのマイページ"
    find('a', text: '推薦図書一覧').click
    all('a', text: 'アウトプット')[0].click
    find('a', text: 'アウトプットを投稿する').click
    expect(page).to  have_content 'アウトプットを投稿する'
  end
  

  context 'アウトプットの投稿に成功する' do
    it 'アクションプランが1つの時アウトプットの投稿に成功し、マイページのアウトプット一覧にアウトプットが1つ追加される' do
      fill_in 'output_content',	with: output.content
      fill_in 'output_time_of_execution_0',	with: output.action_plans[0][:time_of_execution]
      fill_in 'output_what_to_do_0',	with: output.action_plans[0][:what_to_do]
      fill_in 'output_how_to_do_0',	with: output.action_plans[0][:how_to_do]
      expect do
        click_button 'この内容で投稿する'
        sleep 3
      end.to change(Awareness, :count).by(1).and change(ActionPlan, :count).by(1) #ユーザーや書籍との紐付も同時に検証する
      expect(page).to  have_content "『#{user.books[0].title}』のアウトプット"
      sleep 5
      expect(all('.output-content-header').length).to eq 1
      expect(all('.action-plan > p').length).to eq 1
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
        sleep 3
      end.to change(Awareness, :count).by(1).and change(ActionPlan, :count).by(2)
      expect(page).to  have_content "『#{user.books[0].title}』のアウトプット"
      sleep 5
      expect(all('.output-content-header').length).to eq 1
      expect(all('.action-plan > p').length).to eq 2
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
        sleep 3
      end.to change(Awareness, :count).by(1).and change(ActionPlan, :count).by(3)
      expect(page).to  have_content "『#{user.books[0].title}』のアウトプット"
      sleep 5
      expect(all('.output-content-header').length).to eq 1
      expect(all('.action-plan > p').length).to eq 3
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
        sleep 3
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
        sleep 3
      end.to change(Awareness, :count).by(1).and change(ActionPlan, :count).by(1)
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
        sleep 3
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
        fill_in "output_time_of_execution_#{fill_empty_value_index}",	with: '' #1つだけ空にする
        expect do
          click_button 'この内容で投稿する'
          sleep 3
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
        fill_in "output_time_of_execution_#{fill_empty_value_index}",	with: '' #2つとも空にする
      end

      expect do
        click_button 'この内容で投稿する'
        sleep 3
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
        fill_in "output_time_of_execution_#{fill_empty_value_index}",	with: '' #1つだけ空にする
        expect do
          click_button 'この内容で投稿する'
          sleep 3
        end.to change(Awareness, :count).by(0).and change(ActionPlan, :count).by(0)
        expect(page).to have_content "Time of execution of action plan #{fill_empty_value_index + 1} can't be blank"
      end
    end
    
    it "いつやるかが、3つ中2つ空のとき投稿に失敗し、エラーメッセージが表示される" do
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
          sleep 3
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
        fill_in "output_time_of_execution_#{fill_empty_value_index}",	with: '' #3つとも空にする
      end

      expect do
        click_button 'この内容で投稿する'
        sleep 3
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
          sleep 3
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
        sleep 3
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
          sleep 3
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
        sleep 3
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
        sleep 3
      end.to change(Awareness, :count).by(0).and change(ActionPlan, :count).by(0)

      3.times do |error_message_index|
        expect(page).to have_content "What to do of action plan #{error_message_index + 1} can't be blank"
      end
    end
  end
  context 'モーダルの操作' do
    it "入力内容はモーダルを閉じ再び開くと消える" do
      fill_in 'output_content',	with: output.content
      2.times do
        click_button 'アクションプランを追加'
      end
      3.times do |fill_form_index|
        fill_in "output_time_of_execution_#{fill_form_index}",	with: output.action_plans[fill_form_index][:time_of_execution]
        fill_in "output_what_to_do_#{fill_form_index}",	with: output.action_plans[fill_form_index][:what_to_do]
        fill_in "output_how_to_do_#{fill_form_index}",	with: output.action_plans[fill_form_index][:how_to_do]
      end
      click_button 'x' #モーダル外部をクリックしたときも挙動は同じ。
      find('a', text: 'アウトプットを投稿する').click
      # 入力値はあるけど値は空であること検証
      expect(page).to have_field 'output_content', with: ''
      expect(page).to have_field 'output_what_to_do_0', with: ''
      expect(page).to have_field 'output_time_of_execution_0', with: ''
      expect(page).to have_field 'output_how_to_do_0', with: ''
      # 追加した入力欄は消えていることを検証
      [1,2].each do |index|
        expect(page).not_to have_field "output_what_to_do_#{index}"
        expect(page).not_to have_field "output_time_of_execution_#{index}"
        expect(page).not_to have_field "output_how_to_do_#{index}"
      end
    end

    it "エラーメッセージはモーダルを閉じ再び開くと消える" do
      fill_in 'output_content',	with: output.content
      2.times do
        click_button 'アクションプランを追加'
      end
      3.times do |fill_form_index|
        fill_in "output_time_of_execution_#{fill_form_index}",	with: ""
        fill_in "output_what_to_do_#{fill_form_index}",	with: ""
        fill_in "output_how_to_do_#{fill_form_index}",	with: ""
      end
      click_button 'この内容で投稿する'
      sleep 3
      3.times do |error_message_index|
        expect(page).to  have_content "Time of execution of action plan #{error_message_index + 1} can't be blank"
        expect(page).to  have_content "What to do of action plan #{error_message_index + 1} can't be blank"
      end
      click_button 'x' #モーダル外部をクリックしたときも挙動は同じ
      find('a', text: 'アウトプットを投稿する').click
      3.times do |error_message_index|
        expect(page).not_to  have_content "Time of execution of action plan #{error_message_index + 1} can't be blank"
        expect(page).not_to  have_content "What to do of action plan #{error_message_index + 1} can't be blank"
      end
    end

    it "アクションプランが0個の時に取り消し操作をするとアラートが出て消せない" do
      find('span', text: '取り消し').click
      sleep 5
      expect(page.driver.browser.switch_to.alert.text).to eq 'アクションプランは最低1つ必要です'
      sleep 2
      page.driver.browser.switch_to.alert.accept
      expect(page).to  have_content 'アウトプットを投稿する' #モーダルにとどまることを検証
    end
  end  
end
