import React, { Component } from 'react';
import styled from 'styled-components';

// react-routerの読み込み
import { Link } from "react-router-dom";

//コンポーネントの読み込み
import {FormBlock} from "../common/UserModal.jsx"
import {ModalOverlay} from "../common/UserModal.jsx"
import {ModalContent} from "../common/UserModal.jsx"

class NewBook extends React.Component {

  render () {
    return (
      <ModalOverlay>
        <ModalContent>
        <p>推薦図書を投稿する</p>
        <button>x</button>
          <NewBooksWrapper>
            <form>
              <BooksFormBlock>
                <label htmlFor="nickname">タイトル</label>
                <input type="text" name="nickname" id="nickname" />  
              </BooksFormBlock>
              <BooksFormBlock>
                <label htmlFor="nickname">こんな人におすすめ！</label>
                <input type="text" name="nickname" id="nickname" />  
              </BooksFormBlock>
              <BooksFormBlock>
                <label htmlFor="nickname">内容要約</label>
                <textarea type="text" name="nickname" id="nickname"></textarea> 
              </BooksFormBlock>
              <BooksFormBlock>
                <label htmlFor="nickname">著者</label>
                <input type="text" name="nickname" id="nickname" />  
              </BooksFormBlock>
              <BooksFormBlock>
                <label htmlFor="nickname">出版社</label>
                <input type="text" name="nickname" id="nickname" />  
              </BooksFormBlock>
              <BooksFormBlock>
                <label htmlFor="nickname">ジャンル</label>
                <input type="text" name="nickname" id="nickname" />  
              </BooksFormBlock>
              <BooksFormBlock>
                <label htmlFor="nickname">価格</label>
                <input type="text" name="nickname" id="nickname" />  
              </BooksFormBlock>
              <BooksFormBlock>
                <label htmlFor="nickname">画像</label>
                <input type="text" name="nickname" id="nickname" />  
              </BooksFormBlock>
              <BooksFormBlock>
                <input type="submit" value="推薦図書に追加" id="submit-btn"/>
              </BooksFormBlock>
            </form>
          </NewBooksWrapper>
        </ModalContent>
      </ModalOverlay>
    )
  } 
}

const NewBooksWrapper = styled.div `
  width: 70%;
  margin: 0 auto;
  font-family: Verdana, sans-serif;
  & h1 {
    text-align: center;
  }
` 

const BooksFormBlock = styled(FormBlock)`
  width: 80%;
  & label {
    font-size: 16px;
  }
  & input {
    height: 24px;
    line-height: 24px;
  }
  
  & textarea {
    height: 100px;
    resize: none;
  }

`


export default NewBook;