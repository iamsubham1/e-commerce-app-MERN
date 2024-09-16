import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCookie } from '../utility/getCookie';
import StarRating from '../components/StarRating';
import { handleAddToCart } from '../reducers/cartslice';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';

const ProductPage = () => {
    const dispatch = useDispatch();
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [activeTab, setActiveTab] = useState('description');
    const [quantity, setQuantity] = useState(1);  // For quantity
    const [pincode, setPincode] = useState('');  // For pincode input
    const [isEligible, setIsEligible] = useState(null);  // For delivery eligibility result
    const { loading: addingToCart } = useSelector((state) => state.cart);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`https://e-commerce-app-mern-bmty.onrender.com/api/product/productdetails/${productId}`, {
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

    const addToCartHandler = (product) => {
        const payload = {
            "productId": product,
            "quantity": quantity
        }
        dispatch(handleAddToCart(payload));
        notify("Item added to cart");
    };

    const checkDeliveryEligibility = () => {
        // Logic for checking delivery eligibility, here mocked with a sample condition
        if (pincode === "123456") {
            setIsEligible(true);
        } else {
            setIsEligible(false);
        }
    };

    const incrementQuantity = () => setQuantity((prev) => prev + 1);
    const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

    if (loading) {
        return <div className="w-full h-[80vh] flex justify-center items-center">
            <span className="loader"></span>
        </div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen">Error: {error}</div>;
    }

    if (!product) {
        return <div className="flex justify-center items-center h-screen">Product not found</div>;
    }

    const notify = (message) => toast.success(message);

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Toast Notifications */}
            <ToastContainer
                position="top-right"
                autoClose={1500}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable

            />

            <div className="flex flex-col md:flex-row md:space-x-8">
                {/* Image and Thumbnails Section */}
                <div className="flex flex-col md:w-1/2 p-4 items-center">
                    <img
                        src={selectedImage}
                        alt="Product"
                        className="object-contain w-full h-auto max-h-[500px] aspect-square"
                    />
                    <div className="flex overflow-x-auto py-4">
                        {product.pictures.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt={`Thumbnail ${index}`}
                                className="w-16 h-16 md:w-20 md:h-20 cursor-pointer mx-1 border-2 border-[#878787]"
                                onClick={() => handleThumbnailClick(image)}
                            />
                        ))}
                    </div>
                </div>

                {/* Vertical Divider for Large Screens */}
                <div className="hidden md:block border-l border-2 border-[#e7e7e7] min-h-full"></div>

                {/* Product Details Section */}
                <div className="flex flex-col md:w-1/2 p-4">
                    <h1 className="text-2xl md:text-3xl font-semibold mb-2">{product.name}</h1>
                    <p className="text-[#7b7b7b] mb-4 capitalize">{product.description}</p>
                    <p className="text-xl md:text-2xl font-bold text-[#040404] mb-4">${product.price}</p>

                    {/* Quantity Component */}
                    <div className="mb-4">
                        <label className="block font-semibold mb-2">Quantity</label>
                        <div className="flex">
                            <button
                                onClick={decrementQuantity}
                                className="px-3 py-1 bg-gray-300 text-gray-700 rounded-l hover:bg-gray-400"
                            >
                                -
                            </button>
                            <p className='p-2'>{quantity}</p>
                            <button
                                onClick={incrementQuantity}
                                className="px-3 py-1 bg-gray-300 text-gray-700 rounded-r hover:bg-gray-400"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                        className={`shine-btn w-[200px] ${addingToCart ? 'disabled-button' : ''}`}
                        onClick={() => addToCartHandler(product._id)}
                        disabled={addingToCart}
                    >
                        Add to Cart
                    </button>

                    {/* Pincode for Delivery Eligibility */}
                    <div className="mt-12">
                        <label className="block font-semibold mb-2">Enter Pincode for Delivery</label>
                        <div className='flex flex-col md:flex-row gap-4 py-2'>
                            <input
                                type="text"
                                value={pincode}
                                onChange={(e) => setPincode(e.target.value)}
                                className="px-3 py-2 border-2 border-black"
                                placeholder="Enter pincode"
                            />
                            <button
                                className="bg-[#0e0e0e] text-sm px-3 rounded text-[#a8a8a8]"
                                onClick={checkDeliveryEligibility}
                            >
                                Check Eligibility
                            </button>
                        </div>
                        {isEligible === true && (
                            <p className="text-green-500 mt-2">Eligible for delivery.</p>
                        )}
                        {isEligible === false && (
                            <p className="text-red-500 mt-2">Not eligible for delivery.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Tab Layout */}
            <div className="mt-8">
                <div className="flex space-x-4">
                    <button
                        className={`tab-button px-4 py-2 ${activeTab === 'description' ? 'active' : ''}`}
                        onClick={() => setActiveTab('description')}
                    >
                        Description
                    </button>
                    <button
                        className={`tab-button px-4 py-2 ${activeTab === 'reviews' ? 'active' : ''}`}
                        onClick={() => setActiveTab('reviews')}
                    >
                        Reviews
                    </button>
                </div>

                <div className="tab-content mt-4">
                    {activeTab === 'description' && (
                        <div>
                            <p>{product.description}</p>
                        </div>
                    )}

                    {activeTab === 'reviews' && (
                        <div>
                            {product.reviews.length > 0 ? (
                                product.reviews.map((review, index) => (
                                    <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-md mb-4">
                                        <div className="flex items-center mb-2">
                                            <img
                                                src={review?.userId?.profilePic?.url || "https://via.placeholder.com/50"}
                                                alt={review?.userId?.name}
                                                className="w-10 h-10 rounded-full mr-2"
                                            />
                                            <div>
                                                <p className="font-bold">{review?.userId?.name}</p>
                                                <StarRating rating={review?.rating} />
                                            </div>
                                        </div>
                                        <p>{review?.comment}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No reviews yet.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
