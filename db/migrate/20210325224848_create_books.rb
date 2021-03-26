class CreateBooks < ActiveRecord::Migration[6.0]
  def change
    create_table :books do |t|
      # 以下は楽天ブックスAPIから取得
      t.string :title, null: false
      t.string :author, null: false
      t.string :author_kana, null: false
      t.string :publisher_name, null: false
      t.string :sales_date, null: false
      t.integer :item_price, null: false
      t.integer :genre_id, null: false
      t.text :item_url, null: false
      # 以下はユーザーが入力
      t.text :description, null: false
      t.string :recommends, null: false
      t.timestamps
    end
  end
end
