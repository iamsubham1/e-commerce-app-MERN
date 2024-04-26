import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCookie } from '../utility/getCookie';
import StarRating from '../components/StarRating';

const ProductPage = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/product/productdetails/${productId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'JWT': getCookie('JWT'),
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch product details');
                }

                const data = await response.json();
                setProduct(data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen">Error: {error}</div>;
    }

    if (!product) {
        return <div className="flex justify-center items-center h-screen">Product not found</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 justify-items-start shadow-lg">
                <div className="max-w-full md:max-w-[50%] overflow-hidden ">

                    <img
                        src={product.pictures[0]}
                        alt="product image"
                        className="object-contain w-full h-full aspect-square "
                    />

                </div>
                <div className="max-w-full md:max-w-[50%] ">
                    <div className="flex flex-col justify-center h-full">
                        <h1 className="text-3xl font-semibold mb-2">{product.name}</h1>
                        <p className="text-gray-700 mb-4">{product.description}</p>
                        <p className="text-2xl font-bold text-red-600 mb-4">${product.price}</p>
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
            <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
                {product.reviews.map((review, index) => (
                    <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-md mb-4">
                        <div className="flex items-center mb-2">
                            <StarRating rating={review.rating} />
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductPage;
