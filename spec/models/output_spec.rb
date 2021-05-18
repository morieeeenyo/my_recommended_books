require 'rails_helper'

RSpec.describe Output, type: :model do
  let(:user) { create(:user) }
  let(:book) { create(:book) }
  let(:output) { build(:output, user_id: user.id, book_id: book.id) }

  # 異常形は3つ中1つ空のときのみ検証。それ以外のパターンはsystem_specにて

  describe 'アウトプットの保存' do
    context '保存に成功する時' do
      it 'すべての値が存在していれば保存できる' do
        expect(output).to be_valid
      end
      it 'どのように実践するか、は空でも保存できる' do
        output.action_plans.length.times do |action_plan_index|
          output.action_plans[action_plan_index][:how_to_do] = ''
          expect(output).to be_valid
          output.action_plans[action_plan_index][:how_to_do] = 'test' # これがないと空にした値が引き継がれてしまう
        end
      end
      it 'アクションプランが1つでも保存できる' do
        one_action_plan = output.action_plans.slice(0, 1)
        output.action_plans = one_action_plan
        expect(output).to  be_valid
      end
      it 'アクションプランが2つでも保存できる' do
        two_action_plans = output.action_plans.slice(0, 2)
        output.action_plans = two_action_plans
        expect(output).to be_valid
      end
    end

    context '保存に失敗する時' do
      it '気づきの内容が空欄のとき保存できない' do
        output.content = ''
        output.valid?
        expect(output.errors.full_messages).to include "Content of awareness can't be blank"
      end
      it 'アクションプランの何をやるか、が空欄のとき保存できない' do
        output.action_plans.length.times do |action_plan_index|
          output.action_plans[action_plan_index][:what_to_do] = ''
          output.valid?
          expect(output.errors.full_messages).to include "What to do of action plan #{action_plan_index + 1} can't be blank"
          output.action_plans[action_plan_index][:what_to_do] = 'test' # これがないと空にした値が引き継がれてしまう
        end
      end
      it 'アクションプランのいつやるか、が空欄のとき保存できない' do
        output.action_plans.length.times do |action_plan_index|
          output.action_plans[action_plan_index][:time_of_execution] = ''
          output.valid?
          expect(output.errors.full_messages).to include "Time of execution of action plan #{action_plan_index + 1} can't be blank"
          output.action_plans[action_plan_index][:time_of_execution] = 'test' # これがないと空にした値が引き継がれてしまう
        end
      end
      it 'ユーザーが存在しないとき保存できない' do
        output.user_id = ''
        output.valid?
        expect(output.errors.full_messages).to include "User can't be blank"
      end
      it '書籍が存在しないとき保存できない' do
        output.book_id = ''
        output.valid?
        expect(output.errors.full_messages).to include "Book can't be blank"
      end
      it 'アクションプランが0個の時保存できない' do
        output.action_plans = []
        output.valid?
        expect(output.errors.full_messages).to include 'At least one action plan is required'
      end
      it 'アクションプランが3つより多い時保存できない' do
        output.action_plans << output.action_plans[0]
        output.valid?
        expect(output.errors.full_messages).to include 'Action Plans are too many(maximum 3)'
      end
    end
  end
end
