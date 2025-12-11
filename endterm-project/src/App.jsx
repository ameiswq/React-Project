import { Routes, Route } from "react-router-dom";
import SearchPage from "./pages/SearchPage/SearchPage.jsx";
import CharacterDetail from "./pages/CharacterDetail/characterDetail.jsx";
import FavoritesPage from "./pages/Favorites/FavoritesPage.jsx";
import SignupPage from "./pages/SignUp/signUp.jsx";
import LoginPage from "./pages/Login/login.jsx";
import ProfilePage from "./pages/Profile/profile.jsx";
import RequireAuth from "./components/RequireAuth/requireAuth.jsx";
import HomePage from "./pages/Home/homePage.jsx";
import MainLayout from "./layout/mainLayout.jsx";
import RedirectIfAuth from "./components/RedirectIfAuth/RedirectIfAuth.jsx";


export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/characters" element={<SearchPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/character/:id" element={<CharacterDetail />} />
        <Route path="/login" element={<RedirectIfAuth> <LoginPage /></RedirectIfAuth>}/>
        <Route path="/signup" element={<RedirectIfAuth> <SignupPage /></RedirectIfAuth>}/>
        <Route path="/profile" element={<RequireAuth> <ProfilePage /></RequireAuth>}/>
      </Route>
    </Routes>
  );
}
