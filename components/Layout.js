import Navbar from './Navbar';

function Layout({ children, isAuthenticated, userId, setIsAuthenticated, setUserId }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        isAuthenticated={isAuthenticated}
        userId={userId}
        setIsAuthenticated={setIsAuthenticated}
        setUserId={setUserId}
      />
      <main className="flex-grow container mx-auto p-4">
        {children}
      </main>
      {/* Optionally add a Footer component here */}
    </div>
  );
}

export default Layout;
