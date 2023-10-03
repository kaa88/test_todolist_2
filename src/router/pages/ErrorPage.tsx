import ErrorContent from "../../components/parts/ErrorContent/ErrorContent"
import Container from "../../components/ui/Container/Container"
import PageTitle from "../PageTitle"

function ErrorPage() {

	return (
		<>
			<PageTitle value="Not found" />
			<Container>
				<ErrorContent />
			</Container>
		</>
	)
}

export default ErrorPage