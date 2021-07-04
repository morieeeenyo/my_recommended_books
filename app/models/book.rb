# frozen_string_literal: true

class Book < ApplicationRecord
  with_options presence: true do
    # 以下は楽天ブックスAPIから取得
    validates :title
    validates :publisher_name
    validates :sales_date
    validates :item_price
    validates :item_url
    validates :image_url
  end

  has_many :user_books
  has_many :users, through: :user_books
  has_many :awarenesses
end
