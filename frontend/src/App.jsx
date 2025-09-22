import React from "react";
import { useSelector } from "react-redux";
import Landing from "./components/Landing";
import Teacher from "./components/Teacher";
import Student from "./components/Student";
import Layout from "./components/Layout";

export default function App() {
  const role = useSelector((state) => state.auth.role);

  return (
    <Layout>
      {!role ? <Landing /> : role === "teacher" ? <Teacher /> : <Student />}
    </Layout>
  );
}
