module Api
  module V1
    module Users
      class OmniauthCallbacksController < DeviseTokenAuth::OmniauthCallbacksController
        attr_reader :auth_params

        before_action :validate_auth_origin_url_param
        skip_before_action :set_user_by_token, raise: false

        def redirect_callbacks
          super
        end

        def omniauth_success
          # 認証に成功した時の処理
          super
          update_auth_header
        end

        def omniauth_failure
          super
        end        

        protected

        def render_data_or_redirect(message, data, user_data = {})
          
          # 2回目以降のログイン時にはfirst_sessionのクッキーデータを削除
          cookies.delete(:first_session, path: root_path, httponly: true) if cookies[:first_session]
          # 初回ログイン時にはcookieに情報をセット。Oauth認証後ユーザー情報の編集ページに飛ばす
          cookies[:first_session] = { value: true, path: root_path, expres: 10.minutes, same_site: 'Lax', secure: true }  if @resource.sign_in_count == 0 
          
          auth_token = {'uid' => user_data['uid'], 'client' =>  data['client_id'], 'access-token' => data['auth_token'] }
          cookies['authToken'] = { value: JSON.generate(auth_token), path: root_path, expires: 1.hour, same_site: 'Lax', secure: true }
          
          if %w[inAppBrowser newWindow].include?(omniauth_window_type)
            render_data(message, user_data.merge(data))
          elsif auth_origin_url
            # return redirect_to root_path if Rails.env.test?
            redirect_to DeviseTokenAuth::Url.generate(auth_origin_url, data.merge(blank: true))
          else
            fallback_render data[:error] || 'An error occurred'
          end
        end

        # // twitterから取得する絵文字を取り払うメソッドたちDBエラーが起きるときにコメントイン
        # // mysqlだと起きやすい
        # この辺もいるかわからんから一旦保留
        def clean_resource
          @resource.name = strip_emoji(@resource.name)
          @resource.nickname = strip_emoji(@resource.nickname)
        end

        def strip_emoji(str)
          str.encode('SJIS', 'UTF-8', invalid: :replace, undef: :replace, replace: '').encode('UTF-8')
        end

        def set_random_password
          # パスワードのバリデーション突破のためにオーバーライド
          random_password = SecureRandom.alphanumeric(10) + [*'a'..'z'].sample(1).join + [*'0'..'9'].sample(1).join
          @resource.password = random_password
          @resource.password_confirmation = random_password
        end

        def get_resource_from_auth_hash # rubocop:disable Naming/AccessorMethodName
          # テスト通過のためにオーバーライド          
          if Rails.env.test?
              auth_hash = request.env['omniauth.auth']
              # テストコード用。auth_hashを直接定義できないくさいのでrequest.envから取り出す
          elsif !auth_hash
            auth_hash = session['dta.omniauth.auth']
            # 開発環境・本番環境ではauth_hashはsessionから取り出す
          end

          # 認証情報を元に保存するユーザーのインスタンスを決める
          @resource = resource_class.where(
            uid: auth_hash['uid'],
            provider: auth_hash['provider']
          ).first_or_initialize

          @resource.sns_token = auth_hash["credentials"]['token']
          @resource.sns_secret = auth_hash["credentials"]['secret']

          # ここから下はよくわからないので一旦保留
          handle_new_resource if @resource.new_record?

          # sync user info with provider, update/generate auth token
          assign_provider_attrs(@resource, auth_hash)

          # assign any additional (whitelisted) attributes
          if assign_whitelisted_params?
            extra_params = whitelisted_params
            @resource.assign_attributes(extra_params) if extra_params
          end

          @resource
        end
      end
    end
  end
end
