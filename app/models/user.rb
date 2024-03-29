# frozen_string_literal: true

class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,  :trackable, # trackableを入れることでサインイン回数に応じて処理を切り分け
         :recoverable, :rememberable, :validatable, :omniauthable, omniauth_providers: [:twitter]
  include DeviseTokenAuth::Concerns::User

  validates :nickname, presence: true, uniqueness: { case_sensitive: true }

  PASSWORD_REGEX = /\A(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)[a-zA-Z\d]+\z/.freeze # 半角で英小文字・大文字・数字全て含む
  validates :password,
            format: { with: PASSWORD_REGEX, message: 'must include half-width number, lowercase alphabet, and uppercase alphabet',
                      allow_blank: true }
  validates :password, length: { maximum: 20 }
  has_one_attached :avatar
  has_many :user_books
  has_many :books, through: :user_books
  has_many :awarenesses
  has_many :action_plans
end
