import React from "react";
import { LogOut, Book, Star, Settings, ChevronRight, PenLine, X } from "lucide-react";

const MENU_ITEMS = [
  { id: 'all', label: "All Entries", icon: Book },
  { id: 'favorites', label: "Favorites", icon: Star },
  { id: 'settings', label: "Settings", icon: Settings },
];

export default function Sidebar({ 
  user, 
  logout, 
  entries = [], 
  isOpen, 
  onClose,
  currentTab = 'all',
  onTabChange = () => {},
  onEntryClick = () => {},
  onViewAll = () => {}
}) {

  const formatDate = (dateVal) => {
    if (!dateVal) return "Unknown date";
    if (dateVal?.seconds) {
      return new Date(dateVal.seconds * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    }
    return new Date(dateVal).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const getUserInitials = () => {
    return user?.email?.[0]?.toUpperCase() || "U";
  };

  return (
    <>
      {/* --- Mobile Backdrop --- */}
      <div 
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden transition-all duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* --- Sidebar Container --- */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-[#050505] border-r border-white/10 flex flex-col h-full 
          shadow-2xl md:shadow-[4px_0_24px_rgba(0,0,0,0.5)]
          transition-transform duration-300 ease-[cubic-bezier(0.2,0,0,1)]
          md:relative md:translate-x-0 overflow-hidden
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        
        {/* --- Starry Background Effect --- */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
           <div className="absolute top-[-10%] left-[-20%] w-[200px] h-[200px] bg-purple-900/30 rounded-full blur-[60px]"></div>
           <div className="absolute bottom-[20%] right-[-10%] w-[200px] h-[200px] bg-blue-900/20 rounded-full blur-[60px]"></div>
           <div className="absolute top-[15%] right-[10%] w-0.5 h-0.5 bg-white rounded-full opacity-60 animate-pulse"></div>
           <div className="absolute top-[40%] left-[10%] w-0.5 h-0.5 bg-white rounded-full opacity-40"></div>
        </div>

        {/* --- Content Wrapper --- */}
        <div className="relative z-10 flex flex-col h-full">

          {/* 1. Profile Header */}
          <div className="p-6 md:p-8 pb-6 shrink-0">
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors md:hidden"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-4 group cursor-default">
              <div className="relative shrink-0">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    className="w-12 h-12 rounded-2xl object-cover shadow-lg ring-2 ring-white/10 group-hover:ring-indigo-500/50 transition-all"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-indigo-900/50">
                    {getUserInitials()}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#050505] rounded-full"></div>
              </div>
              
              <div className="overflow-hidden">
                <h3 className="text-base font-bold text-white truncate group-hover:text-indigo-400 transition-colors">
                  {user?.displayName || "Writer"}
                </h3>
                <p className="text-xs text-slate-400 font-medium truncate">
                  {user?.email || "Signed in"}
                </p>
              </div>
            </div>
          </div>

          {/* 2. Main Navigation */}
          <nav className="px-4 py-2 shrink-0">
            <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 select-none">
              Menu
            </p>
            <div className="space-y-1">
              {MENU_ITEMS.map((item) => {
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group relative overflow-hidden ${
                      isActive
                        ? "bg-indigo-500/20 text-indigo-300 shadow-sm ring-1 ring-indigo-500/30"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <item.icon
                      size={18}
                      className={`transition-colors ${isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"}`}
                    />
                    <span className="relative z-10">{item.label}</span>
                    
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* 3. Recent Entries List */}
          <div className="flex-1 px-4 py-6 overflow-y-auto custom-scrollbar min-h-0 flex flex-col">
            <div className="flex items-center justify-between px-4 mb-3 shrink-0">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest select-none">
                Recent
              </p>
              {entries.length > 0 && (
                <button 
                  onClick={onViewAll}
                  className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 px-2 py-1 rounded transition-all"
                >
                  VIEW ALL
                </button>
              )}
            </div>
            
            <div className="space-y-2 pb-4">
              {entries.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center px-4 border border-dashed border-white/10 rounded-xl bg-white/5 mx-2">
                  <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center shadow-sm mb-3">
                    <PenLine size={18} className="text-slate-500" />
                  </div>
                  <p className="text-sm font-medium text-slate-300">No entries yet</p>
                  <p className="text-xs text-slate-500 mt-1 max-w-[150px]">Start your journey among the stars.</p>
                </div>
              ) : (
                entries.map((entry) => (
                  <button
                    key={entry.id}
                    onClick={() => onEntryClick(entry)}
                    className="w-full text-left group flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all duration-200"
                  >
                    <div className="mt-0.5 min-w-[24px] h-6 flex items-center justify-center bg-white/5 rounded-md text-sm group-hover:bg-indigo-500/20 transition-colors">
                      {entry.mood || '📝'}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-slate-300 truncate group-hover:text-white transition-colors">
                        {entry.title || "Untitled Entry"}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1 group-hover:text-slate-400">
                        <span>{formatDate(entry.date || entry.createdAt)}</span>
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* 4. Footer */}
          <div className="p-4 border-t border-white/10 bg-[#050505]/50 shrink-0">
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all duration-200 group"
            >
              <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span>Sign Out</span>
            </button>
          </div>

        </div>
      </aside>
    </>
  );
}