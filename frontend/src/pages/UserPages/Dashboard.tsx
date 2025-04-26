import DashboardComponent from '../../components/Dashboard/Dashboard';
import Navbar from '../../components/Navbar/NavBar';
const Dashboard = () => {
    return (
        <>
            <Navbar isAdmin={false}/>
            <DashboardComponent />
        </>
    );
};

export default Dashboard;