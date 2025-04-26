import React from 'react';
import { useParams } from 'react-router-dom';
import GetListingByUser from '@/components/Dashboard/Listings/GetListingByUser';

const AdminViewJobsPage: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();

    return <GetListingByUser userIdForAdmin={userId} />;
};

export default AdminViewJobsPage;