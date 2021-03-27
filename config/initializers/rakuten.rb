RakutenWebService.configure do |c|
  # 誤ってpushしてしまったのでAPI keyを変更
  c.application_id = ENV['RAKUTEN_APP_ID'] 
  c.affiliate_id = ENV['RAKUTEN_APP_AFFILIATE_ID']
end