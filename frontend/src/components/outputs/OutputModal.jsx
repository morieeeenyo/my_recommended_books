import React, { Component } from 'react';
import styled from 'styled-components';

//axiosの読み込み
import axios from 'axios';

// react-router用のlinkを使えるようにする
import { withRouter } from 'react-router-dom'


//コンポーネントの読み込み
import {FormBlock} from "../common/UserModal.jsx"
import {ModalOverlay} from "../common/UserModal.jsx"
import {ModalContent} from "../common/UserModal.jsx"
import {ErrorMessage} from "../common/UserModal.jsx"
import {UserFromContent} from "../common/UserModal.jsx"


function OutputForm(props) {
  // Todo:アクションプランは3つまで同時に設定できるようにする
  return (
    <OutputFormContent onSubmit={props.submit}>
      <ActionPlanFormBlock>
      <label htmlFor="awareness_text">気づき</label>
        <textarea name="content" value={props.awareness.content} onChange={props.change}></textarea>
      </ActionPlanFormBlock>
      <ActionPlanFormBlock>
        <label className="action-plan-label">アクションプラン</label>
        <label htmlFor="due_date">いつ</label>
        <input type="text" name="time_of_execution" value={props.action_plans[0].time_of_execution} onChange={props.change}></input>
      </ActionPlanFormBlock>
        <ActionPlanFormBlock>
          <label htmlFor="what">何を</label>
          <input type="text" name="what_to_do" value={props.action_plans[0].what_to_do} onChange={props.change}></input>
        </ActionPlanFormBlock>
        <ActionPlanFormBlock>
          <label htmlFor="how_much">どのように</label>
          <input type="text" name="how_to_do" value={props.action_plans[0].how_to_do} onChange={props.change}></input>
        </ActionPlanFormBlock>
        <ActionPlanFormBlock>
          <input type="submit" value="追加" id="submit_btn"></input>  
        </ActionPlanFormBlock>
    </OutputFormContent>
  )
}


class OutputModal extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      output: {
        awareness: {
          content: '',
        },
        action_plans: [
          {
            time_of_execution: '',
            what_to_do: '',
            how_to_do: '',
          }
        ],
      },
      errors: []
    }
    // 以下は後で実装するメソッド
    this.getCsrfToken = this.getCsrfToken.bind(this)
    this.setAxiosDefaults = this.setAxiosDefaults.bind(this)
    this.userAuthentification = this.userAuthentification.bind(this)
    this.closeOutputModal = this.closeOutputModal.bind(this)
    this.updateForm = this.updateForm.bind(this)
    this.postOutput = this.postOutput.bind(this)
  }

  getCsrfToken() {
    if (!(axios.defaults.headers.common['X-CSRF-Token'])) {
      return (
        document.getElementsByName('csrf-token')[0].getAttribute('content') //初回ログイン時新規登録時はheadタグのcsrf-tokenを参照する
      )
    } else {
      return (
        axios.defaults.headers.common['X-CSRF-Token'] //それ以外のときは既にセットしてあるcsrf-tokenを参照
      )
    }
  };

  userAuthentification() {
    const authToken = JSON.parse(localStorage.getItem("auth_token"));
    // uid, client, access-tokenの3つが揃っているか検証
    if (authToken['uid'] && authToken['client'] && authToken['access-token']) { 
      axios.defaults.headers.common['uid'] = authToken['uid']
      axios.defaults.headers.common['client']  = authToken['client']
      axios.defaults.headers.common['access-token']  = authToken['access-token']
    } else {
      return null
    }
  }

  setAxiosDefaults() {
    axios.defaults.headers.common['X-CSRF-Token'] = this.getCsrfToken();
  };

  closeOutputModal() {
    this.setState({
      errors: []
    })
    this.props.history.goBack() //元いたページに戻る(マイページ以外からアクセスされることも想定)0
  }

  updateForm(e) {
    // ネストされたオブジェクトのdataまでアクセスしておく
    const awareness = this.state.output.awareness;
    const action_plans = this.state.output.action_plans

    // eventが発火したname属性名ごとに値を処理
    switch (e.target.name) {
        case 'content':
            awareness.content = e.target.value;
            break;
        case 'time_of_execution':
            action_plans[0].time_of_execution = e.target.value;
            break;
        case 'what_to_do':
            action_plans[0].what_to_do = e.target.value;
            break;
        case 'how_to_do':
            action_plans[0].how_to_do = e.target.value;
            break;
            break;
    }
    this.setState({
      output: {
        awareness: awareness,
        action_plans: action_plans
      }
    })
  }

  postOutput(e) {
    e.preventDefault()
    this.userAuthentification()
    this.setAxiosDefaults();
  // props.content,つまりモーダルの種類ごとに処理を分ける
    axios
    .post('/api/v1/books/' + this.props.location.state.book.id + '/outputs', {output: this.state.output} )
    .then(response => {
      // stateをリセットすることで再度モーダルを開いたときにフォームに値が残らないようにする
      this.props.close() //モーダルを閉じる
      return response
    })
    .catch(error => {
      if (error.response.data && error.response.data.errors) {
        this.setState({
          errors: error.response.data.errors //エラーメッセージの表示
        })
      }
    })
  }

  render () {
    // Todo:諸々メソッド実装
    return (
      <ModalOverlay onClick={this.closeOutputModal}>
        {this.props.children}
        <ModalContent onClick={(e) => e.stopPropagation()}>
        <p>アウトプットを投稿する</p>
        <button onClick={this.closeOutputModal}>x</button>
          <div>
            <OutputForm awareness={this.state.output.awareness} action_plans={this.state.output.action_plans} change={this.updateForm} submit={this.postOutput} errors={this.state.errors}/>
          </div>
        </ModalContent>
      </ModalOverlay>
     )
   
  } 
}

const OutputFormContent = styled(UserFromContent)`
  /* アウトプットのform要素 */
`

const ActionPlanFormBlock = styled(FormBlock)`
  width: 70%;

  .action-plan-label {
    margin-bottom: 5px;
  }

  & textarea {
    width: 100%;
    height: 80px;
    resize: none;
  }

  & input {
    width: 100%
  }

  & #submit_btn{
    width: 65%;
    margin: 0 auto;
  }
`

export default withRouter(OutputModal);