import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import config from '../config/config';
import { NavigateFunction } from 'react-router-dom';

export const handleGoogleSuccess = async (
    credentialResponse: any,
    setMessage: React.Dispatch<React.SetStateAction<string>>,
    setIsError: React.Dispatch<React.SetStateAction<boolean>>,
    navigate: NavigateFunction
) => {
    try {
        // Send the token to your backend
        const response = await axios.post(`${config.backendUrl}/google-login`, {
            tokenId: credentialResponse.credential,
            withCredentials: true
        });

        if (response.data.data) {
            localStorage.setItem('token', response.data.data);
            setMessage(response.data.message || 'Login successful!');
            setIsError(false);
            const role = jwtDecode<{ role: string }>(response.data.data);

            if (role.role === 'admin') {
                navigate('/admin-dashboard');
            } else {
                navigate('/dashboard');
            }
        } else {
            setMessage(response.data.message || 'Login failed. Please try again.');
            setIsError(true);
        }
    } catch (error) {
        console.error('Google login error:', error);
        setIsError(true);
        setMessage('Google authentication failed.');
    }
};

export const handleGoogleError = (
    setMessage: React.Dispatch<React.SetStateAction<string>>,
    setIsError: React.Dispatch<React.SetStateAction<boolean>>
) => {
    setIsError(true);
    setMessage('Google authentication failed.');
};