FactoryBot.define do
  factory :user do
    nickname {Faker::Name.name}
    email {Faker::Internet.free_email}
    password {'Pass1234'}
    password_confirmation {'Pass1234'}
    after(:build) do |user|
      user.avatar.attach(io: File.open('spec/fixtures/test_image.jpg'), filename: 'test_image.jpg', content_type: 'image/jpg')
    end
  end
end