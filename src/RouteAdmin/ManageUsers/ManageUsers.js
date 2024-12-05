import React from "react";
import ListUsers from "./ListUsers/ListUsers";
import Header from "../../components/Header/Header";
import ListUserAdmins from "./ListUserAdmins/ListUserAdmins";
import ListReport from "../ManageReport/ListReport";

const ManageUsers = () => {
  return (
    <>
      <Header />
      <div className="container-fluid mt-4">
        <div className="row">
          <div className="col-lg-8 col-md-8 col-sm-8 border-end">
            <ListUsers />
            <hr />
            <ListUserAdmins />
          </div>
          <div className="col-lg-4 col-md-4 col-sm-4">
            <ListReport/>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageUsers;
