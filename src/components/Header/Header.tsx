import { NavLink } from 'react-router-dom';
import { useTMDB } from '../../context/TmdbContext';
import './Header.css';

function Header() {
  const { favorites } = useTMDB();

  return (
    <header className="header">
      <div className="header__inner">
        <NavLink to="/" className="header__brand">
          <span className="header__pre">le</span>
          <span className="header__logo">CINÉ</span>
        </NavLink>

        <nav className="header__nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `header__nav-link${isActive ? ' header__nav-link--active' : ''}`
            }
          >
            Films
          </NavLink>
          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              `header__nav-link${isActive ? ' header__nav-link--active' : ''}`
            }
          >
            Favoris
            {favorites.length > 0 && (
              <span className="header__badge">{favorites.length}</span>
            )}
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Header;
