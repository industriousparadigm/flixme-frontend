import React from 'react'

const Search = props => {
  return (
    <div className="flexsearch">
      <div className="flexsearch--wrapper">
        <form className="flexsearch--form">
          <div className="flexsearch--input-wrapper">
            <input
              onChange={props.handleSearch}
              className="flexsearch--input"
              type="search"
              placeholder="find movies"

            />
          </div>
          {/* <input className="flexsearch--submit" type="submit" value="&#10140;" /> */}
        </form>
      </div>
    </div>
  )
}

export default Search
