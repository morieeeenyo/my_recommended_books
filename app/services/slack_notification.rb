class SlackNotification
  
  @client = Slack::Web::Client.new

  def self.notify_book_post(book)
    text = ''
    text += "※API連携のテストです\n" if !Rails.env.production?
    text += "*『#{book.title}』を推薦図書に追加しました！*\n"
    text += "著者：#{book.author}\n"
    text += "出版社：#{book.publisher_name}\n"
    text += "楽天ブックスURL：#{book.item_url}\n"
    @client.chat_postMessage(text: text, channel: "#毛利タニア国王の書斎")
  end

  def self.notify_output_post(book, output) 
    text = ''
    text += "※API連携のテストです\n" if !Rails.env.production?
    text += "*『#{book.title}』のアウトプットを投稿しました！*\n\n"
    text += "`気づき`\n"
    text += "```#{output.content}```\n"
    output.action_plans.each.with_index(1) do |action_plan, index|
      text += "`アクションプラン#{index}`\n"
      text += "```- 内容\n"
      text += "#{action_plan[:what_to_do]}\n"
      text += "- いつやるか\n"
      text += "#{action_plan[:time_of_execution]}\n"
      text += "- 実施方法/達成基準\n"
      text += "#{action_plan[:how_to_do]}```\n"
    end
    text += "`書籍購入ページURL`\n#{book.item_url}\n"
    @client.chat_postMessage(text: text, channel: "#毛利タニア国王の書斎")
  end
end