import React, { useState, useEffect } from 'react';
import { getCookie } from '../utility/getCookie';
import { useNavigate } from 'react-router-dom';

const LaptopPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/product/category/laptop', {
                    headers: {
                        JWT: getCookie('JWT')
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }

                const data = await response.json();
                setProducts(data);
            } catch (error) {
                setError('Error fetching products');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return <p>Loading products...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Laptops</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {products.map(product => (
                    <div key={product._id} className="rounded-lg shadow-md overflow-hidden flex flex-col justify-center items-center text-center card" onClick={() => {
                        navigate(`/product/${product._id}`);
                    }}>
                        <img src={product.pictures ? product.pictures[0] : "https://via.placeholder.com/300"} alt={product.name} className="w-full h-48 object-contain" />
                        <div className="p-4">
                            <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                            <p className="text-gray-600">{product.description}</p>
                            <p className="text-gray-800 font-bold mt-2">${product.price}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default LaptopPage;
