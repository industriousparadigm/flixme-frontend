import React, { Component } from 'react'
import { Route, Switch, Link } from 'react-router-dom'
import '../App.css'
import API from '../api/API'
import MoviesContainer from './MoviesContainer'
import MovieDetails from './MovieDetails'
import Choices from './Choices';
import UserProfile from './UserProfile'

class App extends Component {
  state = {
    movies: [],
    searchTerm: '',
    currentUser: null
  }

  componentDidMount() {
    API.getUser(2)
      .then(currentUser => this.setState({ currentUser }))
      .then(API.getMovies()
        .then(this.renderMovies)
      )
  }

  renderMovies = json => {
    const movies = this.appendRatingsToMovies(json)
    this.setState({ movies })
  }

  appendRatingsToMovies = json => {
    const { currentUser } = this.state
    json.forEach(movie => {
      const movieWatched = currentUser.movies_watched.find(m => m.movie_id === movie.id)
      movieWatched
        ? this.appendRatingToMovie(movie, movieWatched.rating)
        : this.appendRatingToMovie(movie, null)
    })
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

  handleScroll = page => {
    !this.state.searchTerm && API.getMovies(API.moviesURL + `?page=${page}`)
      .then(this.appendMovies)
  }

  handleRating = (event, { movieid, rating }) => {
    API.postRating(this.state.currentUser.id, movieid, rating)
      .then(this.changeRating(movieid, rating))
  }

  render() {
    const { movies, searchTerm, currentUser } = this.state
    const { handleSearchChange, handleScroll, handleRating } = this

    return (
      <div className="App">
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
              currentUser={currentUser}
              handleSearchChange={handleSearchChange}
              searchTerm={searchTerm}
              handleScroll={handleScroll}
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
              {...props}
            />
          }} />

          <Route component={props => <img src='http://www.404lovers.com/wp-content/uploads/2014/08/batman-3ddotde-1170x563.jpg' alt='404 not found'></img>} />
        </Switch>
      </div>
    )
  }
}

export default App
