import DashboardComponents from '@/components/Admin/AdminDashboard';
import Navbar from '../../components/Navbar/NavBar';
const AdminDashboardPage = () => {
    return (
        <>
            <Navbar isAdmin={true} />
            <DashboardComponents />
        </>
    );
};

export default AdminDashboardPage;