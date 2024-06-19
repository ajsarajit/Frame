import React from 'react'
import styled from 'styled-components'

const Test = () => {
    const Button = styled.button`
    height: 50vh;
    border-color: red;
    color: blue;
    `
  return (
    <div>
      <Button>Hello</Button>
    </div>
  )
}

export default Test
