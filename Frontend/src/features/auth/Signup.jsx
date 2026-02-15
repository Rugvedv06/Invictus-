import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Alert } from '../../components/ui';
import { useDispatch, useSelector } from 'react-redux';
import { register, reset } from './authSlice';
import { ROUTES, APP_CONFIG } from '../../constants';

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'employee',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isError, isSuccess, message } = useSelector((s) => s.auth);

  useEffect(() => {
    if (isSuccess) {
      // after successful signup, reset state and go to login
      dispatch(reset());
      navigate(ROUTES.LOGIN);
    }
  }, [isSuccess, dispatch, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(register(formData));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary-light flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-primary mb-2">Create an account</h1>
            <p className="text-gray-600">Sign up and then sign in with your credentials</p>
          </div>

          {isError && (
            <Alert type="error" message={message} className="mb-4" />
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Your full name"
              required
            />

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
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
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

            <Button type="submit" variant="primary" disabled={isLoading} className="w-full">
              {isLoading ? 'Creating...' : 'Create account'}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-600">
            Already have an account? <a href={ROUTES.LOGIN} className="text-primary font-medium">Sign in</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
