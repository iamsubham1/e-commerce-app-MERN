import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getUserData } from '../reducers/userSlice';
import { useDispatch } from 'react-redux';
import { addAddress, deleteAddress } from '../apis/api';
import { ToastContainer, toast } from 'react-toastify';
import { MdDelete } from 'react-icons/md'; // Import delete icon from Material Icons

const Checkout = () => {
    const { userData } = useSelector((state) => state.user);
    const addresses = userData.address;
    const { items, totalValue } = useSelector((state) => state.cart);
    const dispatch = useDispatch();

    // State to keep track of selected addresses
    const [selectedAddresses, setSelectedAddresses] = useState([]);
    // State to manage modal visibility
    const [isFormOpen, setIsFormOpen] = useState(false);
    // State to store new address
    const [newAddress, setNewAddress] = useState({
        streetname: '',
        landmark: '',
        city: '',
        state: '',
        pincode: '',
        type: 'home' // Default type
    });

    // Function to toggle selection of an address
    const toggleAddressSelection = (index) => {
        setSelectedAddresses([index]);
    };


    // Function to toggle modal visibility
    const toggleModal = () => {
        setIsFormOpen(!isFormOpen);
    };

    // Function to handle input changes in the new address form
    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setNewAddress({
            ...newAddress,
            [name]: value
        });
    };

    // Function to handle submitting the new address
    const handleAddAddress = async () => {
        const response = await addAddress(newAddress);
        if (response) {
            dispatch(getUserData());
            setIsFormOpen(false);
            setNewAddress({
                streetname: '',
                landmark: '',
                city: '',
                state: '',
                pincode: '',
                type: 'home'
            });
            notify("address added");

        }
        else {

            toast.error("Type cant be same")

        }
    };

    const handleDeleteAddress = async (id) => {

        const response = await deleteAddress(id);
        if (response) {
            dispatch(getUserData());

            notify("address deleted");

        }
        else {

            notify("Unable to delete address");

        }

    }


    const notify = (message) => toast.success(`${message}`);

    return (
        <div className="container mx-auto p-4 flex flex-col md:flex-row justify-evenly ">
            <ToastContainer position="top-right"
                autoClose={1500}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover />
            <div className='mb-8 md:mb-0 bg-[#f4f4f4] py-8 px-6 rounded-lg md:w-2/5'>
                <h2 className="text-2xl font-bold mb-4">Select Delivery Address</h2>
                {/* Button to toggle address input field */}
                <div className="mb-4 flex justify-end items-center">
                    <button onClick={toggleModal} className={`shine-btn rounded ${isFormOpen ? 'bg-primary' : ''}`}>
                        {isFormOpen ? "Close" : "Add address"}
                    </button>
                </div>
                {/* Input field for adding a new address */}
                <div className="mb-4" style={{ display: isFormOpen ? "block" : "none" }}>
                    <form>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="streetname" className="block text-sm font-medium text-gray-700">Street Name</label>
                                <input type="text" id="streetname" name="streetname" value={newAddress.streetname} onChange={handleAddressChange} className="mt-1 p-2 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md" />
                            </div>
                            <div>
                                <label htmlFor="landmark" className="block text-sm font-medium text-gray-700">Landmark</label>
                                <input type="text" id="landmark" name="landmark" value={newAddress.landmark} onChange={handleAddressChange} className="mt-1 p-2 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md" />
                            </div>
                            <div>
                                <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                                <input type="text" id="city" name="city" value={newAddress.city} onChange={handleAddressChange} className="mt-1 p-2 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md" />
                            </div>
                            <div>
                                <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
                                <input type="text" id="state" name="state" value={newAddress.state} onChange={handleAddressChange} className="mt-1 p-2 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md" />
                            </div>
                            <div>
                                <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">Pincode</label>
                                <input type="text" id="pincode" name="pincode" value={newAddress.pincode} onChange={handleAddressChange} className="mt-1 p-2 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md" />
                            </div>
                            <div>
                                <label htmlFor="type" className="block text-sm font-medium text-gray-700">Address Type</label>
                                <select id="type" name="type" value={newAddress.type} onChange={handleAddressChange} className="mt-1 p-2 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md">
                                    <option value="home">Home</option>
                                    <option value="work">Work</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                        <div className="mt-4">
                            <button type="button" onClick={handleAddAddress} className="shine-btn mt-2 rounded">Save Address</button>
                        </div>
                    </form>
                </div>
                <div className="grid grid-cols-1 gap-4 ">
                    {addresses && addresses.map((address, index) => (
                        <div key={index} className="p-4 flex items-center justify-between">

                            <div className='flex items-center'>
                                <input
                                    type="checkbox"
                                    checked={selectedAddresses.includes(index)}
                                    onChange={() => toggleAddressSelection(index)}
                                    className="mr-2"
                                />

                                {/* Address details */}
                                <div className="text-md ml-5">
                                    <h1 className='text-2xl mb-2 capitalize'>{address.type}</h1>
                                    {address.streetname}<br />
                                    {address.landmark} {address.city}
                                    <br />{address.state} - {address.pincode}
                                </div>

                                {/* Delete icon */}
                            </div>
                            <MdDelete onClick={() => handleDeleteAddress(address._id)} className="cursor-pointer text-red-500 justify-stretch " />
                        </div>

                    ))}
                </div>

            </div>

            <div className="w-full md:w-2/5 bg-[#f4f4f4] text-[#000000] rounded-lg py-8 px-6 h-[60%]">
                <h3 className="text-2xl font-bold mb-4">Cart Summary</h3>
                <div className="mt-8 flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-bold">${totalValue.toFixed(2)}</span>
                </div>
                <div className="mt-2 flex justify-between">
                    <span>Taxes:</span>
                    <span className="font-bold">$10.00</span>
                </div>
                <div className="mt-2 mb-4 flex justify-between">
                    <span>Shipping Charges:</span>
                    <span className="font-bold">$5.00</span>
                </div>
                <div className='content w-full mt-8'></div>
                <div className="mt-4 flex justify-between">
                    <span>Total:</span>
                    <span className="font-bold">${(totalValue + 10 + 5).toFixed(2)}</span>
                </div>


                {/* Button to place order */}
                <button
                    className="shine-btn mt-4 rounded"
                >
                    Proceed to payment
                </button>
            </div>

        </div>
    );
};

export default Checkout;
