import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUserData, updateUserAddress } from "../reducers/userSlice";
import { fetchOrderDetails } from "../apis/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(userData);
  const [selectedCategory, setSelectedCategory] = useState("personalInfo");
  const [editedAddress, setEditedAddress] = useState(null);
  const [editedAddressIndex, setEditedAddressIndex] = useState(null);
  const [orders, setOrders] = useState([]);

  const handleEditAddressClick = (address, index) => {
    // Make sure we have all the necessary fields
    const addressToEdit = {
      _id: address._id,
      streetname: address.streetname || "",
      landmark: address.landmark || "",
      city: address.city || "",
      state: address.state || "",
      pincode: address.pincode || "",
      type: address.type || "home",
    };

    setEditedAddress(addressToEdit);
    setEditedAddressIndex(index);
    setIsEditing(true);
  };

  const handleCancelAddressEdit = (e) => {
    if (e) e.preventDefault();
    setEditedAddress(null);
    setEditedAddressIndex(null);
    setIsEditing(false);
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();

    if (!editedAddress || !editedAddress._id) {
      toast.error("Invalid address data");
      return;
    }

    // Create a clean address object with only the fields needed by the API
    const addressData = {
      streetname: editedAddress.streetname || "",
      landmark: editedAddress.landmark || "",
      city: editedAddress.city || "",
      state: editedAddress.state || "",
      pincode: editedAddress.pincode || "",
      type: editedAddress.type || "home",
    };

    // Get the address ID from the edited address
    const addressId = editedAddress._id;

    // Debug log
    console.log("Updating address with ID:", addressId);
    console.log("Address data being sent:", addressData);

    // Dispatch the updateUserAddress action
    dispatch(updateUserAddress(addressId, addressData))
      .then((success) => {
        if (success) {
          toast.success("Address updated successfully");
        } else {
          toast.error("Failed to update address");
        }
      })
      .catch((error) => {
        toast.error("Error updating address");
        console.error(error);
      });

    setEditedAddress(null);
    setEditedAddressIndex(null);
    setIsEditing(false);
  };

  const handleAddressInputChange = (e) => {
    const { name, value } = e.target;
    setEditedAddress((prevAddress) => ({ ...prevAddress, [name]: value }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleEditClick = () => setIsEditing(true);
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedData(userData);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);
  };

  useEffect(() => {
    dispatch(getUserData());
    const fetchOrders = async () => {
      const response = await fetchOrderDetails();
      setOrders(response);
    };
    fetchOrders();
  }, [dispatch]);

  const renderContent = () => {
    switch (selectedCategory) {
      case "personalInfo":
        return (
          <div className="bg-white rounded-lg p-6 shadow-md overflow-y-auto h-[50vh] ">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold text-gray-800">
                Personal Information
              </h3>
              {!isEditing ? (
                <button className="shine-btn rounded" onClick={handleEditClick}>
                  Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button className="shine-btn rounded" onClick={handleSubmit}>
                    Save
                  </button>
                  <button
                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-600 text-sm font-semibold mb-2">
                  Email Address
                </label>
                {!isEditing ? (
                  <p className="text-gray-700">{userData.email}</p>
                ) : (
                  <input
                    type="email"
                    name="email"
                    value={editedData.email}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 px-4 py-2 rounded-lg"
                  />
                )}
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-semibold mb-2">
                  Phone Number
                </label>
                {!isEditing ? (
                  <p className="text-gray-700">{userData.phoneNumber}</p>
                ) : (
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={editedData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 px-4 py-2 rounded-lg"
                  />
                )}
              </div>
            </form>
          </div>
        );

      case "addresses":
        return (
          <div className="bg-white rounded-lg p-6 shadow-md overflow-y-auto h-[50vh]">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">
              My Addresses
            </h3>
            {userData.address?.length === 0 ? (
              <p className="text-gray-600">No addresses added yet.</p>
            ) : (
              userData.address.map((address, index) => (
                <div
                  key={index}
                  className="border p-4 rounded-lg mb-4 bg-gray-50"
                >
                  {editedAddressIndex === index ? (
                    <form onSubmit={handleSaveAddress}>
                      {[
                        "streetname",
                        "landmark",
                        "city",
                        "state",
                        "pincode",
                      ].map((field) => (
                        <div className="mb-3" key={field}>
                          <label className="block text-gray-600 mb-1 capitalize">
                            {field}
                          </label>
                          <input
                            type="text"
                            name={field}
                            value={editedAddress?.[field] || ""}
                            onChange={handleAddressInputChange}
                            className="w-full border border-gray-300 px-4 py-2 rounded-lg"
                          />
                        </div>
                      ))}
                      <div className="mb-3">
                        <label className="block text-gray-600 mb-1 capitalize">
                          Address Type
                        </label>
                        <select
                          name="type"
                          value={editedAddress?.type || "home"}
                          onChange={handleAddressInputChange}
                          className="w-full border border-gray-300 px-4 py-2 rounded-lg"
                        >
                          <option value="home">Home</option>
                          <option value="work">Work</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button type="submit" className="shine-btn rounded">
                          Save
                        </button>
                        <button
                          onClick={handleCancelAddressEdit}
                          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      {Object.entries(address)
                        .filter(
                          ([key]) => !key.startsWith("_") && key !== "__v"
                        )
                        .map(([key, value]) => (
                          <p key={key} className="text-gray-700">
                            <span className="font-semibold capitalize">
                              {key}:
                            </span>{" "}
                            {value}
                          </p>
                        ))}
                      <button
                        className="mt-3 shine-btn rounded"
                        onClick={() => handleEditAddressClick(address, index)}
                      >
                        Edit Address
                      </button>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        );

      case "orders":
        return (
          <div className="bg-white rounded-lg p-6 shadow-md overflow-y-auto h-[50vh]">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">
              My Orders
            </h3>
            {orders.length > 0 ? (
              orders.map((order) => (
                <div key={order._id} className="border p-4 rounded-lg mb-4">
                  <p className="text-gray-700 mb-2">
                    Order Placed on:{" "}
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                  <ul className="ml-4 list-disc">
                    {order.products.map((product) => (
                      <li
                        key={product.productId._id}
                        className="flex items-center gap-2 mb-2"
                      >
                        <img
                          src={product.productId.pictures[0]}
                          alt={product.productId.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                        <div>
                          <p className="text-gray-800">
                            {product.productId.name}
                          </p>
                          <p className="text-gray-600">
                            ₹ {product.productId.price.toFixed(2)}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No previous orders found.</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row max-w-7xl mx-auto px-6 py-[20vh] gap-8 min-h-[800px]">
      <ToastContainer position="top-right" autoClose={3000} />
      {/* Sidebar */}
      <div className="lg:w-1/4 w-full h-[50vh] ">
        <div className="bg-white rounded-lg shadow-md p-6 h-full">
          <div className="flex flex-col items-center">
            {userData?.profilePic?.url ? (
              <img
                src={userData.profilePic.url}
                alt="Profile"
                className="w-24 h-24 rounded-full mb-2 object-cover"
              />
            ) : (
              <img
                src="https://res.cloudinary.com/dmb0ooxo5/image/upload/v1706984465/ftfdy0ic7ftz2awihjts.jpg"
                alt="Default"
                className="w-24 h-24 rounded-full mb-2 object-cover"
              />
            )}
            <h2 className="text-xl font-bold text-gray-800">
              {userData?.name}
            </h2>
          </div>
          <div className="mt-8 flex flex-col gap-4">
            {["personalInfo", "addresses", "orders"].map((category) => (
              <button
                key={category}
                className={`w-full text-left px-4 py-2 rounded-lg font-semibold ${
                  selectedCategory === category
                    ? "shine-btn"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category === "personalInfo"
                  ? "Personal Info"
                  : category === "addresses"
                  ? "Addresses"
                  : "Orders"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:w-3/4 w-full h-full">{renderContent()}</div>
    </div>
  );
};

export default Profile;
