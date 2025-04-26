import React, { useState, useEffect } from "react";
import { getCookie } from "../utility/getCookie";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Phones = () => {
  const [appleProducts, setAppleProducts] = useState([]);
  const [samsungProducts, setSamsungProducts] = useState([]);
  const [budgetProducts, setBudgetProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://e-commerce-app-mern-bmty.onrender.com/api/product/category/mobile",
          {
            headers: {
              JWT: getCookie("JWT"),
            },
          }
        );
        const data = await response.json();
        const apple = data.filter((product) => product.brand === "Apple");
        const samsung = data.filter((product) => product.brand === "Samsung");
        const budget = data.filter(
          (product) => product.brand !== "Apple" && product.brand !== "Samsung"
        );

        setAppleProducts(apple);
        setSamsungProducts(samsung);
        setBudgetProducts(budget);
        setLoading(false);
      } catch (error) {
        setError("Error fetching products");
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-[80vh] flex justify-center items-center">
        <span className="loader"></span>
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  const productCard = (product) => (
    <div
      key={product._id}
      className="product-card"
      onClick={() => navigate(`/product/${product._id}`)}
    >
      <img
        src={
          product.pictures
            ? product.pictures[0]
            : "https://via.placeholder.com/300"
        }
        alt={product.name}
        className="product-image"
      />
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="text-gray-700">₹ {product.price}</p>
    </div>
  );

  const sliderSettings = {
    arrows: false,
    infinite: true,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Banner */}
      <div className="hero-banner w-full h-64 bg-cover bg-center mb-8 flex items-center justify-center">
        <div className="bg-black bg-opacity-50 p-4 rounded-lg">
          <h1 className="text-4xl text-white font-bold">
            Shop the Latest Phones
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Apple Section */}
        <div>
          <h2 className="section-header">Apple</h2>
          <div className="grid grid-cols-2 gap-4">
            {appleProducts.map((product) => (
              <div
                key={product._id}
                className="product-card"
                onClick={() => navigate(`/product/${product._id}`)}
              >
                <img
                  src={
                    product.pictures
                      ? product.pictures[0]
                      : "https://via.placeholder.com/300"
                  }
                  alt={product.name}
                  className="product-image"
                />
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-gray-700">${product.price}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Samsung Section */}
        <div>
          <h2 className="section-header">Samsung</h2>
          <Slider {...sliderSettings}>
            {samsungProducts.map((product) => (
              <div key={product._id}>{productCard(product)}</div>
            ))}
          </Slider>
        </div>
      </div>

      {/* Budget Section */}
      <div className="mt-8">
        <h2 className="section-header">Budget Phones</h2>
        <Slider {...sliderSettings}>
          {budgetProducts.map((product) => (
            <div key={product._id}>{productCard(product)}</div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Phones;
