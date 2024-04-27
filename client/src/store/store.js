import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../reducers/cartslice';
import productReducer from '../reducers/productslice';
import userReducer from '../reducers/userSlice';

const store = configureStore({
    reducer: {
        cart: cartReducer,
        products: productReducer,
        user: userReducer
    },
});

export default store;