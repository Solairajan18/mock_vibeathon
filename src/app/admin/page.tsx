import { prisma } from '@/lib/prisma';
import { ThumbsDown, ThumbsUp, CheckCircle, Clock } from 'lucide-react';

export default async function AdminPortal() {

  const feedbacks = await prisma.feedback.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      chatMessage: {
        include: { user: true }
      }
    }
  });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Agent Portal</h1>
        <p className="text-slate-500 mt-2">Review AI interactions and optimize the Knowledge Base.</p>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-white/50">
          <h2 className="text-xl font-bold text-slate-800">Continuous Learning: User Feedback</h2>
          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
            {feedbacks.filter(f => f.status === 'Pending').length} Pending Reviews
          </span>
        </div>
        
        <div className="divide-y divide-slate-100">
          {feedbacks.length === 0 ? (
            <p className="p-12 text-center text-slate-500">No feedback submitted yet.</p>
          ) : (
            feedbacks.map(feedback => (
              <div key={feedback.id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-slate-600 bg-slate-200 px-2 py-0.5 rounded">
                        {feedback.chatMessage.user.name}
                      </span>
                      <span className="text-xs text-slate-400">
                        {feedback.createdAt.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="bg-blue-50 text-blue-900 p-3 rounded-lg mb-3 text-sm">
                      <span className="font-semibold">AI Response:</span> &quot;{feedback.chatMessage.message}&quot;
                    </div>

                    {feedback.correction && (
                      <div className="text-sm text-slate-700 bg-white border border-slate-200 p-3 rounded-lg">
                        <span className="font-semibold text-slate-800">User Comment:</span> {feedback.correction}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-end gap-3 min-w-[150px]">
                    <div className={`flex items-center gap-1 font-medium ${feedback.isHelpful ? 'text-green-600' : 'text-red-500'}`}>
                      {feedback.isHelpful ? <ThumbsUp size={16} /> : <ThumbsDown size={16} />}
                      {feedback.isHelpful ? 'Helpful' : 'Needs Fix'}
                    </div>
                    
                    {feedback.status === 'Pending' ? (
                      <button className="flex items-center gap-1 text-xs font-semibold px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors w-full justify-center">
                        <CheckCircle size={14} />
                        Approve to KB
                      </button>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-semibold px-3 py-2 bg-slate-100 text-slate-500 rounded-lg w-full justify-center border border-slate-200">
                        <Clock size={14} />
                        Processed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
