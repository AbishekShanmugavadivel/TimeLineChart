import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Brain } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Brain className="w-7 h-7" />
          </div>
          <div className="text-left">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">GenAI Roadmap</h1>
            <p className="text-xs font-semibold text-slate-500">From Beginner to AI Engineer</p>
          </div>
        </Link>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-slate-200 sm:rounded-2xl sm:px-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
