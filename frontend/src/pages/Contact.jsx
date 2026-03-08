import { useState } from 'react';
import {
    Mail, Phone, MapPin, Send, MessageCircle,
    Zap, Shield, Globe, LifeBuoy, Clock,
    ChevronRight, ArrowRight
} from 'lucide-react';
import { toast } from 'react-toastify';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        toast.success("Message transmitted. Our team will contact you shortly.");
        setFormData({ name: '', email: '', subject: '', message: '' });
        setIsSubmitting(false);
    };

    return (
        <div className="bg-white text-slate-900 min-h-screen">
            {/* Header Section */}
            <section className="relative pt-32 pb-20 bg-slate-50 border-b border-slate-100 overflow-hidden">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-500/5 blur-[100px] rounded-full"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-bold mb-6 uppercase tracking-widest">
                        <LifeBuoy size={14} /> Center for Excellence
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight">How can we <span className="text-indigo-600">help you?</span></h1>
                    <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
                        Our specialized support units are standing by to assist with your educational journey.
                    </p>
                </div>
            </section>

            {/* Support Categories */}
            <section className="py-20 -mt-10 relative z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Zap,
                                title: "Technical Support",
                                desc: "Troubleshoot platform issues, video playback, or account access.",
                                email: "ops@coursify.edu"
                            },
                            {
                                icon: Shield,
                                title: "Billing & Security",
                                desc: "Inquiries regarding payments, refunds, and corporate subscriptions.",
                                email: "finance@coursify.edu"
                            },
                            {
                                icon: Globe,
                                title: "Partner Programs",
                                desc: "Explore instructor partnerships and institutional licensing.",
                                email: "growth@coursify.edu"
                            }
                        ].map((item, i) => (
                            <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 group hover:-translate-y-2 transition-all duration-500">
                                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <item.icon size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-4">{item.title}</h3>
                                <p className="text-slate-500 text-sm font-medium mb-6 leading-relaxed">{item.desc}</p>
                                <a href={`mailto:${item.email}`} className="text-[11px] font-semibold text-indigo-600 uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                                    {item.email} <ArrowRight size={14} />
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Form Section */}
            <section className="py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-[4rem] border border-slate-100 shadow-2xl overflow-hidden flex flex-col lg:flex-row">
                        <div className="lg:w-1/2 p-12 md:p-20 bg-slate-900 text-white relative">
                            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, white 1.5px, transparent 0)', backgroundSize: '40px 40px' }}></div>

                            <h2 className="text-3xl md:text-5xl font-bold mb-10 tracking-tight">Direct Terminal</h2>
                            <p className="text-slate-400 text-lg mb-16 leading-relaxed">
                                Use the direct terminal for high-priority inquiries. Our response protocol ensures attention within 24 hours.
                            </p>

                            <div className="space-y-10">
                                <div className="flex items-center gap-6 group">
                                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                                        <MessageCircle size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Live Chat</p>
                                        <p className="text-lg font-bold">Protocol Active 24/7</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6 group">
                                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                                        <Clock size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Response Time</p>
                                        <p className="text-lg font-bold">&lt; 120 Minutes Avg.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:w-1/2 p-12 md:p-20">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="User name"
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-medium focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-600/30 transition-all outline-none"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
                                        <input
                                            required
                                            type="email"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="Email protocol"
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-medium focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-600/30 transition-all outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Subject</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.subject}
                                        onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                        placeholder="Inquiry type"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-medium focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-600/30 transition-all outline-none"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Message Payload</label>
                                    <textarea
                                        required
                                        rows={5}
                                        value={formData.message}
                                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                                        placeholder="Detailed description of your requirement..."
                                        className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] px-6 py-4 text-sm font-medium focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-600/30 transition-all outline-none resize-none"
                                    ></textarea>
                                </div>
                                <button
                                    disabled={isSubmitting}
                                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-5 rounded-[2rem] shadow-xl shadow-indigo-600/20 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {isSubmitting ? "Processing..." : <><Send size={18} /> Transmit Message</>}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
