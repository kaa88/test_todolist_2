import { ThunkAction } from "redux-thunk"
import { RootState } from "../store/store"


export interface CustomAction<T> {
	type: string
	payload: T
}
export type CustomActionCreator<T> = (payload: T) => CustomAction<T>

export type CustomThunkActionCreator<T> = ThunkAction<void, RootState, unknown, CustomAction<T>>
