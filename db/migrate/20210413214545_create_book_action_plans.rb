class CreateBookActionPlans < ActiveRecord::Migration[6.0]
  def change
    create_table :book_action_plans do |t|
      t.references :book, foreing_key: true
      t.references :action_plan, foreing_key: true
      t.timestamps
    end
  end
end
