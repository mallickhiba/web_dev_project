import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    users: [],
};

const adminUserSlice = createSlice({
    name: "adminUsers",
    initialState,
    reducers: {
        setUsers(state, action) {
            state.users = action.payload;
        },
        editUser(state, action) {
            const updatedUser = action.payload;
            state.users = state.users.map((user) =>
                user._id === updatedUser._id ? updatedUser : user
            );
        },
        deleteUser(state, action) {
            const idToDelete = action.payload;
            state.users = state.users.filter((user) => user._id !== idToDelete);
        },
    },
});

export const { setUsers, editUser, deleteUser } = adminUserSlice.actions;

export default adminUserSlice.reducer;
