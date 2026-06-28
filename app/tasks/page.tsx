'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Task {
  id: string;
  title: string;
  description: string;
  budget: number;
  status: string;
  category: string;
  deadline: string;
  creator: {
    name: string;
    rating: number;
  };
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('open');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(
          `/api/tasks?status=${filter}`
        );
        const data = await response.json();
        setTasks(data.tasks || []);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [filter]);

  return (
    <div className="py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Available Tasks</h1>
        <Link href="/tasks/create" className="btn-primary">
          Post a Task
        </Link>
      </div>

      {/* Filter */}
      <div className="space-x-2">
        {['open', 'assigned', 'completed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg capitalize transition-colors ${
              filter === status
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Tasks Grid */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No tasks found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <Link
              key={task.id}
              href={`/tasks/${task.id}`}
              className="card hover:shadow-xl transition-shadow"
            >
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900">
                      {task.title}
                    </h3>
                    <span className="text-sm font-semibold text-primary">
                      ${task.budget}
                    </span>
                  </div>
                  <p className="text-gray-600 line-clamp-2">
                    {task.description}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm bg-blue-100 text-primary px-3 py-1 rounded-full">
                    {task.category}
                  </span>
                  <span className="text-sm text-gray-500">
                    {task.status === 'open' ? '📖 Open' : '✅ Assigned'}
                  </span>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600">
                    Posted by <span className="font-semibold">{task.creator.name}</span>
                  </p>
                  <p className="text-sm text-yellow-500">
                    ⭐ {task.creator.rating.toFixed(1)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
