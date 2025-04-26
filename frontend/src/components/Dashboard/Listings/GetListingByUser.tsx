import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import config from '@/config/config';
import { Job } from '@/types/jobs';
import { getDecodeTokenHook } from '@/hooks/useAuth';
import { useAlert } from '@/context/AlertContext';

interface GetListingByUserProps {
  userIdForAdmin?: string;
}

const GetListingByUser: React.FC<GetListingByUserProps> = ({ userIdForAdmin }) => {
  const [listings, setListings] = useState<Job[]>([]);
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const decodedToken = getDecodeTokenHook();
  const userId = decodedToken?.userId;
  const role = decodedToken?.role;
  // console.log(decodedToken);


  useEffect(() => {
    const fetchListings = async () => {

      try {
        const response = await axios.post(`${config.backendUrl}/listings/getUserByLists/${userIdForAdmin ? userIdForAdmin : ''}`,
          userIdForAdmin ? {} : { userId }
        );
        setListings(response.data.data);

      } catch (error) {
        console.error('Error fetching listings:', error);
      }
    };

    fetchListings();
  }, [userIdForAdmin, userId]);

  const handleDelete = async (_id: string) => {
    try {
      await axios.delete(`${config.backendUrl}/listings/deleteList/${_id}`);
      setListings(listings.filter(listing => listing._id.toString() !== _id));
      showAlert('default', 'Success', 'Listing deleted successfully');
    } catch (error) {
      console.error('Error deleting listing:', error);
      showAlert('destructive', 'Error', 'Failed to delete listing');
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/edit-listing/${id}`);
  };

  return (
    <div className="container mx-auto p-4">
      {role === 'admin' ? (<h1 className="text-2xl font-bold mb-4">User Listings</h1>) : (<h1 className="text-2xl font-bold mb-4">My Listings</h1>)}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {listings.map((listing) => (
          <Card key={listing._id} className="shadow-md rounded-xl p-4 mb-4 h-full flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl font-bold truncate">{listing.jobTitle}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden">
              <p className="text-gray-600"><b>Location: </b>{listing.location}</p>
              <p className="text-gray-600"><b>Department: </b>{listing.department}</p>
              <p className="text-gray-600"><b>Status: </b>{listing.status}</p>
              <p className="text-gray-600"><b>Price: </b>{listing.price}</p>
              <p className="text-gray-600 truncate"><b>Description: </b>{listing.jobDescription}</p>
              {/* {listing.imageLink && <img src={`${config.backendUrl}/uploads/${listing.imageLink}`} alt={listing.jobTitle} className="mt-4 rounded-md" />} */}
            </CardContent>
            <CardFooter className="flex justify-between">
              {role === 'admin' ? (
                <Button onClick={() => handleDelete(listing._id.toString())} className='hover:bg-red-700' variant="outline">Delete</Button>
              ) : (
                <>
                  <Button onClick={() => handleEdit(listing._id.toString())} className='hover:bg-violet-700' variant="outline">Edit</Button>
                  <Button onClick={() => handleDelete(listing._id.toString())} className='hover:bg-red-700' variant="outline">Delete</Button>
                </>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GetListingByUser;