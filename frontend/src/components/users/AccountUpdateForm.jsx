import React, { Component } from 'react';
import styled from 'styled-components';

// react-router用のlinkを使えるようにする
import { Link, useParams, useLocation, useHistory } from 'react-router-dom'

//axiosの読み込み
import axios from 'axios';

//コンポーネント読み込み
import {ModalOverlay} from "../users/UserModalForm.jsx"
import {ModalMenuContent} from "../users/UserModalMenu.jsx"
import {ErrorMessage} from "../users/UserModalForm.jsx"
import {UserFromContent} from "../users/UserModalForm.jsx"
import {FormBlock} from "../users/UserModalForm.jsx"


function AccountUpdateForm(props) {
  const location = useLocation();
  const history = useHistory();
  const params = useParams();     // URLのパスパラメータを取得。location.state.contentはキャメルケースなのでスネークケースのデータを取得したい(例：SignUP→sign_up)
  if (location.state.show) {
      return (
      <ModalOverlay onClick={() => history.push('/mypage')}> 
        <ModalMenuContent onClick={(e) => e.stopPropagation()}> 
        {/* モーダル内部をクリックしたときは閉じない */}
          <p>Account Update</p>
          <UserFromContent>
            <ErrorMessage></ErrorMessage>
            <FormBlock>
              <label htmlFor="nickname">ニックネーム(必須)</label>
              <input type="text" name="nickname" id="nickname" value={location.state.user.nickname}/>
            </FormBlock>
            <FormBlock>
              <label htmlFor="email">メールアドレス(必須)</label>
              <input type="email" name="email" id="email" placeholder="@を含む形式" value={location.state.user.email}/>
            </FormBlock>
            <FormBlock>
              <label htmlFor="password">パスワード(必須)</label>
              <input type="password" name="password" id="password" placeholder="英小文字・大文字・数字を全て含み8文字以上" value={location.state.user.password}/>
            </FormBlock>
            <FormBlock>
              <label htmlFor="password_confirmation">パスワード(確認)</label>
              <input type="password" name="password_confirmation" id="password_confirmation" placeholder="同じものを入力" value={location.state.user.password_confirmation}/>
            </FormBlock>
            <FormBlock>
              <label htmlFor="avatar">アバター画像(任意)</label>
              <input type="file" name="avatar" id="avatar" accept="image/*,.png,.jpg,.jpeg,.gif"/>
            </FormBlock>
            <FormBlock>
              <input type="submit" value="SignUp" id="submit_btn"/>
            </FormBlock>
        </UserFromContent>
          

          <button onClick={() => history.push('/mypage')}>x</button>
        </ModalMenuContent>
      </ModalOverlay>
    )
  } else {
    return null
  }
}


export default AccountUpdateForm;