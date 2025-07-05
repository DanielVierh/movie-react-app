import React from 'react'
import { Link } from 'react-router-dom'

const SeriesCard = ({ series }) => {
    const { id, name, vote_average, poster_path, first_air_date, original_language } = series;
    console.log('series', series);
    return (
        <Link to={`/series/${id}`}>
            <div className='series-card cursor-pointer hover:shadow-lg transition'>
                <img src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : '/no-movie.png'} alt={name} />
                <div className="mt-4">
                    <h3>{name}</h3>
                </div>
                <div className="content">
                    <div className="rating">
                        <img src="star.svg" alt="Star Icon" />
                        <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
                        <span>•</span>
                        <p className="lang">{original_language}</p>
                        <span>•</span>
                        <p className="year">{first_air_date ? first_air_date.split('-')[0] : '-'}</p>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default SeriesCard