import { createSlice } from '@reduxjs/toolkit';
import { fetchCartApi, addToCartApi } from '../apis/api'; // Assuming there's an API for fetching cart data


export const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        totalValue: 0,
        loading: false,
        error: null,
    },
    reducers: {
        setCart: (state, action) => {
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
        }, setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const { setCart, setLoading, setError } = cartSlice.actions;



// Action to fetch initial cart state
export const fetchInitialCartState = (id) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const cart = await fetchCartApi(id);
        dispatch(setCart(cart)); // Update Redux store with initial cart state
        dispatch(setLoading(false));
        console.log("set cart");
    } catch (error) {
        dispatch(setError(error.message));
        dispatch(setLoading(false));
    }
};

// Action to handle adding to cart
export const handleAddToCart = (product) => async (dispatch) => {
    console.log("redux triggered");
    dispatch(setLoading(true));
    try {
        const cart = await addToCartApi(product);
        dispatch(setCart(cart)); // Update Redux store with updated cart state
        dispatch(setLoading(false));
    } catch (error) {
        dispatch(setError(error.message));
        dispatch(setLoading(false));
    }
};

export default cartSlice.reducer;
