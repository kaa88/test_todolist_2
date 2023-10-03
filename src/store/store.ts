import { applyMiddleware, combineReducers, createStore } from 'redux'
import projectReducer from './reducers/projectReducer'
import thunk from 'redux-thunk'


const rootReducer = combineReducers({
	project: projectReducer
})

export const store = createStore(rootReducer, applyMiddleware(thunk))


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch