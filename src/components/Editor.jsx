import React, { useState, useEffect, useRef } from 'react';
import { Save, Smile, Meh, Frown, CloudSun, Star, Lock, Image, Paperclip, Loader2, Menu, X, FileText, Calendar } from "lucide-react";

export default function Editor({ entry, setEntry, handleSave, toggleSidebar }) {
  const [isSaving, setIsSaving] = useState(false);
  const [charCount, setCharCount] = useState(0);
  
  // Refs for hidden inputs
  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const dateInputRef = useRef(null); // 1. New Ref for Date
  
  // Sync charCount
  useEffect(() => {
    setCharCount(entry?.content?.length || 0);
  }, [entry]);

  // Helper to update fields
  const updateField = (field, value) => {
    setEntry(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveClick = async () => {
    setIsSaving(true);
    await handleSave();
    setTimeout(() => setIsSaving(false), 1000);
  };

  // --- Date Helpers ---
  // Ensure we have a valid date string (YYYY-MM-DD) for the input
  const getCurrentDateStr = () => {
    if (entry.date) {
        // If it's already a YYYY-MM-DD string
        if (typeof entry.date === 'string' && entry.date.includes('-')) return entry.date;
        // If it's a JS Date object or timestamp
        return new Date(entry.date).toISOString().split('T')[0];
    }
    return new Date().toISOString().split('T')[0];
  };

  const handleDateChange = (e) => {
    updateField('date', e.target.value);
  };
  // --------------------

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      const newImage = { id: Date.now(), url: imageUrl, file: file };
      setEntry(prev => ({ ...prev, images: [...(prev.images || []), newImage] }));
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newFile = { id: Date.now(), name: file.name, size: (file.size / 1024).toFixed(1) + ' KB', file: file };
      setEntry(prev => ({ ...prev, attachments: [...(prev.attachments || []), newFile] }));
    }
  };

  const removeImage = (id) => {
    setEntry(prev => ({ ...prev, images: prev.images.filter(img => img.id !== id) }));
  };

  const removeAttachment = (id) => {
    setEntry(prev => ({ ...prev, attachments: prev.attachments.filter(file => file.id !== id) }));
  };

  const moodConfig = {
    happy: { icon: Smile, emoji: '😊', label: 'Happy', activeClass: 'bg-emerald-500/10 ring-2 ring-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)] text-emerald-400', iconClass: 'text-emerald-400' },
    neutral: { icon: Meh, emoji: '😐', label: 'Neutral', activeClass: 'bg-amber-500/10 ring-2 ring-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)] text-amber-400', iconClass: 'text-amber-400' },
    sad: { icon: Frown, emoji: '😢', label: 'Sad', activeClass: 'bg-rose-500/10 ring-2 ring-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.2)] text-rose-400', iconClass: 'text-rose-400' }
  };

  return (
    <main className="flex-1 overflow-y-auto h-full bg-[#050505] relative text-slate-200">
      
      {/* --- Hidden Inputs --- */}
      <input type="file" ref={imageInputRef} onChange={handleImageSelect} accept="image/*" className="hidden" />
      <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
      
      {/* 2. Hidden Date Input */}
      <input 
        type="date" 
        ref={dateInputRef} 
        value={getCurrentDateStr()} 
        onChange={handleDateChange}
        className="hidden" 
      />

      {/* --- Starry Background --- */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-[20%] left-[15%] w-0.5 h-0.5 bg-white rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-[50%] right-[10%] w-0.5 h-0.5 bg-white rounded-full opacity-40"></div>
        <div className="absolute bottom-[30%] left-[20%] w-1 h-1 bg-white rounded-full opacity-30 blur-[0.5px]"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto p-4 md:p-8 lg:p-12">
        
        {/* Floating Header Bar */}
        <header className="mb-8 backdrop-blur-xl bg-[#121212]/80 rounded-2xl shadow-xl shadow-black/20 border border-white/10 p-6 sticky top-4 z-20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              
              <button onClick={toggleSidebar} className="p-3 -ml-2 rounded-xl text-slate-400 hover:bg-white/10 hover:text-white transition-colors md:hidden">
                <Menu className="w-6 h-6" />
              </button>

              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-900/30">
                <CloudSun className="text-white w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                  {entry.title || "New Entry"}
                </h2>
                
                {/* 3. Date Picker Button */}
                <button 
                  onClick={() => dateInputRef.current.showPicker()} 
                  className="text-slate-500 text-sm font-medium flex items-center gap-2 mt-1 hover:text-indigo-400 transition-colors group cursor-pointer"
                >
                  <Calendar className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  {/* Display formatted date */}
                  {new Date(getCurrentDateStr()).toLocaleDateString('en-US', { 
                    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' 
                  })}
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => updateField('isFavorite', !entry.isFavorite)}
                className={`p-3 rounded-xl transition-all duration-300 group ${entry.isFavorite ? "text-yellow-400 bg-yellow-400/10" : "text-slate-500 hover:text-indigo-400 hover:bg-white/5"}`}
              >
                <Star className={`w-5 h-5 group-hover:scale-110 transition-transform ${entry.isFavorite ? "fill-current" : ""}`} />
              </button>

              <button 
                onClick={() => updateField('isLocked', !entry.isLocked)}
                className={`p-3 rounded-xl transition-all duration-300 group ${entry.isLocked ? "text-rose-500 bg-rose-500/10" : "text-slate-500 hover:text-indigo-400 hover:bg-white/5"}`}
              >
                <Lock className={`w-5 h-5 group-hover:scale-110 transition-transform ${entry.isLocked ? "fill-current" : ""}`} />
              </button>
              
              <button onClick={handleSaveClick} disabled={isSaving} className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl shadow-lg shadow-indigo-900/40 hover:shadow-indigo-600/50 hover:scale-105 transition-all duration-300 active:scale-95 font-semibold disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden group border border-white/10">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin relative z-10" /> : <Save className="w-5 h-5 relative z-10" />}
                <span className="relative z-10">{isSaving ? 'Saving...' : 'Save Entry'}</span>
              </button>
            </div>
          </div>
        </header>

        {/* Editor Card */}
        <div className="bg-[#121212]/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/50 border border-white/10 overflow-hidden transition-all duration-500">
          
          {/* Mood Bar */}
          <div className="bg-gradient-to-r from-[#121212] to-indigo-900/10 px-8 py-5 border-b border-white/5">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                How are you feeling?
              </span>
              <div className="flex gap-3">
                {Object.entries(moodConfig).map(([moodKey, config]) => {
                  const isSelected = entry.mood === moodKey;
                  return (
                    <button key={moodKey} onClick={() => updateField('mood', moodKey)} className={`group relative px-4 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 ${isSelected ? config.activeClass : 'bg-[#0a0a0a] hover:bg-white/5 border border-white/10 text-slate-500 hover:text-slate-300'}`}>
                      <span className="text-xl group-hover:scale-125 transition-transform duration-300">{config.emoji}</span>
                      <span className="text-xs font-semibold">{config.label}</span>
                      {isSelected && <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full border border-[#121212]"></div>}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Writing Area */}
          <div className="p-8 md:p-12">
            <div className="mb-8 group">
              <input type="text" placeholder="Give your day a title..." className="w-full text-4xl md:text-5xl font-black text-white placeholder:text-slate-600 border-none focus:ring-0 outline-none bg-transparent tracking-tight leading-tight transition-all duration-300" value={entry.title || ""} onChange={(e) => updateField('title', e.target.value)} style={{ textShadow: '0 0 20px rgba(255,255,255,0.1)' }} />
              <div className="h-1 w-0 group-focus-within:w-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500 mt-4"></div>
            </div>

            {/* Images */}
            {entry.images && entry.images.length > 0 && (
              <div className="flex flex-wrap gap-4 mb-8 animate-in fade-in slide-in-from-bottom-4">
                {entry.images.map((img) => (
                  <div key={img.id} className="relative group/image">
                    <img src={img.url} alt="Attachment" className="w-32 h-32 object-cover rounded-xl border border-white/10 shadow-lg" />
                    <button onClick={() => removeImage(img.id)} className="absolute -top-2 -right-2 bg-rose-500 text-white p-1 rounded-full opacity-0 group-hover/image:opacity-100 transition-opacity shadow-md">
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="relative">
              <textarea placeholder="Pour your heart out... ✨" className="w-full h-[500px] text-lg md:text-xl text-slate-300 leading-relaxed placeholder:text-slate-700 border-none focus:ring-0 outline-none resize-none bg-transparent tracking-wide selection:bg-indigo-500/30" value={entry.content || ""} onChange={(e) => updateField('content', e.target.value)} style={{ lineHeight: '1.8', fontFamily: "'Georgia', 'Times New Roman', serif" }}></textarea>
              <div className="absolute bottom-4 right-4 bg-[#1a1a1a]/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-white/10 flex items-center gap-2 pointer-events-none">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                <span className="text-xs font-semibold text-slate-400">{charCount} characters</span>
              </div>
            </div>

            {/* Attachments */}
            {entry.attachments && entry.attachments.length > 0 && (
              <div className="mt-4 space-y-2">
                {entry.attachments.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400"><FileText size={18} /></div>
                      <div><p className="text-sm font-medium text-slate-200">{file.name}</p><p className="text-xs text-slate-500">{file.size}</p></div>
                    </div>
                    <button onClick={() => removeAttachment(file.id)} className="p-2 hover:bg-white/10 rounded-lg text-slate-500 hover:text-rose-400 transition-colors"><X size={16} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-[#0a0a0a]/50 px-8 py-4 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => imageInputRef.current.click()} className="p-2.5 rounded-lg text-slate-500 hover:text-indigo-400 hover:bg-white/5 transition-all duration-300 group" title="Add Image"><Image className="w-5 h-5 group-hover:scale-110 transition-transform" /></button>
              <button onClick={() => fileInputRef.current.click()} className="p-2.5 rounded-lg text-slate-500 hover:text-indigo-400 hover:bg-white/5 transition-all duration-300 group" title="Attach File"><Paperclip className="w-5 h-5 group-hover:scale-110 transition-transform" /></button>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]"></div>Auto-saved</div>
          </div>
        </div>
      </div>
    </main>
  );
}