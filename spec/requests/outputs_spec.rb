require 'rails_helper'

RSpec.describe 'Outputs', type: :request do
  let(:user) { create(:user) }
  let(:book) { create(:book) }
  let(:output_params) { attributes_for(:output, user_id: user.id, book_id: book.id) }
  let(:headers) do
    { 'uid' => user.uid, 'access-token' => 'ABCDEFGH12345678', 'client' => 'H-12345678' } # ユーザー認証用ヘッダ
  end

  describe 'アウトプットの投稿' do
    context '投稿に成功する時' do
      before do
        # なんかbeofreがないとcircleciに怒られる
        three_action_plans = output_params[:action_plans].slice(0, 3)
        output_params[:action_plans] = three_action_plans
      end

      it '投稿に成功するとステータスが201で返却される' do
        post api_v1_book_outputs_path(book.id), xhr: true, params: { output: output_params }, headers: headers
        sleep 2
        expect(response).to have_http_status(201)
      end

      it '投稿に成功するとAwarenessモデルのカウントが1増え、ActionPlanモデルのカウントが3増える' do
        expect do
          post api_v1_book_outputs_path(book.id), xhr: true, params: { output: output_params }, headers: headers
          sleep 2
        end.to change(Awareness, :count).by(1).and change(ActionPlan, :count).by(3) # andを使うことで複数のモデルの増減を同時に検証
      end

      it 'すべてのカラムが揃っていればレスポンスで気づきとアクションプランが得られる' do
        output_params[:action_plans].each_with_index do |_action_plan, index|
          post api_v1_book_outputs_path(book.id), xhr: true, params: { output: output_params }, headers: headers
          sleep 2 # sleepしないとレスポンスの返却が間に合わない
          json = JSON.parse(response.body)
          # アクションプランと気付きは別々にレスポンスとして返却される
          sleep 2
          expect(json['awareness']['content']).to eq output_params[:content]
          expect(json['action_plans'][index]['what_to_do']).to eq output_params[:action_plans][index][:what_to_do]
        end
      end
    end

    context '投稿に成功(アクションプランが1つ)' do
      before do
        one_action_plan = output_params[:action_plans].slice(0, 1)
        output_params[:action_plans] = one_action_plan
      end

      it '投稿に成功するとステータスが201で返却される' do
        post api_v1_book_outputs_path(book.id), xhr: true, params: { output: output_params }, headers: headers
        expect(response).to have_http_status(201)
      end

      it '投稿に成功するとAwarenessモデルのカウントが1増え、ActionPlanモデルのカウントが1増える' do
        expect do
          post api_v1_book_outputs_path(book.id), xhr: true, params: { output: output_params }, headers: headers
          sleep 2
        end.to change(Awareness, :count).by(1).and change(ActionPlan, :count).by(1) # andを使うことで複数のモデルの増減を同時に検証
      end

      it 'すべてのカラムが揃っていればレスポンスで気づきとアクションプランが得られる' do
        output_params[:action_plans].each_with_index do |_action_plan, index|
          post api_v1_book_outputs_path(book.id), xhr: true, params: { output: output_params }, headers: headers
          sleep 1 # sleepしないとレスポンスの返却が間に合わない
          json = JSON.parse(response.body)
          # アクションプランと気付きは別々にレスポンスとして返却される
          expect(json['awareness']['content']).to eq output_params[:content]
          expect(json['action_plans'][index]['what_to_do']).to eq output_params[:action_plans][index][:what_to_do]
        end
      end
    end

    context '投稿に成功(アクションプランが2つ)' do
      before do
        two_action_plans = output_params[:action_plans].slice(0, 2)
        output_params[:action_plans] = two_action_plans
      end

      it '投稿に成功するとステータスが201で返却される' do
        post api_v1_book_outputs_path(book.id), xhr: true, params: { output: output_params }, headers: headers
        expect(response).to have_http_status(201)
      end

      it '投稿に成功するとAwarenessモデルのカウントが1増え、ActionPlanモデルのカウントが2増える' do
        expect do
          post api_v1_book_outputs_path(book.id), xhr: true, params: { output: output_params }, headers: headers
          sleep 2
        end.to change(Awareness, :count).by(1).and change(ActionPlan, :count).by(2) # andを使うことで複数のモデルの増減を同時に検証
      end

      it 'すべてのカラムが揃っていればレスポンスで気づきとアクションプランが得られる' do
        output_params[:action_plans].each_with_index do |_action_plan, index|
          post api_v1_book_outputs_path(book.id), xhr: true, params: { output: output_params }, headers: headers
          sleep 1 # sleepしないとレスポンスの返却が間に合わない
          json = JSON.parse(response.body)
          # アクションプランと気付きは別々にレスポンスとして返却される
          expect(json['awareness']['content']).to eq output_params[:content]
          expect(json['action_plans'][index]['what_to_do']).to eq output_params[:action_plans][index][:what_to_do]
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
        output_params[:action_plans].each_with_index do |action_plan, _index|
          action_plan[:how_to_do] = '' # どのように実践するか、は空欄でOK
          post api_v1_book_outputs_path(book.id), xhr: true, params: { output: output_params }, headers: headers
          sleep 2
          expect(response).to have_http_status(201) # リソース保存時のステータスは201
        end
      end

      it '投稿に成功するとAwarenessモデルのカウントが1増え、ActionPlanモデルのカウントが3増える' do
        expect do
          post api_v1_book_outputs_path(book.id), xhr: true, params: { output: output_params }, headers: headers
          sleep 2
        end.to change(Awareness, :count).by(1).and change(ActionPlan, :count).by(3) # andを使うことで複数のモデルの増減を同時に検証
      end

      it 'レスポンスで気づきとアクションプランが得られる' do
        output_params[:action_plans].each_with_index do |action_plan, index|
          action_plan[:how_to_do] = '' # どのように実践するか、は空欄でOK
          post api_v1_book_outputs_path(book.id), xhr: true, params: { output: output_params }, headers: headers
          sleep 2 # sleepしないとレスポンスの返却が間に合わない
          json = JSON.parse(response.body)
          sleep 2
          expect(json['awareness']['content']).to eq output_params[:content]
          expect(json['action_plans'][index]['what_to_do']).to eq output_params[:action_plans][index][:what_to_do]
        end
      end
    end

    context '投稿に失敗する時' do
      # 個別のバリデーションの検証はmodel_psecにて。バリデーションはすべてpresence: true
      it '必須のカラムが不足している時保存に失敗しステータスが404になる' do
        output_params[:action_plans].each_with_index do |_action_plan, index|
          output_params[:action_plans][index][:what_to_do] = ''
          post api_v1_book_outputs_path(book.id), xhr: true, params: { output: output_params }, headers: headers
          expect(response).to have_http_status(422)
          output_params[:action_plans][index][:what_to_do] = 'test' # これがないと空にした値が引き継がれてしまう
        end
      end

      it '投稿に失敗するとAwarenessモデルのカウントが増えていない' do
        output_params[:action_plans].each_with_index do |_action_plan, index|
          output_params[:action_plans][index][:what_to_do] = ''
          expect do
            post api_v1_book_outputs_path(book.id), xhr: true, params: { output: output_params }, headers: headers
          end.not_to change(Awareness, :count)
          output_params[:action_plans][index][:what_to_do] = 'test' # これがないと空にした値が引き継がれてしまう
        end
      end

      it '投稿に失敗するとActionPlanモデルのカウントが増えていない' do
        output_params[:action_plans].each_with_index do |_action_plan, index|
          output_params[:action_plans][index][:what_to_do] = ''
          expect do
            post api_v1_book_outputs_path(book.id), xhr: true, params: { output: output_params }, headers: headers
          end.not_to change(ActionPlan, :count)
          output_params[:action_plans][index][:what_to_do] = 'test' # これがないと空にした値が引き継がれてしまう
        end
      end

      it '保存に失敗した時エラーメッセージがレスポンスとして返却される' do
        output_params[:action_plans].each_with_index do |_action_plan, index|
          output_params[:action_plans][index][:what_to_do] = ''
          post api_v1_book_outputs_path(book.id), xhr: true, params: { output: output_params }, headers: headers
          json = JSON.parse(response.body)
          expect(json['errors']).to include "What to do of action plan #{index + 1} can't be blank"
          output_params[:action_plans][index][:what_to_do] = 'test' # これがないと空にした値が引き継がれてしまう
        end
      end
    end
  end
end
