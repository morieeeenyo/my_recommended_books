import React, { useEffect } from 'react';

export function MetaTags(props) {
  useEffect(() => {
    ogProperties.forEach(data => {
      let metaElement = document.querySelector(`meta[property="${data.property}"]`)
      metaElement.setAttribute('content', data.content)
    })
    meta.forEach(data => {
      let metaElement = document.createElement('meta')
      metaElement.setAttribute('name', data.name)
      metaElement.setAttribute('content', data.content)
      document.head.insertBefore(metaElement, document.head.children[1])
    })
  })

  const meta = [
    {name:  'charset', content: 'utf-8'},
    {name:  'description', content: 'Kaidokuはアウトプットを通じて人生を面白くすることを目指した読書アプリです。'},
  ]

  const ogProperties = [
    {property:  'og:url', content: location.href},
    {property:  'og:image', content: "https://kaidoku.s3.ap-northeast-1.amazonaws.com/public/header_logo.png",},
    {property:  'og:description', content: props.description},
    {property:  'og:title', content: props.title},
  ]

  return null
}