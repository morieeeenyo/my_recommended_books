class ActionPlan < ApplicationRecord
  has_many :book_action_plans
  has_many :books, through: :book_action_plans
  belongs_to :user
  belongs_to :awareness
end
