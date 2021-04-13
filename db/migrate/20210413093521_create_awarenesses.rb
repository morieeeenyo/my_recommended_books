class CreateAwarenesses < ActiveRecord::Migration[6.0]
  def change
    create_table :awarenesses do |t|
      t.text :content
      t.references :book
      t.timestamps
    end
  end
end
