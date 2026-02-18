import Link from 'next/link';

function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <p className="text-xl font-bold cursor-pointer">Contract Services</p>
        </Link>
        <ul className="flex space-x-4">
          <li>
            <Link href="/services">
              <p className="hover:text-gray-300 cursor-pointer">Services</p>
            </Link>
          </li>
          <li>
            <Link href="/login">
              <p className="hover:text-gray-300 cursor-pointer">Login</p>
            </Link>
          </li>
          <li>
            <Link href="/register">
              <p className="hover:text-gray-300 cursor-pointer">Register</p>
            </Link>
          </li>
          <li>
            <Link href="/dashboard">
              <p className="hover:text-gray-300 cursor-pointer">Dashboard</p>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
