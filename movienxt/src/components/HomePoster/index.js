import {useState} from 'react'
import VideoPlayer from '../VideoPlayer'
import './index.css'

const HomePoster = props => {
  const {poster} = props
  const [showVideoPlayer, setShowVideoPlayer] = useState(false)
  const {backdropPath, title, overview} = poster
  const cutText =
    overview.length > 200 ? `${overview.slice(0, 190)}....` : overview

  const handlePlayClick = () => {
    setShowVideoPlayer(true)
  }

  const handleCloseVideo = () => {
    setShowVideoPlayer(false)
  }
  return (
    <>
      <div
        className="devices-container"
        alt={title}
        style={{
          backgroundImage: `url(${backdropPath})`,
          backgroundSize: '100% 100%',
          backgroundRepeat: 'no-repeat',
          height: '100%',
        }}
      >
        <div className="home-header-content heading-container">
          <h1 className="movie-details-name home-poster-title">{title}</h1>
          <h1 className="movie-details-name home-poster-overview">{cutText}</h1>
          <button
            className=" movies-details-play-button  home-poster-play-btn"
            type="button"
            data-testid="searchButton"
            onClick={handlePlayClick}
          >
            Play
          </button>
        </div>
      </div>
      {showVideoPlayer && (
        <VideoPlayer
          videoUrl="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          onClose={handleCloseVideo}
        />
      )}
    </>
  )
}

export default HomePoster
