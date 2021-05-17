import React, { Component } from 'react';
import styled from 'styled-components';

class OutputIndex extends React.Component {
  constructor(props){
    super(props);
    this.state ={
      outputs: []
    }
    this.getCsrfToken = this.getCsrfToken.bind(this)
    this.setAxiosDefaults = this.setAxiosDefaults.bind(this)
    this.userAuthentification = this.userAuthentification.bind(this)
  }

  componentDidMount() {
    this.setAxiosDefaults();
    this.userAuthentification()
    //MyPage.jsxにてユーザーがログインしていない場合トップページにリダイレクトさせる処理が発火
    axios
      .get('/api/v1/mypage/books/' + this.props.location.state.book.id + '/outputs')
      .then(response => {
        this.setState({
            outputs: response.data.outputs
          }
        )
      })
      .catch(error => {
        if (error.response.data && error.response.data.errors) {
          // 投稿していない書籍のページに行くときなどにエラーが発生することを想定
          //アラートを出すとうまく動かなかった(アラートが2つ出てくる？？？)
          console.log(error) 
        }
      })
  }
}

export default withRouter(OutputIndex);