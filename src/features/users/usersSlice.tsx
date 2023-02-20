import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

const initialState = [
    { id: '0', name: 'User Zero' },
    { id: '1', name: 'User One' },
    { id: '2', name: 'Dave Grey' },
]

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
})

export const selectAllUsers = (state: RootState) => state.users

export default userSlice.reducer