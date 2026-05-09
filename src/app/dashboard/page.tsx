import { prisma } from '@/lib/prisma';
import ChatWidget from '@/components/ChatWidget';
import { FileText, ShieldAlert, Activity } from 'lucide-react';

export default async function Dashboard() {
  // Mock login: Fetch the first client
  const user = await prisma.user.findFirst({
    where: { role: 'CLIENT' },
    include: { policies: true, claims: true }
  });

  if (!user) {
    return <div className="p-12 text-center">No user found. Did you run the seed script?</div>;
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Welcome back, {user.name}</h1>
        <p className="text-slate-500 mt-2">Here is a summary of your insurance portfolio.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="glass-panel p-6 flex flex-col gap-4">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Active Policies</p>
            <h3 className="text-3xl font-bold text-slate-800">{user.policies.filter(p => p.status === 'Active').length}</h3>
          </div>
        </div>
        <div className="glass-panel p-6 flex flex-col gap-4">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Total Claims</p>
            <h3 className="text-3xl font-bold text-slate-800">{user.claims.length}</h3>
          </div>
        </div>
        <div className="glass-panel p-6 flex flex-col gap-4">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center">
            <ShieldAlert size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Action Required</p>
            <h3 className="text-3xl font-bold text-slate-800">{user.policies.filter(p => p.status === 'Expired').length}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-panel overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-800">Your Policies</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {user.policies.map(policy => (
              <div key={policy.id} className="p-6 flex justify-between items-center hover:bg-slate-50 transition-colors">
                <div>
                  <h4 className="font-semibold text-slate-800">{policy.type} Insurance</h4>
                  <p className="text-sm text-slate-500 mt-1">Coverage: ₹{policy.coverageAmount.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${policy.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {policy.status}
                  </span>
                  <p className="text-xs text-slate-400 mt-2">Renews: {policy.renewalDate.toISOString().split('T')[0]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-800">Recent Claims</h2>
          </div>
          <div className="p-6 flex flex-col gap-4">
            {user.claims.length === 0 ? (
              <p className="text-slate-500 text-center py-8">No claims filed yet.</p>
            ) : (
              user.claims.map(claim => (
                <div key={claim.id} className="bg-slate-50 rounded-xl p-4 border border-slate-100 relative overflow-hidden">
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${claim.status === 'Approved' ? 'bg-green-500' : claim.status === 'Rejected' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                  <div className="flex justify-between items-start mb-2 pl-2">
                    <h4 className="font-medium text-slate-800 truncate pr-4">{claim.description}</h4>
                    <span className="text-xs font-semibold px-2 py-1 bg-white rounded shadow-sm whitespace-nowrap">
                      {claim.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 pl-2">Filed on {claim.dateFiled.toISOString().split('T')[0]}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <ChatWidget userId={user.id} />
    </main>
  );
}
