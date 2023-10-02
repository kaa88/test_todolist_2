import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
// import type { RootState } from '../store' //?

const initialState = {
	active: ''
}

export const selectSlice = createSlice({
	name: 'select',
	initialState,
	reducers: {
		setActiveSelect(state, action: PayloadAction<string>) {
			state.active = action.payload
		}
	}
})

export const {setActiveSelect} = selectSlice.actions
// export const selectCount = (state: RootState) => state.counter.value //?
export default selectSlice.reducer
