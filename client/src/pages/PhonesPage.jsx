import React, { useState, useEffect } from 'react';
import { getCookie } from '../utility/getCookie';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Phones = () => {
    const [appleProducts, setAppleProducts] = useState([]);
    const [samsungProducts, setSamsungProducts] = useState([]);
    const [budgetProducts, setBudgetProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:8080/api/product/category/mobile', {
                    headers: {
                        JWT: getCookie('JWT')
                    }
                });
                const data = await response.json();
                // Filter products into Apple, Samsung, and Budget categories
                const apple = data.filter(product => product.brand === 'Apple');
                const samsung = data.filter(product => product.brand === 'Samsung');
                const budget = data.filter(product => product.brand !== 'Apple' && product.brand !== 'Samsung');

                setAppleProducts(apple);
                setSamsungProducts(samsung);
                setBudgetProducts(budget);
                setLoading(false);
            } catch (error) {
                setError('Error fetching products');
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="w-[100vw] h-[80vh] overflow flex justify-center items-center">
                <span className="loader"></span>
            </div>
        );
    }
    if (error) {
        return <p>{error}</p>;
    }

    const productCard = (product) => (
        <div key={product._id} className='w-full h-full p-4 ' onClick={() => {
            navigate(`/product/${product._id}`);
        }}>
            <img src={product.pictures ? product.pictures[0] : "https://via.placeholder.com/300"} alt={product.name} className="w-full aspect-square h-full object-contain " />
        </div>
    );

    const sliderSettings = {
        arrows: false,
        infinite: true,
        slidesToShow: 2,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        pauseOnHover: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    };

    return (
        <div className="mx-auto px-4 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6 ">
                <div>
                    <h2 className="text-2xl font-bold mb-4">Apple</h2>
                    <div className="grid grid-cols-2  h-[50%] gap-2">
                        {appleProducts.map(product => (

                            <div key={product._id} className='w-full h-full' onClick={() => {
                                navigate(`/product/${product._id}`);
                            }}>
                                <img src={product.pictures ? product.pictures[0] : "https://via.placeholder.com/300"} alt={product.name} className="w-full h-full object-contain" />
                            </div>

                        ))}
                    </div>
                </div>
                <div>
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Samsung</h2>
                        <Slider {...sliderSettings}>
                            {samsungProducts.map(product => (
                                <div key={product._id}>{productCard(product)}</div>
                            ))}
                        </Slider>
                    </div>
                    <div className="mt-8">
                        <h2 className="text-2xl font-bold mb-4">Budget</h2>
                        <Slider {...sliderSettings}>
                            {budgetProducts.map(product => (
                                <div key={product._id}>{productCard(product)}</div>
                            ))}
                        </Slider>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Phones;
