class CreateBooks < ActiveRecord::Migration[6.0]
  def change
    create_table :books do |t|
      t.string :title, null: false
      t.string :recommends, null: false
      t.string :author, null: false
      t.string :publisher, null: false
      t.integer :genre_id, null: false
      t.integer :price, null: false
      t.text :description, null: false
      t.text :amazon_link, null: false
      t.timestamps
    end
  end
end
