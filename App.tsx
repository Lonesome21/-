
import React, { useState, useEffect } from 'react';
import { UserProfile, AnalysisMode, FavoriteItem, MBTIType } from './types';
import ProfileForm from './components/ProfileForm';
import ResultView from './components/ResultView';
import CommunityBoard from './components/CommunityBoard';
import { analyzeProfile, analyzeCompatibility, getQuickDaily } from './services/geminiService';
import { Star, History, Bookmark, MessageCircle, ArrowRight, User, Users, Sparkles, Coffee } from 'lucide-react';
import { DEFAULT_FUNCTIONS } from './constants';

const App: React.FC = () => {
  const [view, setView] = useState<'HOME' | 'APP' | 'COMMUNITY' | 'FAVORITES'>('HOME');
  const [user1, setUser1] = useState<UserProfile>({
    id: 'user_1',
    name: '',
    birthDate: '',
    birthTime: '',
    birthLocation: '',
    mbti: '',
    gender: 'Other',
    functions: { ...DEFAULT_FUNCTIONS }
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [dailyLuck, setDailyLuck] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    const savedFavs = localStorage.getItem('omni_favs');
    if (savedFavs) setFavorites(JSON.parse(savedFavs));
  }, []);

  const handleSaveResult = () => {
    if (!result) return;
    const newItem: FavoriteItem = { id: Date.now().toString(), timestamp: Date.now(), mode: 'SINGLE', user1Name: user1.name || "用户", result };
    const updated = [newItem, ...favorites];
    setFavorites(updated);
    localStorage.setItem('omni_favs', JSON.stringify(updated));
    alert("已存入收藏夹！");
  };

  const loadPersonalDaily = async () => {
    if (!user1.birthDate) { alert("请先填写个人资料"); return; }
    // Fix: Pass the user1 object directly to getQuickDaily
    const res = await getQuickDaily(user1);
    setDailyLuck(res);
  };

  return (
    <div className="min-h-screen bg-paper-50 relative">
      <nav className="border-b bg-white/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
           <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('HOME')}>
             <Star className="text-ink-900" size={24}/>
             <span className="font-serif font-bold text-xl">OmniPsyche</span>
           </div>
           <div className="flex gap-6 text-sm font-medium">
             <button onClick={() => setView('HOME')}>首页</button>
             <button onClick={() => setView('COMMUNITY')}>社区讨论</button>
             <button onClick={() => setView('FAVORITES')}>我的收藏 ({favorites.length})</button>
           </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {view === 'HOME' && (
          <div className="animate-in fade-in duration-500">
            <header className="text-center py-20">
               <h1 className="text-5xl md:text-7xl font-serif font-bold mb-8">解读灵魂的<br/><span className="text-gold-600">多维密码</span></h1>
               
               {/* Dashboard Daily Widget */}
               <div className="max-w-sm mx-auto mb-10">
                  {!dailyLuck ? (
                    <button onClick={loadPersonalDaily} className="bg-white border-2 border-gold-400/20 p-4 rounded-2xl shadow-sm hover:shadow-md transition flex items-center justify-center gap-3 w-full">
                       <Coffee className="text-gold-500"/> <span className="font-serif">生成基于我命盘的今日运势</span>
                    </button>
                  ) : (
                    <div className="bg-ink-900 text-paper-50 p-6 rounded-2xl shadow-xl border-l-4 border-gold-500">
                       <div className="text-xs text-gold-400 font-serif mb-2 uppercase tracking-widest">今日天启</div>
                       <div className="text-xl font-serif italic">“{dailyLuck}”</div>
                    </div>
                  )}
               </div>

               <div className="flex justify-center gap-4">
                  <button onClick={() => setView('APP')} className="bg-ink-900 text-white px-10 py-4 rounded-full font-bold shadow-xl hover:scale-105 transition flex items-center gap-2"><User size={20}/> 开启个人分析</button>
                  <button onClick={() => setView('COMMUNITY')} className="bg-white border px-10 py-4 rounded-full font-bold shadow-md hover:bg-gray-50 transition flex items-center gap-2"><MessageCircle size={20}/> 进入灵性社区</button>
               </div>
            </header>
          </div>
        )}

        {view === 'APP' && (
          <div className="space-y-8">
            {!result && <ProfileForm profile={user1} onChange={setUser1} title="建立你的灵性档案" />}
            {!result && (
              <div className="text-center">
                <button onClick={async () => { setLoading(true); const res = await analyzeProfile(user1); setResult(res); setLoading(false); }} className="bg-gold-500 text-white px-12 py-5 rounded-full font-bold text-xl shadow-2xl flex items-center gap-3 mx-auto">生成全维分析报告 <ArrowRight/></button>
              </div>
            )}
            <ResultView loading={loading} result={result} onReset={() => setResult(null)} onSave={handleSaveResult} isFav={favorites.some(f => f.result === result)} />
          </div>
        )}

        {view === 'COMMUNITY' && <CommunityBoard />}

        {view === 'FAVORITES' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {favorites.map(f => (
              <div key={f.id} className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm hover:shadow-lg transition cursor-pointer" onClick={() => { setResult(f.result); setView('APP'); }}>
                <div className="text-xs text-gray-400 mb-2">{new Date(f.timestamp).toLocaleDateString()}</div>
                <h3 className="text-xl font-serif font-bold mb-2">{f.user1Name} 的深度分析报告</h3>
                <div className="text-gold-600 flex items-center gap-1 text-sm">点击回顾 <ArrowRight size={14}/></div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
