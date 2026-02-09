import React, { useState } from 'react';
import { UserProfile, MBTIType, CognitiveFunctions } from '../types';
import { EXTERNAL_LINKS, FUNCTION_DESCRIPTIONS } from '../constants';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import FunctionRadar from './RadarChart';

interface ProfileFormProps {
  profile: UserProfile;
  onChange: (p: UserProfile) => void;
  title: string;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ profile, onChange, title }) => {
  const [showFunctions, setShowFunctions] = useState(false);

  const handleFunctionChange = (key: keyof CognitiveFunctions, val: number) => {
    onChange({
      ...profile,
      functions: {
        ...profile.functions,
        [key]: val
      }
    });
  };

  const handleChange = (field: keyof UserProfile, value: any) => {
    onChange({ ...profile, [field]: value });
  };

  return (
    <div className="bg-white border border-ink-900/10 rounded-2xl p-6 shadow-xl mb-6">
      <h2 className="text-xl font-serif text-ink-900 mb-6 border-b border-ink-900/10 pb-2 font-bold">{title}</h2>
      
      {/* Basic Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm text-gray-500 mb-1">姓名 / 昵称</label>
          <input 
            type="text" 
            value={profile.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full bg-paper-100 border border-ink-900/10 rounded-lg p-3 text-ink-900 focus:ring-2 focus:ring-gold-400 outline-none placeholder-gray-400"
            placeholder="请输入姓名"
          />
        </div>
        
        <div>
           <label className="block text-sm text-gray-500 mb-1">性别</label>
           <select 
             value={profile.gender}
             onChange={(e) => handleChange('gender', e.target.value)}
             className="w-full bg-paper-100 border border-ink-900/10 rounded-lg p-3 text-ink-900 focus:ring-2 focus:ring-gold-400 outline-none"
           >
             <option value="Male">男 (Male)</option>
             <option value="Female">女 (Female)</option>
             <option value="Other">其他 (Other)</option>
           </select>
        </div>

        <div>
          <label className="block text-sm text-gray-500 mb-1">出生日期 (公历)</label>
          <input 
            type="date" 
            value={profile.birthDate}
            onChange={(e) => handleChange('birthDate', e.target.value)}
            className="w-full bg-paper-100 border border-ink-900/10 rounded-lg p-3 text-ink-900 focus:ring-2 focus:ring-gold-400 outline-none"
          />
        </div>

        <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm text-gray-500 mb-1">出生时间</label>
              <input 
                type="time" 
                value={profile.birthTime}
                onChange={(e) => handleChange('birthTime', e.target.value)}
                className="w-full bg-paper-100 border border-ink-900/10 rounded-lg p-3 text-ink-900 focus:ring-2 focus:ring-gold-400 outline-none"
              />
            </div>
             <div className="flex-1">
              <label className="block text-sm text-gray-500 mb-1">出生地点</label>
              <input 
                type="text" 
                value={profile.birthLocation}
                onChange={(e) => handleChange('birthLocation', e.target.value)}
                placeholder="城市, 省份"
                className="w-full bg-paper-100 border border-ink-900/10 rounded-lg p-3 text-ink-900 focus:ring-2 focus:ring-gold-400 outline-none"
              />
            </div>
        </div>
      </div>

      {/* MBTI Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-1">
           <label className="block text-sm text-gray-500">MBTI 人格类型</label>
           <a href={EXTERNAL_LINKS.MBTI_TEST} target="_blank" rel="noopener noreferrer" className="text-xs text-gold-600 flex items-center hover:underline">
             还没测过? 点击测试 <ExternalLink size={12} className="ml-1"/>
           </a>
        </div>
        <select 
          value={profile.mbti}
          onChange={(e) => handleChange('mbti', e.target.value)}
          className="w-full bg-paper-100 border border-ink-900/10 rounded-lg p-3 text-ink-900 focus:ring-2 focus:ring-gold-400 outline-none"
        >
          <option value="">选择你的类型 (如 INTJ, ENFP)</option>
          {Object.values(MBTIType).map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Cognitive Functions Toggle */}
      <div className="border-t border-ink-900/10 pt-4">
        <button 
          onClick={() => setShowFunctions(!showFunctions)}
          className="flex items-center justify-between w-full text-left p-2 rounded hover:bg-gray-50 transition"
        >
          <span className="font-semibold text-ink-800 flex items-center gap-2">
            进阶: 荣格八维功能数据 (可选)
            <span className="text-xs text-gray-400 font-normal">建议填写以获得更精准分析</span>
          </span>
          {showFunctions ? <ChevronUp className="text-gray-400"/> : <ChevronDown className="text-gray-400"/>}
        </button>

        {showFunctions && (
          <div className="mt-4 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="mb-4 text-sm text-gray-500 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <p>请输入测试结果的分值 (0-50)。</p>
              <a href={EXTERNAL_LINKS.JUNG_FUNCTIONS_TEST} target="_blank" rel="noopener noreferrer" className="text-gold-600 flex items-center hover:underline">
                 去测荣格八维 <ExternalLink size={14} className="ml-1"/>
              </a>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               {/* Sliders */}
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(Object.keys(profile.functions) as Array<keyof CognitiveFunctions>).map((func) => (
                    <div key={func} className="bg-paper-100 p-3 rounded border border-ink-900/5">
                      <div className="flex justify-between items-center mb-2">
                         <span className="font-bold text-ink-900" title={FUNCTION_DESCRIPTIONS[func]}>{func}</span>
                         <span className="text-xs text-gold-600 font-mono">{profile.functions[func]}</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="50" 
                        value={profile.functions[func]}
                        onChange={(e) => handleFunctionChange(func, parseInt(e.target.value))}
                        className="w-full accent-gold-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="text-[10px] text-gray-500 mt-1 truncate">{FUNCTION_DESCRIPTIONS[func]}</div>
                    </div>
                  ))}
               </div>
               
               {/* Mini Chart Preview */}
               <div className="flex flex-col items-center justify-center">
                  <h4 className="text-xs text-gray-500 mb-2 uppercase tracking-widest">心理模型预览</h4>
                  <FunctionRadar data={profile.functions} />
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileForm;