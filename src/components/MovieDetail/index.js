import './index.css'

const MovieDetail = props => {
  const {movieDetails} = props
  const {
    backdropPath,
    title,
    adult,
    runtime,
    releaseDate,
    overview,
    posterPath,
  } = movieDetails
  //  console.log(posterPath)
  //  console.log(backdropPath)
  const hours = Math.floor(runtime / 60)
  const minutes = runtime % 60
  const date = new Date(releaseDate)
  const year = date.getFullYear()
  return (
    <>
      <div
        className="sm-devices sample-height"
        style={{
          backgroundImage: `url(${posterPath})`,
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
            <p>{releaseDate}</p>
          </div>

          <h1 className="home-poster-overview">{overview}</h1>
          <button className="home-poster-play-btn" type="button">
            Play
          </button>
        </div>
      </div>
      <div
        className="lg-devices"
        style={{
          backgroundImage: `url(${backdropPath})`,
          backgroundSize: '100% 100%',
          height: '100%',
        }}
      >
        <div className="heading-container">
          <h1 className="home-poster-title">{title}</h1>
          <div className="runtime-container">
            <p className="movie-info-hrs-min">{`${hours}h ${minutes}m `}</p>
            <p className="movie-info-a-ua">{adult ? 'A' : 'U/A'}</p>
            <p className="movie-info-year">{year}</p>
          </div>
          <h1 className="home-poster-overview">{overview}</h1>
          <button className="home-poster-play-btn" type="button">
            Play
          </button>
        </div>
      </div>
    </>
  )
}

export default MovieDetail
