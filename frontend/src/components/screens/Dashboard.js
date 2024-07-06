import React, { useEffect, useState } from 'react';
import Graph from '../charts/Graph';
import Card from '../custom/Card';
import UserTable from '../custom/UserTable';
import { GetCardDetail } from '../../services/APIRoutes';

export default function Dashboard() 
{

  const [cardDetail, setCardDetail] = useState({
      "noOfUsers": 0,
      "noOfSongs": 0,
      "noOfArtists": 0,
      "noOfGeneres": 0
  })

  useEffect(() => {

    const fetchData = async () => {
      try {
        const token = localStorage.getItem('userToken');
        const response = await fetch(GetCardDetail, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setCardDetail({
              noOfUsers: data.noOfUsers,
              noOfSongs: data.noOfSongs,
              noOfArtists: data.noOfArtists,
              noOfGeneres: data.noOfGeneres
          });
        } else {
          console.error('Error fetching users:', data.error);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchData();
  }, []);
  
  return (
    <>
      <div className='flex justify-between my-2'>
        <div className='w-2/4'><Graph /></div>
        <div className='w-2/4 grid grid-cols-2 gap-4 p-2'>
          <Card number={cardDetail.noOfUsers} title="Users" />
          <Card number={cardDetail.noOfSongs} title="Songs" />
          <Card number={cardDetail.noOfArtists} title="Artists" />
          <Card number={cardDetail.noOfGeneres} title="Genres" />
        </div>
      </div>
      <div>
        <UserTable />
      </div>
    </>
  );
}
