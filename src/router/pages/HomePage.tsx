import Projects from "../../components/parts/Projects/Projects"
import { PageType } from "../../types/types"
import PageLayout from "../PageLayout"

function HomePage() {

	return (
		<PageLayout pageType={PageType.projects}>
			<Projects />
		</PageLayout>
	)
}

export default HomePage