import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getUserData } from '../reducers/userSlice';
import { useDispatch } from 'react-redux';
import { addAddress, deleteAddress, placeOrder, placeOnlineOrder } from '../apis/api';
import { ToastContainer, toast } from 'react-toastify';
import { MdDelete } from 'react-icons/md'; // Import delete icon from Material Icons
import Modal from 'react-modal';
import { IoMdClose } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import PhonePe from '../assets/pp.png'


const customStyles = {
    content: {
        width: '100%',
        maxWidth: '500px',
        margin: 'auto',
        padding: '0',
        inset: '50% auto auto 50%',
        transform: 'translate(-50%, -50%)',
        borderRadius: '10px',
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
};
const Checkout = () => {
    const { userData } = useSelector((state) => state.user);
    const addresses = userData.address;
    const phoneNumber = userData.phoneNumber;
    const { totalValue, items } = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const [modalIsOpen, setIsOpen] = useState(false);

    const [selectedAddresses, setSelectedAddresses] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [newAddress, setNewAddress] = useState({
        streetname: '',
        landmark: '',
        city: '',
        state: '',
        pincode: '',
        type: 'home' // Default type
    });
    const navigate = useNavigate();

    // Function to toggle selection of an address
    const toggleAddressSelection = (index) => {
        setSelectedAddresses([index]);
    };

    //console.log(items);
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

            toast.error(" Address Type cant be same")

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

    const openModal = () => {
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };
    const notify = (message) => toast.success(`${message}`);

    const transformProductsForAPI = (items) => {
        return items.map(item => ({
            productId: item.product._id,
            quantity: item.quantity
        }));
    };

    const handleCodOrder = async (paymentMode) => {
        try {
            const transformedProducts = transformProductsForAPI(items);

            const orderData = await placeOrder(transformedProducts, paymentMode);


            //console.log(transformedProducts, paymentMode);
            if (paymentMode === 'ONLINE') {
                // Redirect to PhonePe payment URL
                window.location.href = orderData.paymentUrl;
            } else {
                // For COD, navigate to a success page or show a success message
                navigate('/success', { state: { orderId: orderData.order } });
            }
        } catch (error) {
            console.error('Error in handleOrder:', error);
        }
    };

    const handleOnlineOrder = async (paymentMode) => {
        try {
            const transformedProducts = transformProductsForAPI(items);
            //console.log("transformedProducts", transformedProducts);
            const orderData = await placeOnlineOrder(transformedProducts, paymentMode, totalValue, phoneNumber);


        } catch (error) {
            console.error('Error in handleOrder:', error);
        }
    };








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
            <div className={`mb-8 md:mb-0 py-8 px-6 rounded-lg md:w-2/5 ${addresses && addresses?.length > 0 || isFormOpen ? 'bg-[#f4f4f4]' : 'bg-[#fffcfc]'} `}>

                {addresses && addresses?.length > 0 && (<>

                    <h2 className="text-2xl font-bold mb-4">Select Delivery Address</h2>
                    <div className="mb-4 flex justify-end items-center">


                        <button onClick={toggleModal} className={`shine-btn rounded  ${isFormOpen ? 'bg-primary' : ''}`}>
                            {isFormOpen ? "Close" : "Add address"}
                        </button>


                    </div>
                </>
                )
                }

                {/* Input field for adding a new address */}
                <div className="mb-4" style={{ display: isFormOpen ? "block" : "none" }}>

                    <form>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="streetname" className="block text-sm font-medium text-gray-700">Street Name</label>
                                <input type="text" id="streetname" name="streetname" value={newAddress.streetname} onChange={handleAddressChange} className="mt-1 p-2 block w-full shadow-sm rounded-md border-2 border-gray-400" />
                            </div>
                            <div>
                                <label htmlFor="landmark" className="block text-sm font-medium text-gray-700">Landmark</label>
                                <input type="text" id="landmark" name="landmark" value={newAddress.landmark} onChange={handleAddressChange} className="mt-1 p-2 block w-full shadow-sm rounded-md border-2 border-gray-400" />
                            </div>
                            <div>
                                <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                                <input type="text" id="city" name="city" value={newAddress.city} onChange={handleAddressChange} className="mt-1 p-2 block w-full shadow-sm rounded-md border-2 border-gray-400" />
                            </div>
                            <div>
                                <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
                                <input type="text" id="state" name="state" value={newAddress.state} onChange={handleAddressChange} className="mt-1 p-2 block w-full shadow-sm rounded-md border-2 border-gray-400" />
                            </div>
                            <div>
                                <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">Pincode</label>
                                <input type="text" id="pincode" name="pincode" value={newAddress.pincode} onChange={handleAddressChange} className="mt-1 p-2 block w-full shadow-sm border-2 border-gray-400 rounded-md" />
                            </div>
                            <div>
                                <label htmlFor="type" className="block text-sm font-medium text-gray-700">Address Type</label>
                                <select id="type" name="type" value={newAddress.type} onChange={handleAddressChange} className="mt-1 p-2 block w-full shadow-sm rounded-md border-2 border-gray-400">
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
                {
                    !isFormOpen && (
                        <div className="grid grid-cols-1 gap-4">
                            {addresses?.length > 0 ? (addresses.map((address, index) => (
                                <div key={index} className="p-4 flex items-center justify-between">

                                    <div className='flex items-center'>
                                        <input
                                            type="checkbox"
                                            checked={selectedAddresses.includes(index)}
                                            onChange={() => toggleAddressSelection(index)}
                                            className="mr-2"
                                        />

                                        {/* Address details */}
                                        <div className="text-md ml-5 capitalize">
                                            <h1 className='text-2xl mb-2 capitalize text-[#000000]'>{address.type}</h1>
                                            <p>{address.streetname}</p>
                                            <p>{address.landmark},{address.city}</p>
                                            <p> {address.state},{address.pincode}</p>
                                        </div>

                                        {/* Delete icon */}
                                    </div>
                                    <MdDelete onClick={() => handleDeleteAddress(address._id)} className="cursor-pointer text-red-500 justify-stretch " />
                                </div>

                            ))) : (<div className='flex flex-col mt-12 justify-center items-center'>


                                {isFormOpen ? <></> : <p className=' mt-10 text-center mb-10'>No Addresses added yet</p>}

                                <button onClick={toggleModal} className={`shine-btn rounded  ${isFormOpen ? 'bg-primary' : ''}`}>
                                    {isFormOpen ? "Close" : "Add address"}
                                </button>
                            </div>)}
                        </div>
                    )
                }


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

                {/* Modal for payment options*/}

                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    style={customStyles} // Ensure customStyles are responsive
                    contentLabel="Payment Modal"
                >
                    {/* Close button aligned to the right */}
                    <div className="flex justify-end p-2">
                        <IoMdClose
                            onClick={closeModal}
                            className="hover:text-red-700 text-2xl cursor-pointer"
                        />
                    </div>

                    <div className="p-6">
                        <h2 className="text-2xl font-semibold mb-6 text-center">Choose Payment Method</h2>

                        {/* PhonePe Payment Button */}
                        <button
                            onClick={() => handleOnlineOrder('ONLINE')}
                            className="bg-black text-white py-3 px-4 rounded mb-4 w-full hover:bg-blue-700 flex items-center justify-center gap-2"
                        >
                            <img src={PhonePe} alt="PhonePe Icon" className="w-8" />
                            Pay with PhonePe
                        </button>

                        {/* COD Payment Button */}
                        <button
                            onClick={() => handleCodOrder('COD')}
                            className="bg-gray-600 text-white py-3 px-4 rounded w-full hover:bg-gray-700 flex items-center justify-center gap-2"
                        >
                            <img src="https://cdn-icons-png.flaticon.com/512/3135/3135706.png" alt="Cash Icon" className="w-5 h-5" />
                            Cash on Delivery (COD)
                        </button>
                    </div>
                </Modal>



                <button
                    className={`shine-btn mt-4 rounded ${addresses?.length < 1 || selectedAddresses.length === 0 ? 'opacity-50 cursor-not-allowed' : 'opacity-100 cursor-pointer shine-btn hover:scale-105'}`}
                    onClick={addresses?.length > 0 && selectedAddresses.length > 0 ? openModal : null}
                    disabled={addresses?.length < 1 || selectedAddresses.length === 0}
                >
                    Proceed to payment
                </button>

            </div>

        </div>
    );
};

export default Checkout;
