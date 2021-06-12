// Helmetの読み込み(twitterカード使用するmetaタグを設定)
import { Helmet } from "react-helmet";

import React, { useEffect } from 'react';

export function MetaTags(title, description) {
  useEffect(() => {
    const headElements = document.head.children
    Array.from(headElements).forEach(el => {
      if (el.tagName == 'STYLE') {
        document.head.appendChild(el)
      }
    })
  })

  return(
  <Helmet 
        meta = {[
        { name: 'charset', content: 'UTF-8'},
        { property: 'twitter:card', content: 'summary' },
        { property: 'og:image', content: "https://kaidoku.s3.ap-northeast-1.amazonaws.com/public/header_logo.png" },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:url', content: location.href },
      ]}>    
  </Helmet>
  )
}