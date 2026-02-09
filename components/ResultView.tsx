
import React, { useState, useEffect } from 'react';
import { Loader2, RefreshCcw, Star, Share2, Bookmark, X, Sparkles, Info, AlertTriangle } from 'lucide-react';
import { AnalysisJSON } from '../types';
import FiveElementsChart from './FiveElementsChart';
import TenGodsChart from './TenGodsChart';
import { explainTermDetail } from '../services/geminiService';

interface ResultViewProps {
  loading: boolean;
  result: string | null;
  onReset: () => void;
  onSave: () => void;
  isFav: boolean;
}

const ResultView: React.FC<ResultViewProps> = ({ loading, result, onReset, onSave, isFav }) => {
  const [data, setData] = useState<AnalysisJSON | null>(null);
  const [activeTab, setActiveTab] = useState('OVERVIEW');
  const [termModal, setTermModal] = useState<{title: string, content: string | null} | null>(null);

  useEffect(() => {
    if (result) {
      try { setData(JSON.parse(result)); } catch (e) { console.error(e); }
    }
  }, [result]);

  const handleTermClick = async (term: string, category: string) => {
    setTermModal({ title: term, content: null });
    const detail = await explainTermDetail(term, category, data?.bazi.dayMaster || "");
    setTermModal({ title: term, content: detail });
  };

  if (loading) return (
    <div className="py-20 text-center animate-pulse">
      <Loader2 className="animate-spin mx-auto mb-4 text-gold-500" size={48} />
      <p className="font-serif text-lg text-ink-700">正在调拨星辰，推演命格...</p>
    </div>
  );
  
  if (!data) return null;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 术语详解弹窗 */}
      {termModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setTermModal(null)}>
          <div className="bg-paper-50 w-full max-w-md rounded-2xl shadow-2xl border border-gold-400/30 overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="bg-ink-900 text-gold-400 p-4 flex justify-between items-center">
              <span className="font-serif font-bold text-lg flex items-center gap-2"><Sparkles size={16}/> 大师解读：{termModal.title}</span>
              <button onClick={() => setTermModal(null)}><X size={20}/></button>
            </div>
            <div className="p-6">
              {!termModal.content ? <div className="flex justify-center py-4"><Loader2 className="animate-spin text-gold-500"/></div> : 
              <p className="text-ink-800 leading-relaxed font-serif text-justify">{termModal.content}</p>}
            </div>
          </div>
        </div>
      )}

      {/* 报告头部操作栏 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-ink-900/10 pb-6">
        <h2 className="text-3xl font-serif font-bold text-ink-900">{data.oneLiner}</h2>
        <div className="flex gap-2">
          <button onClick={onSave} className={`flex items-center gap-2 px-4 py-2 rounded-full border transition ${isFav ? 'bg-vermilion-500 text-white' : 'hover:bg-paper-100 text-ink-700'}`}>
            <Bookmark size={18} fill={isFav ? "white" : "none"}/> {isFav ? '已收藏' : '收藏'}
          </button>
          <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert("链接已复制！"); }} className="flex items-center gap-2 px-4 py-2 rounded-full border hover:bg-paper-100 text-ink-700">
            <Share2 size={18}/> 分享
          </button>
          <button onClick={onReset} className="p-2 text-gray-400 hover:text-ink-900"><RefreshCcw size={20}/></button>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-black/5">
             <h3 className="text-xl font-serif font-bold mb-4 flex items-center gap-2">
               <Info className="text-gold-500" size={20}/> 深度命理综述
             </h3>
             <p className="text-ink-800 leading-loose text-lg font-serif">{data.comprehensiveAnalysis}</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-black/5">
             <h3 className="text-xl font-serif font-bold mb-6">命中神煞与特殊格局 (点击看详解)</h3>
             <div className="flex flex-wrap gap-3">
                {data.bazi.shensha.map(s => (
                  <button 
                    key={s.name} 
                    onClick={() => handleTermClick(s.name, '神煞')}
                    className={`px-4 py-2 rounded-xl border flex items-center gap-2 transition hover:scale-105 ${s.type === 'good' ? 'border-vermilion-500/30 text-vermilion-500 bg-vermilion-50' : 'border-gray-200 text-gray-500'}`}
                  >
                    {s.type === 'good' ? <Sparkles size={14}/> : <AlertTriangle size={14}/>}
                    {s.name}
                  </button>
                ))}
                {data.bazi.tenGods.map(g => (
                  <button 
                    key={g.name} 
                    onClick={() => handleTermClick(g.name, '十神')}
                    className="px-4 py-2 rounded-xl border border-gold-400/30 text-gold-600 bg-gold-50 text-sm hover:bg-gold-100 transition"
                  >
                    {g.name}
                  </button>
                ))}
             </div>
          </div>
        </div>

        <div className="space-y-6">
           <div className="bg-ink-900 text-paper-50 p-6 rounded-2xl shadow-xl">
              <h4 className="font-serif text-gold-400 mb-4 border-b border-white/10 pb-2">五行能量分布</h4>
              <FiveElementsChart data={data.bazi.elements} />
           </div>
           {/* MBTI 简易卡片 */}
           <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
              <h4 className="font-serif font-bold mb-2">人格类型</h4>
              <div className="text-4xl font-serif font-bold text-ink-900 mb-4">{data.psych.mbtiType}</div>
              <div className="space-y-2">
                 {data.psych.strengths.slice(0, 3).map(s => (
                   <div key={s} className="text-xs flex items-center gap-2 text-ink-700">
                     <div className="w-1.5 h-1.5 bg-green-500 rounded-full"/> {s}
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ResultView;
