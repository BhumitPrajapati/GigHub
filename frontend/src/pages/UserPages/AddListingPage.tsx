import AddListingComponents from '../../components/Dashboard/Listings/AddListing';
import Navbar from '../../components/Navbar/NavBar';
const AddListingPage = () => {
    return (
        <>
            <Navbar isAdmin={false} />
            <AddListingComponents />
        </>
    );
};

export default AddListingPage;