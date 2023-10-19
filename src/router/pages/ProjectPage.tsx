import { useEffect } from 'react'
import PageTitle from "../PageTitle"
import Todos from "../../components/parts/TodosTable/TodosTable"
import { useParams } from "react-router"
import { useAppDispatch, useAppSelector } from "../../hooks/typedReduxHooks"
import ErrorPage from "./ErrorPage"
import Modal from "../../components/ui/Modal/Modal"
import { setCurrentProject } from "../../store/reducers/projectReducer"

function ProjectPage() {

	const dispatch = useAppDispatch()

	let params = useParams<{id: string}>()
	let id = Number(params.id)

	let {isLoading, list: projects, current} = useAppSelector(state => state.projects)
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

	useEffect(() => {
		if (currentProject && current !== id) dispatch(setCurrentProject(currentProject.id))
	}, [currentProject, id, current])

	return (
		isLoading
			? <p>LOADING</p>
			: content
	)
}

export default ProjectPage