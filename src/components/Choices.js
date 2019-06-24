import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'semantic-ui-react'

const Choices = props => {

  return (
    <Fragment>
      <Button onClick={props.setSearchable} size='massive'>movies</Button>
      {/* <Button onClick={props.setFilterable} size='massive'>recommendations</Button> */}
      <Link to={'/users'}>
        <Button size='massive'>people</Button>
      </Link> <br /> <br />
    </Fragment>
  )
}

export default Choices