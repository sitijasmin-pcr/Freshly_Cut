import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import CustomerForm from "./CustomerForm";

export default function CustomerPage() {
  const [customers, setCustomers] = useState([]);
  const [editingCustomer, setEditingCustomer] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    const { data, error } = await supabase.from("customers").select("*").order("created_at", { ascending: false });
    if (error) console.error("Fetch Error:", error);
    else setCustomers(data);
  };

  const addCustomer = async (customer) => {
    const { error } = await supabase.from("customers").insert(customer);
    if (error) console.error("Insert Error:", error);
    else fetchCustomers();
  };

  const updateCustomer = async (customer) => {
    const { error } = await supabase.from("customers").update(customer).eq("id", customer.id);
    if (error) console.error("Update Error:", error);
    else {
      fetchCustomers();
      setEditingCustomer(null);
    }
  };

  const deleteCustomer = async (id) => {
    const { error } = await supabase.from("customers").delete().eq("id", id);
    if (error) console.error("Delete Error:", error);
    else fetchCustomers();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Daftar Customer</h1>
      <CustomerForm
        addCustomer={addCustomer}
        updateCustomer={updateCustomer}
        editingCustomer={editingCustomer}
      />
      <ul className="mt-4">
        {customers.map((cust) => (
          <li key={cust.id} className="border p-2 mb-2">
            <div><strong>{cust.nama}</strong> - {cust.email} - {cust.status_member}</div>
            <button onClick={() => setEditingCustomer(cust)} className="text-blue-600 mr-2">Edit</button>
            <button onClick={() => deleteCustomer(cust.id)} className="text-red-600">Hapus</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
