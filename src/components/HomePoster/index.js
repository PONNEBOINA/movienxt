import './index.css'

const HomePoster = props => {
  const {poster} = props
  const {backdropPath, title, overview} = poster
  const cutText =
    overview.length > 200 ? `${overview.slice(0, 190)}....` : overview
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
          >
            Play
          </button>
        </div>
      </div>
    </>
  )
}

export default HomePoster
