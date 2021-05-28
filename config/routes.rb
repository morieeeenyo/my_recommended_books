Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do 
      mount_devise_token_auth_for 'User', at: 'users' , controllers: {
        registrations: 'api/v1/users/registrations',
        sessions: 'api/v1/users/sessions',
        omniauth_callbacks: 'api/v1/users/omniauth_callbacks'
      }
      resources :books, param: :isbn do # これでparams[:id]→params[:isbn]となる。DBにない書籍のページも読み込みたいのでこの仕様にした
        collection do
          get "search"
        end
        resources :outputs, only: [:index, :create]
      end
      # 20210429 以下2つはomniauthとルーティングがプログラム側で混同してしまうようなのでパスを変更
      get '/mypage', to: "users#show", as: :user_mypage #RESTではないがdevise_auth_tokenを用いる設計でidを使用せずuidを使用する関係でパスを独自に設定
      get '/mypage/books/:book_isbn/outputs', to: "users#my_outputs", as: :user_mypage_book_outputs # 上のparams[:isbn]に合わせるためにURL変更
    end
  end
  # リロード時にルーティングエラーが発生するのを防ぐ
  get '*path', to: "homes#index", constraints: lambda { |req|
    # 'rails/active_storage'が含まれているパスはリダイレクト対象外にする(マイページでの画像の表示に使用)
    req.path.exclude? 'rails/active_storage'
  }
  root 'homes#index'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
