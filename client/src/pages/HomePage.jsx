// HomePage.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/productslice';

const HomePage = () => {
    const dispatch = useDispatch();
    const products = useSelector(state => state.products.items);
    console.log(products);
    const loading = useSelector(state => state.products.loading);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const addToCartHandler = (productId) => {
        dispatch(addToCart(productId));
        console.log(`Product with ID ${productId} added to cart`);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Products</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                    <p>Loading products...</p>
                ) : (
                    products.map(product => (
                        <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <img src="https://via.placeholder.com/300" alt={product.name} className="w-full h-48 object-cover" />
                            <div className="p-4">
                                <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                                <p className="text-gray-600 mb-2">{product.description}</p>
                                <p className="text-gray-800 font-bold mb-2">Price: ${product.price}</p>
                                <p className="text-gray-700">Category: {product.category}</p>
                                <button onClick={() => addToCartHandler(product._id)} className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default HomePage;
