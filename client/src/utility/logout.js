import Cookies from 'universal-cookie';
export const logout = (name) => {
    const cookies = new Cookies();
    cookies.remove(name);
    window.location.reload();
    window.location.href = '/login'


};