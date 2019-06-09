import React, { Component } from 'react'
import '../App.css'
import MoviesContainer from './MoviesContainer'
import MovieDetails from './MovieDetails'
import Choices from './Choices';
import UserProfile from './UserProfile'

import { Route, Switch, Link } from 'react-router-dom'

import { Menu, Icon } from 'semantic-ui-react'


// const API_KEY = process.env.REACT_APP_TMDB_KEY

const onlyUnique = (value, index, self) => {
  return self.indexOf(value) === index;
}

class App extends Component {
  state = {
    movies: [],
    searchTerm: '',
    currentUser: null,
    activeItem: null
  }

  moviesURL = 'http://localhost:3017/movies'
  searchURL = 'http://localhost:3017/movie_search?search='
  usersURL = 'http://localhost:3017/users'

  componentDidMount() {
    this.getMovies(this.moviesURL)
      .then(this.renderMovies)
    this.getUser(this.usersURL + "/2")
      .then(currentUser => {
        this.setState({ currentUser })
      })
  }

  getMovies = (url) =>
    fetch(url)
      .then(resp => resp.json())

  getUser = (url) =>
    fetch(url)
      .then(resp => resp.json())

  renderMovies = json => {
    const movies = json
    this.setState({ movies })
  }

  appendMovies = json => {
    const movies = ([...this.state.movies].concat(json)).filter(onlyUnique)
    this.setState({ movies })
  }

  getUserMovieRating = movieId => {
    return fetch(this.usersURL + `/${this.state.currentUser.id}`)
      .then(resp => resp.json())
      .then(user => {
        const movieWatched = user.movies_watched.find(mw => mw.movie_id === movieId)
        movieWatched && console.log(movieWatched.rating)
        return movieWatched
          ? movieWatched.rating
          : 0
      })
  }

  handleSearchChange = (event, { value }) => {
    // return default movies in case search is empty or spaces only
    if (value.replace(/\s/g, "").length === 0) {
      this.getMovies(this.moviesURL)
        .then(this.renderMovies)
    } else {
      this.getMovies(this.searchURL + value)
        .then(movies => {
          console.log(movies)
          movies !== undefined && this.setState({
            movies
          })
        })
    }
    this.setState({ searchTerm: value })
  }

  handleScroll = page => {
    !this.state.searchTerm && this.getMovies(this.moviesURL + `?page=${page}`)
      .then(this.appendMovies)
  }

  handleItemClick = event => {
    console.log(event.target)
  }

  render() {
    const { movies, searchTerm, activeItem, currentUser } = this.state
    const { handleSearchChange, handleScroll } = this

    return (
      <div className="App">
        <Menu className='App-navbar' compact icon='labeled' inverted>
          <Menu.Item name='home' active={activeItem === 'home'} onClick={this.handleItemClick}>
            <Icon name='home' />
            home
          </Menu.Item>

          <Menu.Item
            name='film'
            active={activeItem === 'film'}
            onClick={this.handleItemClick}
          >
            <Icon name='film' />
            movies
        </Menu.Item>

          <Menu.Item
            name='user'
            active={activeItem === 'user'}
            onClick={this.handleItemClick}
          >
            <Icon name='user' />
            profile
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
            />
          }
          />
          <Route
            path='/movies/:id'
            render={props => {
              const id = parseInt(props.match.params.id, 10)
              const movie = movies.find(movie => movie.id === id)
              if (movies.length === 0) return <h1>Loading...</h1>
              if (movies.length > 0 && movie === undefined) {
                return <h1>movie not found</h1>
              }
              return <MovieDetails
                movie={movie}
                currentUser={currentUser}
                userRating={this.getUserMovieRating(movie.id)}
                {...props}
              />
            }} />
          <Route
            path='/users/:username'
            render={props => {
              return <UserProfile user={currentUser} {...props} />
              // const username = props.match.params.username
            }} />

          <Route component={props => <img src='http://www.404lovers.com/wp-content/uploads/2014/08/batman-3ddotde-1170x563.jpg' alt='404 not found'></img>} />
        </Switch>
      </div>
    )
  }
}

export default App
