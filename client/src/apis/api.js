import { getCookie } from "../utility/getCookie";
const baseUrl = "https://e-commerce-app-mern-bmty.onrender.com/api/";
const token = getCookie("JWT");

//console.log(token, "token_______________________>");

export const login = async (formData) => {
  try {
    const response = await fetch(`${baseUrl}auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();

      return data;
    } else if (response.status === 400) {
      return false;
    }
  } catch (error) {
    console.error("Network error:", error);
    return false;
  }

  formData = null;
};

export const signup = async (formData) => {
  try {
    const response = await fetch(`${baseUrl}auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
      credentials: "include",
    });
    if (response.ok) {
      const data = await response.json();
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

export const fetchAllProducts = async (cookie) => {
  //console.log(cookie, "got from home page+++++++++++++++++>>>");
  try {
    const response = await fetch(`${baseUrl}product/allproducts`, {
      headers: {
        "Content-Type": "application/json",
        JWT: cookie,
      },
      credentials: "include", // Include credentials (cookies)
    });
    const data = await response.json();
    //console.log(getCookie('JWT'));
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const addPhNumber = async (phoneNumber, cookie) => {
  try {
    const response = await fetch(`${baseUrl}user/edituser`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        JWT: cookie,
      },
      body: JSON.stringify({ phoneNumber }),
      credentials: "include", // Include credentials (cookies)
    });
    if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getUserDetails = async () => {
  try {
    //console.log("Fetching user details... from api");
    const response = await fetch(`${baseUrl}user/details`, {
      headers: {
        "Content-Type": "application/json",
        JWT: token,
      },
      credentials: "include", // Include credentials (cookies)
    });

    if (response.ok) {
      const userData = await response.json();
      //console.log("User details:", userData);
      return userData;
    } else {
      //console.log("Failed to fetch user details. Status:", response.status);
      return null;
    }
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw new Error(error.message);
  }
};

export const getSearchResults = async (keyword) => {
  try {
    const response = await fetch(`${baseUrl}product/search/${keyword}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",

        JWT: token,
      },
      credentials: "include", // Include credentials (cookies)
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const searchData = await response.json();

    return searchData;
  } catch (error) {
    console.error("Error fetching search results:", error.message);
    return false;
  }
};

export const addToCartApi = async (data) => {
  try {
    //console.log("triggered api", data);
    const response = await fetch(`${baseUrl}order/addtocart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        JWT: token,
      },
      body: JSON.stringify(data),
      credentials: "include", // Include credentials (cookies)
    });
    if (!response.ok) {
      throw new Error("response was not ok");
    }

    const cartData = await response.json();
    //console.log(cartData, response.status);
    return { cartData, status: response.status };
  } catch (error) {
    console.error("Error fetching search results:", error.message);
    return false;
  }
};

export const fetchCartApi = async (cookie) => {
  try {
    const response = await fetch(`${baseUrl}order/cartdetails`, {
      headers: {
        "Content-Type": "application/json",
        JWT: cookie,
      },
      credentials: "include", // Include credentials (cookies)
    });

    if (!response.ok) {
      throw new Error("Failed to fetch cart details");
    }

    const cartDetails = await response.json();
    return cartDetails;
  } catch (error) {
    console.error("Error fetching cart details:", error);

    return false;
  }
};

export const removeItemApi = async (data) => {
  try {
    const response = await fetch(`${baseUrl}order/updatecart`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        JWT: token,
      },
      body: JSON.stringify(data),
      credentials: "include", // Include credentials (cookies)
    });
    if (!response.ok) {
      throw new Error("response was not ok");
    }

    const cartData = await response.json();
    //console.log(cartData);
    return cartData;
  } catch (error) {
    console.error("Error fetching search results:", error.message);
    return false;
  }
};

export const decreaseItemCountApi = async (data) => {
  try {
    const response = await fetch(`${baseUrl}order/updatecart`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        JWT: token,
      },
      body: JSON.stringify(data),
      credentials: "include", // Include credentials (cookies)
    });
    if (!response.ok) {
      throw new Error("response was not ok");
    }

    const cartData = await response.json();
    //console.log(cartData);
    return cartData;
  } catch (error) {
    console.error("Error fetching search results:", error.message);
    return false;
  }
};

export const clearCartApi = async () => {
  try {
    const response = await fetch(`${baseUrl}order/clearcart`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        JWT: token,
      },
      credentials: "include", // Include credentials (cookies)
    });
    if (!response.ok) {
      throw new Error("response was not ok");
    }

    const cartData = await response.json();
    //console.log(cartData);
    return cartData;
  } catch (error) {
    console.error("Error fetching search results:", error.message);
    return false;
  }
};

export const addAddress = async (address) => {
  try {
    const response = await fetch(`${baseUrl}user/addaddress`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        JWT: token,
      },
      body: JSON.stringify({ ...address }),
      credentials: "include", // Include credentials (cookies)
    });
    if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteAddress = async (id) => {
  try {
    const response = await fetch(`${baseUrl}user/deleteaddress/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        JWT: token,
      },
      credentials: "include", // Include credentials (cookies)
    });
    if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateAddress = async (id, addressData) => {
  try {
    const response = await fetch(`${baseUrl}user/updateaddress/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        JWT: token,
      },
      body: JSON.stringify(addressData),
      credentials: "include", // Include credentials (cookies)
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error updating address:", error);
    throw new Error(error.message);
  }
};

export const fetchOrderDetails = async () => {
  try {
    const response = await fetch(`${baseUrl}order/orderDetails`, {
      headers: {
        "Content-Type": "application/json",
        JWT: token,
      },
      credentials: "include", // Include credentials (cookies)
    });
    if (!response.ok) {
      throw new Error("Failed to fetch order details");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching order details:", error);
  }
};

export const placeOrder = async (products, paymentMode) => {
  try {
    const response = await fetch(`${baseUrl}order/placeorder`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        JWT: token,
      },
      body: JSON.stringify({ products, paymentMode }),
      credentials: "include", // Include credentials (cookies)
    });

    if (!response.ok) {
      throw new Error("Failed to place order");
    }

    return await response.json();
  } catch (error) {
    console.error("Error placing order:", error);
    throw error;
  }
};

export const placeOnlineOrder = async (
  products,
  paymentMode,
  amount,
  phoneNumber
) => {
  try {
    amount = Number(amount) + 5 + 10;
    const response = await fetch(`${baseUrl}order/newPayment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        JWT: token,
      },
      body: JSON.stringify({
        data: { products, paymentMode },
        phoneNumber,
        amount,
      }),
      credentials: "include", // Include credentials (cookies)
    });

    const resData = await response.json();
    //console.log(resData);

    if (resData && resData.data.instrumentResponse.redirectInfo.url) {
      window.location.href = resData.data.instrumentResponse.redirectInfo.url;
    }
  } catch (error) {
    console.error(error);
  }
};

export const serverAlive = async () => {
  try {
    const response = await fetch(
      `https://e-commerce-app-mern-bmty.onrender.com/health`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include credentials (cookies)
      }
    );

    // Parse the response as JSON since you are using res.json()
    const data = await response.json();
    console.log("Server response:", data);

    // Return the parsed response data to the caller
    return data;
  } catch (error) {
    console.error("Error in serverAlive:", error.message);
    throw new Error(error.message);
  }
};
