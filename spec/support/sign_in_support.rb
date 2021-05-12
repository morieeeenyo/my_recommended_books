# frozen_string_literal: true

module SignInSupport
  def sign_in(user)
    user.save
    visit root_path
    find('.header-link', text: 'ログイン').click # href属性がないaタグはclick_link, click_onで検出できないのでfindで検出する
    click_link 'SignIn with Email'
    expect(page).to have_content 'SignIn'
    fill_in 'email',	with: user.email
    fill_in 'password',	with: user.password
    click_button 'SignIn'
    sleep 2 # sleepしないと間に合わない
    # ログインすると表示が切り替わる
    expect(page).to  have_content 'ログアウト'
    expect(page).to  have_content 'マイページ'
  end
end
