class CreateActionPlans < ActiveRecord::Migration[6.0]
  def change
    create_table :action_plans do |t|
      t.datetime :when
      t.string :what
      t.string :how
      t.references :awareness
      t.timestamps
    end
  end
end
