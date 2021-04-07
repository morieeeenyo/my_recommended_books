require 'rails_helper'

RSpec.describe User, type: :model do
  let(:user) { build(:user) }

  context 'ユーザーが登録できる時' do
    it '画像含む全ての値が存在する時ユーザーを保存できる' do
      # 画像をFactoryに含めるとテストが遅くなり、MysqlConnectionErrorが発生する
      user.avatar = fixture_file_upload('spec/fixtures/test_avatar.png', filename: 'test_avatar.png',
                                                                         content_type: 'image/png')
      expect(user).to be_valid
    end

    it '画像がなくてもユーザーを保存できる' do
      user.avatar = nil
      expect(user).to be_valid
    end
  end

  context 'ユーザーが登録できない時' do
    it 'nicknameが空だとユーザーを保存できない' do
      user.nickname = ''
      user.valid?
      expect(user.errors.full_messages).to include("Nickname can't be blank")
    end

    it '同じnicknameが使われているときユーザーを保存できない' do
      user.save
      another_user = build(:user)
      another_user.nickname = user.nickname
      another_user.valid?
      expect(another_user.errors.full_messages).to include('Nickname has already been taken')
    end

    it 'emailが空だとユーザーを保存できない' do
      user.email = ''
      user.valid?
      expect(user.errors.full_messages).to include("Email can't be blank")
    end

    it '同じemailが使われているときユーザーを保存できない' do
      user.save
      another_user = build(:user)
      another_user.email = user.email
      another_user.valid?
      expect(another_user.errors.full_messages).to include('Email has already been taken')
    end

    it 'passwordが空だとユーザーを保存できない' do
      user.password = ''
      user.valid?
      expect(user.errors.full_messages).to include("Password can't be blank")
    end

    it 'passwordとpassword_confirmationが一致していない場合ユーザーを保存できない' do
      user.password_confirmation = 'Pass12345'
      user.valid?
      expect(user.errors.full_messages).to include("Password confirmation doesn't match Password")
    end

    it 'passwordが全角だとユーザーを保存できない' do
      user.password = 'PASS１２３４'
      user.valid?
      expect(user.errors.full_messages).to include('Password must include half-width number, lowercase alphabet, and uppercase alphabet')
    end

    it 'passwordが半角数字のみだとユーザーを保存できない' do
      user.password = '12345678'
      user.valid?
      expect(user.errors.full_messages).to include('Password must include half-width number, lowercase alphabet, and uppercase alphabet')
    end

    it 'passwordが半角英字のみだとユーザーを保存できない' do
      user.password = 'abcdefgh'
      user.valid?
      expect(user.errors.full_messages).to include('Password must include half-width number, lowercase alphabet, and uppercase alphabet')
    end

    it 'passwordが5文字以下だとユーザーを保存できない' do
      user.password = '123aB'
      user.valid?
      expect(user.errors.full_messages).to include('Password is too short (minimum is 6 characters)')
    end

    it 'passwordが21文字以上だとユーザーを保存できない' do
      user.password = '1aB' * 7
      user.valid?
      expect(user.errors.full_messages).to include('Password is too long (maximum is 20 characters)')
    end
  end
end
