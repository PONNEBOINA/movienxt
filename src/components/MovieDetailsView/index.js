import {useEffect, useState} from 'react'
import {withRouter, Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import FailureView from '../FailureView'
import Header from '../Header'
import MovieDetail from '../MovieDetail'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const MovieItemDetails = props => {
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)
  const [movieDetails, setMovieDetails] = useState([])
  const [genres, setGenres] = useState([])
  const [spokenLanguages, setSpokenLanguages] = useState([])
  const [similarMovies, setSimilarMovies] = useState([])

  const {match} = props
  const {params} = match
  const {id} = params

  const getMovieDetails = async () => {
    setApiStatus(apiStatusConstants.inProgress)
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/movies-app/movies/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = {
        id: data.movie_details.id,
        backdropPath: data.movie_details.backdrop_path,
        budget: data.movie_details.budget,
        title: data.movie_details.title,
        overview: data.movie_details.overview,
        originalLanguage: data.movie_details.original_language,
        releaseDate: data.movie_details.release_date,
        count: data.movie_details.vote_count,
        rating: data.movie_details.vote_average,
        runtime: data.movie_details.runtime,
        posterPath: data.movie_details.poster_path,
      }

      const genresData = data.movie_details.genres.map(each => ({
        id: each.id,
        name: each.name,
      }))

      const languagesData = data.movie_details.spoken_languages.map(each => ({
        id: each.id,
        language: each.english_name,
      }))

      const similarData = data.movie_details.similar_movies.map(each => ({
        id: each.id,
        title: each.title,
        posterPath: each.poster_path,
      }))

      setMovieDetails([updatedData])
      setGenres(genresData)
      setSpokenLanguages(languagesData)
      setSimilarMovies(similarData.slice(0, 6))
      setApiStatus(apiStatusConstants.success)
    } else {
      setApiStatus(apiStatusConstants.failure)
    }
  }

  useEffect(() => {
    getMovieDetails()
  }, [id])

  const onRetry = () => {
    getMovieDetails()
  }

  const renderFailureView = () => <FailureView onRetry={onRetry} />

  const renderLoadingView = () => (
    <div className="loader-container">
      <Loader
        testid="loader"
        type="TailSpin"
        height={35}
        width={380}
        color="#D81F26"
      />
    </div>
  )

  const renderSuccessView = () => {
    const newMovieDetails = {...movieDetails[0]}
    const {releaseDate, count, rating, budget} = newMovieDetails
    const d = new Date(releaseDate)
    const monthName = d.toLocaleString('default', {month: 'long'})
    const day = d.getDate()
    const year = d.getFullYear()

    let dateEndingWord = 'th'
    if (day === 1) {
      dateEndingWord = 'st'
    } else if (day === 2) {
      dateEndingWord = 'nd'
    } else if (day === 3) {
      dateEndingWord = 'rd'
    }

    return (
      <>
        <div>
          {movieDetails.map(each => (
            <MovieDetail movieDetails={each} key={each.id} />
          ))}
        </div>
        <div className="additional-movie-info-container additional-info-sm-container">
          <ul className="each-genre-ul-container">
            <h1 className="movie-info-genre-heading">Genres</h1>
            {genres.map(each => (
              <li className="movie-info-each-genre" key={each.id}>
                <p>{each.name}</p>
              </li>
            ))}
          </ul>
          <ul className="each-genre-ul-container">
            <h1 className="movie-info-genre-heading">Audio Available</h1>
            {spokenLanguages.map(each => (
              <li className="movie-info-each-genre" key={each.id}>
                <p>{each.language}</p>
              </li>
            ))}
          </ul>
          <div className="each-genre-ul-container">
            <h1 className="movie-info-rating-count-heading">Rating Count</h1>
            <p className="movie-info-rating-count">{count}</p>
            <h1 className="movie-info-rating-avg-heading">Rating Average</h1>
            <p className="movie-info-rating">{rating}</p>
          </div>
          <div className="each-genre-ul-container">
            <h1 className="movie-info-budget-heading">Budget</h1>
            <p className="movie-info-budget">{budget}</p>
            <h1 className="movie-info-release-date">Release Date</h1>
            <p>
              <span className="movie-info-date">{day}</span>
              <span className="movie-info-date-end">{dateEndingWord}</span>
              <span className="movie-info-month-name">{monthName}</span>
              <span className="movie-info-year">{year}</span>
            </p>
          </div>
        </div>

        <div className="similar-movies-container">
          <h1 className="more-like-this">More like this</h1>
          <ul className="popular-ul-container similar-ul-container">
            {similarMovies.map(each => (
              <Link to={`/movies/${each.id}`} key={each.id} target="blank">
                <li className="popular-li-item">
                  <img
                    className="popular-poster"
                    src={each.posterPath}
                    alt={each.title}
                  />
                </li>
              </Link>
            ))}
          </ul>
        </div>
      </>
    )
  }

  const renderMovieDetailSection = () => {
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
    <div className="dummy" data-testid="loader">
      <Header />
      <div className="root-container">
        <div
          className="video-details-view-container"
          data-testid="videoItemDetails"
        >
          {renderMovieDetailSection()}
        </div>
        <p>Contact us</p>
      </div>
    </div>
  )
}

export default withRouter(MovieItemDetails)
