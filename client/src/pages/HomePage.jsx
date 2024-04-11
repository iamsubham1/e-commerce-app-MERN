import React, { useState, useEffect } from 'react';

const HomePage = () => {
    const [products, setProducts] = useState([]);

    const fetchProducts = async () => {
        try {
            const JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoicmFtIiwib3JkZXJzIjpbXSwiX2lkIjoiNjVmYmRjNzdiZGQwNjcyNTZlMTQ5ZGE2IiwiZW1haWwiOiJyYW1AZ21haWwuY29tIiwiaWF0IjoxNzExMzA4MjUzfQ.qPFsdXXokkfWOY36k67BCMGYZ2zx0avk3qFD6n0bXPk';
            const response = await fetch('http://localhost:8080/api/product/allproducts', {
                headers: {
                    JWT: JWT
                }
            });
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Products</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.length > 0 ? (
                    products.map(product => (
                        <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <img src="https://via.placeholder.com/300" alt={product.name} className="w-full h-48 object-cover" />
                            <div className="p-4">
                                <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                                <p className="text-gray-600 mb-2">{product.description}</p>
                                <p className="text-gray-800 font-bold mb-2">Price: ${product.price}</p>
                                <p className="text-gray-700">Category: {product.category}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Loading products...</p>
                )}
            </div>
        </div>
    );
}

export default HomePage;
