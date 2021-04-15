# frozen_string_literal: true

FactoryBot.define do
  factory :output do
    content {'test'}
    action_plans {[{time_of_execution: 'test', what_to_do: 'test', how_to_do: ''}]}
    # user_idとbook_idはテストコード上で紐付ける
  end
end
