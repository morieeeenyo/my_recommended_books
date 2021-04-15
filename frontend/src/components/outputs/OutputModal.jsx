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
      <ErrorMessage errors={props.errors}></ErrorMessage>
      <OutputFormBlock>
      <label htmlFor="awareness_text">気づき</label>
      <textarea name="content" value={props.output.content} onChange={props.change}></textarea>
      </OutputFormBlock>
      <div id="action_plans">
        <h4 className="action-plan-label">アクションプラン(最大3つまで)</h4>
        <ActionPlan dataIndex={1}>
          <h4>アクションプラン１</h4>
          <OutputFormBlock>
            <label htmlFor="due_date">いつ</label>
            <input type="text" name="time_of_execution" value={props.output.action_plans[0].time_of_execution} onChange={props.change}></input>
          </OutputFormBlock>
          <OutputFormBlock>
            <label htmlFor="what">何を</label>
            <input type="text" name="what_to_do" value={props.output.action_plans[0].what_to_do} onChange={props.change}></input>
          </OutputFormBlock>
          <OutputFormBlock>
            <label htmlFor="how_much">どのように</label>
            <input type="text" name="how_to_do" value={props.output.action_plans[0].how_to_do} onChange={props.change}></input>
          </OutputFormBlock>
        </ActionPlan>
      </div>
      <OutputFormBlock>
        <button className="add-actionplan-button" onClick={props.add}>アクションプランを追加</button>
      </OutputFormBlock>
      <OutputFormBlock>
        <input type="submit" value="この内容で投稿する" id="submit_btn"></input>  
      </OutputFormBlock>
    </OutputFormContent>
  )
}


class OutputModal extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      output: {
        content: '',
        action_plans: [
          {
            time_of_execution: '',
            what_to_do: '',
            how_to_do: '',
          }
        ],
      },
      errors: [],

    }
    // 以下は後で実装するメソッド
    this.getCsrfToken = this.getCsrfToken.bind(this)
    this.setAxiosDefaults = this.setAxiosDefaults.bind(this)
    this.userAuthentification = this.userAuthentification.bind(this)
    this.closeOutputModal = this.closeOutputModal.bind(this)
    this.updateForm = this.updateForm.bind(this)
    this.postOutput = this.postOutput.bind(this)
    this.addActionPlan = this.addActionPlan.bind(this)
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
    const output = this.state.output

    // eventが発火したname属性名ごとに値を処理
    switch (e.target.name) {
        case 'content':
            output.content = e.target.value;
            break;
        case 'time_of_execution':
            output.action_plans[0].time_of_execution = e.target.value;
            break;
        case 'what_to_do':
            output.action_plans[0].what_to_do = e.target.value;
            break;
        case 'how_to_do':
            output.action_plans[0].how_to_do = e.target.value;
            break;
    }

    this.setState({
      output: output
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
      this.closeOutputModal()
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

  addActionPlan(e) {
    e.preventDefault()
    const actionPlanParent = document.getElementById('action_plans')
    let clone = actionPlanParent.lastElementChild.cloneNode(true);
    let index = Number(clone.getAttribute('data-index'))
    index += 1
    clone.setAttribute('data-index', index)
    //「actionPlanParent」の要素の最後尾に複製した要素を追加
    actionPlanParent.appendChild(clone); 
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
            <OutputForm output={this.state.output} change={this.updateForm} submit={this.postOutput} errors={this.state.errors} add={this.addActionPlan}/>
          </div>
        </ModalContent>
      </ModalOverlay>
     )
   
  } 
}

const OutputFormContent = styled(UserFromContent)`
  /* アウトプットのform要素 */
  & #action_plans {
    width: 100%;
    & h4 {
      margin: 0 auto;
      width: 70%;
    }
  }
`

const ActionPlan = styled.div`
  border: 1px solid #000;
  border-radius: 5px;
  width: 70%;
  margin: 0 auto 10px;
  padding: 1%;

  & div {
    width: 85%;
  }

  & h4 {
    margin: 0 auto;
    width: 100%;
  }
`

const OutputFormBlock = styled(FormBlock)`
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

  & .add-actionplan-button {
    background-color: lightgray;
    color: #FFF;
    position: static;
  }

  & .add-actionplan-button:hover {
    background-color: #cb4d00;
    color: #FFF;
    cursor: pointer;
  }

  & #submit_btn{
    width: 65%;
    margin: 0 auto;
  }
`

export default withRouter(OutputModal);