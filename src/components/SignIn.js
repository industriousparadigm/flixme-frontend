import React, { useState } from 'react'
import { Form, Button } from 'semantic-ui-react'
import API from '../api/API'


const SignIn = props => {

  const [userEmail, setUserEmail] = useState('email')
  const [userPass, setUserPass] = useState('password')

  const handleSubmit = event => {
    const user = { email: userEmail, password: userPass }
    event.preventDefault()
    API.signIn(user)
      .then(data => {
        if (data.error) {
          console.log(data.error)
        } else {
          console.log(data)
          props.signIn(data.id).then(props.history.push('/'))
        }
      })
  }

  const handleFormChange = event => {
    const { value, type } = event.target
    type === 'email'
      ? setUserEmail(value)
      : setUserPass(value)
  }

  return (
    <Form className='authForm' size='massive' onSubmit={handleSubmit}>
      <Form.Field type='email' control='input' onChange={handleFormChange}>
      </Form.Field>
      <Form.Field type='password' control='input' onChange={handleFormChange}>
      </Form.Field>
      <Button type='submit' size='massive' >sign in</Button>
    </Form>
  );
}

export default SignIn