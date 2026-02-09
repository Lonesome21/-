import React from 'react';
import { BookOpen, Sparkles, Scroll, Compass } from 'lucide-react';
import { WIKI_CONTENT } from '../constants';

const WikiSection: React.FC = () => {
  return (
    <section className="max-w-6xl mx-auto mt-20 mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 mb-2 text-gold-600 font-serif tracking-widest text-sm uppercase">
          <Sparkles size={14} /> Knowledge Base
        </div>
        <h2 className="text-3xl md:text-4xl font-serif text-ink-900 font-bold">全维灵性知识库</h2>
        <div className="w-20 h-1 bg-gold-400 mx-auto mt-6 rounded-full"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        {WIKI_CONTENT.map((item, idx) => (
          <div key={idx} className="group bg-white p-8 rounded-xl border border-ink-900/5 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
            {/* Hover Gradient */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-400 to-vermilion-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            
            <div className="mb-6 w-12 h-12 rounded-full bg-paper-100 flex items-center justify-center text-ink-900 group-hover:bg-gold-500 group-hover:text-white transition-colors">
               {idx === 0 ? <Compass size={24}/> : idx === 1 ? <Scroll size={24}/> : <BookOpen size={24}/>}
            </div>

            <h3 className="text-xl font-bold font-serif text-ink-900 mb-4 group-hover:text-gold-600 transition-colors">{item.title}</h3>
            <p className="text-ink-700 text-sm leading-7 text-justify font-light opacity-80">
              {item.content}
            </p>
            
            <div className="mt-6 flex items-center text-xs font-bold text-gold-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
               Read More <span className="ml-2">→</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WikiSection;