import { applyMiddleware, combineReducers, createStore } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { projectReducer } from './reducers/projectReducer'
import { taskReducer } from './reducers/taskReducer'
// import { commentReducer } from './reducers/commentReducer'
import { modalReducer } from './reducers/modalReducer'


const rootReducer = combineReducers({
	project: projectReducer,
	task: taskReducer,
	// comment: commentReducer,
	modal: modalReducer,
})

export const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)))

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch | any // any?