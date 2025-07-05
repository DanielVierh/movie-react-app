import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MovieList from "./MovieList";
import MovieDetail from "./MovieDetail";
import SeriesList from "./SeriesList";
import SeriesDetail from "./SeriesDetail";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MovieList />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/series" element={<SeriesList />} />
        <Route path="/series/:id" element={<SeriesDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
