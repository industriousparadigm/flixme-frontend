import React, { Fragment, useState, useEffect } from 'react'
import MovieCard from './MovieCard'
import { Card, Search, Form, Checkbox, Button, Icon, Rating } from 'semantic-ui-react'
import _ from 'lodash'
import InfiniteScroll from 'react-infinite-scroller'
import Select from 'react-select'
import API from '../api/API'

const MoviesContainer = props => {
  const [minYear, setMinYear] = useState(null)
  const [maxYear, setMaxYear] = useState(null)
  const [selectedGenres, setSelectedGenres] = useState([])
  const [sorter, setSorter] = useState('')
  const [seenToggle, setSeenToggle] = useState(false)
  const [showFilters, setShowFilters] = useState(true)

  // useEffect(() => {
  //   if (movie && props.currentUser) {
  //     const userMovie = props.currentUser.movies.find(m => m.id === movie.id)
  //     if (userMovie) setUserRating(userMovie.user_rating)
  //   }
  //   props.currentUser && console.log(props.currentUser.movies.length)
  // }, [props.movie, props.currentUser, movie, userRating])



  const { movies, page, currentUser, reloadCurrentUser, genres, handleSearchChange, searchTerm, handleFilters, handleScroll, history } = props

  const renderCards = () =>
    movies.length > 0 && movies.map(movie =>
      currentUser && !currentUser.movies.find(m => m.id === movie.id)
        ? <MovieCard key={movie.id} movie={movie} currentUser={currentUser} reloadCurrentUser={reloadCurrentUser} inMoviesPage allowEdit />
        : !seenToggle && <MovieCard key={movie.id} movie={movie} currentUser={currentUser} reloadCurrentUser={reloadCurrentUser} inMoviesPage allowEdit />
    )

  const handleFilterSubmit = () => {
    let urlQueries = []
    if (minYear) urlQueries.push(`minYear=${minYear}`)
    if (maxYear) urlQueries.push(`maxYear=${maxYear}`)
    if (selectedGenres) urlQueries.push(`genres=${selectedGenres.join('%2C')}`)
    if (sorter) urlQueries.push(`sorter=${sorter}`)

    handleFilters(urlQueries.join('&'))
  }

  return (
    <Fragment>
      {
        !showFilters && <Search
          onSearchChange={_.debounce(handleSearchChange, 500)}
          size='massive'
          showNoResults={false}
          className='movieSearch'
          defaultValue={searchTerm}
        />
      }
      {
        showFilters && <Form className='movieFilters' >
          <Button floated='left' icon onClick={() => setSeenToggle(!seenToggle)}>
            <Icon name={seenToggle ? 'eye slash' : 'eye'} />
          </Button>

          <Form.Group>
            <Form.Input type='number' fluid placeholder="YYYY" width={2} onChange={(event, { value }) => setMinYear(value)} />
            <Form.Input type='number' fluid placeholder='YYYY' width={2} onChange={(event, { value }) => setMaxYear(value)} />
            <Form.Select
              options={[
                { key: 'pop', text: 'Popularity', value: 'popularity.desc' },
                { key: 'usr', text: 'User rating', value: 'vote_average.desc' },
                { key: 'rld', text: 'Release date', value: 'release_date.desc' },
              ]}
              placeholder='sort by'
              onChange={(event, { value }) => setSorter(value)}
              width={3}
            />
            <Select
              isMulti
              name="genres"
              options={genres}
              className="multiSelect"
              classNamePrefix="select"
              onChange={(event, { option }) => {
                if (option) {
                  setSelectedGenres([...selectedGenres, option.id])
                } else {
                  setSelectedGenres([])
                }
              }}
            />
            <Button onClick={handleFilterSubmit}>Apply</Button>
          </Form.Group>

        </Form>
      }

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