// cartSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { addToCartApi } from '../apis/api';

export const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        totalValue: 0,
        loading: false,
        error: null,
    },
    reducers: {
        addToCart: (state, action) => {
            const { items, totalValue } = action.payload;
            state.items = items;
            state.totalValue = totalValue;
        },
        removeFromCart: (state, action) => {
            const { items, totalValue } = action.payload
            state.items = items;
            state.totalValue = totalValue;
        },
        clearCart: (state) => {
            state.items = [];
            state.totalValue = 0;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});




export const { addToCart, removeFromCart, clearCart, setLoading, setError } = cartSlice.actions;


export const handleAddToCart = (product) => async (dispatch) => {
    console.log("redux triggered")
    dispatch(setLoading(true))
    try {
        const cart = await addToCartApi(product);
        dispatch(addToCart(cart));

    } catch (error) {
        dispatch(setError(error.message));
        dispatch(setLoading(false));
    }

}


export default cartSlice.reducer;
