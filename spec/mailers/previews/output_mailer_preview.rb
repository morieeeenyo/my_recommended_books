# Preview all emails at http://localhost:3000/rails/mailers/output_mailer
class OutputMailerPreview < ActionMailer::Preview

  # Preview this email at http://localhost:3000/rails/mailers/output_mailer/action_plan_reminder
  def action_plan_reminder
    OutputMailer.action_plan_reminder
  end

end
