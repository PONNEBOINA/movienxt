import {useState, useEffect} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'

import FailureView from '../FailureView'
import Footer from '../Footer'
import Header from '../Header'

import './index.css'

const apiStatusContext = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const PopularPage = () => {
  const [popularMovies, setPopularMovies] = useState([])
  const [apiStatus, setApiStatus] = useState(apiStatusContext.initial)

  const fetchPopularMovies = async () => {
    setApiStatus(apiStatusContext.inProgress)

    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/movies-app/popular-movies'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = data.results.map(each => ({
        backdropPath: each.backdrop_path,
        id: each.id,
        posterPath: each.poster_path,
        title: each.title,
      }))
      setPopularMovies(updatedData)
      setApiStatus(apiStatusContext.success)
    } else {
      setApiStatus(apiStatusContext.failure)
    }
  }

  useEffect(() => {
    fetchPopularMovies()
  }, [])

  const onRetry = () => {
    fetchPopularMovies()
  }

  const renderSuccessView = () => {
    const fewMovies = popularMovies.slice(0, 26)
    return (
      <div data-testid="loader">
        <ul className="img-container">
          {fewMovies.map(each => (
            <Link to={`/movies/${each.id}`} key={each.id}>
              <li className="each-img">
                <img src={each.posterPath} alt={each.title} className="image" />
              </li>
            </Link>
          ))}
        </ul>
      </div>
    )
  }

  const renderFailureView = () => <FailureView onRetry={onRetry} />

  const renderLoading = () => (
    <div className="loader-container" data-testid="loader">
      <Loader
        testid="loader"
        type="TailSpin"
        height={35}
        width={380}
        color="#D81F26"
      />
    </div>
  )

  const renderPopularPage = () => {
    switch (apiStatus) {
      case apiStatusContext.success:
        return renderSuccessView()
      case apiStatusContext.failure:
        return renderFailureView()
      case apiStatusContext.inProgress:
        return renderLoading()
      default:
        return null
    }
  }

  return (
    <div className="container" data-testid="loader">
      <Header />
      <div>{renderPopularPage()}</div>
      <Footer />
    </div>
  )
}

export default PopularPage
