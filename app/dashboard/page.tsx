'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/auth/login');
      return;
    }
    setUser(JSON.parse(userData));
    setLoading(false);
  }, [router]);

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  return (
    <div className="py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <button onClick={handleLogout} className="btn-secondary">
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Profile</h3>
          <p className="text-gray-600 mb-4">{user.name}</p>
          <p className="text-sm text-gray-500 mb-4">{user.email}</p>
          <p className="text-lg font-semibold text-yellow-500">
            ⭐ Rating: {user.rating?.toFixed(1) || 'N/A'}
          </p>
        </div>

        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 mb-2">My Tasks</h3>
          <p className="text-4xl font-bold text-primary mb-2">0</p>
          <p className="text-sm text-gray-600">Tasks you posted</p>
        </div>

        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Earnings</h3>
          <p className="text-4xl font-bold text-green-500 mb-2">$0</p>
          <p className="text-sm text-gray-600">Total earnings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card space-y-4">
          <h3 className="text-xl font-bold">Quick Actions</h3>
          <button className="w-full btn-primary text-left">
            Post a New Task
          </button>
          <button className="w-full btn-secondary text-left">
            Browse Available Tasks
          </button>
          <button className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 text-left">
            View My Profile
          </button>
        </div>

        <div className="card space-y-4">
          <h3 className="text-xl font-bold">Recent Activity</h3>
          <div className="text-center py-8 text-gray-500">
            <p>No recent activity yet</p>
            <p className="text-sm">Start by posting or bidding on tasks!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
