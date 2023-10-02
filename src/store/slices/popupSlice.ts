import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit'

const initialState = {
	active: ''
}

export const popupSlice = createSlice({
	name: 'popup',
	initialState,
	reducers: {
		setActivePopup(state, action: PayloadAction<string>) {
			state.active = action.payload || ''
		}
	}
})

export const {setActivePopup} = popupSlice.actions
export default popupSlice.reducer
