import React from 'react';

const statsData = [
  { count: 120, label: 'Total Users' },
  { count: 58, label: 'Active Sessions' },
  { count: 34, label: 'Pending Requests' },
  { count: 14, label: 'New Signups' },
];

const userList = [
  { name: 'John Doe', status: 'Active', statusColor: 'text-green-600 dark:text-green-400' },
  { name: 'Jane Smith', status: 'Pending', statusColor: 'text-yellow-600 dark:text-yellow-400' },
  { name: 'Mike Johnson', status: 'Inactive', statusColor: 'text-red-600 dark:text-red-400' },
];

const recentActivities = [
  { activity: 'User John Doe updated his profile.', time: '2 mins ago' },
  { activity: 'Jane Smith requested access.', time: '5 mins ago' },
  { activity: 'Mike Johnson signed up.', time: '20 mins ago' },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-darkContainer p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Dashboard Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-darkCard dark:hover:darkCardHover p-6 rounded shadow text-center"
          >
            <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">{stat.count}</h2>
            <p className="text-gray-500 dark:text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* User List */}
      <div className="bg-white dark:bg-darkCard dark:hover:darkCardHover p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">User List</h2>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {userList.map((user, index) => (
            <li key={index} className="py-3 flex justify-between">
              <span className="text-gray-800 dark:text-gray-100">{user.name}</span>
              <span className={user.statusColor}>{user.status}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Recent Activities */}
      <div className="bg-white dark:bg-darkCard dark:hover:darkCardHover p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Recent Activities</h2>
        <div className="space-y-2">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>{activity.activity}</span>
              <span>{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
