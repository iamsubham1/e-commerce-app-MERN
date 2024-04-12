// store.js
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../store/cartslice';
import thunk from 'redux-thunk';

const store = configureStore({
    reducer: {
        cart: cartReducer,
    },
    middleware: [thunk],
});


export default store