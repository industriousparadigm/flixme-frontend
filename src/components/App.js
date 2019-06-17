import React, { Component } from 'react'
import { Route, Switch, Link, withRouter } from 'react-router-dom'
import { Menu, Icon } from 'semantic-ui-react'
import '../App.css'
import API from '../api/API'
import MoviesContainer from './MoviesContainer'
import UsersContainer from './UsersContainer'
import MovieDetails from './MovieDetails'
import Choices from './Choices';
import UserProfile from './UserProfile'
import SignUp from './SignUp'
import SignIn from './SignIn'

class App extends Component {
  state = {
    movies: [],
    moviesPage: 1,
    searchTerm: '',
    currentUser: null
  }

  PAGE_SIZE = 20

  componentDidMount() {
    API.validate().then(data =>
      !data.error
        ? this.initializeWithUser(data.userId)
        : this.initializeWithoutUser()
    )
  }

  initializeWithUser = userId => {
    this.initializeWithoutUser()
    this.signIn(userId)
  }

  initializeWithoutUser = () => {
    API.getMovies()
      .then(this.loadMovies)
    // API.getUsers()
    //   .then(this.loadUsers)
  }

  signIn = userId =>
    API.getUser(userId)
      .then(currentUser => this.setState({ currentUser, moviesPage: 1 }))

  signOut = () => {
    this.setState({ currentUser: null })
    localStorage.removeItem('token')
  }

  // puts the top 20 movies in state and resets page count
  loadMovies = json => this.setState({ movies: json, moviesPage: 1 })

  appendMovies = json => { // appends 20 movies
    const movies = ([...this.state.movies].concat(json))
    this.setState({ movies })
  }

  // loadUsers = users => this.setState({ users }) // puts ALL users in state

  // reloadUser = userId =>
  //   API.getUser(userId)
  //     .then(user => {
  //       const users = [...this.state.users.filter(user => user.id !== userId)]
  //       users.push(user)
  //       this.setState({ users })
  //     })

  reloadCurrentUser = () =>
    API.getUser(this.state.currentUser.id)
      .then(currentUser => this.setState({ currentUser }))

  // findUser = userId => this.state.users.find(user => user.id === userId)

  handleSearchChange = (event, { value }) => {
    // return default movies in case search is empty or spaces only
    if (value.replace(/\s/g, "").length === 0) {
      API.getMovies()
        .then(this.loadMovies)
    } else {
      API.getMovies(API.searchURL + value)
        .then(json => {
          json !== undefined
            ? this.loadMovies(json)
            : this.setState({ movies: [] })
        })
    }
    this.setState({ searchTerm: value })
  }

  handleScroll = () => { // loads more movies + increments moviesPage, 1 page per 20 movies
    const { moviesPage } = this.state
    if (!this.state.searchTerm)
      API.getMovies(API.moviesURL + `?page=${moviesPage + 1}`)
        .then(this.appendMovies)
    this.setState({ moviesPage: moviesPage + 1 })
  }

  handleUserClick = user => {
    this.props.history.push(`/users/${user.id}`)
  }

  render() {
    const { history } = this.props
    const { movies, moviesPage, searchTerm, currentUser } = this.state
    const {
      handleSearchChange,
      handleScroll,
      handleUserClick,
      signIn,
      signOut,
      reloadCurrentUser
    } = this

    return (
      <div className="App">
        <Menu borderless icon='labeled' vertical floated='right' className='iconMenu'>
          {
            !currentUser
              ?
              <Menu.Item name='signup' as={Link} to={'/signup'}>
                <Icon name='signup' />
                sign up
              </Menu.Item>
              :
              <Menu.Item
                name='signout' as={Link} to={'/'} onClick={signOut}>
                <Icon name='cut' />
                sign out
              </Menu.Item>
          }
          <Menu.Item
            name='user'
            onClick={() => {
              currentUser
                ? history.push(`/users/${currentUser.id}`)
                : history.push('/signin')
            }}>
            <Icon name='user' />
            {currentUser ? currentUser.first_name : 'sign in'}
          </Menu.Item>
          <Menu.Item name='film' as={Link} to='/movies'>
            <Icon name='film' />
            movies
          </Menu.Item>
          <Menu.Item name='people' as={Link} to='/users'>
            <Icon name='users' />
            people
          </Menu.Item>
        </Menu>
        <header className="App-header">
          <Link to={'/'}><h1 id='flixme'>flix me</h1></Link>
        </header>
        <Switch>
          <Route exact path='/' render={props =>
            <Choices {...props} />
          } />
          <Route exact path='/movies' render={props =>
            <MoviesContainer
              {...props}
              movies={movies}
              page={moviesPage}
              PAGE_SIZE={this.PAGE_SIZE}
              handleSearchChange={handleSearchChange}
              searchTerm={searchTerm}
              handleScroll={handleScroll}
            />
          }
          />
          <Route path='/movies/:id' render={props => {
            const id = parseInt(props.match.params.id, 10)
            return <MovieDetails
              movieId={id}
              currentUser={currentUser}
              reloadCurrentUser={reloadCurrentUser}
              {...props}
            />
          }} />
          <Route exact path='/users' render={props =>
            <UsersContainer
              {...props}
              handleUserClick={handleUserClick}
            />
          }
          />
          <Route path='/users/:id' render={props => {
            const id = parseInt(props.match.params.id, 10)
            return <UserProfile
              userId={id}
              currentUser={currentUser}
              reloadCurrentUser={reloadCurrentUser}
              {...props} />
          }} />
          <Route exact path='/signin' render={props => <SignIn {...props} signIn={signIn} />} />
          <Route exact path='/signup' render={props => <SignUp {...props} signIn={signIn} />} />
          <Route component={props => <img src='http://www.404lovers.com/wp-content/uploads/2014/08/batman-3ddotde-1170x563.jpg' alt='404 not found'></img>} />
        </Switch>
      </div>
    )
  }
}

export default withRouter(App)
