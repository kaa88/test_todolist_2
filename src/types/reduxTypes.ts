import { ThunkAction } from "redux-thunk"
import { RootState } from "../store/store"


export interface CustomAction<T = any> {
	type: string
	payload: T
}
export type CustomActionCreator<T = any> = (payload: T) => CustomAction<T>

export type CustomThunkActionCreator<T = any> = ThunkAction<void, RootState, unknown, CustomAction<T>>
