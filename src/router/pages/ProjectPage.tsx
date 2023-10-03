import { useAppDispatch } from "../../hooks/typedReduxHooks"
import PageTitle from "../PageTitle"
import Container from "../../components/ui/Container/Container"
import Todos from "../../components/parts/Todos/Todos"
import { useParams } from "react-router"

function ProjectPage() {

	// const dispatch = useAppDispatch()
	const {id} = useParams<{id: string}>()

	return (
		<>
			<PageTitle />
			<Container>
				<Todos project={Number(id)} />
			</Container>
		</>
	)
}

export default ProjectPage