import Projects from "../../components/parts/Projects/Projects"
import Container from "../../components/ui/Container/Container"
import PageTitle from "../PageTitle"

function HomePage() {

	return (
		<>
			<PageTitle />
			<Container modif="flex">
				<Projects />
			</Container>
		</>
	)
}

export default HomePage