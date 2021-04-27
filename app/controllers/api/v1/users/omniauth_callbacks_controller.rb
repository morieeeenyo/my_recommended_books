module Api
  module V1
    module Users
      class OmniauthCallbacksController < DeviseTokenAuth::OmniauthCallbacksController

        def redirect_callbacks
          super
        end

        def omniauth_success
          super
          update_auth_header
        end

        def omniauth_failure
          super
        end

        protected
            # // ②credentialを保存。いるのかわからないから一旦保留
          # def get_resource_from_auth_hash
          #   super
          #   @resource.credentials = auth_hash["credentials"]
          #   clean_resource
          # end

        def render_data_or_redirect(message, data, user_data = {})
          if Rails.env.production?
            if ['inAppBrowser', 'newWindow'].include?(omniauth_window_type)
              render_data(message, user_data.merge(data))
            elsif auth_origin_url
              redirect_to DeviseTokenAuth::Url.generate(auth_origin_url, data.merge(blank: true))
            else
              fallback_render data[:error] || 'An error occurred'
            end
          else
            #  // わかりやすい様に開発時はjsonとして結果を返す
            render json: @resource, status: :ok
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

        def get_resource_from_auth_hash
          # テスト通過のためにオーバーライド
          unless auth_hash
            auth_hash = request.env['omniauth.auth'] #主にテストコード用。auth_hashを直接定義できないくさいのでrequest.envから取り出す
          end
          
          @resource = resource_class.where(
            uid: auth_hash['uid'],
            provider: auth_hash['provider']
          ).first_or_initialize
    
          if @resource.new_record?
            handle_new_resource
          end
    
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