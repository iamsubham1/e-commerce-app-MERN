import { createSlice } from '@reduxjs/toolkit';

import { fetchAllProducts } from '../apis/api';

// create product slice
const productSlice = createSlice({
    name: 'products',
    initialState: {
        products: [],
        loading: false,
        error: null,
    },

    // declare reducers(state and actions)
    reducers: {
        setProducts: (state, action) => {
            state.products = action.payload;
            state.loading = false;
            state.error = null;
        },
        setProductsLoading: (state, action) => {
            state.loading = action.payload;
        },
        setProductsError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
    },
});

export const { setProducts, setProductsLoading, setProductsError } = productSlice.actions;

export const fetchProducts = (cookie) => async (dispatch) => {
    dispatch(setProductsLoading(true));
    try {

        const data = await fetchAllProducts(cookie);
        dispatch(setProducts(data));


    } catch (error) {
        dispatch(setProductsError(error.message));
    } finally {
        dispatch(setProductsLoading(false));
    }
};

export default productSlice.reducer;