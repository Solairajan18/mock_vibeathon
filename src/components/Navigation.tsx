'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, User } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="glass-panel sticky top-4 z-50 mx-4 md:mx-12 my-4 px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
          PA
        </div>
        <span className="text-xl font-bold text-gradient">Policy Assist AI</span>
      </div>
      
      <div className="flex gap-4">
        <Link 
          href="/dashboard"
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${pathname === '/dashboard' ? 'bg-blue-100 text-blue-700 font-medium' : 'hover:bg-slate-100 text-slate-600'}`}
        >
          <User size={18} />
          Client View
        </Link>
        <Link 
          href="/admin"
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${pathname === '/admin' ? 'bg-purple-100 text-purple-700 font-medium' : 'hover:bg-slate-100 text-slate-600'}`}
        >
          <Shield size={18} />
          Admin View
        </Link>
      </div>
    </nav>
  );
}
