import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import FailureView from '../FailureView'
import Footer from '../Footer'

import './index.css'
import Header from '../Header'

const apiStatusContext = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class PopularPage extends Component {
  state = {
    popularMovies: [],
    apiStatus: apiStatusContext.initial,
  }

  componentDidMount() {
    this.renderPopularView()
  }

  renderPopularView = async () => {
    this.setState({apiStatus: apiStatusContext.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/movies-app/popular-movies'
    const option = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, option)
    if (response.ok === true) {
      const data = await response.json()
      const updateData = data.results.map(each => ({
        backdropPath: each.backdrop_path,
        id: each.id,
        posterPath: each.poster_path,
        title: each.title,
      }))
      this.setState({
        popularMovies: updateData,
        apiStatus: apiStatusContext.success,
      })
    } else {
      this.setState({apiStatus: apiStatusContext.failure})
    }
  }

  onRetry = () => {
    this.renderPopularView()
  }

  renderSuccessView = () => {
    const {popularMovies} = this.state
    const fewMovies = popularMovies.slice(0, 16)
    return (
      <>
        <ul className="img-container">
          {fewMovies.map(each => (
            <Link to={`/movies/${each.id}`} key={each.id}>
              <li key={each.id} className="each-img">
                <img src={each.posterPath} alt={each.title} className="image" />
              </li>
            </Link>
          ))}
        </ul>
      </>
    )
  }

  renderFailureView = () => <FailureView onRetry={this.onRetry} />

  renderLoading = () => (
    <div className="loader-container" data-testid="loader">
      <Loader
        testid="loader"
        type="TailSpin"
        height={35}
        width={380}
        color=" #D81F26"
      />
    </div>
  )

  renderPopularPage = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusContext.success:
        return this.renderSuccessView()
      case apiStatusContext.failure:
        return this.renderFailureView()
      case apiStatusContext.inProgress:
        return this.renderLoading()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="container" data-testid="loader">
        <Header />
        <div>{this.renderPopularPage()}</div>
        <Footer />
      </div>
    )
  }
}

export default PopularPage

//     <img
//       src="https://res.cloudinary.com/dnxbl0xrb/image/upload/v1729667371/Group_7399_os0yqk.svg"
//       className="login-website-logo-desktop-image"
//       alt="website logo"
//     />

// export default PopularPage
