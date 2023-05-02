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

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/login",
    element: (
      <AuthRedirect loggedIn="/buses">
        <LoginPage />
      </AuthRedirect>
    ),
  },
  {
    path: "/garages",
    element: (
      <AuthRedirect notLoggedIn="/login">
        <GaragesPage />
      </AuthRedirect>
    ),
  },
  {
    path: "/garages/biggest",
    element: (
      <AuthRedirect notLoggedIn="/login">
        <GaragesBiggestPage />
      </AuthRedirect>
    ),
  },
  {
    path: "/buses",
    element: (
      <AuthRedirect notLoggedIn="/login">
        <BusesPage />
      </AuthRedirect>
    ),
  },
  {
    path: "/buses/edit/:id",
    element: (
      <AuthRedirect notLoggedIn="/login">
        <AddEditBusPage />
      </AuthRedirect>
    ),
  },
  {
    path: "/buses/add",
    element: (
      <AuthRedirect notLoggedIn="/login">
        <AddEditBusPage />
      </AuthRedirect>
    ),
  },
  {
    path: "/lines",
    element: (
      <AuthRedirect notLoggedIn="/login">
        <LinesPage />
      </AuthRedirect>
    ),
  },
  {
    path: "/lines/edit/:id",
    element: (
      <AuthRedirect notLoggedIn="/login">
        <AddEditLinePage />
      </AuthRedirect>
    ),
  },
  {
    path: "/lines/add",
    element: (
      <AuthRedirect notLoggedIn="/login">
        <AddEditLinePage />
      </AuthRedirect>
    ),
  },
  {
    path: "/stations",
    element: (
      <AuthRedirect notLoggedIn="/login">
        <StationsPage />
      </AuthRedirect>
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
