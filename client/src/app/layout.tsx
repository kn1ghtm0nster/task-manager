import "./globals.css";
import { ReactNode } from "react";

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <header>Task Manager Header</header>
        {children}
        <footer>Footer</footer>
      </body>
    </html>
  );
};

export default RootLayout;
