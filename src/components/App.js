import React, { Component } from 'react'
import '../App.css'
import MoviesContainer from './MoviesContainer'
import MovieDetails from './MovieDetails'
import Choices from './Choices';
import UserProfile from './UserProfile'

import { Route, Switch, Link } from 'react-router-dom'

const API_KEY = process.env.REACT_APP_TMDB_KEY

const onlyUnique = (value, index, self) => {
  return self.indexOf(value) === index;
}

class App extends Component {
  state = {
    movies: [],
    searchTerm: ''
  }

  moviesURL = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&include_video=false&page=`
  searchURL = 'https://api.themoviedb.org/3/search/movie?api_key=b90e3d41e6ca35ff7dbd3597740c1ca6&language=en-US&page=1&query='

  componentDidMount() {
    this.getMovies(this.moviesURL + "1")
      .then(this.renderMovies)
  }

  getMovies = (url) =>
    fetch(url)
      .then(resp => resp.json())

  renderMovies = json => {
    const movies = json.results
    this.setState({ movies })
  }

  appendMovies = json => {
    const movies = ([...this.state.movies].concat(json.results)).filter(onlyUnique)
    this.setState({ movies })
  }

  handleSearchChange = (event, { value }) => {
    // return default movies in case search is empty or spaces only
    if (value.replace(/\s/g, "").length === 0) {
      return this.getMovies(this.moviesURL)
        .then(this.renderMovies)
    }
    this.getMovies(this.searchURL + value)
      .then(json => json.results !== undefined && this.setState({
        movies: json.results,
        searchTerm: value
      }))
  }

  handleScroll = page => {
    this.getMovies(this.moviesURL + `${page}`)
      .then(this.appendMovies)
  }

  render() {
    const { movies, searchTerm } = this.state
    const { handleSearchChange, handleScroll } = this

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
                console.log(id)
                return <h1>movie not found</h1>
              }
              return <MovieDetails movie={movie} {...props} />
            }} />
          <Route
            path='/users/:username'
            render={props => {
              const username = props.match.params.username
              const user = { username }
              return <UserProfile user={user} {...props} />
            }} />

          <Route component={props => <img src='http://www.404lovers.com/wp-content/uploads/2014/08/batman-3ddotde-1170x563.jpg' alt='404 not found'></img>} />
        </Switch>
      </div>
    )
  }
}

export default App
