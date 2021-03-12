# frozen_string_literal: true

class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  include DeviseTokenAuth::Concerns::User

  has_one_attached :avatar
  
  with_options presence: true, { message: 'は必須です'} do 
    validates :nickname
    validates :image
  end

  PASSWORD_REGEX = /\A(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)[a-zA-Z\d]+\z/.freeze #半角で英小文字・大文字・数字全て含む
  validates :password, format { with: PASSWORD_REGEX, message: 'は英語大文字・小文字・数字を全て含む形式にしてください'}
  validates :password, length: { in: 6..20, message: 'は6文字以上20文字以下で設定してください' }
end
