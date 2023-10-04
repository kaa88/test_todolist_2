import { useAppDispatch } from './hooks/typedReduxHooks'
import Router from './router/Router'
import { updateProjectList } from './store/reducers/projectReducer'
import './styles/index.scss'

function App() {
	const dispatch = useAppDispatch()
	dispatch(updateProjectList())
	return <Router />
}

export default App
