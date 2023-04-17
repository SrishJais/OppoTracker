// import React from "react";
// import { useAuth } from "../myFirebase/myAuthFirebase";
// import { Navigate, Outlet } from "react-router-dom"; //note navigate component is used

// const ProtectedRoute = () => {
//   const { currentUser } = useAuth();
//   return !currentUser ? <Navigate to="../login" /> : <Outlet />;
// };

// export default ProtectedRoute;

// import React, { useState, useEffect } from "react";
// import { useAuth } from "../myFirebase/myAuthFirebase";
// import { Navigate, Outlet } from "react-router-dom";

// const ProtectedRoute = () => {
//   const { currentUser } = useAuth();
//   // const [loading, setLoading] = useState(true);

//   // useEffect(() => {
//   //   if (currentUser) {
//   //     setLoading(false);
//   //   }
//   // }, [currentUser]);

//   // if (loading) {
//   //   return <div>Loading...</div>;
//   // }

//   return !currentUser ? <Navigate to="/login" /> : <Outlet />;
// };

// export default ProtectedRoute;
import React from "react";
import { useAuth } from "../myFirebase/myAuthFirebase";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ Cmp }) => {
  const { currentUser } = useAuth();

  return !currentUser ? <Navigate to="/login" /> : Cmp;
};

export default ProtectedRoute;
