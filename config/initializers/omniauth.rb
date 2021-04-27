Rails.application.config.middleware.use OmniAuth::Builder do
  provider :twitter, ENV.fetch("TWITTER_CONSUMER_KEY"), ENV.fetch("TWITTER_CONSUMER_SECRET"), callback_url: "http://127.0.0.1:3000/omniauth/twitter/callback"
end