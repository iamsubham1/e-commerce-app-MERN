import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const Profile = () => {
    const { userData } = useSelector(state => state.user);
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState(userData);
    const [activeSection, setActiveSection] = useState('personalInfo');

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

    const handleSectionClick = (section) => {
        setActiveSection(section);
    };

    return (
        <div className="max-w-xl mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row lg:items-start mb-4">
                <div className="lg:w-48 flex flex-col mr-4">
                    <button className={`mb-2 ${activeSection === 'personalInfo' ? 'font-bold' : ''}`} onClick={() => handleSectionClick('personalInfo')}>Personal Info</button>
                    <button className={`mb-2 ${activeSection === 'address' ? 'font-bold' : ''}`} onClick={() => handleSectionClick('address')}>Address</button>
                    <button className={`mb-2 ${activeSection === 'payments' ? 'font-bold' : ''}`} onClick={() => handleSectionClick('payments')}>Payments</button>
                </div>
                <div className="lg:flex-grow">
                    <h2 className="text-2xl font-bold mb-2">{userData.name}</h2>
                    {!isEditing && (
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleEditClick}>Edit</button>
                    )}
                </div>
            </div>

            <div className="border border-gray-300 p-4">
                <h3 className="text-lg font-bold mb-4">Details</h3>
                {activeSection === 'personalInfo' && (
                    <div>
                        <h3 className="text-lg font-bold mb-2">Personal Info</h3>
                        {!isEditing ? (
                            <div>
                                <p className="text-gray-800">Email: {userData.email}</p>
                                <p className="text-gray-800">Phone Number: {userData.phoneNumber}</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email:</label>
                                    <input type="email" id="email" name="email" value={editedData.email} onChange={handleInputChange} className="w-full border border-gray-300 px-3 py-2 rounded" />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phoneNumber">Phone Number:</label>
                                    <input type="tel" id="phoneNumber" name="phoneNumber" value={editedData.phoneNumber} onChange={handleInputChange} className="w-full border border-gray-300 px-3 py-2 rounded" />
                                </div>
                                <div className="flex justify-between">
                                    <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={handleSubmit}>Save</button>
                                    <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded" onClick={handleCancelEdit}>Cancel</button>
                                </div>
                            </form>
                        )}
                    </div>
                )}
                {/* Add similar sections for address and payments */}
            </div>
        </div>
    );
};

export default Profile;
