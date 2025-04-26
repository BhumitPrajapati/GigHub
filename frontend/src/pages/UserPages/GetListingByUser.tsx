import GetListingByUserComponenets from '../../components/Dashboard/Listings/GetListingByUser';
import Navbar from '../../components/Navbar/NavBar';
const GetListingByUserPage = () => {
    return (
        <>
            <Navbar isAdmin={false} />
            <GetListingByUserComponenets />
        </>
    );
};

export default GetListingByUserPage;