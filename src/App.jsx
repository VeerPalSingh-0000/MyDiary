import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import Auth from "./components/Auth";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "./firebase"; 
import { 
  collection, 
  addDoc,
  deleteDoc, // 1. Import deleteDoc
  doc,       // 1. Import doc
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
  
  const [entries, setEntries] = useState([]);
  const [activeTab, setActiveTab] = useState('all');

  const [entry, setEntry] = useState({
    title: "",
    content: "",
    mood: "neutral",
    images: [],
    attachments: [],
    date: ""
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setEntries([]);
      return;
    }

    const q = query(
      collection(db, "entries"),
      where("uid", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedEntries = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEntries(fetchedEntries);
    });

    return () => unsubscribe();
  }, [user]);

  const handleSave = async () => {
    if ((!entry.content?.trim()) && (!entry.title?.trim())) {
      alert("Please write a title or some content first!");
      return;
    }
    
    if (!user) {
      alert("You need to be logged in to save.");
      return;
    }
    
    try {
      const entryData = {
        uid: user.uid,
        title: entry.title || "Untitled",
        content: entry.content || "",
        mood: entry.mood || "neutral",
        createdAt: serverTimestamp(),
        date: entry.date ? new Date(entry.date).toLocaleDateString() : new Date().toLocaleDateString(),
        images: entry.images || [], 
        attachments: entry.attachments || [],
        isFavorite: entry.isFavorite || false,
        isLocked: entry.isLocked || false
      };

      await addDoc(collection(db, "entries"), entryData);
      
      setEntry({
        title: "",
        content: "",
        mood: "neutral",
        images: [],
        attachments: [],
        date: ""
      });
      
    } catch (error) {
      console.error("Error saving entry:", error);
      alert(`Error saving: ${error.message}`); 
    }
  };

  // 2. New Delete Function
  const handleDelete = async (entryId) => {
    // We confirm inside the Sidebar component, but double check here or just execute
    try {
      await deleteDoc(doc(db, "entries", entryId));
      
      // If the deleted entry is currently open in the editor, clear the editor
      if (entry.id === entryId) {
        setEntry({
            title: "",
            content: "",
            mood: "neutral",
            images: [],
            attachments: [],
            date: ""
        });
      }
    } catch (error) {
      console.error("Error deleting:", error);
      alert("Could not delete entry.");
    }
  };

  const handleEntrySelect = (selectedEntry) => {
    setEntry({
      ...selectedEntry,
      images: selectedEntry.images || [],
      attachments: selectedEntry.attachments || []
    });
    setIsSidebarOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const displayedEntries = activeTab === 'favorites' 
    ? entries.filter(e => e.isFavorite) 
    : entries;

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#050505]">
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
        currentTab={activeTab}
        onTabChange={setActiveTab}
        onEntryClick={handleEntrySelect}
        onViewAll={() => setActiveTab('all')}
        onDelete={handleDelete} // 3. Pass handleDelete to Sidebar
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