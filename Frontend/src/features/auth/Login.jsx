import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input, Button, Alert } from '../../components/ui';
import { useAuth } from '../../hooks';
import { ROUTES, APP_CONFIG } from '../../constants';
import { LogIn } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'employee',
  });
  const [showError, setShowError] = useState(false);

  const { login, isLoading, isError, message, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD);
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isError) {
      setShowError(true);
      const timer = setTimeout(() => setShowError(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isError]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary-light flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">
              {APP_CONFIG.APP_NAME}
            </h1>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          {showError && (
            <Alert
              type="error"
              message={message}
              onClose={() => setShowError(false)}
              className="mb-4"
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sign in as</label>
              <div className="flex items-center gap-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={formData.role === 'admin'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span>Admin</span>
                </label>

                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="employee"
                    checked={formData.role === 'employee'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span>Employee</span>
                </label>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2"
            >
              {isLoading ? (
                'Signing in...'
              ) : (
                <>
                  <LogIn size={20} />
                  Sign In
                </>
              )}
            </Button>

            <div className="mt-4 text-center">
              <span className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to={ROUTES.SIGNUP} className="text-primary hover:text-primary-dark font-semibold">
                  Sign up
                </Link>
              </span>
            </div>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-semibold text-gray-700 mb-2">Demo Credentials:</p>
            <div className="space-y-1 text-sm text-gray-600">
              <p><strong>Admin:</strong> admin@electrolyte.com / admin123</p>
              <p><strong>Employee:</strong> employee@electrolyte.com / employee123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
