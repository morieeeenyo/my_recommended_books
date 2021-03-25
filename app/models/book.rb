class Book < ApplicationRecord
  has_one_attached :image

  with_options presence: true do 
    validates :title
    validates :recommends
    validates :author
    validates :publisher
    validates :genre_id
    validates :price
    validates :description
    validates :amazon_link
  end
end
