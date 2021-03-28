import React, { Component } from 'react';
import styled from 'styled-components';

//axiosの読み込み
import axios from 'axios';

//コンポーネントの読み込み
import {FormBlock} from "../common/UserModal.jsx"
import {ModalOverlay} from "../common/UserModal.jsx"
import {ModalContent} from "../common/UserModal.jsx"

function ManualBookPostForm() {
    return(
      <form>
        <BooksFormBlock>
          <label htmlFor="title">タイトル</label>
          <input type="text" name="title" id="nickname" onChange={this.searchBook}/>  
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
    )
  }

function SearchBookForm(props) {
  return(
    <form>
      <BooksFormBlock>
        <label htmlFor="title">タイトル</label>
        <input type="text" name="title" id="nickname" onChange={props.change}/>  
      </BooksFormBlock>
      <div id="search_result">


      </div>
      <BooksFormBlock>
        <input type="submit" value="推薦図書に追加" id="submit-btn"/>
      </BooksFormBlock>
    </form>
  )
}

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
    this.searchBook = this.searchBook.bind(this)
    this.updateForm = this.updateForm.bind(this)
  }

  closeBookModal() {
    this.props.history.push("/");
  }

  updateForm(e) {
    // ネストされたオブジェクトのdataまでアクセスしておく
    const book = this.state.book;
    book.title = e.target.value            
    this.setState({
      book: book
    })
  }

  searchBook(e) {
    //todo: インクリメンタルサーチだと速すぎて間に合わないのでクリックイベントとかで検索したほうが良さそう
    const keyword = this.state.book.title
    console.log(keyword)
    //todo:ユーザー認証周りは一通り動くようになってから
    // this.setAxiosDefaults();
    // this.userAuthentification()
    axios
    .get(`/api/v1/books/search/?keyword=${keyword}`)
    .then(response => {
      console.log(response)
      const resultList = document.getElementById('search_result')
      resultList.textContent = "" //検索するたびに中身を空にして重複を防ぐ
      response.data.books.forEach(book => {
        const resultItem = document.createElement('div')
        const resultImage = document.createElement('img')
        resultImage.setAttribute('src', book.params.smallImageUrl)
        resultList.appendChild(resultItem)
        resultItem.appendChild(resultImage)
      })
      return response //todo:予測候補を出力する
    })
    .catch(error => {
      if (error.response.data && error.response.data.errors) {
        // ログアウトに失敗するケースはあまり想定していないが一応設定
        const errors = [] //ログアウトではエラーメッセージは1つしか出ないがループ処理でレンダリングするために一度配列を作っておく
        errors.push(error.response.data.errors) 
        this.setState({
          errors: errors
        })
      }
    })
  }

  render () {
    return (
      <ModalOverlay onClick={this.closeBookModal}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
        <p>推薦図書を投稿する</p>
        <button onClick={this.closeBookModal}>x</button>
          <NewBooksWrapper>
            <SearchBookForm search={this.searchBook}/>
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

  & #search_result {
    overflow: scroll;
    display: flex;
    justify-content: space-evenly;
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