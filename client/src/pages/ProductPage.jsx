// ProductPage component
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCookie } from '../utility/getCookie';
import StarRating from '../components/StarRating';
import { handleAddToCart } from '../reducers/cartslice';
import { useDispatch, useSelector } from 'react-redux';

const ProductPage = () => {
    const dispatch = useDispatch();
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

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
                setSelectedImage(data.pictures[0]);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    const handleThumbnailClick = (image) => {
        setSelectedImage(image);
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen">Error: {error}</div>;
    }

    if (!product) {
        return <div className="flex justify-center items-center h-screen">Product not found</div>;
    }

    const addToCartHandler = (productId) => {
        const params = {
            "productId": productId,
            "quantity": 1
        }
        dispatch(handleAddToCart(params));
    };

    return (
        <div className="container mx-auto px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 justify-items-start shadow-lg p-4">
                <div className="max-w-full flex flex-col md:max-w-[50%] relative p-4 ">
                    <img
                        src={selectedImage}
                        alt="product image"
                        className="object-contain w-full h-full md:h-auto aspect-square"
                    />
                    <div className=" left-0 w-full max-auto flex overflow-x-auto overflow-y-hidden justify-center   py-4">
                        {product.pictures.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt={`Thumbnail ${index}`}
                                className="w-16 h-16 md:w-12 md:h-12 cursor-pointer mx-1 border-2 border-[#878787] "
                                onClick={() => handleThumbnailClick(image)}
                            />
                        ))}
                    </div>
                </div>

                <div className="max-w-full md:max-w-[70%] ">
                    <div className="flex flex-col justify-center h-full">
                        <h1 className="text-3xl font-semibold mb-2">{product.name}</h1>
                        <p className="text-[#7b7b7b] mb-4">{product.description}</p>
                        <p className="text-2xl font-bold text-[#040404] mb-4">${product.price}</p>
                        <button className="shine-btn max-w-[55%]"
                            onClick={() => {
                                addToCartHandler(product._id);
                            }}>
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
