Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do 
      mount_devise_token_auth_for 'User', at: 'users' , controllers: {
        registrations: 'api/v1/users/registrations',
        sessions: 'api/v1/users/sessions',
        omniauth_callbacks: 'api/v1/users/omniauth_callbacks'
      }
      resources :books do 
        collection do
          get "search"
        end
        resources :outputs, only: :create
      end
      # 20210429 以下2つはomniauthとルーティングがプログラム側で混同してしまうようなのでパスを変更
      get '/mypage', to: "users#show", as: :user_mypage #RESTではないがdevise_auth_tokenを用いる設計でidを使用せずuidを使用する関係でパスを独自に設定
      get '/mypage/books/:book_id/outputs', to: "users#my_outputs", as: :user_outputs
      get '/books/:isbn/outputs', to: "outputs#index", as: :book_outputs_index
    end
  end
  root 'homes#index'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
