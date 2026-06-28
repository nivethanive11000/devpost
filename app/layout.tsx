import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TaskFlow - Task Management & Marketplace",
  description: "Manage tasks and earn money on the TaskFlow marketplace",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-slate-50 to-slate-100">
        <nav className="bg-white shadow-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary">TaskFlow</h1>
            <div className="space-x-4">
              <a href="/" className="text-gray-600 hover:text-primary">Home</a>
              <a href="/tasks" className="text-gray-600 hover:text-primary">Browse Tasks</a>
              <a href="/dashboard" className="text-gray-600 hover:text-primary">Dashboard</a>
              <a href="/auth/login" className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600">Login</a>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
