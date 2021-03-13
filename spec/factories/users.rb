FactoryBot.define do
  factory :user do
    nickname {}
    sequence(:email) { |n| "TEST#{n}@example.com"}
  end
end