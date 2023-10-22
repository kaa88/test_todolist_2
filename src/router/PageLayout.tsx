import { ComponentProps } from 'react';
import Header from '../components/parts/Header/Header';
import PageTitle from './PageTitle';
import { PageType } from '../types/types';

interface PageLayoutProps extends ComponentProps<'div'> {
	pageTitle?: string
	pageType?: PageType
}

const PageLayout = function({pageTitle, pageType, children}: PageLayoutProps) {

	return (
		<>
			<PageTitle value={pageTitle} />
			<Header type={pageType} />
			{children}
		</>
	)
}
export default PageLayout