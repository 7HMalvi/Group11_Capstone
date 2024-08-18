import React, { useState, useEffect } from 'react';
import { DeleteUser, GetUserList, EditUser } from '../../services/APIRoutes';
import EditUserModal from '../modals/EditUserModal';

function UserTable() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('userToken');
        const response = await fetch(GetUserList, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setUsers(data.users);
        } else {
          console.error('Error fetching users:', data.error);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleEdit = (userId) => {
    const user = users.find((user) => user._id === userId);
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleUpdate = async (userId, updatedUser) => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(`${EditUser}/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedUser),
      });
      const data = await response.json();
      if (response.ok) {
        setUsers(users.map((user) => (user._id === userId ? data.user : user)));
        setShowModal(false);
        setSelectedUser(null);
      } else {
        console.error('Error updating user:', data.error);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDelete = async (userId) => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(`${DeleteUser}/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        users && users.length > 0 && setUsers(users.filter((user) => user._id !== data.user._id));
      } else {
        console.error('Error deleting user:', data.error);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const filteredUsers = users && users.length > 0 ? users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Search users"
        value={searchTerm}
        onChange={handleSearch}
        className="mb-4 p-2 border border-red-600 bg-black rounded"
      />
      <table className="min-w-full border border-red-600">
        <thead>
          <tr>
            <th className="py-2 px-4 border border-red-600 bg-red-600">First Name</th>
            <th className="py-2 px-4 border border-red-600 bg-red-600">Last Name</th>
            <th className="py-2 px-4 border border-red-600 bg-red-600">Email</th>
            <th className="py-2 px-4 border border-red-600 bg-red-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.length > 0 ? (
            currentUsers.map((user) => (
              <tr key={user._id}>
                <td className="py-2 px-4 border border-red-600">{user.firstName}</td>
                <td className="py-2 px-4 border border-red-600">{user.lastName}</td>
                <td className="py-2 px-4 border border-red-600">{user.email}</td>
                <td className="py-2 px-4 border border-red-600 text-center">
                  <button onClick={() => handleEdit(user._id)} className="mr-2 text-blue-500">Edit</button>
                  <button onClick={() => handleDelete(user._id)} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="py-2 px-4 border border-red-600 text-center text-red-500">No users found</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="flex justify-center mt-4">
        {[...Array(Math.ceil(filteredUsers.length / usersPerPage)).keys()].map((number) => (
          <button
            key={number + 1}
            onClick={() => paginate(number + 1)}
            className={`px-4 py-2 mx-1 border border-red-600 ${currentPage === number + 1 ? 'bg-red-500 text-white' : 'bg-black text-red-500'}`}
          >
            {number + 1}
          </button>
        ))}
      </div>
      {showModal && (
        <EditUserModal
          user={selectedUser}
          show={showModal}
          onClose={() => setShowModal(false)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}

export default UserTable;
