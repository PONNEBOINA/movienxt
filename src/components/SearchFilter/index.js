import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
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

class SearchFilter extends Component {
  state = {
    searchValue: '',
    searchMovies: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getSearchMovies()
  }

  getSearchMovies = async () => {
    const {searchValue} = this.state

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/movies-app/movies-search?search=${searchValue}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      // console.log(data)
      const updatedData = data.results.map(each => ({
        posterPath: each.poster_path,
        title: each.title,
        id: each.id,
        backdropPath: each.backdrop_path,
      }))

      this.setState({
        searchMovies: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  searchInput = text => {
    this.setState(
      {
        searchValue: text,
      },
      this.getSearchMovies,
    )
  }

  onRetry = () => {
    this.getSearchMovies()
  }

  renderFailureView = () => <FailureView onRetry={this.onRetry} />

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="TailSpin" height={35} width={380} color=" #D81F26" />
    </div>
  )

  renderNotfoundMovies = () => {
    const {searchValue} = this.state
    console.log(searchValue)
    return (
      <div className="search-heading-container">
        <img
          src="https://res.cloudinary.com/dyx9u0bif/image/upload/v1657092588/Group_7394_jzwy1v.png"
          alt="no movies"
          className="search-not-found-image"
        />
        <h1 className="search-not-found-heading">
          Your search for {searchValue} did not find any matches.
        </h1>
      </div>
    )
  }

  renderResultsView = () => {
    const {searchMovies} = this.state
    return (
      <div>
        {searchMovies.length > 0 ? (
          <div>
            <div className="search-filter-bg-container">
              <div className="search-filter-movies-list-container">
                <ul className="search-filter-ul-container">
                  {searchMovies.map(each => (
                    <Link to={`/movies/${each.id}`} key={each.id}>
                      <li className="search-filter-li-item" key={each.id}>
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
          </div>
        ) : (
          this.renderNotfoundMovies()
        )}
      </div>
    )
  }

  renderSuccessView = () => {
    const {searchValue} = this.state
    const isEmpty = searchValue === ''
    console.log(isEmpty)
    return (
      <>
        {isEmpty ? (
          <div className="search-filter-initial-no-search">
            <p className="empty-text">
              Search the movie,by clicking on the search Icon
            </p>
          </div>
        ) : (
          this.renderResultsView()
        )}
      </>
    )
  }

  renderSearchMovies = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()

      default:
        return null
    }
  }

  render() {
    return (
      <div className="search-filter-bg-container">
        <Header searchInput={this.searchInput} />
        <div>{this.renderSearchMovies()}</div>
        <Footer />
      </div>
    )
  }
}
export default SearchFilter
