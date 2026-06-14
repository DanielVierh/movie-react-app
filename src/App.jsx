import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import MovieList from "./MovieList";
import MovieDetail from "./MovieDetail";
import SeriesList from "./SeriesList";
import SeriesDetail from "./SeriesDetail";
import Watchlist from "./Watchlist";
import Navigation from "./components/Navigation";

function App() {
  return (
    <>
      <Router>
        <Navigation />
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
