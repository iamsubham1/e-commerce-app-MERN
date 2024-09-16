import { createSlice } from "@reduxjs/toolkit";
import { getCookie } from "../utility/getCookie";

import { getUserDetails } from "../apis/api";

const token = getCookie('Jwt');

const userSlice = createSlice({
    name: 'user',
    initialState: {
        userData: {},
        loading: false,
        errors: null
    },
    reducers: {
        setUserData: (state, action) => {
            state.userData = action.payload;
            state.loading = false;
            state.errors = null;
        },
        setUserDataloading: (state, action) => {
            state.loading = action.payload;
        },

        setUserDataErrors: (state, action) => {
            state.errors = action.payload;
            state.loading = false;

        }
    }
})

export const { setUserData, setUserDataloading, setUserDataErrors } = userSlice.actions


//thunk middleware
export const getUserData = () => async (dispatch) => {
    dispatch(setUserDataloading(true));
    try {
        const userData = await getUserDetails(token);
        dispatch(setUserData(userData));
    } catch (error) {
        dispatch(setUserDataErrors(error.message));
    } finally {
        dispatch(setUserDataloading(false));
    }
};

export default userSlice.reducer