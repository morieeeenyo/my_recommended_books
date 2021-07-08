# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Book, type: :model do
  let(:book) { build(:book) }

  context '本が登録できる時' do
    it '全てのカラムに値があれば本が登録できる' do
      expect(book).to be_valid
    end
  end

  # modelに定義したバリデーションはpresence: trueのみ
  context '本が登録できない時' do
    it 'titleが空の場合登録できない' do
      book.title = ''
      book.valid?
      expect(book.errors.full_messages).to include "Title can't be blank"
    end
    it 'publisher_nameが空の場合登録できない' do
      book.publisher_name = ''
      book.valid?
      expect(book.errors.full_messages).to include "Publisher name can't be blank"
    end
    it 'sales_dateが空の場合登録できない' do
      book.sales_date = ''
      book.valid?
      expect(book.errors.full_messages).to include "Sales date can't be blank"
    end
    it 'item_priceが空の場合登録できない' do
      book.item_price = ''
      book.valid?
      expect(book.errors.full_messages).to include "Item price can't be blank"
    end
    it 'item_urlが空の場合登録できない' do
      book.item_url = ''
      book.valid?
      expect(book.errors.full_messages).to include "Item url can't be blank"
    end
    it 'image_urlが空の場合登録できない' do
      book.image_url = ''
      book.valid?
      expect(book.errors.full_messages).to include "Image url can't be blank"
    end
  end
end
