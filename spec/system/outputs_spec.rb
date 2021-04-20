require 'rails_helper'

RSpec.describe 'Outputs', type: :system, js: true do
  let(:user) { build(:user) }
  let(:book) { build(:book) }
  let(:output) { build(:output) }

  before do
    sign_in(user)
    create_list(:user_book, 2, user_id: user.id)
    find('a', text: 'マイページ').click
    expect(page).to have_content "#{user.nickname}さんのマイページ"
    find('a', text: '推薦図書一覧').click
    all('a', text: 'アウトプット')[0].click
    find('a', text: 'アウトプットを投稿する').click
  end

  context 'アウトプットの投稿に成功する' do
    it 'アクションプランが1つの時アウトプットの投稿に成功し、複数のモデルのカウントが正しく変化する' do
      fill_in 'output_content',	with: output.content
      fill_in 'output_time_of_execution_0',	with: output.action_plans[0][:time_of_execution]
      fill_in 'output_what_to_do_0',	with: output.action_plans[0][:what_to_do]
      fill_in 'output_how_to_do_0',	with: output.action_plans[0][:how_to_do]
      expect do
        click_button 'この内容で投稿する'
        sleep 3
      end.to change(Awareness, :count).by(1).and change(ActionPlan, :count).by(1)
    end

    it 'アクションプランが2つの時アウトプットの投稿に成功し、複数のモデルのカウントが正しく変化する' do
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
    end

    it 'アクションプランが3つの時アウトプットの投稿に成功し、複数のモデルのカウントが正しく変化する' do
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
      2.times do |_click_button_index|
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
      expect(page).to have_content "Content can't be blank"
    end

    it 'いつやるかが、一つでも空のとき投稿に失敗し、エラーメッセージが表示される' do
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
        fill_in "output_time_of_execution_#{fill_empty_value_index}",	with: ''
        expect do
          click_button 'この内容で投稿する'
          sleep 3
        end.to change(Awareness, :count).by(0).and change(ActionPlan, :count).by(0)
        expect(page).to have_content "Time of execution of action plan #{fill_empty_value_index + 1} can't be blank"
      end
      # 2つ空のとき
      3.times do |fill_form_index_for_two_values_empty_expectation|
        3.times do |fill_empty_value_index|
          fill_in "output_time_of_execution_#{fill_empty_value_index}",	with: ''
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
          expect(page).to  have_content "Time of execution of action plan #{test_index} can't be blank"
        end
      end
    end

    it '何をやるかが、一つでも空のとき投稿に失敗し、エラーメッセージが表示される' do
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

      # 2つ空のとき
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
  end
end
