class BookActionPlan < ApplicationRecord
  belongs_to :book
  belongs_to :action_plan
end
