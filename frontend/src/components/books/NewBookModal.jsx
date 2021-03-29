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
        <label htmlFor="title">タイトルで検索</label>
        <div className="search-form-field">
          <input type="text" name="title" id="nickname" onChange={props.change}/>  
          <button className="search-button" onClick={props.search}><i className="fas fa-search"></i></button>  
        </div>
      </BooksFormBlock>
      <div id="search_result">
        {/* 検索結果が個々に入る */}


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
    //入力欄の変化を検知してstateを変える
    const book = this.state.book;
    book.title = e.target.value            
    this.setState({
      book: book
    })
  }

  searchBook(e) {
    //todo: インクリメンタルサーチだと速すぎて間に合わないのでクリックイベントとかで検索したほうが良さそう
    e.preventDefault()
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
      const book = this.state.book
      response.data.books.forEach(book => {
        const resultItem = document.createElement('div') //全体の親
        const resultImage = document.createElement('img') //画像
        resultImage.setAttribute('src', book.params.mediumImageUrl) 
        const resultInfoWrapper = document.createElement('div') //書籍の詳細
        const resultInfoContent = `
        <h3>${book.params.title}</h3>
        <p>著者名</p><p>${book.params.author}</p>
        `
        resultInfoWrapper.insertAdjacentHTML('afterbegin', resultInfoContent)
        resultItem.appendChild(resultImage)
        resultItem.appendChild(resultInfoWrapper)
        var index = 0
        resultItem.setAttribute('data-index',index)
        index += 1
        resultList.appendChild(resultItem)
        resultItem.addEventListener('click', (e) => {
          const selectedItems = document.getElementsByClassName('selected')
          if (selectedItems) { //初回は選択状態の要素がないので条件分岐しないとエラーが発生しそう
            Array.prototype.slice.call(selectedItems).forEach(item => {
              item.removeAttribute('class') //一度クラスが付与されたdiv要素を全て外し1つだけ選択されている状態にする
            })
          }
          resultItem.setAttribute('class', 'selected') //選択状態にする
          book.title = book.params.title
          book.isbn = book.params.isbn
          book.author = book.params.author
          book.author_kana = book.params.authorKana
          book.publisher_name = book.params.publisherName
          book.sales_date = book.params.salesDate
          book.item_price = book.params.itemPrice
          book.item_url = book.params.itemUrl
          this.setState({
            book: book
          })
          console.log(this.state.book)
        })
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
            <SearchBookForm search={this.searchBook} change={this.updateForm}/>
          </NewBooksWrapper>
        </ModalContent>
      </ModalOverlay>
    )
  } 
}

// 基本的なスタイルはUserModal.jsxを継承しているためそちらを参照
const NewBooksWrapper = styled.div `
  width: 100%;
  margin: 0 auto;
  font-family: Verdana, sans-serif;
  & h1 {
    text-align: center;
  }

  & #search_result {
    overflow: scroll;
    height: 300px;

    & > div {
      display: flex;
      justify-content: space-between;
      padding: 10px;
      border: 1px solid black;
      border-radius: 5px;
      margin-bottom: 10px;

      & img {
        width: 30%;
      }

      & > div {
        width: 60%;
      }

      & p {
        text-align: start;
        font-size: 12px;
      }
    }

    & .selected {
      border: 5px solid blue;
    }
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

  .search-form-field {
    display: flex;
    justify-content: space-between;
    align-items: center;

    & input {
      width: 80%;
    }

    & .search-button {
      vertical-align: center;
      position: static;
      background-color: #cb4d00;
      color: #FFF;
      height: 30px;
      padding: 0 10px;

      & i {
        font-size: 16px;
      }
    }

    & .search-button:hover {
      cursor: pointer;
      color: #cb4d00;
      background-color: #FFF;
    }
  }

`


export default NewBookModal;