import React, { Component } from 'react'
import { Route, Switch, Link, withRouter } from 'react-router-dom'
import { Menu, Icon } from 'semantic-ui-react'
import '../App.css'
import API from '../api/API'
import MoviesContainer from './MoviesContainer'
import MovieDetails from './MovieDetails'
import Choices from './Choices';
import UserProfile from './UserProfile'
import SignUp from './SignUp'
import SignIn from './SignIn'

class App extends Component {
  state = {
    movies: [],
    page: 1,
    searchTerm: '',
    currentUser: null,
    activeItem: ''
  }

  signIn = userId =>
    API.getUser(userId)
      .then(currentUser => this.setState({ currentUser, page: 1 }, () => {
        API.getMovies()
          .then(this.renderMovies)
      }))

  signOut = () => {
    this.setState({ currentUser: null })
    localStorage.removeItem('token')
  }

  componentDidMount() {
    API.validate()
      .then(data => {
        if (data.error) {
          API.getMovies()
            .then(this.renderMovies)
        } else {
          this.signIn(data.userId)
        }
      })
  }

  renderMovies = json => {
    const movies = this.appendRatingsToMovies(json)
    this.setState({ movies, page: 1 })
  }

  appendRatingsToMovies = json => {
    const { currentUser } = this.state
    currentUser
      ? json.forEach(movie => {
        const movieWatched = currentUser.movies_watched.find(m => m.movie_id === movie.id)
        movieWatched
          ? this.appendRatingToMovie(movie, movieWatched.rating)
          : this.appendRatingToMovie(movie, null)
      })
      : json.forEach(movie =>
        this.appendRatingToMovie(movie, null)
      )

    return json
  }

  appendRatingToMovie = (movie, rating) => {
    movie.current_user_rating = rating
  }

  appendMovies = json => {
    const movies = ([...this.state.movies].concat(this.appendRatingsToMovies(json)))
    this.setState({ movies })
  }

  changeRating = (movieId, rating) => {
    const movies = [...this.state.movies]
    movies.find(m => m.id === movieId).current_user_rating = rating
    this.setState({ movies })
  }

  handleSearchChange = (event, { value }) => {
    // return default movies in case search is empty or spaces only
    if (value.replace(/\s/g, "").length === 0) {
      API.getMovies()
        .then(this.renderMovies)
    } else {
      API.getMovies(API.searchURL + value)
        .then(json => {
          json !== undefined
            ? this.renderMovies(json)
            : this.setState({ movies: [] })
        })
    }
    this.setState({ searchTerm: value })
  }

  handleScroll = () => {
    const { page } = this.state
    !this.state.searchTerm && API.getMovies(API.moviesURL + `?page=${page + 1}`)
      .then(this.appendMovies)
    this.setState({ page: this.state.page + 1 })
  }

  handleRating = (event, { movieid, rating }) => {
    API.postRating(this.state.currentUser.id, movieid, rating)
      .then(this.changeRating(movieid, rating))
  }

  handleWatched = movieId => {
    const { currentUser, movies } = this.state
    if (movies.find(m => m.id === movieId).current_user_rating !== null) {
      console.log('deleted the watch')
      API.deleteRating(currentUser.id, movieId)
        .then(this.changeRating(movieId, null))
    } else {
      console.log('created a watch')
      API.postRating(currentUser.id, movieId, 0)
        .then(this.changeRating(movieId, 0))
    }
  }

  // handleSignOut = () => {
  //   this.signOut()
  // }

  render() {
    const { movies, page, searchTerm, currentUser, activeItem } = this.state
    const { handleSearchChange, handleScroll, handleRating, handleWatched, signIn, signOut } = this

    return (
      <div className="App">
        <Menu icon='labeled' vertical floated='right' className='iconMenu'>
          {
            !currentUser && <Menu.Item
              name='signup'
              active={activeItem === 'signup'}
              as={Link} to={'/signup'}
            >
              <Icon name='signup' />
              sign up
          </Menu.Item>
          }
          <Menu.Item
            name='user'
            active={activeItem === 'user'}
            onClick={() => {
              currentUser
                ? signOut()
                : this.props.history.push('/signin')
            }}
          >
            <Icon name='user' />
            {currentUser ? `${currentUser.name.split(' ')[0]} - sign out` : 'sign in'}
          </Menu.Item>
          <Menu.Item
            name='film'
            active={activeItem === 'film'}
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
            <Choices
              {...props}
            />
          } />
          <Route exact path='/movies' render={props =>
            <MoviesContainer
              {...props}
              movies={movies}
              handleSearchChange={handleSearchChange}
              searchTerm={searchTerm}
              handleScroll={handleScroll}
              page={page}
            />
          }
          />
          <Route
            path='/users/:username'
            render={props => {
              return <UserProfile user={currentUser} {...props} />
              // const username = props.match.params.username
            }} />
          <Route path='/movies/:id' render={props => {
            const id = parseInt(props.match.params.id, 10)
            const movie = movies.find(m => m.id === id)
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
