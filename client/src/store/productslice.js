// productSlice.js
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const productSlice = createSlice({
    name: 'products',
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {
        setProducts: (state, action) => {
            state.items = action.payload;
        },
        setProductsLoading: (state, action) => {
            state.loading = action.payload;
        },
        setProductsError: (state, action) => {
            state.error = action.payload;
        },
    },
});


export const { setProducts, setProductsLoading, setProductsError } = productSlice.actions;

export const fetchProducts = () => async dispatch => {
    dispatch(setProductsLoading(true));
    try {
        const JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoicmFtIiwib3JkZXJzIjpbIjY2MDJmMjJjY2UyZGNiZGI2YjI5OGRhMiIsIjY2MDJmMzE3NDZhY2Q0ZjMwYWI1NWIyZiIsIjY2MTI5MmRiMDEwMDBkNjZjOGU1YjRjNyIsIjY2MTI5MzA2YzMzYTFhYWEzMTkzOTEwOSIsIjY2MTJiZTExNzFlY2QwMGI4YzdkNDAyMyIsIjY2MTJiZTdmOTIzMmUyYjAzNDJkOTJhNCIsIjY2MTJiZWU5MzYyMWRmYThjNmRkOTAyZiIsIjY2MTJjMzA0ZjRiYWY5ZjM4ZGQ4YzIyNiIsIjY2MTJjMzRjZjRiYWY5ZjM4ZGQ4YzIzNiIsIjY2MTJjMzcxNDFmZWQyNzdjZGNlMzM1MSIsIjY2MTJjNWI0NGU0ZGM1OTkwYjU2OGU5NyIsIjY2MTJjNjBkYjc3OTdhNTQ4ZjUzMTk0MSIsIjY2MTJkMTc2ZjUzZTQyNzBmOTk2NzJkZSIsIjY2MTJkMTg2MzNkMmJkMTZlMjFkOWU2NSIsIjY2MTJkMWIwNjA5NTJiMDkxNzVlMzQxYyIsIjY2MTJkMWJiYmE5ZjhiOTQzNzljNmRhNyIsIjY2MTJkMWNlY2VlNGRjYmY3NDJjM2M1NyIsIjY2MTJkM2E4NDk2MGYwNDBmZGY4YzJhMCIsIjY2MTJkM2NlNDk2MGYwNDBmZGY4YzJhYyIsIjY2MTJkM2ZiOGYwOWE5ZWJmMGUzMjAwZCIsIjY2MTJkNDI4ZDgwZjkyZWZmYTMyMzc2NCIsIjY2MTJkNDNmZDgwZjkyZWZmYTMyMzc3MCIsIjY2MTJkNDlkM2Q4YjYzMzQxOGVmMDE4YSIsIjY2MTJkNTI2ZDNiZTE0MDExZDQyN2RjOCIsIjY2MTJkNjczZDBkYTZlNzJlNzE3MzdjYiIsIjY2MTJkNzk0ZTExODE4YzZkNGNjMjI1NCIsIjY2MTJkN2FkYmU0Mzk0MjE2ZjA0MjA3MyIsIjY2MTJkODA3OTJiZWE1MDdkMTRlMjc4OCIsIjY2MTJkODJmYmU2YmFhZTI5NGNlOTc3YiIsIjY2MTJkODViM2JkZmE5MDBlYmIwNjZlYSIsIjY2MTJkODg1ZTc1NzQ1M2RjOTE1YzQ2MSIsIjY2MTJkOTI5N2U4YWI4NmE4NDIyNzRkZSIsIjY2MTJkOTM5N2U4YWI4NmE4NDIyNzRlOCIsIjY2MTJkYTI5YTBkOTRmMzNjMzM4MTQ2ZCJdLCJfaWQiOiI2NWZiZGM3N2JkZDA2NzI1NmUxNDlkYTYiLCJlbWFpbCI6InJhbUBnbWFpbC5jb20iLCJpYXQiOjE3MTMwMjcyNzN9.hCZvOAnMWJBgVyV2L5vq8kxHWFR-9fIYKbUBvx9q_Qw';
        const response = await axios.get('http://localhost:8080/api/product/allproducts', {
            headers: {
                JWT: JWT
            }
        });
        dispatch(setProducts(response.data));
        dispatch(setProductsLoading(false));
    } catch (error) {
        dispatch(setProductsError(error.message));
        dispatch(setProductsLoading(false));
    }
};


