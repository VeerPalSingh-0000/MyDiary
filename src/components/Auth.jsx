import { useState } from "react";
import { signInWithGoogle, loginEmail, signupEmail } from "../firebase"; 
import { Mail, Lock, ArrowRight, AlertCircle, Loader2 } from "lucide-react";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      if (isLogin) {
        await loginEmail(email, password);
      } else {
        await signupEmail(email, password);
      }
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') setError("This email is already registered.");
      else if (err.code === 'auth/wrong-password') setError("Incorrect password.");
      else if (err.code === 'auth/user-not-found') setError("No account found with this email.");
      else if (err.code === 'auth/invalid-credential') setError("Invalid email or password.");
      else if (err.code === 'auth/weak-password') setError("Password should be at least 6 characters.");
      else setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error(error);
      setError("Google Sign In failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#050505] text-white font-sans p-4 relative overflow-hidden">
      
      {/* --- Starry Background --- */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[120px]"></div>
        <div className="absolute top-[20%] left-[15%] w-1 h-1 bg-white rounded-full animate-pulse opacity-80 shadow-[0_0_8px_white]"></div>
        <div className="absolute bottom-[30%] right-[20%] w-1 h-1 bg-white rounded-full animate-pulse opacity-90 shadow-[0_0_4px_white] delay-300"></div>
      </div>

      {/* --- Main Card --- */}
      <div className="w-full max-w-md bg-white/5 backdrop-blur-2xl p-6 sm:p-10 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-white/10 relative z-10 transition-all duration-300 my-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto h-12 w-12 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center shadow-lg shadow-black/50 mb-6 transform transition-transform hover:scale-110 duration-300">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold tracking-tight text-white">
            {isLogin ? "Welcome back" : "Create an account"}
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            {isLogin ? "Enter your details to access your diary." : "Start documenting your life today."}
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 text-red-200 text-sm border border-red-500/20 animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-300">Email address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-500 group-focus-within:text-white transition-colors" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl bg-black/40 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/40 transition-all sm:text-sm"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-300">Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-white transition-colors" />
              </div>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl bg-black/40 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/40 transition-all sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-black bg-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all shadow-lg active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
               <Loader2 className="w-5 h-5 animate-spin text-black" />
            ) : (
              <>
                {isLogin ? "Sign in" : "Sign up"}
                <ArrowRight className="ml-2 h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
        
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-[#0a0a0a] rounded-full text-gray-500 font-medium">Or continue with</span>
          </div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="w-full inline-flex justify-center items-center py-3 px-4 border border-white/10 rounded-xl shadow-lg bg-white/5 text-sm font-medium text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/20 transition-all active:scale-[0.98]"
        >
          <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Google
        </button>

        <p className="text-center text-sm text-gray-500 mt-8">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="font-bold text-white hover:text-gray-300 underline decoration-gray-600 underline-offset-4 hover:decoration-white transition-all"
          >
            {isLogin ? "Sign up for free" : "Sign in"}
          </button>
        </p>

      </div>
    </div>
  );
}