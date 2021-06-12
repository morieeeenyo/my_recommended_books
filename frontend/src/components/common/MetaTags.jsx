// Helmetの読み込み(twitterカード使用するmetaタグを設定)
import { Helmet } from "react-helmet";

import React, { useEffect } from 'react';

export function MetaTags(props) {
  useEffect(() => {
    const headElements = document.head.children
    Array.from(headElements).forEach(el => {
      if (el.tagName == 'STYLE' || el.tagName == 'SCRIPT') {
        document.head.appendChild(el)
      }
    })
  })

  return(
  <Helmet 
      meta = {[
        { property: 'og:description', content: props.description },
        { property: 'og:url', content: location.href },
    ]}>    
  </Helmet>
  )
}