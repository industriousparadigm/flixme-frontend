class API {
  static baseURL = 'http://localhost:3017'
  static moviesURL = this.baseURL + '/movies'
  static searchURL = this.baseURL + '/movie_search?search='
  static usersURL = this.baseURL + '/users'
  static rateMovieURL = this.baseURL + '/rate_movie'
  static deleteMovieURL = this.baseURL + '/forget_movie'
  static signInURL = this.baseURL + '/signin'
  static validateURL = this.baseURL + '/validate'

  static posterURL = 'http://image.tmdb.org/t/p/w300'
  static selfHelpURL = 'https://www.youtube.com/results?search_query=selfhelp'


  static signIn(user) {
    return fetch(this.signInURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    }).then(resp => resp.json())
  }

  static signUp(user) {
    return fetch(this.usersURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    }).then(resp => resp.json())
  }

  static validate() {
    const token = localStorage.getItem('token')
    return fetch(this.validateURL, {
      headers: { Authorization: token },
    }).then(resp => resp.json())
  }

  static getMovies = (url = this.moviesURL) =>
    fetch(url)
      .then(resp => resp.json())

  static getMovie = movieId =>
    fetch(this.moviesURL + `/${movieId}`)
      .then(resp => resp.json())

  // this is to be changed once user login becomes a thing
  static getUser = (id = 1) =>
    fetch(this.usersURL + `/${id}`)
      .then(resp => resp.json())

  static postRating = (userId, movieId, rating) => {
    const data = { userId, movieId, rating }
    return fetch(this.rateMovieURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(resp => resp.json())
  }

  static deleteRating = (userId, movieId) => {
    const data = { userId, movieId }
    return fetch(this.deleteMovieURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(resp => resp.json())
  }

  static getUserMovieRating = (userId, movieId) =>
    fetch(this.usersURL + `/${userId}`)
      .then(resp => resp.json())
      .then(user => {
        const movieWatched = user.movies_watched.find(mw => mw.movie_id === movieId)
        movieWatched && console.log(movieWatched.rating)
        return movieWatched
          ? movieWatched.rating
          : 0
      })

}

export default API
