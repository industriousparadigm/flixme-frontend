import React, { Fragment } from 'react'
import MovieCard from './MovieCard'
import { Card, Search } from 'semantic-ui-react'
import _ from 'lodash'
import InfiniteScroll from 'react-infinite-scroller'

const MoviesContainer = props => {
  const { movies, handleSearchChange, searchTerm, handleScroll } = props

  const renderCards = () =>
    movies.length > 0 && movies.map(movie =>
      <MovieCard key={movie.id} movie={movie} />
    )

  return (
    <Fragment>
      <Search
        onSearchChange={_.debounce(handleSearchChange, 500)}
        size='massive'
        showNoResults={false}
        className='movieSearch'
        defaultValue={searchTerm}
      />
      <InfiniteScroll
        pageStart={1}
        initialLoad={false}
        loadMore={handleScroll}
        hasMore={true || false}
        loader={!searchTerm ? <div className="loader" key={0}>Loading ...</div> : null}
      >
        <Card.Group itemsPerRow={5} className='moviesContainer' centered >
          {renderCards()}
        </Card.Group>
      </InfiniteScroll>
    </Fragment>
  )
}

export default MoviesContainer