import PageTitle from "../PageTitle"
import Todos from "../../components/parts/TodosTable/TodosTable"
import { useParams } from "react-router"
import { useAppSelector } from "../../hooks/typedReduxHooks"
import ErrorPage from "./ErrorPage"
import Modal from "../../components/ui/Modal/Modal"

function ProjectPage() {

	let params = useParams<{id: string}>()
	let id = Number(params.id)

	let {isLoading, list: projects} = useAppSelector(state => state.project)
	let currentProject = projects.length ? projects.find(p => p.id === id) : null
	
	let pageTitle = ''
	let content = <ErrorPage />
	if (currentProject) {
		pageTitle = currentProject.name
		content = <>
			<PageTitle value={pageTitle} />
			<Todos project={id} />
			<Modal />
		</>
	}

	return (
		isLoading
			? <p>LOADING</p>
			: content
	)
}

export default ProjectPage