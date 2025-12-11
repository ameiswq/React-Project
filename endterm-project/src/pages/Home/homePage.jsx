// src/pages/Home/HomePage.jsx
import "./homePage.css";

export default function HomePage() {
  return (
    <div className="home-page">
      <div className="home-center">
        <h1 className="home-title">Rick and Morty Explorer</h1>
        <p className="home-description">
          Simple app for browsing Rick and Morty characters:
          search, view details and mark your favourites.
        </p>
      </div>
    </div>
  );
}
