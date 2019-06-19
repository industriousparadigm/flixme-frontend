class API {
  static baseURL = 'http://localhost:3017'
  static moviesURL = this.baseURL + '/movies'
  static filtersURL = this.baseURL + '/movies_filtered'
  static searchURL = this.baseURL + '/movie_search?search='
  static usersURL = this.baseURL + '/users'
  static genresURL = this.baseURL + '/genres'
  static rateMovieURL = this.baseURL + '/rate_movie'
  static deleteMovieURL = this.baseURL + '/forget_movie'
  static signInURL = this.baseURL + '/signin'
  static validateURL = this.baseURL + '/validate'
  static friendRequestURL = this.baseURL + '/add_friend'
  static friendDeletionURL = this.baseURL + '/delete_friend'

  static posterURL = 'http://image.tmdb.org/t/p/w300'
  static genericPosterURL = 'https://i.pinimg.com/originals/b3/5f/c9/b35fc9dee41f17718303d5a5ea11e0a4.jpg'


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
  static getUser = (userId) =>
    fetch(this.usersURL + `/${userId}`)
      .then(resp => resp.json())

  static getUsers = () =>
    fetch(this.usersURL)
      .then(resp => resp.json())

  static editUser = user =>
    fetch(this.usersURL + `/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    }).then(resp => resp.json())

  static getGenres = () =>
    fetch(this.genresURL)
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

  static initiateFriendship = (requesterId, receiverId) => {
    const data = { requesterId, receiverId }
    return fetch(this.friendRequestURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(resp => resp.json())
  }

  static terminateFriendship = (requesterId, receiverId) => {
    const data = { requesterId, receiverId }
    return fetch(this.friendDeletionURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(resp => resp.json())
  }
}

export default API
