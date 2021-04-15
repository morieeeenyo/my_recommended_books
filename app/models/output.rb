class Output
  include ActiveModel::Model
  attr_accessor :content, :user_id, :book_id, :awareness, :action_plans

  with_options presence: true do 
    validates :user_id
    validates :book_id
    validates :content
    # how_to_doは必ずしも入力されない可能性が高いため必須としない
  end

  validate :validate_action_plans_size
  validate :validate_action_plan_content

  def validate_action_plans_size
    if action_plans.length > 3
      errors.add(:action_plans, "Action plan is too many(maximum 3)")
    end
  end

  def validate_action_plan_content
    action_plans.each do |action_plan|
      if action_plan[:time_of_execution]  == ""
        errors.add(:time_of_execution, "can't be blank")
      end

      if action_plan[:what_to_do] == ""
        errors.add(:what_to_do, "can't be blank")
      end
    end
  end

  def save
    awareness = Awareness.new(content: content, book_id: book_id, user_id: user_id)
    awareness.save
    action_plans.each do |action_plan|
      action_plan = ActionPlan.new(time_of_execution: action_plan[:time_of_execution], what_to_do: action_plan[:what_to_do], how_to_do: action_plan[:how_to_do], book_id: book_id, user_id: user_id, awareness_id: awareness.id)
      action_plan.save
      BookActionPlan.create(book_id: book_id, action_plan_id: action_plan.id)
    end
    # 別々にレスポンスとして扱うためにハッシュ形式を採用(配列でもいけるが、なんのデータなのかわかりやすくしたい)
    output = {}
    output[:awareness] = awareness
    output[:action_plans] = action_plans
    return output #生成したハッシュをコントローラーに返し、レスポンスにする
  end
end