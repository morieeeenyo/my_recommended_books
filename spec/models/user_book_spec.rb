require 'rails_helper'

RSpec.describe UserBook, type: :model do
  let(:user) { build(:user) }
  let(:another_user) { build(:user) }
  let(:book) { build(:book) }
  let(:another_book) { build(:book) }
  let(:user_book) { build(:user_book, user: user, book: book) }
  let(:user_another_book) { build(:user_book, user: user, book: another_book) }
  let(:another_user_book) { build(:user_book, user: another_user, book: book) }

  describe 'ユーザーと書籍の紐付け' do
    context '保存に成功する時' do
      it '1人のユーザーは複数書籍を投稿することができる' do
        expect(user_another_book).to be_valid
      end

      it '複数のユーザーが同一の書籍を投稿することが可能である' do
        expect(another_user_book).to be_valid
      end
    end

    context '保存に失敗する時' do
      it 'ユーザーがすでに同じ書籍を推薦図書に追加している場合は保存に失敗する' do
        create(:user_book, user: user, book: book)
        user_book.valid?
        expect(user_book.errors.full_messages).to include 'Book has already been taken'
      end
    end
  end
end
