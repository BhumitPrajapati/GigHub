import { jwtDecode } from 'jwt-decode';

export const getDecodeTokenHook = () => {
    const token: string | null = localStorage.getItem('token');
    if (!token) {
        console.error('No token found');
        return;
    }
    const decodedToken = jwtDecode<{ _id: string, userId: string, role: string, profilePicImageLink: string, firstName: string }>(token);
    return decodedToken;
}