# frozen_string_literal: true

class UserBook < ApplicationRecord
  belongs_to :user
  belongs_to :book
  validates :book_id, uniqueness: { scope: :user_id }  #同じユーザーに対して同じ書籍は1回しか紐付けられない
end
