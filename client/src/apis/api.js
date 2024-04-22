import { getCookie } from "../utility/getCookie";
import Cookies from 'universal-cookie';
const baseUrl = 'http://localhost:8080/api/'
const cookieOptions = { httpOnly: false, secure: true, sameSite: 'none', maxAge: 60 * 60 * 24 };

export const login = async (formData) => {

    try {
        const response = await fetch(`${baseUrl}auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
            credentials: 'include',
        })

        if (response.ok) {
            const data = await response.json();

            return true;
        }
        else if (response.status === 400) {

            return false;

        }
    } catch (error) {
        console.error('Network error:', error);
        return false;
    }

    formData = null;
}

export const signup = async (formData) => {
    try {
        const response = await fetch(`${baseUrl}auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
            credentials: 'include',
        })
        if (response.ok) {
            const data = await response.json();
            return true;
        } else {
            return false;
        }
    } catch (error) {
        throw new Error(error.message);
    }
}

export const fetchAllProducts = async () => {
    try {
        const response = await fetch(`${baseUrl}product/allproducts`, {
            headers: {
                'Content-Type': 'application/json',
                JWT: getCookie('JWT'),
            }
        });
        const data = await response.json();
        // console.log(getCookie('JWT'));
        return data;
    } catch (error) {
        throw new Error(error.message);

    }
};

export const addPhNumber = async (phoneNumber) => {
    try {
        const response = await fetch(`${baseUrl}user/edituser`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                JWT: getCookie('JWT')
            },
            body: JSON.stringify({ phoneNumber })
        });
        if (response.ok) {
            return true
        } else {
            return false;
        }
    } catch (error) {
        throw new Error(error.message);

    }
}

export const getUserDetails = async () => {
    try {
        console.log("Fetching user details... from api");
        const response = await fetch(`${baseUrl}user/details`, {
            headers: {
                'Content-Type': 'application/json',
                'JWT': getCookie('JWT')
            }
        });

        if (response.ok) {
            const userData = await response.json();
            console.log("User details:", userData);
            return userData;
        } else {
            console.log("Failed to fetch user details. Status:", response.status);
            return null;
        }
    } catch (error) {
        console.error("Error fetching user details:", error);
        throw new Error(error.message);
    }
}
