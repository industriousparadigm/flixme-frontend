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
    users: [],
    currentUser: null,
    currentUserMovies: [],
    selectedUser: null,
    selectedMovie: null
  }

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
    API.getMovies().then(this.loadMovies)
    API.getUsers().then(this.loadUsers)
  }

  signIn = userId =>
    API.getUser(userId)
      .then(currentUser => this.setState({ currentUser, moviesPage: 1 }, () => {
        this.loadCurrentUserMovies()
        this.loadCurrentUserFriends()
      }))

  signOut = () => {
    this.setState({ currentUser: null })
    localStorage.removeItem('token')
  }

  loadCurrentUserMovies = () =>
    this.state.currentUser.movies_watched.forEach(movie => {
      API.getMovie(movie.movie_id)
        .then(movie_json => {
          movie_json.current_user_rating = movie.rating
          this.setState({ currentUserMovies: [...this.state.currentUserMovies, movie_json] })
        })
    })

  loadCurrentUserFriends = () => {
    const { friends } = this.state.currentUser
    friends.size > 0 && friends.forEach(user => {
      API.getUser(user.id)
        .then(user_json => this.setState({ currentUserFriends: [...this.state.currentUserFriends, user_json] }))
    })
  }

  loadMovies = json => { // puts 20 movies in state
    const movies = this.appendRatingsToMovies(json)
    this.setState({ movies, moviesPage: 1 })
  }

  loadUsers = users => this.setState({ users }) // puts ALL users in state

  loadAllUsersMovies = user => {

  }

  appendRatingsToMovies = movies => {
    const { currentUser } = this.state
    currentUser
      ? movies.forEach(movie => {
        const movieWatched = currentUser.movies_watched.find(m => m.movie_id === movie.id)
        movieWatched
          ? this.appendRatingToMovie(movie, movieWatched.rating)
          : this.appendRatingToMovie(movie, null)
      })
      : movies.forEach(movie =>
        this.appendRatingToMovie(movie, null)
      )

    return movies
  }

  appendRatingToMovie = (movie, rating) => movie.current_user_rating = rating

  appendMovies = json => {
    const movies = ([...this.state.movies].concat(this.appendRatingsToMovies(json)))
    this.setState({ movies })
  }

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

  handleScroll = () => {
    const { moviesPage } = this.state
    !this.state.searchTerm && API.getMovies(API.moviesURL + `?page=${moviesPage + 1}`)
      .then(this.appendMovies)
    this.setState({ moviesPage: moviesPage + 1 })
  }

  handleRating = (event, { movieid, rating }) => {
    API.postRating(this.state.currentUser.id, movieid, rating)
      .then(this.changeRating(movieid, rating))
  }

  handleWatched = movie => { // handles "mark as seen" button
    const { currentUser } = this.state
    if (movie.current_user_rating !== null) { // if movie seen
      API.deleteRating(currentUser.id, movie.id)
        .then(this.changeRating(movie, null)) // mark as not seen and delete rating
    } else {
      API.postRating(currentUser.id, movie.id, 0)
        .then(this.changeRating(movie, 0)) // or just mark as seen without rating
    }
  }

  changeRating = (movie, rating) => {
    // first change the rating in overall movies state array
    const movies = [...this.state.movies]
    movie.current_user_rating = rating
    this.setState({ movies })
    // then add or update rating in currentUserMovies state array
    const currentUserMovies = [...this.state.currentUserMovies]
    const foundMovie = currentUserMovies.find(m => m.id === movieId)
    foundMovie
      ? foundMovie.current_user_rating = rating // update if found
      : currentUserMovies.push(movie) // add that movie if not rated yet
    this.setState({ currentUserMovies })
  }

  handleUserClick = user => {
    this.setState({ selectedUser: user }, () =>
      this.props.history.push(`/users/${user.id}`)
    )
  }

  addToUserMovies = movieId => { // work in progress, should move movie to end of array if already seen.
    const movies = this.state.currentUserMovies
    movies.includes(movie => movie.id === movieId)
    API.getMovie(movieId).then(movie =>
      this.setState({ currentUserMovies: [...movies, movie] })
    )
  }

  render() {
    const { history } = this.props
    const { movies, moviesPage, searchTerm, currentUser, currentUserMovies, users } = this.state
    const { handleSearchChange, handleScroll, handleRating, handleWatched, handleUserClick, signIn, signOut } = this

    return (
      <div className="App">
        <Menu icon='labeled' vertical floated='right' className='iconMenu'>
          {
            !currentUser
              ? <Menu.Item
                name='signup'
                as={Link} to={'/signup'}
              >
                <Icon name='signup' />
                sign up
          </Menu.Item>
              : <Menu.Item
                name='signout'
                as={Link} to={'/'}
                onClick={signOut}
              >
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
            {currentUser ? `${currentUser.name.split(' ')[0]}` : 'sign in'}
          </Menu.Item>
          <Menu.Item
            name='film'
            as={Link} to='/movies'
          >
            <Icon name='film' />
            movies
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
              handleSearchChange={handleSearchChange}
              searchTerm={searchTerm}
              handleScroll={handleScroll}
              page={moviesPage}
            />
          }
          />
          <Route exact path='/users' render={props =>
            <UsersContainer
              {...props}
              users={users}
              handleUserClick={handleUserClick}
            />
          }
          />
          <Route path='/users/:id' render={props => {
            const id = parseInt(props.match.params.id, 10)
            const user = users.find(u => u.id === id)
            return <UserProfile
              user={user}
              users={users}
              movies={currentUserMovies}
              currentUser={currentUser}
              {...props} />
          }} />
          <Route path='/movies/:id' render={props => {
            const id = parseInt(props.match.params.id, 10)
            let movie = movies.find(m => m.id === id)
            if (!movie) { movie = currentUserMovies.find(m => m.id === id) }
            if (movies.length === 0) return <h1>Loading...</h1>
            if (movies.length > 0 && movie === undefined) {
              return <h1 style={{ color: 'white' }}>movie not found</h1>
            }

            return <MovieDetails
              movie={movie}
              currentUser={currentUser}
              handleRating={handleRating}
              handleWatched={handleWatched}
              {...props}
            />
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
