import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCookie } from '../utility/getCookie';
import StarRating from '../components/StarRating';

const ProductPage = () => {
    const { productId } = useParams(); // Extract productId from route parameters
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/product/productdetails/${productId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'JWT': getCookie('JWT')
                    }
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


    }, [productId]); // Execute effect when productId changes

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!product) {
        return <div>Product not found</div>;
    }

    return (
        <div>
            <img src={product.pictures[0]} alt="product image" />
            <h1>{product.name}</h1>
            <p>{product.description}</p>
            <p>{product.price}</p>
            {product.reviews && product.reviews.map((review, index) => (
                <div key={index}>

                    <StarRating rating={review.rating} />
                    <p>{review.comment}</p>
                </div>
            ))}
            {/* Render other product details */}
        </div>

    );
};

export default ProductPage;
