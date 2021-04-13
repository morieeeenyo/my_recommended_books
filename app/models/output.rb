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
    book = Book.find(book_id)
    awareness = book.build_awareness(content: content, book_id: book_id, user_id: user_id)
    outout = {}
    output[:awareness] = awareness.save
    action_plan = book.build_action_plan(time_of_execution: time_of_execution, what_to_do: what_to_do, how_to_do: how_to_do, book_id: book_id, user_id: userid, awareness_id: awareness.id)
    output[:action_plan] = action_plan.save
    return output
  end
end