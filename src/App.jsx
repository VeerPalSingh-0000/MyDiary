import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import Auth from "./components/Auth";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "./firebase"; 
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  where, 
  orderBy, 
  onSnapshot 
} from "firebase/firestore";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Data States
  const [entries, setEntries] = useState([]);
  const [activeTab, setActiveTab] = useState('all');

  // Editor State
  const [entry, setEntry] = useState({
    title: "",
    content: "",
    mood: "neutral"
  });

  // 1. Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Real-time Data Listener (Fetch Entries from Firestore)
  useEffect(() => {
    if (!user) {
      setEntries([]);
      return;
    }

    // Query: Get entries for this user, ordered by newest first
    const q = query(
      collection(db, "entries"),
      where("uid", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    // Snapshot listener updates automatically when DB changes
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedEntries = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEntries(fetchedEntries);
    });

    return () => unsubscribe();
  }, [user]);

  // 3. Handle Saving (Create New Entry)
  const handleSave = async () => {
    if (!user || !entry.content.trim()) return;
    
    try {
      await addDoc(collection(db, "entries"), {
        uid: user.uid,
        title: entry.title || "Untitled",
        content: entry.content,
        mood: entry.mood,
        createdAt: serverTimestamp(), // Server-side time is safer
        date: entry.date ? new Date(entry.date).toLocaleDateString() : new Date().toLocaleDateString() // Fallback display date
      });
      
      // Reset editor after save to allow new writing
      setEntry({
        title: "",
        content: "",
        mood: "neutral"
      });
      
      console.log("Entry saved successfully!");
    } catch (error) {
      console.error("Error saving entry:", error);
      alert("Failed to save entry. Check console.");
    }
  };

  // 4. Handle Entry Selection (Load from Sidebar)
  const handleEntrySelect = (selectedEntry) => {
    setEntry({
      ...selectedEntry,
      // If reading an old entry, we might want to prevent editing or handle updates differently
      // For now, we just load the content into the editor
    });
    // Close sidebar on mobile when an entry is clicked
    setIsSidebarOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // 5. Filter Logic (Optional - for Favorites tab)
  const displayedEntries = activeTab === 'favorites' 
    ? entries.filter(e => e.isFavorite) // You'll need to add 'isFavorite' to your data later
    : entries;

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#050505]">
      
      <Sidebar 
        user={user} 
        logout={handleLogout} 
        entries={displayedEntries}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        
        // Dynamic Props
        currentTab={activeTab}
        onTabChange={setActiveTab}
        onEntryClick={handleEntrySelect}
        onViewAll={() => setActiveTab('all')}
      />

      <Editor 
        entry={entry}
        setEntry={setEntry}
        handleSave={handleSave}
        toggleSidebar={() => setIsSidebarOpen(true)}
      />
      
    </div>
  );
}