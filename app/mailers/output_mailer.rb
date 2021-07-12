class OutputMailer < ApplicationMailer

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.output_mailer.action_plan_reminder.subject
  #
  def action_plan_reminder(user)

    mail to: "#{user.email}",
         subject: 'アクションプランが達成できたか振り返りましょう！'
  end
end
