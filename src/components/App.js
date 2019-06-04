import React, { Component } from 'react'
import '../App.css'
import MoviesContainer from './MoviesContainer'
import MovieDetails from './MovieDetails'

import { Route, Switch } from 'react-router-dom'
import Choices from './Choices';

class App extends Component {
  state = {
    movies: [],
    searchTerm: ''
  }

  moviesURL = 'https://api.themoviedb.org/3/discover/movie?api_key=b90e3d41e6ca35ff7dbd3597740c1ca6&language=en-US&sort_by=popularity.desc&include_video=false&page=1'

  searchURL = 'https://api.themoviedb.org/3/search/movie?api_key=b90e3d41e6ca35ff7dbd3597740c1ca6&language=en-US&page=1&query='

  componentDidMount () {
    this.getMovies(this.moviesURL)
      .then(this.renderMovies)
  }

  getMovies = url =>
    fetch(url)
      .then(resp => resp.json())

  renderMovies = json => {
    this.setState({ movies: json.results })
  }
      
  handleSearchChange = (event, { value }) => {
      this.getMovies(this.searchURL + value)
        .then(json => json.results !== undefined && this.setState({
          movies: json.results
        }))
  }
  
  render() { 
    const { movies, searchTerm } = this.state
    const { handleSearchChange } = this

    return (
      <div className="App">
        <header className="App-header">
          <h1>flix me</h1>
        </header>
        <Switch>
          <Route exact path='/' render={props =>
            <Choices
              {...props}
            />
          } />
          <Route exact path='/movies' component={props =>
            <MoviesContainer
              {...props}
              movies={movies}
              handleSearchChange={handleSearchChange}
            />
          }
          />
          <Route path='/movies/:id' component={props => {
            const id = parseInt(props.match.params.id, 10)
            const movie = movies.find(movie => movie.id === id)
            if (movies.length === 0) return <h1>Loading...</h1>
            if (movies.length > 0 && movie === undefined) {
              console.log(id)
              return <h1>movie not found</h1>
            }
            return <MovieDetails movie={movie} {...props} />
          }} />
          <Route component={props => <h1>404 - Not Found</h1>}/>
        </Switch>
      </div>
    )
  }
}
 
export default App
