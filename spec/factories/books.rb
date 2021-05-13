# frozen_string_literal: true

FactoryBot.define do
  factory :book do
    isbn { Faker::Number.number(digits: 13) }
    title { Faker::Book.title }
    author { 'testさん' }
    author_kana { 'テストさん' }
    publisher_name { '株式会社test' }
    sales_date { '1996-12-22' }
    item_price { 1500 }
    item_url { 'https://books.rakuten.co.jp/hoge/12345' }
    image_url { 'https://hogehoge.image.rakuten.co.jp/fuga/book/test/4151/12345678.jpg' }
  end
end
