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
]);

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return (
    <HeadProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </HeadProvider>
  );
}

export default App;
