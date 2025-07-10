import {useState, useEffect, useCallback} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import debounce from 'lodash.debounce'

import Header from '../Header'
import FailureView from '../FailureView'
import Footer from '../Footer'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const SearchFilter = () => {
  const [searchValue, setSearchValue] = useState('')
  const [searchMovies, setSearchMovies] = useState([])
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)

  const getSearchMovies = async value => {
    if (value.trim() === '') {
      setSearchMovies([])
      setApiStatus(apiStatusConstants.success)
      return
    }
    setApiStatus(apiStatusConstants.inProgress)

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/movies-app/movies-search?search=${value}`

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(apiUrl, options)

    if (response.ok) {
      const data = await response.json()
      const updatedData = data.results.map(each => ({
        id: each.id,
        title: each.title,
        posterPath: each.poster_path,
        backdropPath: each.backdrop_path,
      }))
      setSearchMovies(updatedData)
      setApiStatus(apiStatusConstants.success)
    } else {
      setApiStatus(apiStatusConstants.failure)
    }
  }

  const debouncedSearch = useCallback(
    debounce(value => {
      getSearchMovies(value)
    }, 500),
    [],
  )

  const handleSearchInput = text => {
    setSearchValue(text)
    debouncedSearch(text)
  }

  const onRetry = () => {
    getSearchMovies(searchValue)
  }

  const renderFailureView = () => <FailureView onRetry={onRetry} />

  const renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="TailSpin" height={35} width={380} color=" #D81F26" />
    </div>
  )

  const renderNotFoundMovies = () => (
    <div className="search-heading-container">
      <img
        src="https://res.cloudinary.com/dyx9u0bif/image/upload/v1657092588/Group_7394_jzwy1v.png"
        alt="no movies"
        className="search-not-found-image"
      />
      <h1 className="search-not-found-heading">
        Your search for <span style={{color: '#fff'}}>{searchValue}</span> did
        not find any matches.
      </h1>
    </div>
  )

  const renderResultsView = () => (
    <div className="search-filter-bg-container">
      <div className="search-filter-movies-list-container">
        <ul className="search-filter-ul-container">
          {searchMovies.map(each => (
            <Link to={`/movies/${each.id}`} key={each.id}>
              <li className="search-filter-li-item">
                <img
                  className="search-poster"
                  src={each.posterPath}
                  alt={each.title}
                />
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  )

  const renderSuccessView = () => {
    const isEmpty = searchValue.trim() === ''
    if (isEmpty) {
      return (
        <div className="search-filter-initial-no-search">
          <p className="empty-text">
            Search the movie by typing in the search bar
          </p>
        </div>
      )
    }

    return searchMovies.length > 0
      ? renderResultsView()
      : renderNotFoundMovies()
  }

  const renderSearchResults = () => {
    switch (apiStatus) {
      case apiStatusConstants.success:
        return renderSuccessView()
      case apiStatusConstants.failure:
        return renderFailureView()
      case apiStatusConstants.inProgress:
        return renderLoadingView()
      default:
        return null
    }
  }

  return (
    <div className="search-filter-bg-container">
      <Header searchInput={handleSearchInput} />
      {renderSearchResults()}
      <Footer />
    </div>
  )
}

export default SearchFilter
