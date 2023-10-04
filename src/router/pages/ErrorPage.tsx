import ErrorContent from "../../components/parts/ErrorContent/ErrorContent"
import PageTitle from "../PageTitle"

function ErrorPage() {

	return (
		<>
			<PageTitle value="Not found" />
			<ErrorContent />
		</>
	)
}

export default ErrorPage