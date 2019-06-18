import React, { Fragment, useState, useEffect } from 'react'
import MovieCard from './MovieCard'
import { Card, Search, Form, Checkbox } from 'semantic-ui-react'
import _ from 'lodash'
import InfiniteScroll from 'react-infinite-scroller'

const MoviesContainer = props => {
  const { movies, page, handleSearchChange, searchTerm, handleScroll, PAGE_SIZE } = props

  const renderCards = () =>
    movies.length > 0 && movies.slice(0, PAGE_SIZE * page).map(movie =>
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
      {/* <Form className='movieFilters' size='massive'>
        <Form.Group widths='equal'>
          <Form.Input fluid placeholder="later than, e.g. 1999" />
          <Form.Input fluid placeholder='earlier than, e.g. 2013' />
          <Form.Select fluid options={[{ text: 'action' }, { text: 'crime' }, { text: 'history' }]} placeholder='genre' />
        </Form.Group>
      </Form>
 */}
      <InfiniteScroll
        pageStart={page}
        initialLoad={false}
        loadMore={handleScroll}
        hasMore={true || false}
        loader={!searchTerm ? <div className="loader" key={0}>flixing...</div> : null}
      >
        <Card.Group itemsPerRow={5} className='moviesContainer' centered >
          {renderCards()}
        </Card.Group>
      </InfiniteScroll>
    </Fragment>
  )
}

export default MoviesContainer