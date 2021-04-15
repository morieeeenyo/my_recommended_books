require 'rails_helper'

RSpec.describe "Outputs", type: :request do
  let(:user) {create(:user)}
  let(:book) {create(:book)}
  let(:output_params) {attributes_for(:output, user_id: user.id, book_id: book.id)}
  let(:headers) do
    { 'uid' => user.uid, 'access-token' => 'ABCDEFGH12345678', 'client' => 'H-12345678' } #ユーザー認証用ヘッダ
  end

  describe "アウトプットの投稿" do
    context "投稿に成功する時" do
      it "投稿に成功するとステータスが201で返却される" do
        post api_v1_book_outputs_path(book.id), xhr: true, params: {output: output_params}, headers: headers
        expect(response).to have_http_status(201)
      end

      it "すべてのカラムが揃っていればレスポンスで気づきとアクションプランが得られる" do
        post api_v1_book_outputs_path(book.id), xhr: true, params: {output: output_params}, headers: headers
        sleep 1 #sleepしないとレスポンスの返却が間に合わない
        json = JSON.parse(response.body)
        # アクションプランと気付きは別々にレスポンスとして返却される
        expect(json['awareness']['content']).to eq output_params[:content]
        expect(json['action_plans'][0]['what_to_do']).to eq output_params[:action_plans][0][:what_to_do]
      end
    end
    
    context "投稿に成功する時(任意項目が空)" do
      before do
        output_params[:how_to_do] = "" #どのように実践するか、は空欄でOK
      end
      
      it "投稿に成功するとステータスが201で返却される" do
        post api_v1_book_outputs_path(book.id), xhr: true, params: {output: output_params}, headers: headers
        expect(response).to have_http_status(201) #リソース保存時のステータスは201
      end
  
      it "すべてのカラムが揃っていればレスポンスで気づきとアクションプランが得られる" do
        post api_v1_book_outputs_path(book.id), xhr: true, params: {output: output_params}, headers: headers
        sleep 1 #sleepしないとレスポンスの返却が間に合わない
        json = JSON.parse(response.body)
        expect(json['awareness']['content']).to eq output_params[:content]
        expect(json['action_plans'][0]['what_to_do']).to eq output_params[:action_plans][0][:what_to_do]
      end   
    end
    
    context "投稿に失敗する時" do
      # 個別のバリデーションの検証はmodel_psecにて。バリデーションはすべてpresence: true
      it "必須のカラムが不足している時保存に失敗しステータスが404になる" do
        output_params[:action_plans][0][:what_to_do] = ""
        post api_v1_book_outputs_path(book.id), xhr: true, params: {output: output_params}, headers: headers
        expect(response).to have_http_status(422)
      end

      it "保存に失敗した時エラーメッセージがレスポンスとして返却される" do
        output_params[:action_plans][0][:what_to_do] = ""
        post api_v1_book_outputs_path(book.id), xhr: true, params: {output: output_params}, headers: headers
        json = JSON.parse(response.body)
        expect(json['errors']).to include "What to do can't be blank"
      end
    end
  end
end
