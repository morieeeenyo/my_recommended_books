import  { useEffect } from 'react';

export function MetaTags(props) {
  useEffect(() => {
    ogProperties.forEach(data => {
      let metaElement = document.querySelector(`meta[property="${data.property}"]`)
      metaElement.setAttribute('content', data.content)
    })
  })

  const ogProperties = [
    {property:  'og:url', content: location.href},
    {property:  'og:description', content: props.description},
    {property:  'og:title', content: props.title},
  ]

  return null
}