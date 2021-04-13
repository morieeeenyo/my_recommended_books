class Output
  include ActiveModel::Model
  attr_accessor :content, :time_of_execution, :what_to_do, :how_to_do, :user_id, :book_id

  with_options presence: true do 
    validates :user_id
    validates :book_id
    validates :content
    validates :time_of_execution
    validates :what_to_do
  end

  def save
    awareness = Awareness.new(content: content, book_id: book_id, user_id: user_id)
    awareness.save
    action_plan = ActionPlan.new(time_of_execution: time_of_execution, what_to_do: what_to_do, how_to_do: how_to_do, book_id: book_id, user_id: user_id, awareness_id: awareness.id)
    action_plan.save
    output = {}
    output[:awareness] = awareness
    output[:action_plan] = action_plan
    return output
  end
end