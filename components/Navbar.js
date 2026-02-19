import Link from 'next/link';
import AuthButton from './AuthButton'; // Import AuthButton

function Navbar({ isAuthenticated, userId, setIsAuthenticated, setUserId }) { // Accept new props
  // Callback for AuthButton on successful authentication
  const handleAuthSuccess = (newUserId) => {
    setIsAuthenticated(true);
    setUserId(newUserId);
  };

  // Callback for AuthButton on logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserId(null);
  };

  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <p className="text-xl font-bold cursor-pointer">Contract Services</p>
        </Link>
        <ul className="flex space-x-4 items-center"> {/* Added items-center for vertical alignment */}
          <li>
            <Link href="/services">
              <p className="hover:text-gray-300 cursor-pointer">Services</p>
            </Link>
          </li>
          {/* Dashboard link always visible, but content might be protected */}
          <li>
            <Link href="/dashboard">
              <p className="hover:text-gray-300 cursor-pointer">Dashboard</p>
            </Link>
          </li>
          {/* AuthButton replaces Login/Register links */}
          <li>
            <AuthButton
              isAuthenticated={isAuthenticated}
              userId={userId}
              onAuthSuccess={handleAuthSuccess}
              onLogout={handleLogout}
            />
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
