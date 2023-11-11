import './styles/index.scss'
import Router from './router/Router'
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './hooks/typedReduxHooks'
import { getSettings } from './store/reducers/userReducer'
import { updateProjectList } from './store/reducers/projectReducer';

// import function to register Swiper custom elements
import { register } from 'swiper/element/bundle';
// register Swiper custom elements
register();


function App() {
	const dispatch = useAppDispatch()
	useEffect(() => {
		dispatch(getSettings())
	}, [])

	const userId = useAppSelector(state => state.user.id)
	useEffect(() => {
		if (typeof userId === 'number') dispatch(updateProjectList(userId))
	}, [userId])

	return <Router />
}

export default App
