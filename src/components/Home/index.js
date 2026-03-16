import {useState, useEffect} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import HomePoster from '../HomePoster'
import Header from '../Header'
import './index.css'
import FailureView from '../FailureView'
import Trending from '../TrendingView'
import Originals from '../Originals'
import Footer from '../Footer'
import TrailerModal from '../TrailerModal'
import InlineTrailerPreview from '../InlineTrailerPreview'
import useTrailerPreview from '../../hooks/useTrailerPreview'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const Home = () => {
  const [initialPoster, setInitialPoster] = useState({})
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)
  const [showFullTrailer, setShowFullTrailer] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  
  const {
    trailerKey,
    showPreview,
    handleMouseEnter,
    handleMouseLeave
  } = useTrailerPreview(initialPoster, 1000)

  const getHomePagePoster = async () => {
    setApiStatus(apiStatusConstants.inProgress)

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/movies-app/originals'

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(apiUrl, options)

    if (response.ok) {
      const data = await response.json()
      const randomPoster =
        data.results[Math.floor(Math.random() * data.results.length)]

      const updatedData = {
        id: randomPoster.id,
        overview: randomPoster.overview,
        backdropPath: randomPoster.backdrop_path,
        title: randomPoster.title,
        posterPath: randomPoster.poster_path,
      }

      setInitialPoster(updatedData)
      setApiStatus(apiStatusConstants.success)
    } else {
      setApiStatus(apiStatusConstants.failure)
    }
  }

  useEffect(() => {
    getHomePagePoster()
  }, [])

  const handlePlayTrailer = () => {
    if (trailerKey) {
      setShowFullTrailer(true)
    }
  }

  const handleExpandTrailer = (trailerKey, title) => {
    setShowFullTrailer(true)
  }

  const handleCloseTrailer = () => {
    setShowFullTrailer(false)
  }

  const onRetry = () => {
    getHomePagePoster()
  }

  const renderFailureView = () => <FailureView onRetry={onRetry} />

  const renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader
        type="TailSpin"
        height={35}
        width={380}
        color="#D81F26"
        data-testid="loader"
      />
    </div>
  )

  const renderSuccessView = () => (
    <div 
      className="home-poster-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <HomePoster poster={initialPoster} onPlayTrailer={handlePlayTrailer} />
      <InlineTrailerPreview
        trailerKey={trailerKey}
        movieTitle={initialPoster?.title}
        isVisible={showPreview}
        onExpand={handleExpandTrailer}
        autoPlay={true}
        showControls={true}
      />
    </div>
  )

  const renderHomePoster = () => {
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
    <div className="root-container" data-testid="loader">
      <Header />
      <div className="home-sizes-container">{renderHomePoster()}</div>
      <div>
        <div>
          <h1 className="trending-now-heading">Trending Now</h1>
          <Trending />
        </div>
        <div>
          <h1 className="originals-heading">Originals</h1>
          <Originals />
        </div>
      </div>
      <Footer />
      {showFullTrailer && (
        <TrailerModal
          videoKey={trailerKey}
          onClose={handleCloseTrailer}
          title={initialPoster?.title}
        />
      )}
    </div>
  )
}

export default Home
