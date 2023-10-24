import { useEffect } from 'react'
import Todos from "../../components/parts/TodosTable/TodosTable"
import { useParams } from "react-router"
import { useAppDispatch, useAppSelector } from "../../hooks/typedReduxHooks"
import ErrorPage from "./ErrorPage"
import { setCurrentProject } from "../../store/reducers/projectReducer"
import { closeAllModals } from '../../store/reducers/modalReducer'
import PageLayout from '../PageLayout'
import { PageType } from '../../types/types'
import Loader from '../../components/ui/Loader/Loader'

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
		content =
			<PageLayout pageTitle={pageTitle} pageType={PageType.tasks}>
				<Todos project={id} />
			</PageLayout>
	}

	useEffect(() => {
		if (currentProject && current !== id) dispatch(setCurrentProject(currentProject.id))
	}, [currentProject, id, current])

	useEffect(() => {dispatch(closeAllModals())}, [current]) // if any opened

	return (
		isLoading
			? <Loader variant='light' style={{position: 'absolute'}} />
			: content
	)
}

export default ProjectPage