class SlackNotification

  def initialize
    @client = Slack::Web::Client.new
  end

  def notify_reading_output(output)
    text = ''
    @client.chat_postMessage(text: text, channel: "#毛利タニア国王の書斎")
  end

  def notify_book_post(book)
    text = ''
    text += "*『#{book.title}』を推薦図書に追加しました！*\n"
    text += "著者：#{book.author}\n"
    text += "出版社：#{book.publisher_name}\n"
    text += "楽天ブックスURL：#{book.item_url}\n"
    if Rails.env.production?
      text += "↓その他の書籍を見るにはこちらから↓\n"
      text += "#{Rails.application.routes.url_helpers.root_url(protocol: 'https')}books" 
    end
    @client.chat_postMessage(text: text, channel: "#毛利タニア国王の書斎")
  end
end