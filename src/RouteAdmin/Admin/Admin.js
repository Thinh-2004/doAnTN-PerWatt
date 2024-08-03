import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useSession from "../../Session/useSession";
const Admin = () => {
  const [fullName, setFullName, removeFullName] = useSession("fullname");
  const [email, sêtmail, removeEmail] = useSession("email");
  const changeLink = useNavigate();
  const handleLogOut = (e) => {
    removeFullName();
    removeEmail();
    changeLink("/login");
  };
  return (
    <div>
      <h1>Page Admin</h1>
      <h1>Hello {fullName}</h1>
      <button className="btn btn-danger" onClick={handleLogOut}>
        Log out
      </button>
    </div>
  );
};

export default Admin;
