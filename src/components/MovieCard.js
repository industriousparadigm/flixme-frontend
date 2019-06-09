import React from 'react'
import { Card, Image } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

const MovieCard = props => {
  const posterURL = 'http://image.tmdb.org/t/p/w300'
  const genericPosterURL = 'https://i.pinimg.com/originals/b3/5f/c9/b35fc9dee41f17718303d5a5ea11e0a4.jpg'

  const { id, poster_path, title, release_date, overview, vote_average } = props.movie

  return (
    <Card link as={Link} to={`/movies/${id}`}>

      <Image src={
        poster_path
          ? posterURL + poster_path
          : genericPosterURL
      } wrapped ui={false} />
      {/* <Card.Content>
        <Card.Header>{title}</Card.Header>
        <Card.Meta>{release_date.slice(0, 4)}</Card.Meta>
        <Card.Description>
          {overview.slice(0, 120) + '... '}
          <a>read more</a>
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <a>
          <Icon name='like' />
          {vote_average.toFixed(1)}
        </a>
      </Card.Content> */}
    </Card>

  )
}

export default MovieCard