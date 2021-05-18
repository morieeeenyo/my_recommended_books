class Awareness < ApplicationRecord
  belongs_to :book
  belongs_to :user
  has_many :action_plans, dependent: :destroy
  has_one :awareness
end
