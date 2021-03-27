require 'rails_helper'

RSpec.describe Book, type: :model do
  let(:book) { build(:book) }

  context "本が登録できる時" do
    it "全てのカラムに値があれば本が登録できる" do
      expect(book).to  be_valid
    end
  end

  context "本が登録できない時" do
    it "titleが空の場合登録できない" do
      book.title = ""
      book.valid?
      expect(book.errors.full_messages).to  include "Title can't be blank"
    end
    it "authorが空の場合登録できない" do
      book.author = ""
      book.valid?
      expect(book.errors.full_messages).to  include "Author can't be blank"
    end
    it "author_kanaが空の場合登録できない" do
      book.author_kana = ""
      book.valid?
      expect(book.errors.full_messages).to  include "Author kana can't be blank"
    end
    it "publisher_nameが空の場合登録できない" do
      book.publisher_name = ""
      book.valid?
      expect(book.errors.full_messages).to  include "Publisher name can't be blank"
    end
    it "sales_dateが空の場合登録できない" do
      book.sales_date = ""
      book.valid?
      expect(book.errors.full_messages).to  include "Sales date can't be blank"
    end
    it "item_priceが空の場合登録できない" do
      book.item_price = ""
      book.valid?
      expect(book.errors.full_messages).to  include "Item price can't be blank"
    end
    it "genre_idが空の場合登録できない" do
      book.genre_id = ""
      book.valid?
      expect(book.errors.full_messages).to  include "Genre can't be blank"
    end
    it "item_urlが空の場合登録できない" do
      book.item_url = ""
      book.valid?
      expect(book.errors.full_messages).to  include "Item url can't be blank"
    end
    it "descriptionが空の場合登録できない" do
      book.description = ""
      book.valid?
      expect(book.errors.full_messages).to  include "Description can't be blank"
    end
    it "recommendsが空の場合登録できない" do
      book.recommends = ""
      book.valid?
      expect(book.errors.full_messages).to  include "Recommends can't be blank"
    end
    
  end
  

  
end
