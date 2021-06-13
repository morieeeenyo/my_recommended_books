import DocumentMeta from 'react-document-meta';
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

  const meta = {
    title: 'Kaidoku - 読書とアウトプットで人生を面白く',
    description: 'Kaidokuはアウトプットを通じて人生を面白くすることを目指した読書アプリです。',
    meta: {
      charset: 'utf-8',
      name: {
        'twitter:card': 'summary'
      },
      property: {
        'og:title': props.title,
        'og:description': props.description,
        'og:image': "https://kaidoku.s3.ap-northeast-1.amazonaws.com/public/header_logo.png",
        'og:url': location.href
      }
    }
  }

  return(
    <DocumentMeta {...meta}>
    </DocumentMeta>
  )
}