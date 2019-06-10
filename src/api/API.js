class API {
  static baseURL = 'http://localhost:3017'
  static moviesURL = API.baseURL + '/movies'
  static searchURL = API.baseURL + '/movie_search?search='
  static usersURL = API.baseURL + '/users'
  static rateMovieURL = 'http://localhost:3017/rate_movie'
  static posterURL = 'http://image.tmdb.org/t/p/w300'

  static getMovies = (url = this.moviesURL) =>
    fetch(url)
      .then(resp => resp.json())

  static getMovie = movieId =>
    fetch(this.moviesURL + `/${movieId}`)
      .then(resp => resp.json())

  // this is to be changed once user login becomes a thing
  static getUser = (id = 2) =>
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

  static deleteRating = (userId, movieId, rating) => {
    console.log('rating would clear now')
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
