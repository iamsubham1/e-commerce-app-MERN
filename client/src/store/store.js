import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../store/cartslice';
import productReducer from '../store/productslice';

const store = configureStore({
    reducer: {
        cart: cartReducer,
        products: productReducer,
    },
});

export default store;