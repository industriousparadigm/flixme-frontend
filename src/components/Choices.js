import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'semantic-ui-react'

const Choices = props => {

  return (
    <Fragment>
      <Link to={'/movies'}>
        <Button size='massive'>rate a movie</Button>
      </Link>
      <Button size='massive'>get rec(t)</Button>
      <Button size='massive'>find people</Button>
    </Fragment>
  )
}

export default Choices