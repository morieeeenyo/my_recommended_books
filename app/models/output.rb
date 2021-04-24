class Output
  include ActiveModel::Model
  attr_accessor :content, :user_id, :book_id, :awareness, :action_plans

  with_options presence: true do
    validates :user_id
    validates :book_id
    # how_to_doは必ずしも入力されない可能性が高いため必須としない
  end
  
  validates :content, presence: { message: "of awareness can't be blank" } #contentだけだとなんのこっちゃわからないのでカスタムメッセージを設定
  validate :validate_action_plans_size
  validate :validate_action_plan_content

  def validate_action_plans_size
    if action_plans.length <= 0
      errors.add(:base, 'At least one action plan is required') #フロント側で0個にならないようにはしてます
    elsif action_plans.length > 3
      errors.add(:base, 'Action Plans are too many(maximum 3)') #フロントで3つ以上アクションプランがあればそれ以上追加できないようにしてる
    end
  end

  def validate_action_plan_content
    # indexはアクションプランの番号と連動してます。+1しているのはindexが0始まりなので
    action_plans.each_with_index do |action_plan, index|
      errors.add(:time_of_execution, "of action plan #{index + 1} can't be blank") if action_plan[:time_of_execution] == ''
      errors.add(:what_to_do, "of action plan #{index + 1} can't be blank") if action_plan[:what_to_do] == ''
    end
  end

  def save
    awareness = Awareness.new(content: content, book_id: book_id, user_id: user_id)
    awareness.save
    action_plans.each do |action_plan|
      action_plan = ActionPlan.new(time_of_execution: action_plan[:time_of_execution], what_to_do: action_plan[:what_to_do],
                                   how_to_do: action_plan[:how_to_do], awareness_id: awareness.id)
      action_plan.save
    end
    # 別々にレスポンスとして扱うためにハッシュ形式を採用(配列でもいけるが、なんのデータなのかわかりやすくしたい)
    output = {}
    output[:awareness] = awareness
    output[:action_plans] = action_plans
    output # 生成したハッシュをコントローラーに返し、レスポンスにする
  end

  def self.fetch_resources(book_id)
    book = Book.find(book_id)
    outputs = [] #アウトプットは複数投稿できるので配列で定義
    book.awarenesses.each do |awareness|
      output = {} #1つ1つのアウトプットはハッシュ形式。都度都度空にするためにeachの中に入れる
      output[:awareness] = awareness
      output[:action_plans] = awareness.action_plans #AwarenessとActionPlanで1対多のアソシエーションが組まれているのでこの書き方で参照可能
      outputs.push(output)
    end
    return outputs #コントローラー側に戻り値として配列を返す
  end
end
