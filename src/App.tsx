import { HeadProvider } from "react-head";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages";
import GaragesPage from "./pages/garages";
import { QueryClient, QueryClientProvider } from "react-query";
import GaragesBiggestPage from "./pages/garages/biggest";

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
]);

function App() {
  const queryClient = new QueryClient();
  return (
    <HeadProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </HeadProvider>
  );
}

export default App;
