import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/productslice';
import { addToCart } from '../store/cartslice';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../utility/getCookie';
import { getUserData } from '../store/userSlice';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const HomePage = () => {
    const navigate = useNavigate();


    const dispatch = useDispatch();
    const { products, loading, error } = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(fetchProducts());
        dispatch(getUserData());
    }, [dispatch]);

    useEffect(() => {
        const cookie = getCookie('JWT');
        if (!cookie) {
            navigate('/login');
        }
    }, []);

    const [selectedCategory, setSelectedCategory] = useState('');

    const addToCartHandler = (product) => {
        dispatch(addToCart(product));
    };

    // Filtered products based on search query and selected category
    const filteredProducts = products.filter((product) => {
        if (selectedCategory) {
            const categoryWords = product.category.toLowerCase().split(" ");
            const selectedWords = selectedCategory.toLowerCase().split(" ");
            return selectedWords.every(word => categoryWords.includes(word));
        } else {
            // If no category is selected, return all products
            return true;
        }
    });
    // 3 products for carousel
    let iphoneFound = false;
    let headphoneFound = false;
    let samsungFound = false;

    const specificProducts = filteredProducts.filter(product => {
        const productName = product.name.toLowerCase();
        if (productName.includes('iphone') && !iphoneFound) {
            iphoneFound = true;
            return true;
        } else if (productName.includes('oneplus') && !headphoneFound) {
            headphoneFound = true;
            return true;
        } else if (productName.includes('samsung') && !samsungFound) {
            samsungFound = true;
            return true;
        }
        return false;
    }).slice(0, 3);

    // Settings for react-slick carousel
    const settings = {
        arrows: false,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        pauseOnHover: true
    };
    const handleProductClick = (productId) => {
        // Navigate to the product details page with the product ID
        navigate(`/product/${productId}`);
    };
    return (
        <div className='flex flex-col items-center '>

            <div className="text-sm md:text-md lg:text-md xl:text-lg flex justify-evenly self-center mt-5 w-[90%]">
                {/* Category Filter */}
                <div className="flex w-full justify-evenly self-center">
                    <button className={selectedCategory === '' ? ' text-gray-700 px-3  border-b-2 border-[#000000] rounded' : ' categorybtn rounded text-black px-3 py-1  border-b-2'} onClick={() => setSelectedCategory('')}>All</button>
                    <button className={selectedCategory === 'electronics' ? ' text-gray-700 px-3  border-b-2 border-[#000000] rounded' : ' categorybtn rounded text-black px-3 py-1  border-b-2'} onClick={() => setSelectedCategory('electronics')}>Electronics</button>
                    <button className={selectedCategory === 'clothing' ? ' text-gray-700 px-3 border-b-2 border-[#000000] rounded' : ' categorybtn rounded text-black px-3 py-1  border-b-2'} onClick={() => setSelectedCategory('clothing')}>Clothing</button>
                    <button className={selectedCategory === 'home decor' ? ' text-gray-700 px-3  border-b-2 border-[#000000] rounded' : ' categorybtn rounded text-black px-3 py-1  border-b-2'} onClick={() => setSelectedCategory('home decor')}>Home</button>
                    <button className={selectedCategory === 'phone' ? ' text-gray-700 px-3  border-b-2 border-[#000000] rounded' : ' categorybtn rounded text-black px-3 py-1  border-b-2'} onClick={() => setSelectedCategory('phone')}>Phones</button>

                </div></div>

            <div className="container mx-auto  py-8 bg-red-80rounded0">




                {/* Carousel */}
                {selectedCategory == '' ? (<><Slider {...settings} className=' w-[100%] mx-auto px-2'>
                    {specificProducts.map((product) => (
                        <div key={product._id} className="text-center px-8" onClick={() => handleProductClick(product._id)}>
                            <img src={product.pictures ? product.pictures[0] : "https://via.placeholder.com/300"} alt={product.name} className="carouselimg" />

                        </div>
                    ))}
                </Slider>
                    <div className=' w-[100vw] content'></div></>) : <></>}

                {/* Product Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-8 px-12">
                    {loading ? (
                        <p>Loading products...</p>
                    ) : error ? (
                        <p>Error: {error}</p>
                    ) : filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            <div key={product._id} className="  shadow-md overflow-hidden p-4 card" onClick={() => handleProductClick(product._id)}>
                                <img src={product.pictures ? product.pictures[0] : "https://via.placeholder.com/300"} alt={product.name} className="w-full h-48 object-cover" />
                                <div className="p-4">
                                    <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                                    <p className="text-gray-800 font-bold mb-2">Price: ${product.price}</p>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            addToCartHandler(product);
                                        }}
                                        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className='relative h-autoflex item text-center'><p className='inline'>No products found.</p>
                        </div>

                    )}
                </div>
            </div>

        </div>
    );
};

export default HomePage;
