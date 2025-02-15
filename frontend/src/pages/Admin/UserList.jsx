import { useEffect, useState } from "react"
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa"
import Loader from "../../components/Loader"
import { toast } from "react-toastify"
import { useGetUsersQuery, useDeleteUserMutation, useUpdateUserMutation} from "../../redux/api/usersApiSlice"
import Message from "../../components/Message"

const UserList = () => {
    const {data: users, refetch, isLoading, isError, error} = useGetUsersQuery();
    const [deleteUser] = useDeleteUserMutation();
    const [updateUser] = useUpdateUserMutation();

    const [editableUserId, setEditableUserId] = useState(null);
    const [editableUsername, setEditableUsername] = useState('');
    const [editableUserEmail, setEditableUserEmail] = useState('');
    
    useEffect(() => {
        refetch();
    }, [refetch]);

    const deleteHandler = async (id) => {
        if(window.confirm("Are you sure?")) {
            try {
                await deleteUser(id).unwrap();
                toast.success("User deleted successfully");
            } catch (error) {
                toast.error(error?.data?.message || error.error);
            }
        }
    };

    const toggleEdit = (id, username, email) => {
        setEditableUserId(id);
        setEditableUsername(username);
        setEditableUserEmail(email);
    };

    const updateHandler = async (id) => {
        try {
            await updateUser({
                userId : id, 
                username: editableUsername,
                email: editableUserEmail
            }).unwrap();
            toast.success("User updated successfully");
            setEditableUserId(null);
            refetch();
        } catch (error) {
            toast.error(error?.data?.message || error.error);
        }
    };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-10 ml-[12rem]">Users</h1>
      {isLoading ? (<Loader />) : error ? (<Message variant='danger'>{error?.data?.message || error.message}</Message>)
      : (
          <div className="flex flex-col md:flex-row">
            {/* Admin Menu */}
            <table className="w-full md:w-4/5 mx-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">NAME</th>
                  <th className="px-4 py-2 text-left">EMAIL</th>
                  <th className="px-4 py-2 text-left">ADMIN</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="px-4 py-2">{user._id}</td>
                    <td className="px-4 py-2">
                      {editableUserId === user._id ? (
                        <div className="flex items-center">
                          <input
                            type="text"
                            value={editableUsername}
                            onChange={(e) => setEditableUsername(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                          />
                          <button 
                            className="ml-2 bg-blue-500 text-white py-2 px-4 rounded-lg cursor-pointer" 
                            onClick={() => updateHandler(user._id)}
                            >
                                <FaCheck />
                            </button>
                        </div>
                      ) : (
                        <div className="flex items-center">
                            {user.username} {""}
                            <button onClick={() => toggleEdit(user._id, user.username, user.email)}>
                                <FaEdit className="ml-[1rem] cursor-pointer"  />
                            </button>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-2">{editableUserId === user._id ? (
                        <div className="flex items-center">
                          <input
                            type="text"
                            value={editableUserEmail}
                            onChange={(e) => setEditableUserEmail(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                          />
                          <button 
                            className="ml-2 bg-blue-500 text-white py-2 px-4 rounded-lg cursor-pointer" 
                            onClick={() => updateHandler(user._id)}
                            >
                                <FaCheck />
                            </button>
                        </div>
                      ) : (
                        <div className="flex items-center">
                            {user.email} {""}
                            <button onClick={() => toggleEdit(user._id, user.username, user.email)}>
                                <FaEdit className="ml-[1rem] cursor-pointer" />
                            </button>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-2">{user.isAdmin ? (
                        <FaCheck style={{color: 'green'}} />
                      ) : (
                        <FaTimes style={{color: 'red'}} />
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {!user.isAdmin && (
                        <div className="flex">
                          <button 
                            className="bg-red-600 hover:bg-red-700 font-bold text-white py-2 px-4 rounded-lg cursor-pointer" 
                            onClick={() => deleteHandler(user._id)}
                            >
                                <FaTrash />
                            </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      )}
    </div>
  )
}

export default UserList
