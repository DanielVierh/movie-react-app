import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import MovieList from "./MovieList";
import MovieDetail from "./MovieDetail";
import SeriesList from "./SeriesList";
import SeriesDetail from "./SeriesDetail";
import Watchlist from "./Watchlist";

function App() {
  return (
    <>
      <Router>
        <nav>
          <ul>
            <li>
              <Link className="link-button" to="/">
                Movies
              </Link>
            </li>
            <li>
              <Link className="link-button" to="/series">
                Series
              </Link>
            </li>
            <li>
              <Link className="link-button" to="/watchlist">
                Watchlist
              </Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<MovieList />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/series" element={<SeriesList />} />
          <Route path="/series/:id" element={<SeriesDetail />} />
          <Route path="/watchlist" element={<Watchlist />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
