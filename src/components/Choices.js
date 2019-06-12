import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'semantic-ui-react'

const Choices = props => {

  return (
    <Fragment>
      <Link to={'/movies'}>
        <Button size='massive'>movies</Button>
      </Link>
      <Button size='massive'>recommendations</Button>
      <Button size='massive'>people</Button>
    </Fragment>
  )
}

export default Choices