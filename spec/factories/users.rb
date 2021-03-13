FactoryBot.define do
  factory :user do
    nickname {Faker::Name.name}
    email {Faker::Internet.free_email}
    password {'Pass1234'}
    password_confirmation {'Pass1234'}
  end
end