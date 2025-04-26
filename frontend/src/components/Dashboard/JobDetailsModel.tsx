import React, { useState } from 'react';
import { Job } from '../../types/jobs';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDecodeTokenHook } from '@/hooks/useAuth';

interface JobDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job | null;
}

const JobDetailsModal: React.FC<JobDetailsModalProps> = ({ isOpen, onClose, job }) => {
  const [userId, setUserId] = useState()
  const navigate = useNavigate();
  const decodedToken = getDecodeTokenHook();
  const userIdFromToken = decodedToken?.userId;

  if (!job) return null;

  const handleChatNavigation = () => {
    if (job?.userId) {
      navigate(`/chat?userId=${job.userId}`);
    } else {
      navigate('/chat');
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg h-full max-h-[90vh] transform overflow-hidden rounded-lg bg-slate-50 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  {job.jobTitle}
                </Dialog.Title>
                <div className="mt-2 overflow-y-scroll max-h-[70vh]">
                  {job.imageLink && (
                    <div className="m-4">
                      <img
                        src={job.imageLink}
                        alt={job.jobTitle}
                        className="w-full h-auto rounded-lg"
                      />
                    </div>
                  )}
                  {/* <p className="text-sm text-gray-500 mt-4"><b></b>{job.postedBy}</p> */}
                  <p className="text-sm text-gray-500 mt-4"><b>Job location: </b>{job.location}</p>
                  <p className="text-sm text-gray-500 mt-4"><b>Job Description: </b>{job.jobDescription}</p>
                  <p className="text-sm text-gray-500 mt-4"><b>Wages: </b> {job.price}</p>
                  <p className="text-sm text-gray-500 mt-4"><b>Status: </b> {job.status}</p>
                  {/* Add job poster information and job pictures here */}
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={onClose}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="ml-4 inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-indigo-800 hover:text-indigo-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={handleChatNavigation} // Navigate to the chat page
                  >
                    Send Message
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default JobDetailsModal;