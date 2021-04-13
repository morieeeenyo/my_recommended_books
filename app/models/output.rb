class Output
  include ActiveModel::Model
  attr_accesor :content, :time_of_execution, :what_to_do, :how_to_do, :book_id

  with_options presence: true do 
    validates :book_id
    validates :content
    validates :time_of_execution
    validates :what_to_do
  end

  def save
    book = Book.find(book_id)
    awareness = book.build_awareness(content: content, book_id: book_id)
    awareness.save
    action_plan = book.build_action_plan(time_of_execution: time_of_execution, what_to_do: what_to_do, how_to_do: how_to_do, book_id: book_id, awareness_id: awareness.id)
    action_plan.save
  end
end