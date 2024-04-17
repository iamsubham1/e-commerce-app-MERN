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
            const cookie = new Cookies();
            cookie.set('JWT', data.JWT, cookieOptions);
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


export const fetchAllProducts = async () => {
    try {
        const response = await fetch(`${baseUrl}product/allproducts`, {
            headers: {
                'Content-Type': 'application/json',
                JWT: getCookie('JWT'),
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(error.message);
    }
};