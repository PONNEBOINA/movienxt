import {useState} from 'react'
import VideoPlayer from '../VideoPlayer'
import './index.css'

const MovieDetail = props => {
  const {movieDetails, trailerUrl} = props
  const [showVideoPlayer, setShowVideoPlayer] = useState(false)
  const {
    backdropPath,
    title,
    adult,
    runtime,
    releaseDate,
    overview,
  } = movieDetails

  const hours = Math.floor(runtime / 60)
  const minutes = runtime % 60
  const date = new Date(releaseDate)
  const year = date.getFullYear()

  const handlePlayClick = () => {
    setShowVideoPlayer(true)
  }

  const handleCloseVideo = () => {
    setShowVideoPlayer(false)
  }

  return (
    <div
      style={{
        backgroundImage: `url(${backdropPath})`,
        backgroundSize: '100% 100%',
        height: '100%',
        margin: '10px',
      }}
    >
      <div className="heading-container movie-info-content-container-sm-devices">
        <h1 className="home-poster-title">{title}</h1>
        <div className="runtime-container">
          <p className="movie-info-hrs-min">{`${hours}h ${minutes}m `}</p>
          <p className="movie-info-a-ua">{adult ? 'A' : 'U/A'}</p>
          <p className="movie-info-year">{year}</p>
          <p className="movie-info-year">{releaseDate}</p>
        </div>

        <p className="home-poster-overview">{overview}</p>
        <button 
          className="home-poster-play-btn" 
          type="button"
          onClick={handlePlayClick}
        >
          Play
        </button>
      </div>
      {showVideoPlayer && (
        <VideoPlayer
          videoUrl={trailerUrl}
          onClose={handleCloseVideo}
        />
      )}
    </div>
  )
}

export default MovieDetail
