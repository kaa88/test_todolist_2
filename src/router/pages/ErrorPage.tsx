import ErrorContent from "../../components/parts/ErrorContent/ErrorContent"
import PageLayout from "../PageLayout"

function ErrorPage() {

	return (
		<PageLayout pageTitle="Not found">
			<ErrorContent />
		</PageLayout>
	)
}

export default ErrorPage