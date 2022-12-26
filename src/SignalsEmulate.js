import { useEffect, useState } from 'react'

const SignalsEmulate = () => {

  useEffect(() => {
    window.addEventListener("message", (event) => {
      if (event.origin !== 'http://localhost:3000' && event.origin !== 'https://prohetamine.github.io/signal') {
        return
      }

      console.log(event)
    }, false);
  }, [])

  return (
    <div></div>
  )
}

export default SignalsEmulate
