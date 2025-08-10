import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";
import NotificationPage from "./pages/NotificationPage";
import PrivateRoutes from "./routes/PrivateRoutes";
import MainLayout from "./components/layouts/MainLayout";
import ProfilePage from "./components/profile/ProfilePage";
import EditProfile from "./components/profile/EditProfile";
import CreatePost from "./components/createPosts/CreatePost";
import PostDetails from "./components/createPosts/PostDetails";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />

        <Route element={<PrivateRoutes />}>
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/posts/:id" element={<PostDetails />} />
          <Route path="/notifications" element={<NotificationPage />} />
        </Route>
      </Route>

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
