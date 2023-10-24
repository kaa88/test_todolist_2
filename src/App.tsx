import { useAppDispatch } from './hooks/typedReduxHooks'
import Router from './router/Router'
import { updateProjectList } from './store/reducers/projectReducer'
import { getSettings } from './store/reducers/userReducer'
import './styles/index.scss'

// import function to register Swiper custom elements
import { register } from 'swiper/element/bundle';
// register Swiper custom elements
register();


function App() {
	const dispatch = useAppDispatch()
	dispatch(updateProjectList())
	dispatch(getSettings())
	return <Router />
}

export default App
