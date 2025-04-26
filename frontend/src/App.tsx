import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import config from './config/config';
import Dashboard from './pages/UserPages/Dashboard';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import { ThemeProvider } from "./components/ThemeProvider/ThemeProvider"
import CreateJob from './pages/UserPages/AddListingPage';
import { PrivateRoute, PrivateAdminRoute } from "./routes/PrivateRoute";
import AdminDashboardPage from '@/pages/AdminPages/AdminDashboardPage';
import GetListingByUserPage from './pages/UserPages/GetListingByUser';
import UpdateListingByUserPage from './pages/UserPages/UpdateListing';
import { AlertProvider } from '@/context/AlertContext';
import AdminViewJobsPage from './pages/AdminPages/AdminViewJobsPage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
// import { useAuthStore } from "./store/useAuthStore";


function App() {
  // const { authUser, checkAuth } = useAuthStore();
  // // const { theme } = useThemeStore();

  // // console.log({ onlineUsers });

  // useEffect(() => {
  //   checkAuth();
  // }, [checkAuth]);

  // console.log({ authUser });
  return (
    <GoogleOAuthProvider clientId={config.googleClientId}>

      <Router>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <AlertProvider>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/create-job" element={<CreateJob />} />
                <Route path="/my-jobs/:userId" element={<GetListingByUserPage />} />
                <Route path="/edit-listing/:id" element={<UpdateListingByUserPage />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/dashboard/myAccount/profile" element={<ProfilePage />} />
              </Route>
              <Route element={<PrivateAdminRoute />}>
                <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
                <Route path="/admin-dashboard/view-jobs/:userId" element={<AdminViewJobsPage />} />
                <Route path="/admin-dashboard/myAccount/profile" element={<ProfilePage />} />
              </Route>
            </Routes>
          </AlertProvider>
        </ThemeProvider>
      </Router>
    </GoogleOAuthProvider>
  )
}

export default App
