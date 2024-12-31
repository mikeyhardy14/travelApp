// app/components/UserSection.tsx
import React from 'react';

const UserSection: React.FC = () => {
  const users = [
    { name: 'Mike' },
    { name: 'Luke' },
    { name: 'Emmett' },
  ];

  return (
    <div className="bg-white p-8">
      <div className="flex justify-center space-x-8 mb-8">
        {users.map((user) => (
          <div key={user.name} className="text-center">
            <div className="w-16 h-16 rounded-full bg-gray-200 mb-2 flex items-center justify-center">
              <i className="fas fa-user text-gray-500 text-2xl"></i>
            </div>
            <p className="flex items-center justify-center space-x-2">
              <i className="fas fa-user"></i> <span>{user.name}</span>
            </p>
          </div>
        ))}
      </div>
      {/* <h2 className="text-center text-2xl font-bold">Welcome to Travel App</h2> */}
    </div>
  );
};

export default UserSection;

