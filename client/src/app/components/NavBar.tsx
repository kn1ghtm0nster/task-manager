"use client";
import React, { useState } from "react";
import Link from "next/link";

const NavBar: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
    setDarkMode(!darkMode);
  };

  return (
    <header className="bg-blue-600 dark:bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <nav className="space-x-4 hidden md:flex">
          <Link href="/" className="hover:text-gray-200">
            <h1 className="text-lg font-bold">Task Manager</h1>
          </Link>
        </nav>
        <button
          onClick={toggleDarkMode}
          className="p-2 bg-gray-100 text-gray-800 rounded-md dark:bg-gray-700 dark:text-gray-300"
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
    </header>
  );
};

export default NavBar;
