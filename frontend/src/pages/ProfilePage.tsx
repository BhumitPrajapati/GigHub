import Profile from '@/components/Dashboard/profile';
import Navbar from '@/components/Navbar/NavBar';


function ProfilePage() {
    return (
        <>
            <Navbar isAdmin={false} />
            <Profile />
        </>
    );
}

export default ProfilePage