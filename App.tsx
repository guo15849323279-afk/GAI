import React, { useState, useEffect } from 'react';
import { AppTab, DailyStats } from './types';
import Vocabulary from './features/Vocabulary';
import ImageGenerator from './features/ImageGenerator';
import VideoAnimator from './features/VideoAnimator';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.Learn);
  const [stats, setStats] = useState<DailyStats>({
    streak: 0,
    lastCheckIn: null,
    wordsLearned: 0
  });

  // Load stats
  useEffect(() => {
    const saved = localStorage.getItem('lingoflow_stats');
    if (saved) {
      setStats(JSON.parse(saved));
    }
  }, []);

  // Daily Check-in Logic
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (stats.lastCheckIn !== today) {
      // It's a new day or first time
      let newStreak = stats.streak;
      
      if (stats.lastCheckIn) {
        const lastDate = new Date(stats.lastCheckIn);
        const diffTime = Math.abs(new Date().getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        
        if (diffDays === 1) {
            // Consecutive day
            newStreak += 1;
        } else if (diffDays > 1) {
            // Broken streak
            newStreak = 1;
        }
      } else {
          newStreak = 1;
      }

      const newStats = {
        ...stats,
        lastCheckIn: today,
        streak: newStreak
      };
      setStats(newStats);
      localStorage.setItem('lingoflow_stats', JSON.stringify(newStats));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center">
      <div className="w-full max-w-lg bg-white min-h-screen shadow-2xl relative flex flex-col">
        
        {/* Top Bar */}
        <header className="px-6 py-5 bg-white sticky top-0 z-50 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Lingo<span className="text-indigo-600">Flow</span></h1>
            <p className="text-xs text-slate-400 font-medium">AI 驱动的英语备考助手</p>
          </div>
          
          <div className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100">
            <span className="text-lg">🔥</span>
            <span className="text-sm font-bold text-orange-600">{stats.streak} 天连卡</span>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 pb-24 scroll-smooth">
           {activeTab === AppTab.Learn && <Vocabulary />}
           {activeTab === AppTab.ImageGen && <ImageGenerator />}
           {activeTab === AppTab.VideoGen && <VideoAnimator />}
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 w-full max-w-lg bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
           <NavButton 
             active={activeTab === AppTab.Learn} 
             onClick={() => setActiveTab(AppTab.Learn)}
             icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>}
             label="学习"
           />
           <NavButton 
             active={activeTab === AppTab.ImageGen} 
             onClick={() => setActiveTab(AppTab.ImageGen)}
             icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>}
             label="绘图"
           />
           <NavButton 
             active={activeTab === AppTab.VideoGen} 
             onClick={() => setActiveTab(AppTab.VideoGen)}
             icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>}
             label="视频"
           />
        </nav>

      </div>
    </div>
  );
};

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center space-y-1 transition-colors ${active ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
  >
    <div className={`p-1 rounded-lg ${active ? 'bg-indigo-50' : ''}`}>
      {icon}
    </div>
    <span className="text-[10px] font-bold uppercase tracking-wide">{label}</span>
  </button>
);

export default App;