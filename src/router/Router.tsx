import { RouterProvider, createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProjectPage from "./pages/ProjectPage";
import ErrorPage from "./pages/ErrorPage";

function Router() {

	const router = createBrowserRouter(
		[
			{
				path: '*',
				element: <ErrorPage />,
			},
			{
				path: '/',
				element: <HomePage />,
			},
			{
				path: '/project/:id',
				element: <ProjectPage />,
			},
		],
		{
			basename: process.env.REACT_APP_HOST_BASENAME || ''
		}
	)

	return <RouterProvider router={router} />
}

export default Router
