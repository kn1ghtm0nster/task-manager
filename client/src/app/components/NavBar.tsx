import Link from "next/link";

const NavBar = () => (
  <header className="bg-blue-600 text-white p-4">
    <div className="container mx-auto flex justify-between items-center">
      <h1 className="text-lg font-bold">My App</h1>
      <nav className="space-x-4 hidden md:flex">
        <Link href="/" className="hover:text-gray-200">
          Home
        </Link>
        <Link href="/tasks" className="hover:text-gray-200">
          Tasks
        </Link>
      </nav>
      <button className="mg:hidden p-2">Menu</button>
    </div>
  </header>
);

export default NavBar;
