import UpdateListingByUserComponenets from '../../components/Dashboard/Listings/UpdateListing';
import Navbar from '../../components/Navbar/NavBar';
const UpdateListingByUserPage = () => {
    return (
        <>
            <Navbar isAdmin={false} />
            <UpdateListingByUserComponenets />
        </>
    );
};

export default UpdateListingByUserPage;