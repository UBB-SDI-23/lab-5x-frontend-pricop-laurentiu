import { HeadProvider } from "react-head";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages";
import GaragesPage from "./pages/garages";
import { QueryClient, QueryClientProvider } from "react-query";
import GaragesBiggestPage from "./pages/garages/biggest";
import BusesPage from "./pages/buses";
import AddEditBusPage from "./pages/buses/add-edit";
import LinesPage from "./pages/lines";
import AddEditLinePage from "./pages/lines/add-edit";
import StationsPage from "./pages/stations";
import { toast, ToastContainer } from "react-toastify";
import { handleError } from "./lib/axios";
import LoginPage from "./pages/auth/login";
import { UserProvider } from "./lib/user-context";
import AuthRedirect from "./components/AuthRedirect";
import ProfilePage from "./pages/profile";
import AuthRegisterPage from "./pages/auth/register";
import AuthThanksPage from "./pages/auth/register/thanks";
import AuthConfirmPage from "./pages/auth/register/confirm";
import ProfileEditPage from "./pages/profile/edit";
import { UserRole } from "./lib/types";
import AdminPage from "./pages/admin";
import ChatPage from "./pages/chat";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/auth/login",
    element: (
      <AuthRedirect loggedIn="/">
        <LoginPage />
      </AuthRedirect>
    ),
  },
  {
    path: "/auth/register",
    element: (
      <AuthRedirect loggedIn="/">
        <AuthRegisterPage />
      </AuthRedirect>
    ),
  },
  {
    path: "/auth/register/confirm",
    element: (
      <AuthRedirect loggedIn="/">
        <AuthConfirmPage />
      </AuthRedirect>
    ),
  },
  {
    path: "/auth/register/thanks",
    element: (
      <AuthRedirect loggedIn="/">
        <AuthThanksPage />
      </AuthRedirect>
    ),
  },
  {
    path: "/garages",
    element: (
      <AuthRedirect>
        <GaragesPage />
      </AuthRedirect>
    ),
  },
  {
    path: "/garages/biggest",
    element: (
      <AuthRedirect>
        <GaragesBiggestPage />
      </AuthRedirect>
    ),
  },
  {
    path: "/buses",
    element: (
      <AuthRedirect>
        <BusesPage />
      </AuthRedirect>
    ),
  },
  {
    path: "/buses/edit/:id",
    element: (
      <AuthRedirect notLoggedIn="/auth/login">
        <AddEditBusPage />
      </AuthRedirect>
    ),
  },
  {
    path: "/buses/add",
    element: (
      <AuthRedirect notLoggedIn="/auth/login">
        <AddEditBusPage />
      </AuthRedirect>
    ),
  },
  {
    path: "/lines",
    element: (
      <AuthRedirect>
        <LinesPage />
      </AuthRedirect>
    ),
  },
  {
    path: "/lines/edit/:id",
    element: (
      <AuthRedirect notLoggedIn="/auth/login">
        <AddEditLinePage />
      </AuthRedirect>
    ),
  },
  {
    path: "/lines/add",
    element: (
      <AuthRedirect notLoggedIn="/auth/login">
        <AddEditLinePage />
      </AuthRedirect>
    ),
  },
  {
    path: "/stations",
    element: (
      <AuthRedirect>
        <StationsPage />
      </AuthRedirect>
    ),
  },
  {
    path: "/profile",
    element: (
      <AuthRedirect notLoggedIn="/auth/login">
        <ProfilePage />
      </AuthRedirect>
    ),
  },
  {
    path: "/profile/:id",
    element: (
      <AuthRedirect notLoggedIn="/auth/login">
        <ProfilePage />
      </AuthRedirect>
    ),
  },
  {
    path: "/profile/edit",
    element: (
      <AuthRedirect notLoggedIn="/auth/login">
        <ProfileEditPage />
      </AuthRedirect>
    ),
  },
  {
    path: "/admin",
    element: (
      <AuthRedirect notLoggedIn="/auth/login" allowedRoles={[UserRole.admin]}>
        <AdminPage />
      </AuthRedirect>
    ),
  },
  {
    path: "/chat",
    element: (
      <ChatPage />
    ),
  },
]);

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
        onError: handleError,
      },
    },
  });
  return (
    <HeadProvider>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <RouterProvider router={router} />
          <ToastContainer />
        </UserProvider>
      </QueryClientProvider>
    </HeadProvider>
  );
}

export default App;
