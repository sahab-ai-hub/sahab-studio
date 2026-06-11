import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import useAuthStore from '../store/authStore';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const Subscription = () => {
  const { token, user } = useAuthStore();
  const [plans, setPlans] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [plansRes, subRes] = await Promise.all([
          axios.get(`${API_URL}/api/subscriptions/plans`),
          axios.get(`${API_URL}/api/subscriptions/status`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setPlans(plansRes.data);
        setSubscription(subRes.data);
      } catch (error) {
        toast.error('Failed to load subscription data');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);

  const handleUpgrade = async (plan) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/subscriptions/checkout`,
        { plan },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Redirect to Stripe checkout
      window.location.href = `https://checkout.stripe.com/pay/${response.data.sessionId}`;
    } catch (error) {
      toast.error('Failed to upgrade subscription');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Subscription Plans</h1>
        <p className="text-gray-600 mb-8">Current Plan: <span className="font-semibold capitalize">{subscription?.tier || 'free'}</span></p>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading plans...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(plans).map(([key, plan]) => (
              <div
                key={key}
                className={`rounded-lg shadow-md p-8 ${
                  subscription?.tier === key ? 'bg-blue-50 border-2 border-blue-600' : 'bg-white'
                }`}
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-4xl font-bold text-blue-600 mb-4">
                  ${(plan.price / 100).toFixed(2)}
                  <span className="text-lg text-gray-600">/month</span>
                </p>
                <ul className="space-y-2 mb-6 text-gray-600">
                  <li>✓ Feature 1</li>
                  <li>✓ Feature 2</li>
                  <li>✓ Feature 3</li>
                </ul>
                <button
                  onClick={() => handleUpgrade(key)}
                  disabled={subscription?.tier === key}
                  className={`w-full py-2 rounded font-semibold ${
                    subscription?.tier === key
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {subscription?.tier === key ? 'Current Plan' : 'Upgrade'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Subscription;
