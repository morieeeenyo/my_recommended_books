require 'rails_helper'

RSpec.describe 'Outputs', type: :request do
  let(:user) { create(:user) }
  let(:book) { create(:book) }
  let(:user_book_relation) { create(:user_book, book_id: book.id, user_id: user.id) }
  let(:output) { build(:output, book_id: user_book_relation.book.id, user_id: user_book_relation.user.id) }

  # ユーザーは同じだが書籍が異なる
  let(:another_book) { create(:book) }
  let(:user_another_book_relation) { build(:user_book, book_id: another_book.id, user_id: user.id) }

  # 書籍は同一だがuserが異なる
  let(:another_user_book_relation) { create(:user_book, book_id: book.id) }
  let(:output_of_others) { build(:output, book_id: another_user_book_relation.book.id, user_id: another_user_book_relation.user.id) }

  let(:output_params) { attributes_for(:output, user_id: user.id, book_id: book.id) }
  let(:headers) do
    { 'uid' => user.uid, 'access-token' => 'ABCDEFGH12345678', 'client' => 'H-12345678' } # ユーザー認証用ヘッダ
  end

  describe 'アウトプット一覧' do
    context 'アウトプットが1件以上投稿されている場合' do
      before do
        3.times do
          output_of_others.save
        end
      end

      it 'ログイン中のユーザーがアウトプットを投稿していない場合ステータスが200になる' do
        get api_v1_book_outputs_path(book.isbn), xhr: true, headers: headers
        expect(response).to have_http_status(200)
      end

      it 'ログイン中のユーザーがアウトプットを投稿していない場合すべてのアウトプットが新しい順に返却される' do
        get api_v1_book_outputs_path(book.isbn), xhr: true, headers: headers
        sleep 2 # sleepしないとレスポンスの返却が間に合わない
        json = JSON.parse(response.body)
        sleep 2
        expect(json['myoutputs'].length).to eq 0 # ログイン中のユーザーがアウトプットを投稿していれば返却されるデータ
        expect(json['outputs'].length).to eq 3
        # 添字が若いほどidの値が大きい=新しい順
        expect(json['outputs'][0]['awareness']['id']).to be > json['outputs'][1]['awareness']['id']
        expect(json['outputs'][1]['awareness']['id']).to be > json['outputs'][2]['awareness']['id']
      end

      it 'ユーザーがログアウトしている場合ステータスが200になる' do
        get api_v1_book_outputs_path(book.isbn), xhr: true
        expect(response).to have_http_status(200)
      end

      it 'ユーザーがログアウトしている場合すべてのアウトプットが新しい順に返却される' do
        get api_v1_book_outputs_path(book.isbn), xhr: true
        sleep 2 # sleepしないとレスポンスの返却が間に合わない
        json = JSON.parse(response.body)
        sleep 2
        expect(json['myoutputs'].length).to eq 0 # ログイン中のユーザーがアウトプットを投稿していれば返却されるデータ
        expect(json['outputs'].length).to eq 3
        # 添字が若いほどidの値が大きい=新しい順
        expect(json['outputs'][0]['awareness']['id']).to be > json['outputs'][1]['awareness']['id']
        expect(json['outputs'][1]['awareness']['id']).to be > json['outputs'][2]['awareness']['id']
      end

      it 'ログイン中のユーザーがアウトプットを投稿している場合、ステータスが200になる' do
        # 3個保存することで複数データの取得が可能かどうか、順番は正しいかを検証
        2.times do
          output.save
        end
        get api_v1_book_outputs_path(book.isbn), xhr: true, headers: headers
        expect(response).to have_http_status(200)
      end

      it 'ログイン中のユーザーがアウトプットを投稿している場合、自分が投稿したアウトプットと他の人が投稿したアウトプットが別々に返却される' do
        # 3個保存することで複数データの取得が可能かどうか、順番は正しいかを検証
        2.times do
          output.save
        end
        get api_v1_book_outputs_path(book.isbn), xhr: true, headers: headers
        sleep 2 # sleepしないとレスポンスの返却が間に合わない
        json = JSON.parse(response.body)
        sleep 2
        expect(json['myoutputs'].length).to eq 2
        # 添字が若いほどidの値が大きい=新しい順
        expect(json['myoutputs'][0]['awareness']['id']).to be > json['myoutputs'][1]['awareness']['id']
        expect(json['outputs'].length).to eq 3
        # 添字が若いほどidの値が大きい=新しい順
        expect(json['outputs'][0]['awareness']['id']).to be > json['outputs'][1]['awareness']['id']
        expect(json['outputs'][1]['awareness']['id']).to be > json['outputs'][2]['awareness']['id']
      end
    end

    context 'アウトプットが0件の場合' do
      before do
        another_book.awarenesses.delete_all # すでに投稿されたアウトプットを削除
      end

      it 'ログイン中のユーザーが推薦図書に追加していない場合ステータスは200' do
        get api_v1_book_outputs_path(another_book.isbn), xhr: true, headers: headers
        expect(response).to have_http_status(200)
      end

      it 'ログイン中のユーザーが推薦図書に追加していない場合レスポンスは0件' do
        get api_v1_book_outputs_path(another_book.isbn), xhr: true, headers: headers
        sleep 2 # sleepしないとレスポンスの返却が間に合わない
        json = JSON.parse(response.body)
        sleep 2
        expect(json['outputs'].length).to eq 0
      end

      it 'ログイン中のユーザーが推薦図書に追加している場合ステータスは200' do
        user_another_book_relation.save
        get api_v1_book_outputs_path(another_book.isbn), xhr: true, headers: headers
        expect(response).to have_http_status(200)
      end

      it 'ログイン中のユーザーが推薦図書に追加している場合レスポンスが0件' do
        user_another_book_relation.save
        get api_v1_book_outputs_path(another_book.isbn), xhr: true, headers: headers
        sleep 2 # sleepしないとレスポンスの返却が間に合わない
        json = JSON.parse(response.body)
        sleep 2
        expect(json['outputs'].length).to eq 0
      end
    end
  end

  describe 'アウトプットの投稿' do
    context '投稿に成功する時' do
      before do
        # なんかbeofreがないとcircleciに怒られる
        three_action_plans = output_params[:action_plans].slice(0, 3)
        output_params[:action_plans] = three_action_plans
      end

      it '投稿に成功するとステータスが201で返却される' do
        post api_v1_book_outputs_path(book.isbn), xhr: true, params: { output: output_params }, headers: headers
        sleep 2
        expect(response).to have_http_status(201)
      end

      it '投稿に成功するとAwarenessモデルのカウントが1増え、ActionPlanモデルのカウントが3増える' do
        expect do
          post api_v1_book_outputs_path(book.isbn), xhr: true, params: { output: output_params }, headers: headers
          sleep 2
        end.to change(Awareness, :count).by(1).and change(ActionPlan, :count).by(3) # andを使うことで複数のモデルの増減を同時に検証
      end

      it 'すべてのカラムが揃っていればレスポンスで気づきとアクションプランが得られる' do
        output_params[:action_plans].length.times do |action_plan_index|
          post api_v1_book_outputs_path(book.isbn), xhr: true, params: { output: output_params }, headers: headers
          sleep 2 # sleepしないとレスポンスの返却が間に合わない
          json = JSON.parse(response.body)
          # アクションプランと気付きは別々にレスポンスとして返却される
          sleep 2
          expect(json['awareness']['content']).to eq output_params[:content]
          expect(json['action_plans'][action_plan_index]['what_to_do']).to eq output_params[:action_plans][action_plan_index][:what_to_do]
        end
      end
    end

    context '投稿に成功(アクションプランが1つ)' do
      before do
        one_action_plan = output_params[:action_plans].slice(0, 1)
        output_params[:action_plans] = one_action_plan
      end

      it '投稿に成功するとステータスが201で返却される' do
        post api_v1_book_outputs_path(book.isbn), xhr: true, params: { output: output_params }, headers: headers
        expect(response).to have_http_status(201)
      end

      it '投稿に成功するとAwarenessモデルのカウントが1増え、ActionPlanモデルのカウントが1増える' do
        expect do
          post api_v1_book_outputs_path(book.isbn), xhr: true, params: { output: output_params }, headers: headers
          sleep 2
        end.to change(Awareness, :count).by(1).and change(ActionPlan, :count).by(1) # andを使うことで複数のモデルの増減を同時に検証
      end

      it 'すべてのカラムが揃っていればレスポンスで気づきとアクションプランが得られる' do
        output_params[:action_plans].length.times do |action_plan_index|
          post api_v1_book_outputs_path(book.isbn), xhr: true, params: { output: output_params }, headers: headers
          sleep 1 # sleepしないとレスポンスの返却が間に合わない
          json = JSON.parse(response.body)
          # アクションプランと気付きは別々にレスポンスとして返却される
          expect(json['awareness']['content']).to eq output_params[:content]
          expect(json['action_plans'][action_plan_index]['what_to_do']).to eq output_params[:action_plans][action_plan_index][:what_to_do]
        end
      end
    end

    context '投稿に成功(アクションプランが2つ)' do
      before do
        two_action_plans = output_params[:action_plans].slice(0, 2)
        output_params[:action_plans] = two_action_plans
      end

      it '投稿に成功するとステータスが201で返却される' do
        post api_v1_book_outputs_path(book.isbn), xhr: true, params: { output: output_params }, headers: headers
        expect(response).to have_http_status(201)
      end

      it '投稿に成功するとAwarenessモデルのカウントが1増え、ActionPlanモデルのカウントが2増える' do
        expect do
          post api_v1_book_outputs_path(book.isbn), xhr: true, params: { output: output_params }, headers: headers
          sleep 2
        end.to change(Awareness, :count).by(1).and change(ActionPlan, :count).by(2) # andを使うことで複数のモデルの増減を同時に検証
      end

      it 'すべてのカラムが揃っていればレスポンスで気づきとアクションプランが得られる' do
        output_params[:action_plans].length.times do |action_plan_index|
          post api_v1_book_outputs_path(book.isbn), xhr: true, params: { output: output_params }, headers: headers
          sleep 1 # sleepしないとレスポンスの返却が間に合わない
          json = JSON.parse(response.body)
          # アクションプランと気付きは別々にレスポンスとして返却される
          expect(json['awareness']['content']).to eq output_params[:content]
          expect(json['action_plans'][action_plan_index]['what_to_do']).to eq output_params[:action_plans][action_plan_index][:what_to_do]
        end
      end
    end

    context '投稿に成功する時(任意項目が空)' do
      before do
        # なんかbeofreがないとcircleciに怒られる
        three_action_plans = output_params[:action_plans].slice(0, 3)
        output_params[:action_plans] = three_action_plans
      end

      it '投稿に成功するとステータスが201で返却される' do
        output_params[:action_plans].each do |action_plan|
          action_plan[:how_to_do] = '' # どのように実践するか、は空欄でOK
          post api_v1_book_outputs_path(book.isbn), xhr: true, params: { output: output_params }, headers: headers
          sleep 2
          expect(response).to have_http_status(201) # リソース保存時のステータスは201
        end
      end

      it '投稿に成功するとAwarenessモデルのカウントが1増え、ActionPlanモデルのカウントが3増える' do
        expect do
          post api_v1_book_outputs_path(book.isbn), xhr: true, params: { output: output_params }, headers: headers
          sleep 2
        end.to change(Awareness, :count).by(1).and change(ActionPlan, :count).by(3) # andを使うことで複数のモデルの増減を同時に検証
      end

      it 'レスポンスで気づきとアクションプランが得られる' do
        output_params[:action_plans].each_with_index do |action_plan, action_plan_index|
          action_plan[:how_to_do] = '' # どのように実践するか、は空欄でOK
          post api_v1_book_outputs_path(book.isbn), xhr: true, params: { output: output_params }, headers: headers
          sleep 2 # sleepしないとレスポンスの返却が間に合わない
          json = JSON.parse(response.body)
          sleep 2
          expect(json['awareness']['content']).to eq output_params[:content]
          expect(json['action_plans'][action_plan_index]['what_to_do']).to eq output_params[:action_plans][action_plan_index][:what_to_do]
        end
      end
    end

    # 異常形は3つ中1つ空のときのみ検証。それ以外のパターンはsystem_specにて
    context '投稿に失敗する時' do
      # 個別のバリデーションの検証はmodel_psecにて。バリデーションはすべてpresence: true
      it '必須のカラムが不足している時保存に失敗しステータスが404になる' do
        output_params[:action_plans].length.times do |index|
          output_params[:action_plans][index][:what_to_do] = ''
          post api_v1_book_outputs_path(book.isbn), xhr: true, params: { output: output_params }, headers: headers
          expect(response).to have_http_status(422)
          output_params[:action_plans][index][:what_to_do] = 'test' # これがないと空にした値が引き継がれてしまう
        end
      end

      it '投稿に失敗するとAwarenessモデルのカウントが増えていない' do
        output_params[:action_plans].length.times do |index|
          output_params[:action_plans][index][:what_to_do] = ''
          expect do
            post api_v1_book_outputs_path(book.isbn), xhr: true, params: { output: output_params }, headers: headers
          end.not_to change(Awareness, :count)
          output_params[:action_plans][index][:what_to_do] = 'test' # これがないと空にした値が引き継がれてしまう
        end
      end

      it '投稿に失敗するとActionPlanモデルのカウントが増えていない' do
        output_params[:action_plans].length.times do |index|
          output_params[:action_plans][index][:what_to_do] = ''
          expect do
            post api_v1_book_outputs_path(book.isbn), xhr: true, params: { output: output_params }, headers: headers
          end.not_to change(ActionPlan, :count)
          output_params[:action_plans][index][:what_to_do] = 'test' # これがないと空にした値が引き継がれてしまう
        end
      end

      it '保存に失敗した時エラーメッセージがレスポンスとして返却される(何をやるか、が空欄)' do
        output_params[:action_plans].length.times do |action_plan_index|
          output_params[:action_plans][action_plan_index][:what_to_do] = ''
          post api_v1_book_outputs_path(book.isbn), xhr: true, params: { output: output_params }, headers: headers
          json = JSON.parse(response.body)
          expect(json['errors']).to include "What to do of action plan #{action_plan_index + 1} can't be blank"
          output_params[:action_plans][action_plan_index][:what_to_do] = 'test' # これがないと空にした値が引き継がれてしまう
        end
      end

      it '保存に失敗した時エラーメッセージがレスポンスとして返却される(いつやるか、が空欄)' do
        output_params[:action_plans].length.times do |action_plan_index|
          output_params[:action_plans][action_plan_index][:time_of_execution] = ''
          post api_v1_book_outputs_path(book.isbn), xhr: true, params: { output: output_params }, headers: headers
          json = JSON.parse(response.body)
          expect(json['errors']).to include "Time of execution of action plan #{action_plan_index + 1} can't be blank"
          output_params[:action_plans][action_plan_index][:time_of_execution] = 'test' # これがないと空にした値が引き継がれてしまう
        end
      end
    end
  end
end
