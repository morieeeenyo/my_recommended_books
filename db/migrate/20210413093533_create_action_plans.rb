class CreateActionPlans < ActiveRecord::Migration[6.0]
  def change
    create_table :action_plans do |t|
      t.string :time_of_execution
      t.string :what_to_do
      t.string :how_to_do
      t.references :awareness
      t.timestamps
    end
  end
end
