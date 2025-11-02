import React from "react";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

function Layout({ children }) {
  return (
    <div className="app">
      <NavBar />
      <main className="main-content">{children}</main>
      <Footer />
    </div>
  );
}

export default Layout;
