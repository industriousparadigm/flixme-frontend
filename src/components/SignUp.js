import React from 'react'
import { Form, Button } from 'semantic-ui-react'

const SignUp = props => {
  return (
    <Form className='authForm' size='massive'>
      <Form.Field>
        {/* <label>First Name</label> */}
        <input placeholder='email' />
      </Form.Field>
      <Form.Field>
        {/* <label>First Name</label> */}
        <input placeholder='password' />
      </Form.Field>
      <Button size='massive' >sign up</Button>
    </Form>
  );
}

export default SignUp