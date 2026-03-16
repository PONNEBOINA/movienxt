import {useEffect, useState} from 'react'
import {withRouter, Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {FaPlay} from 'react-icons/fa'
import FailureView from '../FailureView'
import Header from '../Header'
import MovieDetail from '../MovieDetail'
import Footer from '../Footer'
import TrailerModal from '../TrailerModal'
import InlineTrailerPreview from '../InlineTrailerPreview'
import useTrailerPreview from '../../hooks/useTrailerPreview'
import {openTrailerInModal} from '../../utils/trailerUtils'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const SimilarMovieCard = ({movie}) => {
  const {
    trailerKey,
    showPreview,
    handleMouseEnter,
    handleMouseLeave
  } = useTrailerPreview(movie, 800)

  const [showFullTrailer, setShowFullTrailer] = useState(false)

  const handleExpandTrailer = (trailerKey, title) => {
    setShowFullTrailer(true)
  }

  const handleCloseFullTrailer = () => {
    setShowFullTrailer(false)
  }

  return (
    <>
      <li 
        className="popular-li-item"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Link to={`/movies/${movie.id}`} target="_blank">
          <img
            className="popular-poster"
            src={movie.posterPath}
            alt={movie.title}
          />
        </Link>
        
        <InlineTrailerPreview
          trailerKey={trailerKey}
          movieTitle={movie.title}
          isVisible={showPreview}
          onExpand={handleExpandTrailer}
          autoPlay={true}
          showControls={true}
        />
      </li>
      
      {showFullTrailer && (
        <TrailerModal
          videoKey={trailerKey}
          onClose={handleCloseFullTrailer}
          title={movie.title}
        />
      )}
    </>
  )
}

const MovieItemDetails = props => {
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)
  const [movieDetails, setMovieDetails] = useState([])
  const [genres, setGenres] = useState([])
  const [spokenLanguages, setSpokenLanguages] = useState([])
  const [similarMovies, setSimilarMovies] = useState([])
  const [showTrailer, setShowTrailer] = useState(false)
  const [trailerKey, setTrailerKey] = useState('')

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
        trailerKey: data.movie_details.trailer_key || null,
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

  const handlePlayTrailer = async () => {
    const movie = movieDetails[0]
    
    // Show loading state
    setApiStatus(apiStatusConstants.inProgress)
    
    try {
      await openTrailerInModal(
        movie?.title,
        movie?.trailerKey,
        (trailerKey, title) => {
          setTrailerKey(trailerKey)
          setShowTrailer(true)
          setApiStatus(apiStatusConstants.success)
        },
        movie?.id,
        movie?.releaseDate ? new Date(movie.releaseDate).getFullYear() : null
      )
    } catch (error) {
      console.error('Error loading trailer:', error)
      setApiStatus(apiStatusConstants.success)
      // Show no trailer available message
      alert('Sorry, no trailer is available for this movie.')
    }
  }

  const handleCloseTrailer = () => {
    setShowTrailer(false)
    setTrailerKey('')
  }

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
            <MovieDetail 
              movieDetails={each} 
              key={each.id} 
              onPlayTrailer={handlePlayTrailer}
            />
          ))}
        </div>
        <div className="additional-movie-info-container additional-info-sm-container">
          <div className="trailer-section">
            <button
              className="watch-trailer-btn"
              onClick={handlePlayTrailer}
              type="button"
            >
              <FaPlay className="play-icon" />
              Watch Trailer
            </button>
          </div>
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
            {similarMovies.map(movie => (
              <SimilarMovieCard key={movie.id} movie={movie} />
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
      </div>
      <Footer />
      {showTrailer && (
        <TrailerModal
          videoKey={trailerKey}
          onClose={handleCloseTrailer}
          title={movieDetails[0]?.title}
        />
      )}
    </div>
  )
}

export default withRouter(MovieItemDetails)
