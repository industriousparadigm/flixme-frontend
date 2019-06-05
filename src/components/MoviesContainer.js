import React, { Fragment } from 'react'
import MovieCard from './MovieCard'
import { Card, Search } from 'semantic-ui-react'
import _ from 'lodash'

const MoviesContainer = props => {
  const { movies, handleSearchChange } = props

  const renderCards = () =>
    movies.map(movie =>
      <MovieCard key={movie.id} movie={movie} />
    )

  return (
    <Fragment>
      <Search
        onSearchChange={_.debounce(handleSearchChange, 500)}
        size='massive'
        showNoResults={false}
        className='movieSearch'
      />
      <Card.Group itemsPerRow={5} className='moviesContainer' centered >
        {renderCards()}
      </Card.Group>

    </Fragment>
  )
}

export default MoviesContainer