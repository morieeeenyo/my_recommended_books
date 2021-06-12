// Helmetの読み込み(twitterカード使用するmetaタグを設定)
import { Helmet } from "react-helmet";

import React, { useEffect } from 'react';

export function MetaTags(props) {
  useEffect(() => {
    const headElements = document.head.children
    Array.from(headElements).forEach(el => {
      if (!el.getAttribute('data-react-helmet')) {
        document.head.appendChild(el)
      }
    })
  })

  return(
  <Helmet 
      meta = {[
      { name: 'twitter:card', content: "summary" },
      { property: 'og:image', content: "https://kaidoku.s3.ap-northeast-1.amazonaws.com/public/header_logo.png" },
      { property: 'og:title', content: props.title },
      { property: 'og:description', content: props.description },
      { property: 'og:url', content: location.href },
    ]}>    
  </Helmet>
  )
}