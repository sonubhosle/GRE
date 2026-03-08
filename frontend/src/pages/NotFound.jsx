import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Zap, Satellite, Rocket } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 overflow-hidden relative">
            {/* Background elements */}
            <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full animate-pulse"></div>
            <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-[500px] h-[500px] bg-purple-600/10 blur-[150px] rounded-full animate-pulse capitalize"></div>

            <div className="relative z-10 text-center max-w-2xl mx-auto space-y-12 animate-fade-in-up">
                {/* Visual Icon */}
                <div className="relative inline-block">
                    <div className="text-white opacity-5 text-[200px] font-semibold tracking-tighter absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none">
                        404
                    </div>
                    <div className="relative w-40 h-40 bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-3xl flex items-center justify-center mx-auto shadow-2xl">
                        <Satellite size={60} className="text-white animate-bounce-slow" />
                        <div className="absolute -top-4 -right-4 w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center animate-pulse">
                            <Zap size={20} className="text-white fill-current" />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                        Course <span className="text-indigo-400">Not Discovered</span>
                    </h1>
                    <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-md mx-auto">
                        Your request has entered an unmapped sector of our library. The knowledge you seek may have been relocated.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-5 justify-center pt-8">
                    <Link to="/" className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-5 rounded-2xl font-bold text-sm transition-all shadow-2xl shadow-indigo-500/20 active:scale-95 flex items-center justify-center gap-3">
                        <Home size={18} /> Return to base
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="bg-white/5 border border-white/10 hover:bg-white/10 text-white px-10 py-5 rounded-2xl font-bold text-sm transition-all backdrop-blur-xl flex items-center justify-center gap-3"
                    >
                        <ArrowLeft size={18} /> Previous quadrant
                    </button>
                </div>

                <div className="pt-16 flex items-center justify-center gap-10 opacity-20">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-white uppercase tracking-widest">
                        <Rocket size={14} /> Protocol 404-b
                    </div>
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                    <div className="text-[10px] font-bold text-white uppercase tracking-widest">
                        Coursify Search Active
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
