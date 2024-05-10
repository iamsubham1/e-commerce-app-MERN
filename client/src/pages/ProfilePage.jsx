import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const Profile = () => {
    const { userData } = useSelector(state => state.user);
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState(userData);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedData(userData);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you can dispatch an action to update the user data in the Redux store
        // For simplicity, I'm just logging the edited data
        console.log("Edited Data:", editedData);
        setIsEditing(false);
    };

    return (
        <div className="max-w-xl mx-auto px-4 py-8">
            <div className="flex items-center mb-4">
                <img className="w-24 h-24 rounded-full mr-4" src={userData.profilePic.url} alt={userData.profilePic.name} />
                <div>
                    <h2 className="text-2xl font-bold">{userData.name}</h2>
                    {!isEditing ? (
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2" onClick={handleEditClick}>Edit</button>
                    ) : (
                        <div>
                            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2" onClick={handleSubmit}>Save</button>
                            <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded" onClick={handleCancelEdit}>Cancel</button>
                        </div>
                    )}
                </div>
            </div>

            <div className="border border-gray-300 p-4">
                <h3 className="text-lg font-bold mb-4">Details</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email:</label>
                        {!isEditing ? (
                            <p className="text-gray-800">{userData.email}</p>
                        ) : (
                            <input type="email" id="email" name="email" value={editedData.email} onChange={handleInputChange} className="w-full border border-gray-300 px-3 py-2 rounded" />
                        )}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phoneNumber">Phone Number:</label>
                        {!isEditing ? (
                            <p className="text-gray-800">{userData.phoneNumber}</p>
                        ) : (
                            <input type="tel" id="phoneNumber" name="phoneNumber" value={editedData.phoneNumber} onChange={handleInputChange} className="w-full border border-gray-300 px-3 py-2 rounded" />
                        )}
                    </div>
                    {/* Display orders */}
                    <div className="mb-4">
                        <h3 className="text-lg font-bold mb-2">Orders</h3>
                        {userData.orders?.length === 0 ? (
                            <p className="text-gray-800">No orders yet</p>
                        ) : (
                            <ul className="list-disc ml-4">
                                {userData.orders?.map(orderId => (
                                    <li key={orderId}>Order ID: {orderId}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                    {/* Display addresses */}
                    <div>
                        <h3 className="text-lg font-bold mb-2">Addresses</h3>
                        {userData.address?.length === 0 ? (
                            <p className="text-gray-800">No addresses yet</p>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {userData.address?.map((address, index) => (
                                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 mr-4">
                                        <p className="text-gray-800 mb-2"><span className="font-semibold">Street Name:</span> {address.streetname}</p>

                                        <p className="text-gray-800 mb-2"><span className="font-semibold">Street Name:</span> {address.streetname}</p>
                                        <p className="text-gray-800 mb-2"><span className="font-semibold">Landmark:</span> {address.landmark}</p>
                                        <p className="text-gray-800 mb-2"><span className="font-semibold">City:</span> {address.city}</p>
                                        <p className="text-gray-800 mb-2"><span className="font-semibold">State:</span> {address.state}</p>
                                        <p className="text-gray-800 mb-2"><span className="font-semibold">Pincode:</span> {address.pincode}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;
