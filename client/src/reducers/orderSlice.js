import { createSlice } from "@reduxjs/toolkit";
import { fetchOrderDetails } from "../apis/api";

const orderSlice = createSlice({
    name: 'orders',
    initialState: {
        ordersData: [],  // Initialize as an empty array
        loading: false,
        errors: null
    },
    reducers: {
        setOrdersData: (state, action) => {
            state.ordersData = action.payload;
            state.loading = false;
            state.errors = null;
        },
        setOrdersDataloading: (state, action) => {
            state.loading = action.payload;
        },
        setOrdersDataErrors: (state, action) => {
            state.errors = action.payload;
            state.loading = false;
        }
    }
});//state

export const { setOrdersData, setOrdersDataloading, setOrdersDataErrors } = orderSlice.actions;   //state manipulator

// Thunk middleware 

export const getOrdersData = () => async (dispatch, getState) => {
    const { ordersData } = getState().orders;

    // Only fetch data if ordersData is empty
    if (ordersData.length === 0) {
        dispatch(setOrdersDataloading(true));
        try {
            const orderData = await fetchOrderDetails();
            dispatch(setOrdersData(orderData));
        } catch (error) {
            dispatch(setOrdersDataErrors(error.message));
        } finally {
            dispatch(setOrdersDataloading(false));
        }
    }
}; //state manipulation

export default orderSlice.reducer;
