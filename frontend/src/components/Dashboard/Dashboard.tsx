import { useEffect, useState } from 'react';
import axios from 'axios';
import JobCard from './JobCard';

import config from '../../config/config';
import { Job } from '../../types/jobs';

const Dashboard = () => {
  const [listings, setListings] = useState<Job[]>([]);

  useEffect(() => {
    const fetchAllListings = async () => {
      try {
        const response = await axios.get(`${config.backendUrl}/listings/getAllLists`);
        // console.log(response.data.data);

        setListings(response.data.data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchAllListings();
  }, []);

  return (
    <>
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {listings.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Dashboard;