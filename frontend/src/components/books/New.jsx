import React, { Component } from 'react';
import styled from 'styled-components';

// react-routerの読み込み
import { Link } from "react-router-dom";

//コンポーネントの読み込み
import {FormBlock} from "../common/UserModal.jsx"

class NewBook extends React.Component {
  render () {
    return (
      <NewBooksWrapper>
        <h1>推薦図書を投稿する</h1>
        <div className="new-books-link">
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
              <input type="text" name="nickname" id="nickname" />  
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
          </form>
        </div>
      </NewBooksWrapper>
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
    font-size: 24px;
  }
  & input {
    height: 30px;
  }

`


export default NewBook;