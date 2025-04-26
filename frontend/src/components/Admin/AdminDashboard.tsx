import { useEffect, useState } from 'react'
import axios from 'axios';
import config from '@/config/config';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { getDecodeTokenHook } from '@/hooks/useAuth';
import GetListingByUser from '../Dashboard/Listings/GetListingByUser';


const AdminDashboard = () => {
  const [getUserData, setUserData] = useState<any[]>([]);
  const navigate = useNavigate();

  const decodedToken = getDecodeTokenHook();
  const decUserId = decodedToken?.userId;

  const viewUserByJob = (userId: string) => {
    navigate(`/admin-dashboard/view-jobs/${userId}`);
  };

  const deleteUser = async (userId: string) => {
    try {
      await axios.delete(`${config.backendUrl}/admin/deleteUser/${userId}`);
      setUserData((prevData) => prevData.filter((user) => user.userId !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(`${config.backendUrl}/admin/getAllUserLists`);
        setUserData(result.data.data)
      } catch (error) {
        console.error('Error fetching listings:', error);
      }
    };
    fetchData();
  }, [])

  return (
    <>
      <div className='m-6  ' >
        {/* <h1>User's Lists</h1> */}
        <p className='text-2xl m-3'>User's Lists</p>
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead>First Name</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className='	text-align: justify;'>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {getUserData && getUserData.map((data) => (

              <TableRow key={data._id}>
                <TableCell>{data.firstName}</TableCell>
                <TableCell>{data.lastName}</TableCell>
                <TableCell>{data.location}</TableCell>
                <TableCell>{data.role}</TableCell>
                <TableCell>
                  {data.role !== "admin" ? (<><Button onClick={() => deleteUser(data.userId)} className='hover:bg-red-700  content-end' variant="outline" >Delete</Button>
                    <Button onClick={() => viewUserByJob(data.userId)} className='hover:bg-violet-700 m-4 content-end' variant="outline" >View Jobs</Button></>) : (<><Button className=' m-4 content-end' variant="ghost" ></Button></>)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default AdminDashboard;