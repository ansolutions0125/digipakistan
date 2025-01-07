
"use client";

import React, { useState, useEffect } from "react";
import { firestore } from "../../../../Backend/Firebase";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";

const AssignPermissions = () => {
  const [adminsData, setAdminsData] = useState([]);
  const [permissions, setPermissions] = useState({});

  const allPermissions = [
    { label: "Dashboard", value: "dashboard:view" },
    { label: "Issues Panel", value: "issues:manage" },
    { label: "Add Admins", value: "admins:add" },
    { label: "Manage Admins", value: "admins:manage" },
    { label: "Add Certifications", value: "certifications:add" },
    { label: "Manage Certifications", value: "certifications:manage" },
    { label: "Manage Users", value: "users:manage" },
    { label: "Manage Payments", value: "payments:manage" },
    { label: "Compose Emails", value: "emails:compose" },
    { label: "Manage Site Settings", value: "site:settings" },
  ];

  useEffect(() => {
    const fetchAdminsData = async () => {
      const querySnapshot = await getDocs(
        collection(firestore, "site_admins_details")
      );
      const admins = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAdminsData(admins);
    };

    fetchAdminsData();
  }, []);

  const handlePermissionChange = (adminId, permissionValue, isChecked) => {
    setPermissions((prev) => ({
      ...prev,
      [adminId]: isChecked
        ? [...(prev[adminId] || []), permissionValue]
        : (prev[adminId] || []).filter((perm) => perm !== permissionValue),
    }));
  };

  const savePermissions = async (adminId) => {
    const updatedPermissions = permissions[adminId] || [];
    const adminDocRef = doc(firestore, "site_admins_details", adminId);

    try {
      await setDoc(adminDocRef, { permissions: updatedPermissions }, { merge: true });
      alert("Permissions updated successfully!");
    } catch (error) {
      console.error("Error updating permissions:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Assign Permissions</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminsData.map((admin) => (
          <div
            key={admin.id}
            className="bg-white shadow-md rounded-lg p-6 border border-gray-200"
          >
            <h2 className="text-lg font-bold mb-4">{admin.admin_name}</h2>
            <div className="flex flex-col gap-2">
              {allPermissions.map((perm) => (
                <label
                  key={perm.value}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    value={perm.value}
                    checked={
                      permissions[admin.id]?.includes(perm.value) || false
                    }
                    onChange={(e) =>
                      handlePermissionChange(admin.id, perm.value, e.target.checked)
                    }
                    className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary focus:ring-opacity-50"
                  />
                  <span className="text-sm text-gray-700">{perm.label}</span>
                </label>
              ))}
            </div>
            <button
              onClick={() => savePermissions(admin.id)}
              className="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition duration-200"
            >
              Save Permissions
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssignPermissions;
