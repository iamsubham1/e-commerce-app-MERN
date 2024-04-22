import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../store/cartslice';
import productReducer from '../store/productslice';
import userReducer from '../store/userSlice';

const store = configureStore({
    reducer: {
        cart: cartReducer,
        products: productReducer,
        user: userReducer
    },
});

export default store;