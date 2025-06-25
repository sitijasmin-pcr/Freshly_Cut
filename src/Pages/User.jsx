import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import UserForm from './UserForm';
// import UserForm from '../component/FormUser';


function User() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('ss')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error(error);
    else setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const addUser = async (users) => {
    const { error } = await supabase.from('users').insert(users);
    if (error) console.error(error);
    else fetchUsers();
  };

  const updateUser = async (users) => {
    const { error } = await supabase
      .from('users')
      .update(users)
      .eq('id', users.id);

    if (error) console.error(error);
    else {
      fetchUsers();
      setEditingUser(null);
    }
  };

  const deleteUser = async (id) => {
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (error) console.error(error);
    else fetchUsers();
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">CRUD Pengguna dengan Supabase</h1>

      <UserForm
        addUser={addUser}
        updateUser={updateUser}
        editingUser={editingUser}
      />

      <ul className="mt-6 space-y-4">
        {users.map((users) => (
          <li key={user.id} className="border p-3 rounded shadow">
            <div>
              <p className="font-semibold">{users.nama}</p>
              <p className="text-sm text-gray-600">
                Usia: {users.usia} tahun | Penghasilan: Rp {users.penghasilan} | Email: {users.email}
              </p>
              <p className="text-sm text-gray-600">
                Jenis Kelamin: {users.jenis_kelamin} | Kegiatan: {users.jenis_kegiatan} | Gula: {users.tingkat_kadar_gula}
              </p>
              <p className="text-sm text-gray-600">
                Metode Bayar: {users.metode_pembayaran_favorit} | Status: {usesr.status_member}
              </p>
            </div>

            <div className="mt-2 space-x-2">
              <button
                onClick={() => setEditingUser(users)}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => deleteUser(users.id)}
                className="text-red-600 hover:underline"
              >
                Hapus
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default User;
