class Awareness < ApplicationRecord
  belongs_to :book
  belongs_to :user
  has_many :action_plans
end
