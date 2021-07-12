# frozen_string_literal: true

class ApplicationMailer < ActionMailer::Base
  default from: 'kaidoku運営事務局'
  layout 'mailer'
end
