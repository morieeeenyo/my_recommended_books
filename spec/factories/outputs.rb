# frozen_string_literal: true

FactoryBot.define do
  factory :output do
    content { Faker::Lorem.sentence } # テキストが一致しているかどうかの判定に使うためにランダムにした
    action_plans = []
    3.times do
      action_plans << { time_of_execution: Faker::Lorem.sentence, what_to_do: Faker::Lorem.sentence, how_to_do: Faker::Lorem.sentence } # 同上
    end
    action_plans { action_plans }
    # user_idとbook_idはテストコード上で紐付ける
  end
end
