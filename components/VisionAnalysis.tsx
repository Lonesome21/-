import React, { useState, useRef } from 'react';
import { Camera, Upload, ScanFace, Hand, X, Loader2, Sparkles } from 'lucide-react';
import { analyzeImage } from '../services/geminiService';

interface VisionAnalysisProps {
  onClose: () => void;
}

const VisionAnalysis: React.FC<VisionAnalysisProps> = ({ onClose }) => {
  const [mode, setMode] = useState<'FACE' | 'PALM'>('FACE');
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        // Remove data URL prefix for API
        const base64Data = base64.split(',')[1];
        setImage(base64Data);
        handleAnalyze(base64Data);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async (base64Data: string) => {
    setLoading(true);
    setResult(null);
    try {
      const text = await analyzeImage(base64Data, mode);
      setResult(text);
    } catch (e) {
      setResult("分析失败，请重试。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink-900/50 backdrop-blur-sm p-4">
      <div className="bg-paper-50 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 relative border border-white/20">
        
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-ink-900 z-10">
           <X size={24}/>
        </button>

        <div className="bg-ink-900 text-paper-50 p-6 text-center relative overflow-hidden">
           <div className="absolute inset-0 bg-noise opacity-20"></div>
           <h2 className="text-2xl font-serif font-bold relative z-10 flex items-center justify-center gap-2">
             <ScanFace className="text-gold-500"/> AI 视觉玄学
           </h2>
           <p className="text-gray-400 text-sm mt-2 relative z-10">上传面相或手相照片，解读潜藏运势</p>
        </div>

        <div className="p-6">
           {/* Toggle */}
           <div className="flex justify-center mb-6 bg-paper-200 p-1 rounded-full w-fit mx-auto">
              <button 
                onClick={() => { setMode('FACE'); setImage(null); setResult(null); }}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${mode === 'FACE' ? 'bg-ink-900 text-white shadow-md' : 'text-gray-500 hover:text-ink-900'}`}
              >
                面相 (Face)
              </button>
              <button 
                onClick={() => { setMode('PALM'); setImage(null); setResult(null); }}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${mode === 'PALM' ? 'bg-ink-900 text-white shadow-md' : 'text-gray-500 hover:text-ink-900'}`}
              >
                手相 (Palm)
              </button>
           </div>

           {/* Content */}
           {!image ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-xl h-64 flex flex-col items-center justify-center cursor-pointer hover:border-gold-500 hover:bg-gold-50/10 transition-colors group"
              >
                 <div className="w-16 h-16 rounded-full bg-paper-200 flex items-center justify-center text-gray-400 group-hover:bg-gold-100 group-hover:text-gold-600 mb-4 transition-colors">
                    <Upload size={32}/>
                 </div>
                 <p className="text-gray-500 font-serif">点击上传照片</p>
                 <p className="text-xs text-gray-400 mt-2">支持 JPG/PNG</p>
                 <input type="file" ref={fileInputRef} className="hidden" accept="image/*" />
              </div>
           ) : (
              <div className="space-y-6">
                 <div className="h-48 w-full rounded-xl overflow-hidden relative shadow-inner bg-black/5">
                    <img src={`data:image/jpeg;base64,${image}`} alt="Upload" className="w-full h-full object-contain" />
                    {loading && (
                       <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                          <Loader2 size={32} className="animate-spin mb-2 text-gold-500"/>
                          <span className="text-sm font-serif tracking-widest animate-pulse">正在扫描特征...</span>
                       </div>
                    )}
                 </div>

                 {result && (
                    <div className="bg-white p-4 rounded-xl border border-ink-900/5 shadow-sm max-h-60 overflow-y-auto">
                       <h3 className="text-gold-600 font-bold font-serif mb-2 flex items-center gap-2">
                          <Sparkles size={14}/> 分析结果
                       </h3>
                       <p className="text-sm text-ink-800 leading-relaxed whitespace-pre-line text-justify">
                          {result}
                       </p>
                    </div>
                 )}
                 
                 <div className="flex justify-center">
                    <button 
                      onClick={() => { setImage(null); setResult(null); }}
                      className="text-sm text-gray-500 hover:text-ink-900 underline"
                    >
                      重新上传
                    </button>
                 </div>
              </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default VisionAnalysis;