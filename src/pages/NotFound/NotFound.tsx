import { Link } from 'react-router-dom';
import './NotFound.css';

function NotFound() {
  return (
    <main className="not-found">
      <p className="not-found__code">404</p>
      <h1 className="not-found__title">Page introuvable</h1>
      <p className="not-found__sub">Cette page n'existe pas ou le film est inconnu.</p>
      <Link to="/" className="not-found__link">Retour à l'accueil</Link>
    </main>
  );
}

export default NotFound;
