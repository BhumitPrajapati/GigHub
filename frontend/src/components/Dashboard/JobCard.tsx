import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
import { Job } from '../../types/jobs';
// import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import JobDetailsModal from './JobDetailsModel';

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>

      <Card className="w-full sm:w-[300px] md:w-[350px] m-4 flex flex-col h-64">
        <CardHeader>
          <CardTitle>{job.jobTitle}</CardTitle>
          <CardDescription>{job.postedBy}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 truncate">{job.location}</p>
          <p className="text-gray-600 truncate">{job.jobDescription}</p>
          <p className="text-gray-600 truncate">Wages: {job.price}</p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <button onClick={openModal} className="text-zinc-300 hover:underline">
            View Job {'>'}
          </button>
        </CardFooter>
      </Card>
      <JobDetailsModal isOpen={isModalOpen} onClose={closeModal} job={job} />
    </>
  );
};

export default JobCard;