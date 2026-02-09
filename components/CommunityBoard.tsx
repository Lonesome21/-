import React, { useState, useEffect } from 'react';
import { CommunityPost } from '../types';
import { MessageCircle, Heart, User, Sparkles, Send } from 'lucide-react';
import { generateCommunityContent } from '../services/geminiService';

const CommunityBoard: React.FC = () => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [newContent, setNewContent] = useState('');
  const [dailyTopic, setDailyTopic] = useState("今日话题: ...");
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    // Load local posts or init default
    const saved = localStorage.getItem('omni_community_posts');
    if (saved) {
      setPosts(JSON.parse(saved));
    } else {
       // Init with a few "fake" posts
       setPosts([
         { id: '1', author: 'StarGazer', content: 'INTJ配对ENFP真的太上头了，有人有同感吗？', likes: 24, timestamp: Date.now() - 3600000, topic: 'MBTI', aiReply: 'INTJ与ENFP常被称为“黄金搭档”，直觉功能的互补能带来深层的灵魂共鸣。' },
         { id: '2', author: 'WoodDragon', content: '今年甲辰年，是不是对日主是土的人不太友好？', likes: 12, timestamp: Date.now() - 7200000, topic: 'BaZi', aiReply: '甲木克土，若日主身弱且无火通关，确实压力较大。建议多穿红色衣物化解。' }
       ]);
    }

    // Generate daily topic via AI
    if (process.env.API_KEY) {
        generateCommunityContent('TOPIC').then(t => {
            if (t) setDailyTopic("🔥 今日热议: " + t);
        });
    }
  }, []);

  const handlePost = async () => {
    if (!newContent.trim()) return;
    setIsPosting(true);
    
    const newPost: CommunityPost = {
      id: Date.now().toString(),
      author: '我 (User)',
      content: newContent,
      likes: 0,
      timestamp: Date.now(),
      topic: 'General'
    };

    // Simulate AI reply
    if (process.env.API_KEY) {
        const reply = await generateCommunityContent('REPLY', newContent);
        newPost.aiReply = reply;
    }

    const updated = [newPost, ...posts];
    setPosts(updated);
    localStorage.setItem('omni_community_posts', JSON.stringify(updated));
    setNewContent('');
    setIsPosting(false);
  };

  const handleLike = (id: string) => {
      const updated = posts.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p);
      setPosts(updated);
      localStorage.setItem('omni_community_posts', JSON.stringify(updated));
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 animate-in fade-in slide-in-from-bottom-4">
      <div className="bg-gradient-to-r from-ink-900 to-ink-800 rounded-2xl p-8 mb-8 text-paper-50 shadow-xl relative overflow-hidden">
         <div className="absolute top-0 right-0 p-8 opacity-10"><MessageCircle size={120}/></div>
         <h2 className="text-3xl font-serif font-bold mb-2">灵性社区</h2>
         <p className="opacity-80 mb-6 max-w-lg">分享你的感悟，与AI向导及同频伙伴交流。</p>
         <div className="inline-block bg-white/10 px-4 py-2 rounded-full text-sm font-bold text-gold-400 border border-gold-400/20 backdrop-blur-sm">
            {dailyTopic}
         </div>
      </div>

      {/* Input */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-ink-900/5 mb-8">
         <textarea 
            className="w-full bg-paper-50 rounded-lg p-4 border border-ink-900/10 focus:ring-2 focus:ring-gold-400 outline-none text-ink-900 resize-none h-24"
            placeholder="分享你的星象观察或命理困惑..."
            value={newContent}
            onChange={e => setNewContent(e.target.value)}
         ></textarea>
         <div className="flex justify-end mt-4">
            <button 
               onClick={handlePost} 
               disabled={isPosting}
               className="bg-ink-900 text-gold-400 px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-ink-800 disabled:opacity-50 transition-colors"
            >
               {isPosting ? '发布中...' : <><Send size={16}/> 发布</>}
            </button>
         </div>
      </div>

      {/* Feed */}
      <div className="space-y-6">
         {posts.map(post => (
            <div key={post.id} className="bg-white p-6 rounded-xl border border-ink-900/5 hover:shadow-md transition-shadow">
               <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-paper-200 flex items-center justify-center text-ink-700">
                        <User size={20}/>
                     </div>
                     <div>
                        <div className="font-bold text-ink-900 text-sm">{post.author}</div>
                        <div className="text-xs text-gray-500">{new Date(post.timestamp).toLocaleString('zh-CN')}</div>
                     </div>
                  </div>
                  <span className="text-[10px] bg-paper-100 text-gray-500 px-2 py-1 rounded-full">{post.topic}</span>
               </div>
               
               <p className="text-ink-800 leading-relaxed mb-4">{post.content}</p>

               {post.aiReply && (
                   <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-lg mb-4 text-sm flex gap-3">
                      <div className="mt-1 text-indigo-500"><Sparkles size={16}/></div>
                      <div>
                         <span className="font-bold text-indigo-700 text-xs uppercase tracking-wider block mb-1">AI 灵性向导回复</span>
                         <p className="text-ink-700">{post.aiReply}</p>
                      </div>
                   </div>
               )}

               <div className="flex gap-4 border-t border-ink-900/5 pt-3">
                  <button onClick={() => handleLike(post.id)} className="flex items-center gap-1 text-gray-400 hover:text-vermilion-500 transition-colors text-sm">
                     <Heart size={16}/> {post.likes}
                  </button>
                  <button className="flex items-center gap-1 text-gray-400 hover:text-ink-900 transition-colors text-sm">
                     <MessageCircle size={16}/> 回复
                  </button>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
}

export default CommunityBoard;