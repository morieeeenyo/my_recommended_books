import React, { Component } from 'react';
import styled from 'styled-components';

//コンポーネントの読み込み
import {FormBlock} from "../common/UserModal.jsx"
import {ModalOverlay} from "../common/UserModal.jsx"
import {ModalContent} from "../common/UserModal.jsx"

class NewBookModal extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      book: {
        isbn: '',
        title: '',
        author: '',
        author_kana: '',
        publisher_name: '',
        sales_date: '',
        item_price: '',
        genre_id: '',
        item_url: '',
        description: '',
        recommends: '',
      },
      errors: []
    }
    this.closeBookModal = this.closeBookModal.bind(this)
  }

  closeBookModal() {
    this.props.history.push("/");
  }

  render () {
    return (
      <ModalOverlay onClick={this.closeBookModal}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
        <p>推薦図書を投稿する</p>
        <button onClick={this.closeBookModal}>x</button>
          <NewBooksWrapper>
            <form>
              {/* name属性とかは変更していない状態 */}
              <BooksFormBlock>
                <label htmlFor="title">タイトル</label>
                <input type="text" name="title" id="nickname" />  
              </BooksFormBlock>
              <BooksFormBlock>
                <label htmlFor="recommends">こんな人におすすめ！</label>
                <input type="text" name="recommends" id="nickname" />  
              </BooksFormBlock>
              <BooksFormBlock>
                <label htmlFor="description">内容要約</label>
                <textarea type="text" name="description" id="nickname"></textarea> 
              </BooksFormBlock>
              <BooksFormBlock>
                <label htmlFor="author">著者</label>
                <input type="text" name="author" id="nickname" />  
              </BooksFormBlock>
              <BooksFormBlock>
                <label htmlFor="author_kana">著者(カナ)</label>
                <input type="text" name="author_kana" id="nickname" />  
              </BooksFormBlock>
              <BooksFormBlock>
                <label htmlFor="publisher_name">出版社</label>
                <input type="text" name="publisher_name" id="nickname" />  
              </BooksFormBlock>
              <BooksFormBlock>
                <label htmlFor="genre_id">ジャンル</label>
                <input type="text" name="genre_id" id="nickname" />  
              </BooksFormBlock>
              <BooksFormBlock>
                <label htmlFor="sales_date">発売日</label>
                <input type="text" name="sales_date" id="nickname" />  
              </BooksFormBlock>
              <BooksFormBlock>
                <label htmlFor="item_price">価格</label>
                <input type="text" name="item_price" id="nickname" />  
              </BooksFormBlock>
              <BooksFormBlock>
                <label htmlFor="image_url">画像</label>
                <input type="hidden" name="image_url" id="nickname" />  
              </BooksFormBlock>
              <BooksFormBlock>
                <input type="hidden" name="isbn" id="nickname" />  
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

// 基本的なスタイルはUserModal.jsxを継承しているためそちらを参照
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


export default NewBookModal;