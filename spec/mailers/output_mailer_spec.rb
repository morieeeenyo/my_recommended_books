require "rails_helper"

RSpec.describe OutputMailer, type: :mailer do
  describe "action_plan_reminder" do
    let(:mail) { OutputMailer.action_plan_reminder }

    it "renders the headers" do
      expect(mail.subject).to eq("Action plan reminder")
      expect(mail.to).to eq(["to@example.org"])
      expect(mail.from).to eq(["from@example.com"])
    end

    it "renders the body" do
      expect(mail.body.encoded).to match("Hi")
    end
  end

end
