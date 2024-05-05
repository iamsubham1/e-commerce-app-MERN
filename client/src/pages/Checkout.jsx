import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const Checkout = () => {
    const { userData } = useSelector((state) => state.user);
    const addresses = userData.address;

    // State to keep track of selected addresses
    const [selectedAddresses, setSelectedAddresses] = useState([]);

    // Function to toggle selection of an address
    const toggleAddressSelection = (index) => {
        const isSelected = selectedAddresses.includes(index);
        if (isSelected) {
            // If address is already selected, remove it
            setSelectedAddresses(selectedAddresses.filter((i) => i !== index));
        } else {
            // If address is not selected, add it
            setSelectedAddresses([...selectedAddresses, index]);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Select Delivery Address</h2>
            <div className="grid grid-cols-1 gap-4">
                {addresses && addresses.map((address, index) => (
                    <div key={index} className="bg-gray-100 rounded p-4 flex items-center justify-between">
                        <div>




                            {/* Checkbox to select address */}
                            <div className='flex items-center'>


                                <input
                                    type="checkbox"
                                    checked={selectedAddresses.includes(index)}
                                    onChange={() => toggleAddressSelection(index)}
                                    className="mr-2"
                                />

                                {/* Address details */}
                                <div className="text-md ml-5">
                                    <h1 className='text-2xl mb-2'>{address.type}</h1>
                                    {address.streetname},<br />
                                    {address.landmark}, {address.city}, {address.state} - {address.pincode}
                                </div>

                            </div>
                        </div>
                        {/* Add any additional information or actions related to the address here */}
                    </div>
                ))}
            </div>
            {/* Button to place order */}
            <button
                className="bg-blue-500 text-white px-4 py-2 mt-4 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                onClick={() => placeOrder(selectedAddresses)}
            >
                Place Order
            </button>
        </div>
    );
};

export default Checkout;
