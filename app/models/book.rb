class Book < ApplicationRecord
  with_options presence: true do 
    # 以下は楽天ブックスAPIから取得
    validates :title
    validates :author
    validates :author_kana
    validates :publisher_name
    validates :sales_date
    validates :item_price
    # validates :genre_id
    validates :item_url #image_urlから画像データ取得して表示できるはず…
    # 以下はユーザーが入力
    # validates :description
    # validates :recommends #todo: 推薦文は別のモデルにする？
  end

  has_many :user_books
  has_many :users, through: :user_books
end
