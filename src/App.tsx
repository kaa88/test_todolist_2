import { useAppDispatch } from './hooks/typedReduxHooks'
import Router from './router/Router'
import { updateProjectList } from './store/reducers/projectReducer'
import { getSettings } from './store/reducers/userReducer'
import './styles/index.scss'

function App() {
	const dispatch = useAppDispatch()
	dispatch(updateProjectList())
	dispatch(getSettings())
	return <Router />
}

export default App
