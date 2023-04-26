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

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/garages",
    element: <GaragesPage />,
  },
  {
    path: "/garages/biggest",
    element: <GaragesBiggestPage />,
  },
  {
    path: "/buses",
    element: <BusesPage />,
  },
  {
    path: "/buses/edit/:id",
    element: <AddEditBusPage />,
  },
  {
    path: "/buses/add",
    element: <AddEditBusPage />,
  },
  {
    path: "/lines",
    element: <LinesPage />,
  },
  {
    path: "/lines/edit/:id",
    element: <AddEditLinePage />,
  },
  {
    path: "/lines/add",
    element: <AddEditLinePage />,
  },
  {
    path: "/stations",
    element: <StationsPage />,
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
        <RouterProvider router={router} />
        <ToastContainer />
      </QueryClientProvider>
    </HeadProvider>
  );
}

export default App;
