import "./globals.css";
import { ReactNode } from "react";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
        <NavBar />
        <main className="flex-1 w-full p-8">
          <div className="container mx-auto">{children}</div>
        </main>
        <Footer />
      </body>
    </html>
  );
};

export default RootLayout;
