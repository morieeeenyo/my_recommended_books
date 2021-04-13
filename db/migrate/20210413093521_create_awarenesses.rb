class CreateAwarenesses < ActiveRecord::Migration[6.0]
  def change
    create_table :awarenesses do |t|
      t.text :content, null: false
      t.references :book, foreing_key: true
      t.timestamps
    end
  end
end
