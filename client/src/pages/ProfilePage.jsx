import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUserData } from '../reducers/userSlice';

const Profile = () => {
    const dispatch = useDispatch();
    const { userData } = useSelector(state => state.user);

    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState(userData);
    const [selectedCategory, setSelectedCategory] = useState('personalInfo');

    useEffect(() => {
        dispatch(getUserData());
    }, [dispatch]);

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
        console.log("Edited Data:", editedData);
        setIsEditing(false);
    };

    const renderContent = () => {
        switch (selectedCategory) {
            case 'personalInfo':
                return (
                    <div className='h-[50vh] overflow-y-scroll'>
                        {!isEditing ? (
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2" onClick={handleEditClick}>Edit</button>
                        ) : (
                            <div>
                                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2" onClick={handleSubmit}>Save</button>
                                <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded" onClick={handleCancelEdit}>Cancel</button>
                            </div>
                        )}
                        <h3 className="text-lg font-bold mb-4">Personal Info</h3>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email:</label>
                                {!isEditing ? (
                                    <p className="text-gray-800">{userData.email}</p>
                                ) : (
                                    <input type="email" id="email" name="email" value={editedData.email} onChange={handleInputChange} className="w-full border border-gray-300 px-3 py-2 rounded" />
                                )}
                            </div>
                            <div className="mb-4 ">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phoneNumber">Phone Number:</label>
                                {!isEditing ? (
                                    <p className="text-gray-800">{userData.phoneNumber}</p>
                                ) : (
                                    <input type="tel" id="phoneNumber" name="phoneNumber" value={editedData.phoneNumber} onChange={handleInputChange} className="w-full border border-gray-300 px-3 py-2 rounded" />
                                )}
                            </div>
                        </form>
                    </div>
                );
            case 'addresses':
                return (
                    <div className='max-h-[50vh] h-[50vh] overflow-y-scroll'>
                        <h3 className="text-lg font-bold mb-2">Addresses</h3>
                        {userData.address?.length === 0 ? (
                            <p className="text-gray-800">No addresses yet</p>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {userData.address?.map((address, index) => (
                                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 mr-4">
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
                );
            case 'orders':
                return (
                    <div className='h-[50vh] overflow-y-scroll'>
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
                );
            default:
                return null;
        }
    };


    return (
        <div className="max-w-6xl mx-auto px-4 py-8 flex min-h-[100vh]">
            <div className="mr-8">
                <div className="mb-4 flex flex-col items-center justify-center h-full">
                    <button className={`block text-left w-full py-2 px-4 mb-2 ${selectedCategory === 'personalInfo' && 'bg-gray-200'}`} onClick={() => setSelectedCategory('personalInfo')}>Personal Info</button>
                    <button className={`block text-left w-full py-2 px-4 mb-2 ${selectedCategory === 'addresses' && 'bg-gray-200'}`} onClick={() => setSelectedCategory('addresses')}>Addresses</button>
                    <button className={`block text-left w-full py-2 px-4 mb-2 ${selectedCategory === 'orders' && 'bg-gray-200'}`} onClick={() => setSelectedCategory('orders')}>Orders</button>
                </div>
            </div>
            <div className="flex-grow">
                <div className="mb-4 flex flex-col items-center">
                    {userData && userData.profilePic ? (
                        <>
                            <img className="w-24 h-24 rounded-full mb-2" src={userData.profilePic.url} alt={userData.profilePic.name} />

                        </>
                    ) : <>
                        <img className="w-24 h-24 rounded-full mb-2" src="https://res.cloudinary.com/dmb0ooxo5/image/upload/v1706984465/ftfdy0ic7ftz2awihjts.jpg" />

                    </>}
                    <h2 className="text-2xl font-bold">{userData.name}</h2>
                </div>
                <div className="border border-gray-300 p-4">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default Profile;
