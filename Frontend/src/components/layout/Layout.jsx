import Header from './Header';


const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-secondary-50">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
