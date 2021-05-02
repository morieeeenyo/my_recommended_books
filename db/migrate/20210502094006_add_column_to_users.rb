class AddColumnToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :sns_token, :text
    add_column :users, :sns_secret, :text
  end
end
