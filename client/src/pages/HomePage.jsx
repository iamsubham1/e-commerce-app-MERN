import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../reducers/productslice";
import { handleAddToCart } from "../reducers/cartslice";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../utility/getCookie";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ToastContainer, toast } from "react-toastify";

const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    products,
    loading: productsLoading,
    error,
  } = useSelector((state) => state.products);
  const { loading: addingToCart } = useSelector((state) => state.cart);

  //console.log(addingToCart);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const perPage = 10;

  useEffect(() => {
    const cookie = getCookie("JWT");
    console.log(cookie, "===================");
    if (!cookie) {
      navigate("/login");
    }
    dispatch(fetchProducts(cookie));
  }, []);

  const addToCartHandler = async (product) => {
    const payload = {
      productId: product,
      quantity: 1,
    };

    try {
      const responseStatus = await dispatch(handleAddToCart(payload));

      // Notify based on response status
      if (responseStatus === 200) {
        notify("Item added to cart successfully!", "success");
      } else {
        notify("Item not in stock", "error");
      }
    } catch (error) {
      notify("An error occurred while adding item to cart.", "error");
    }
  };

  // Filtered products based on search query and selected category
  const filteredProducts = products?.filter((product) => {
    if (selectedCategory) {
      const categoryWords = product.category.toLowerCase().split(" ");
      const selectedWords = selectedCategory.toLowerCase().split(" ");
      return selectedWords.every((word) => categoryWords.includes(word));
    } else {
      // If no category is selected, return all products
      return true;
    }
  });

  // 3 products for carousel
  let iphoneFound = false;
  let headphoneFound = false;
  let samsungFound = false;

  const carouselProducts = filteredProducts.filter((product) => {
    const productName = product.name.toLowerCase();
    if (productName.includes("iphone") && !iphoneFound) {
      iphoneFound = true;
      return true;
    } else if (productName.includes("oneplus") && !headphoneFound) {
      headphoneFound = true;
      return true;
    } else if (productName.includes("samsung") && !samsungFound) {
      samsungFound = true;
      return true;
    }
    return false;
  });

  // Settings for react-slick carousel
  const settings = {
    arrows: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
  };

  const handleProductClick = (productId) => {
    // Navigate to the product details page with the product ID
    navigate(`/product/${productId}`);
  };

  // Calculate total number of pages
  const totalPages = Math.ceil(filteredProducts.length / perPage);

  // Pagination Controls
  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Get products for current page
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const notify = (message, type) => {
    if (type.toLowerCase() === "success") {
      toast.success(message);
    } else if (type.toLowerCase() === "error") {
      toast.error(message);
    } else {
      toast.info(message); // Default to info if type is not specified
    }
  };

  return (
    <>
      {productsLoading ? (
        <div className="w-[100vw] h-[80vh] overflow flex justify-center items-center">
          <span className="loader"></span>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          {addingToCart && (
            <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
              <div className="loader"></div>
            </div>
          )}
          {/* toast */}
          <ToastContainer
            position="top-right"
            autoClose={1500}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />

          <div className="text-sm md:text-md lg:text-md xl:text-lg flex justify-evenly self-center mt-5 w-[90%] ">
            {/* Category Filter */}
            <div className="flex w-full justify-evenly self-center gap-[3px] ">
              <button
                className={
                  selectedCategory === ""
                    ? "text-gray-700 px-3 border-b-2 border-[#000000] rounded"
                    : "categorybtn rounded text-black px-3 py-1 border-b-2"
                }
                onClick={() => setSelectedCategory("")}
              >
                All
              </button>
              <button
                className={
                  selectedCategory === "electronics"
                    ? "text-gray-700 px-3 border-b-2 border-[#000000] rounded"
                    : "categorybtn rounded text-black px-3 py-1 border-b-2"
                }
                onClick={() => setSelectedCategory("electronics")}
              >
                Electronics
              </button>
              <button
                className={
                  selectedCategory === "laptop"
                    ? "text-gray-700 px-3 border-b-2 border-[#000000] rounded"
                    : "categorybtn rounded text-black px-3 py-1 border-b-2"
                }
                onClick={() => setSelectedCategory("laptop")}
              >
                Laptops
              </button>
              <button
                className={
                  selectedCategory === "headphone"
                    ? "text-gray-700 px-3 border-b-2 border-[#000000] rounded"
                    : "categorybtn rounded text-black px-3 py-1 border-b-2"
                }
                onClick={() => setSelectedCategory("headphone")}
              >
                Audio
              </button>
              <button
                className={
                  selectedCategory === "mobile"
                    ? "text-gray-700 px-3 border-b-2 border-[#000000] rounded"
                    : "categorybtn rounded text-black px-3 py-1 border-b-2"
                }
                onClick={() => setSelectedCategory("mobile")}
              >
                Phones
              </button>
            </div>
          </div>

          {selectedCategory === "mobile" && (
            <div className="w-full h-[9vh] mt-7 grid place-content-center bannerBg text-white">
              <h1 className="mx-auto">Top in Smartphones</h1>
            </div>
          )}

          <div className="container mx-auto">
            {/* Carousel */}
            {selectedCategory === "" && (
              <>
                <Slider {...settings} className="w-[100%] mx-auto px-2 ">
                  {carouselProducts.map((product) => (
                    <div
                      key={product._id}
                      className="text-center px-8"
                      onClick={() => handleProductClick(product._id)}
                    >
                      <img
                        src={
                          product.banner
                            ? product.banner
                            : "https://via.placeholder.com/300"
                        }
                        alt={product.name}
                        className="carouselimg"
                      />
                    </div>
                  ))}
                </Slider>
                <div className=" max-w-[80vw] mx-auto content"></div>
              </>
            )}

            {/* Product Grid */}
            {selectedCategory == "" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10 mt-8 px-12">
                {productsLoading ? (
                  <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
                    <div className="loader"></div>
                  </div>
                ) : error ? (
                  <p>Error: {error}</p>
                ) : currentProducts.length > 0 ? (
                  currentProducts.map((product) => (
                    <div
                      key={product._id}
                      className="shadow-md overflow-hidden flex p-4 card flex-col items-center justify-center"
                      onClick={() => handleProductClick(product._id)}
                    >
                      <img
                        src={
                          product.pictures
                            ? product.pictures[0]
                            : "https://via.placeholder.com/300"
                        }
                        alt={product.name}
                        className="w-48 h-48 object-contain"
                      />
                      <div className="p-4 flex flex-col items-center ">
                        <h2 className="text-xl font-semibold mb-2 overflow-hidden whitespace-nowrap">
                          {product.name}
                        </h2>
                        <p className="text-gray-800 font-bold mb-2">
                          ₹ {product.price}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCartHandler(product._id);
                            disabled = { addingToCart };
                          }}
                          className={`mt-4 text-white font-bold py-2 px-4 rounded primary-button ${
                            addingToCart && "disabled-button"
                          }`}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="relative h-autoflex item text-center">
                    <p className="inline">No products found.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10 mt-8 px-12">
                {productsLoading ? (
                  <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
                    <div className="loader"></div>
                  </div>
                ) : error ? (
                  <p>Error: {error}</p>
                ) : filteredProducts.length > 0 ? (
                  // If a specific category is selected, render only the first 5 products for that category
                  filteredProducts.slice(0, 5).map((product) => (
                    <div
                      key={product._id}
                      className="shadow-md overflow-hidden p-4 card"
                      onClick={() => handleProductClick(product._id)}
                    >
                      <img
                        src={
                          product.pictures
                            ? product.pictures[0]
                            : "https://via.placeholder.com/300"
                        }
                        alt={product.name}
                        className="w-48 h-48 object-contain"
                      />
                      <div className="p-4">
                        <h2 className="text-xl font-semibold mb-2 overflow-hidden whitespace-nowrap">
                          {product.name}
                        </h2>
                        <p className="text-gray-800 font-bold mb-2">
                          {product.price}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCartHandler(product);
                            disabled = { addingToCart };
                          }}
                          className="mt-4 text-white font-bold py-2 px-4 rounded primary-button"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="relative h-autoflex item text-center">
                    <p className="inline">No products found.</p>
                  </div>
                )}
              </div>
            )}

            {/* Pagination Controls for all products and redirect for categories */}

            {selectedCategory == "" ? (
              <div className="flex justify-center mt-8">
                <button
                  onClick={prevPage}
                  className="pagination-arrow"
                  disabled={currentPage === 1}
                >
                  &lt; Prev &nbsp; &nbsp;&nbsp;
                </button>
                {[...Array(totalPages).keys()].map((num) => (
                  <button
                    key={num + 1}
                    onClick={() => setCurrentPage(num + 1)}
                    className={
                      currentPage === num + 1
                        ? "pagination-number active"
                        : "pagination-number"
                    }
                  >
                    {num + 1}
                  </button>
                ))}
                <button
                  onClick={nextPage}
                  className="pagination-arrow"
                  disabled={currentPage === totalPages}
                >
                  &nbsp; &nbsp;&nbsp; Next &gt;
                </button>
              </div>
            ) : (
              <div className="w-full h-[9vh] mt-[5%] grid place-content-center text-black ">
                <button
                  className="shine-btn rounded-md"
                  onClick={() => {
                    navigate(`/${selectedCategory}`);
                  }}
                >
                  See more..
                  <svg fill="currentColor" viewBox="0 0 24 24" className="icon">
                    <path
                      clipRule="evenodd"
                      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z"
                      fillRule="evenodd"
                    ></path>
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default HomePage;
