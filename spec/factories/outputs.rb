# frozen_string_literal: true

FactoryBot.define do
  factory :output do
    content {'もしかして読書によって人生を変えられるのではないか'}
    time_of_execution {'寝る前'}
    what_to_do {'kindleを開く'}
    how_to_do {'横に紙を置いてメモ書きしながら'}
    # user_idとbook_idはテストコード上で紐付ける
  end
end
