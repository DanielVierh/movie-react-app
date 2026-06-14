import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";

const Navigation = () => {
  const location = useLocation();

  // Hilfsfunktion: Prüft, ob der Pfad mit dem Menüpunkt startet
  const isActive = (path) => {
    // Spezialfall für die Startseite: Muss exakt "/" sein
    if (path === "/") {
      return (
        location.pathname === "/" || location.pathname.startsWith("/movie")
      );
    }
    // Für "/series" und "/series/:id"
    return location.pathname.startsWith(path);
  };

  return (
    <nav>
      <ul>
        <li>
          <Link
            className={`link-button ${isActive("/") ? "active" : ""}`}
            to="/"
          >
            Movies
          </Link>
        </li>
        <li>
          <Link
            className={`link-button ${isActive("/series") ? "active" : ""}`}
            to="/series"
          >
            Series
          </Link>
        </li>
        <li>
          <Link
            className={`link-button ${isActive("/watchlist") ? "active" : ""}`}
            to="/watchlist"
          >
            Watchlist
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
