// store.js
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../store/cartslice';

const store = configureStore({
    reducer: {
        cart: cartReducer,
    },

});


export default store