require 'rails_helper'

RSpec.describe "Users", type: :system do
  let(:user) { build(:user) }
  
  describe "新規登録" do
    before do
      visit root_path
      find('a', text: '新規登録').click #reactで作ったaタグはhref属性がつかないのでfindで検出する
      expect(page).to have_content 'SignUp'  
    end
    
    context "新規登録できるとき" do
      it "全てのフォームに値を入力すると新規登録できる" do
        fill_in "nickname",	with: user.nickname
        fill_in "email",	with: user.email
        fill_in "password",	with: user.password
        fill_in "password_confirmation",	with: user.password_confirmation
        attach_file "avatar", "spec/fixtures/test_image.jpg"
        expect{
          click_button "SignUp"
          sleep 2 #sleepしないと間に合わない
        }.to  change(User, :count).by(1) #Userのデータが1つ増える
        # ログインすると表示が切り替わる
        expect(page).to  have_content 'ログアウト'
        expect(page).to  have_content 'マイページ'
      end

      it "画像はなしでも新規登録できる" do
        fill_in "nickname",	with: user.nickname
        fill_in "email",	with: user.email
        fill_in "password",	with: user.password
        fill_in "password_confirmation",	with: user.password_confirmation
        expect{
          click_button "SignUp"
          sleep 2 #sleepしないと間に合わない
        }.to  change(User, :count).by(1) #Userのデータが1つ増える
        # ログインすると表示が切り替わる
        expect(page).to  have_content 'ログアウト'
        expect(page).to  have_content 'マイページ'
      end
    end

    context "新規登録できない時" do
      it "同じnickname, emailのユーザーが既に登録されている場合登録できない" do
        # user.save
        # fill_in "nickname",	with: user.nickname
        # fill_in "email",	with: user.email
        # fill_in "password",	with: user.password
        # fill_in "password_confirmation",	with: user.password_confirmation
        # expect{
        #   click_button "SignUp"
        #   sleep 2 #sleepしないと間に合わない
        # }.to  change(User, :count).by(0) #Userのデータが1つ増える
        # expect(page).to have_content 
      end
    end
  end

  describe "ログイン" do
    before do
      user.save    
    end

    context "ログインできる時" do
      it "emailとpasswordを入力すればログインできる" do
        
      end
    end

    context "ログアウトできない時" do
      it "emailだけではログインできない" do
        
      end

      it "パスワードだけではログインできない" do
        
      end

      it "emailとパスワード両方空の場合ログインできない" do
        
      end
      
      
      
    end
    
    
    
  end

  describe "ログアウト" do
    
  end
  
  
  
end
