import React, { useState } from 'react'
import { Form, Button, Input } from 'semantic-ui-react'
import API from '../api/API'

const SignUp = props => {

  const [userFirstName, setUserFirstName] = useState('')
  const [userLastName, setUserLastName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [userPass, setUserPass] = useState('')

  const handleSignUp = event => {
    event.preventDefault()
    const user = {
      first_name: userFirstName,
      last_name: userLastName,
      email: userEmail,
      password: userPass
    }
    API.signUp(user)
      .then(data => {
        if (data.error) {
          console.log(data.error)
        } else {
          console.log(data)
          props.signIn(data.id).then(props.history.push('/'))
          localStorage.setItem('token', data.id)
        }
      })
  }

  const handleFormChange = event => {
    const { value, name } = event.target
    switch (name) {
      case 'firstName':
        setUserFirstName(value)
        break
      case 'lastName':
        setUserLastName(value)
        break
      case 'email':
        setUserEmail(value)
        break
      case 'password':
        setUserPass(value)
        break
      default:
    }
  }

  return (
    <Form className='authForm' size='massive' onChange={handleFormChange}>
      <Form.Group widths='equal'>
        <Form.Input
          name='firstName'
          required
          fluid
          placeholder='first name'
        />
        <Form.Input
          name='lastName'
          required
          fluid
          placeholder='last name'
        />
      </Form.Group>
      <Form.Input
        required
        fluid
        name='email'
        placeholder='email'
      />
      <Form.Input
        required
        fluid
        name='password'
        placeholder='password'
      />
      <Button size='massive' onClick={handleSignUp}>sign up</Button>
    </Form>
  );
}

export default SignUp