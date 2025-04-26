import { jwtDecode } from 'jwt-decode';

// export const useAuth = () => {
//     const [email, setEmail] = useState('');

//     useEffect(() => {
//         const token = localStorage.getItem('token');
//         if (token) {
//             const decodedToken = jwtDecode(token);
//             setEmail(decodedToken.email);
//         }
//     }, []);

//     return { email };
// };

export const getDecodeTokenHook = () => {
    const token: string | null = localStorage.getItem('token');
    if (!token) {
        console.error('No token found');
        return;
    }
    const decodedToken = jwtDecode<{ _id: string, userId: string, role: string, profilePicImageLink: string, firstName: string }>(token);
    return decodedToken;
}