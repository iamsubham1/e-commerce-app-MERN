import { createSlice } from '@reduxjs/toolkit';
import { fetchCartApi, addToCartApi, removeItemApi, decreaseItemCountApi, clearCartApi } from '../apis/api';


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
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const { setCart, setLoading, setError } = cartSlice.actions;


// Action to fetch initial cart state
export const fetchInitialCartState = (cookie) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const cart = await fetchCartApi(cookie);
        dispatch(setCart(cart)); // Update Redux store with initial cart state
        dispatch(setLoading(false));
    } catch (error) {
        dispatch(setError(error.message));
        dispatch(setLoading(false));
    }
};

// Action to handle adding to cart
export const handleAddToCart = (product) => async (dispatch) => {
    //console.log("redux triggered");
    dispatch(setLoading(true));
    try {
        const cart = await addToCartApi(product);

        dispatch(setCart(cart.cartData.data)); // Update Redux store with updated cart state
        dispatch(setLoading(false));
        return cart.status;
    } catch (error) {
        dispatch(setError(error.message));
        dispatch(setLoading(false));
    }
};

// Action to clear cart
export const handleRemoveItem = (product) => async (dispatch) => {
    //console.log("redux triggered");
    dispatch(setLoading(true));
    try {
        const cart = await removeItemApi(product);
        dispatch(setCart(cart));
        dispatch(setLoading(false));
    } catch (error) {
        dispatch(setError(error.message));
        dispatch(setLoading(false));
    }
};

export const handleDecreaseItem = (product) => async (dispatch) => {
    //console.log("redux triggered");
    dispatch(setLoading(true));
    try {
        const cart = await decreaseItemCountApi(product);
        dispatch(setCart(cart));
        dispatch(setLoading(false));
    } catch (error) {
        dispatch(setError(error.message));
        dispatch(setLoading(false));
    }
};

export const clearCart = () => async (dispatch) => {
    //console.log("redux triggered");
    dispatch(setLoading(true));
    try {
        const cart = await clearCartApi();
        dispatch(setCart(cart));
        dispatch(setLoading(false));
    } catch (error) {
        dispatch(setError(error.message));
        dispatch(setLoading(false));
    }
};

export default cartSlice.reducer;
