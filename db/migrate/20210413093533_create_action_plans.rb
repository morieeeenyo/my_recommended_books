class CreateActionPlans < ActiveRecord::Migration[6.0]
  def change
    create_table :action_plans do |t|
      t.string :time_of_execution, null: false
      t.string :what_to_do, null: false
      t.string :how_to_do
      t.references :awareness, foreing_key: true
      t.references :book, foreing_key: true
      t.references :user, foreing_key: true
      t.timestamps
    end
  end
end
