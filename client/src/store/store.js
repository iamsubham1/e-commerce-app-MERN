import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../reducers/cartslice';
import productReducer from '../reducers/productslice';
import userReducer from '../reducers/userSlice';
import orderReducer from '../reducers/orderSlice';


const store = configureStore({
    reducer: {
        cart: cartReducer,
        products: productReducer,
        user: userReducer,
        orders: orderReducer
    },
});

export default store;