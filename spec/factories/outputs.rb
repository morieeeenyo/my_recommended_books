# frozen_string_literal: true

FactoryBot.define do
  factory :output do
    content {'test'}
    action_plans = []
    3.times do 
      action_plans << {time_of_execution: 'test', what_to_do: 'test', how_to_do: 'test'}
    end
    action_plans { action_plans }
    # user_idとbook_idはテストコード上で紐付ける
  end
end
