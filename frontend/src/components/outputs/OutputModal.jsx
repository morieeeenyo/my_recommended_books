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
      <textarea name="content" value={props.output.content} onChange={props.change} id="output_content"></textarea>
      </OutputFormBlock>
      <div id="action_plans">
      <h4 className="action-plan-label">アクションプラン(最大3つまで)</h4>
      {props.output.action_plans.map((action_plan, index) => {
          return (
            <ActionPlan data-index={index} key={index}>
              <h4>
                {/* indexは0始まりなのでページ上見える部分は+1する */}
                アクションプラン{index + 1}
                <span onClick={props.remove} data-index={index}>取り消し</span>
              </h4>
              {/* idは結合テストコードでの検証用 */}
              <OutputFormBlock>
                <label htmlFor="due_date">いつ</label>
                <input type="text" name="time_of_execution" value={action_plan.time_of_execution} onChange={props.change} data-index={index} id={"output_time_of_execution_" + index}></input>
              </OutputFormBlock>
              <OutputFormBlock>
                <label htmlFor="what">何を</label>
                <input type="text" name="what_to_do" value={action_plan.what_to_do} onChange={props.change} data-index={index} id={"output_what_to_do_" + index}></input>
              </OutputFormBlock>
              <OutputFormBlock>
                <label htmlFor="how_much">どのように</label>
                <input type="text" name="how_to_do" value={action_plan.how_to_do} onChange={props.change} data-index={index} id={"output_how_to_do_" + index}></input>
              </OutputFormBlock>
            </ActionPlan>
          )
      })}
      </div>
      <OutputFormBlock>
        <button id="add-actionplan-button" onClick={props.add}>アクションプランを追加</button>
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
    this.removeActionPlan = this.removeActionPlan.bind(this)
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
    // stateをリセットすることで再度モーダルを開いたときにフォームに値が残らないようにする
    this.setState({
      errors: []
    })
    this.props.history.goBack() //元いたページに戻る(マイページ以外からアクセスされることも想定。あとあと書籍別にアクセスできるようにする)
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
            // indexがあることでアクションプランの番号とうまく対応する
            output.action_plans[e.target.getAttribute('data-index')].time_of_execution = e.target.value;
            break;
        case 'what_to_do':
            output.action_plans[e.target.getAttribute('data-index')].what_to_do = e.target.value;
            break;
        case 'how_to_do':
            output.action_plans[e.target.getAttribute('data-index')].how_to_do = e.target.value;
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
    axios
    .post('/api/v1/books/' + this.props.location.state.book.id + '/outputs', {output: this.state.output} )
    .then(response => {
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
    this.setState(prevState => {
      const output = prevState.output
      const newActionPlan = {
        time_of_execution: '',
        what_to_do: '',
        how_to_do: '',
      }
      output.action_plans.push(newActionPlan)
      if (output.action_plans.length >= 3) { 
        // アクションプランが3つ以上のときはアクションプラン追加ボタンを非表示にする
        const actionPlanAddButton = document.getElementById('add-actionplan-button')
        actionPlanAddButton.setAttribute('style', 'display: none;')
      }
      return {
        output: output
      }
    })
  }

  removeActionPlan(e) {
    e.preventDefault()
    const targetIndex = e.target.getAttribute('data-index')
    const output = this.state.output
    if (output.action_plans.length === 1) {
      //アクションプランが1つのときは取り消しできない
      alert('アクションプランは最低1つ必要です')
      return null
    }
    output.action_plans.splice(targetIndex, 1) //stateのaction_plansから指定したindexの要素を削除
    this.setState({
      output: output
    })
    if (output.action_plans.length < 3) {
      // 取り消し後アクションプランが3つより少なくなるのでアクションプラン追加ボタンを再表示する
      const actionPlanAddButton = document.getElementById('add-actionplan-button')
      actionPlanAddButton.setAttribute('style', 'display: block;')
    }
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
            <OutputForm output={this.state.output} change={this.updateForm} submit={this.postOutput} errors={this.state.errors} add={this.addActionPlan} remove={this.removeActionPlan}/>
          </div>
        </ModalContent>
      </ModalOverlay>
     )
   
  } 
}

const OutputFormContent = styled(UserFromContent)`
  /* アウトプットのform要素 */
  /* 高さ固定していないと画面サイズによりときにモーダルがはみ出る */
  height: 90vh;

  & #action_plans {
    /* アクションプランのform全体のスタイル */
    width: 100%;
    height: 80%;
    overflow: scroll;

    & .action-plan-label {
      /* formのラベルのスタイル */
      margin: 0 auto;
      width: 70%;
    }
  }
`

const ActionPlan = styled.div`
  /* 1個1個のアクションプランのformのスタイル */
  border: 1px solid #000;
  border-radius: 5px;
  width: 70%;
  margin: 0 auto 10px;
  padding: 1%;

  & div {
    /* OutputFormBlock。アクションプランのdivタグの中にあるのでスタイルを調整している */
    width: 85%;
  }

  & h4 {
    /* アクションプランのタイトルのスタイル(アクションプラン1,2,3の部分) */
    margin: 0 auto;
    width: 100%;
    position: relative;

    & span {
      /* 取り消しボタンのスタイル */
      background-color: lightgray;
      color: #FFF;
      position: absolute;
      right: 5%;
      padding: 1px;
      border-radius: 2px;
    }

    & span:hover {
      /* 取り消しボタンはホバーすると色が変わる */
      cursor: pointer;
      background-color: #cb4d00;
      color: #FFF;
    }
  }
`

const OutputFormBlock = styled(FormBlock)`
  /* 各入力欄のスタイル */
  width: 70%;

  .action-plan-label {
    /* 各入力欄のラベルのスタイル */
    margin-bottom: 5px;
  }

  & textarea {
    /* 気づきの入力欄のスタイル */
    width: 100%;
    height: 80px;
    resize: none;
  }

  & input {
    width: 100%
  }

  & #add-actionplan-button {
    /* アクションプラン追加ボタンのスタイル */
    background-color: lightgray;
    color: #FFF;
    position: static;
  }

  & #add-actionplan-button:hover {
    background-color: #cb4d00;
    color: #FFF;
    cursor: pointer;
  }

  & #submit_btn{
    /* 『この内容で投稿する』ボタンのスタイル */
    width: 65%;
    margin: 0 auto;
  }
`

export default withRouter(OutputModal);