FactoryBot.define do
  factory :book do
    title {'test'}
    author {'testさん'}
    author_kana {'テストさん'}
    publisher_name {'株式会社test'}
    sales_date {'1996-12-22'}
    item_price {1500}
    genre_id {10000}
    item_url {"https://books.rakuten.co.jp/hoge/12345"}
    description {Faker::Lorem.sentence}
    recommends {Faker::Lorem.sentence}
  end
end