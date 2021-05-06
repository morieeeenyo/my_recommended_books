import React, { Component } from 'react';
import styled from 'styled-components';

// react-router用のlinkを使えるようにする
import { withRouter } from 'react-router-dom'

//axiosの読み込み
import axios from 'axios';

//コンポーネント読み込み
import {ModalOverlay} from "../users/UserModalForm.jsx"
import {ModalMenuContent} from "../users/UserModalMenu.jsx"
import {ErrorMessage} from "../users/UserModalForm.jsx"
import {UserFromContent} from "../users/UserModalForm.jsx"
import {FormBlock} from "../users/UserModalForm.jsx"


class AccountUpdateForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      user: {
        nickname: '',        
        email: '',        
        password: '',        
        password_confirmation: '',        
        avatar: {
          data: '',
          filename: ''
        }  
      },
      errors: []
    }
    this.updateForm = this.updateForm.bind(this)
  }

  componentDidMount() {
    this.setState({
      user: this.props.location.state.user
    })
  }

  updateForm(e) {
    // ネストされたオブジェクトのdataまでアクセスしておく
    const user = this.state.user;

    // eventが発火したname属性名ごとに値を処理
    switch (e.target.name) {
        case 'nickname':
            user.nickname = e.target.value;
            break;
        case 'email':
            user.email = e.target.value;
            break;
        case 'password':
            user.password = e.target.value;
            break;
        case 'password_confirmation':
            user.password_confirmation = e.target.value;
            break;
        case 'avatar':
            //画像は事前にvalueを取得できないのでFileReaderを使ってデータを読み取る
            const file = e.target.files[0];
            const reader = new FileReader()
            reader.onload = () => { 
              //以下2つはactivestorageの保存に必要
              user.avatar.data = reader.result
              user.avatar.filename = file.name 
            }
            reader.readAsDataURL(file) //戻り値はata:image/jpeg;base64,/9j/4AA…のようになる。これをサーバーサイドで複合する
            break;
    }
    this.setState({
      user: user
    })
  }

  render() {
    if (this.props.location.state.show) {
        if(this.props.location.state.content == 'Edit Profile') {
          return (
          <ModalOverlay onClick={() => this.props.history.push('/mypage')}> 
            <ModalMenuContent onClick={(e) => e.stopPropagation()}> 
            {/* モーダル内部をクリックしたときは閉じない */}
              <p>{this.props.location.state.content}</p>
              <UserFromContent>
                <ErrorMessage errors={this.state.errors}></ErrorMessage>
                <FormBlock>
                  <label htmlFor="nickname">ニックネーム(必須)</label>
                  <input type="text" name="nickname" id="nickname" onChange={this.updateForm} value={this.props.location.state.user.nickname}/>
                </FormBlock>
                <FormBlock>
                  <label htmlFor="avatar">アバター画像(任意)</label>
                  <input type="file" name="avatar" id="avatar" accept="image/*,.png,.jpg,.jpeg,.gif"/>
                </FormBlock>
                <FormBlock>
                  <input type="submit" onChange={this.updateForm} value={this.props.location.state.content} id="submit_btn"/>
                </FormBlock>
              </UserFromContent>
              <button onClick={() => this.props.history.push('/mypage')}>x</button>
            </ModalMenuContent>
          </ModalOverlay>
          )
        }
  
      if(this.props.location.state.content == 'Change Email') {
        return (
          <ModalOverlay onClick={() => this.props.history.push('/mypage')}> 
              <ModalMenuContent onClick={(e) => e.stopPropagation()}> 
              {/* モーダル内部をクリックしたときは閉じない */}
                <p>{this.props.location.state.content}</p>
                <UserFromContent>
                  <ErrorMessage errors={this.state.errors}></ErrorMessage>
                  <FormBlock>
                    <label htmlFor="email">メールアドレス(必須)</label>
                    <input type="email" name="email" id="email" placeholder="@を含む形式" onChange={this.updateForm} value={this.props.location.state.user.email}/>
                  </FormBlock>
                  <FormBlock>
                    <input type="submit" onChange={this.updateForm} value={this.props.location.state.content} id="submit_btn"/>
                  </FormBlock>
                </UserFromContent>
                <button onClick={() => this.props.history.push('/mypage')}>x</button>
              </ModalMenuContent>
            </ModalOverlay>
        )
      }
  
      if(this.props.location.state.content == 'Change Password') {
        return (
          <ModalOverlay onClick={() => this.props.history.push('/mypage')}> 
              <ModalMenuContent onClick={(e) => e.stopPropagation()}> 
              {/* モーダル内部をクリックしたときは閉じない */}
                <p>{this.props.location.state.content}</p>
                <UserFromContent>
                  <ErrorMessage errors={this.state.errors}></ErrorMessage>
                  <FormBlock>
                    <label htmlFor="password">パスワード(必須)</label>
                    <input type="password" name="password" id="password" placeholder="英小文字・大文字・数字を全て含み8文字以上" onChange={this.updateForm} value={this.props.location.state.user.password}/>
                  </FormBlock>
                  <FormBlock>
                    <label htmlFor="password_confirmation">パスワード(確認)</label>
                    <input type="password" name="password_confirmation" id="password_confirmation" placeholder="同じものを入力" onChange={this.updateForm} value={this.props.location.state.user.password_confirmation}/>
                  </FormBlock>
                  <FormBlock>
                    <input type="submit" onChange={this.updateForm} value={this.props.location.state.content} id="submit_btn"/>
                  </FormBlock>
                </UserFromContent>
                <button onClick={() => this.props.history.push('/mypage')}>x</button>
              </ModalMenuContent>
            </ModalOverlay>
        )
      }
    } else {
      return null
    }
  }     // URLのパスパラメータを取得。location.state.contentはキャメルケースなのでスネークケースのデータを取得したい(例：SignUP→sign_up)
}


export default withRouter(AccountUpdateForm);