import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import {
    Cpu,
    Layers,
    BarChart3,
    ShieldCheck,
    Zap,
    Activity,
    ArrowRight,
    Lock,
    Settings
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '../../components/ui';
import { ROUTES } from '../../constants';
import { Footer } from '../../components/ui/Footer';
import { GlowEffect } from '../../components/ui/GlowEffect';
import DashboardImage from '../../assets/Dashboard.png';
import Logo from '../../assets/logo.png';

const LandingPage = () => {
    const navigate = useNavigate();

    const handleLogin = () => navigate(ROUTES.LOGIN);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-secondary-50 font-sans text-secondary-900 overflow-x-hidden">

            {/* NAVBAR */}
            <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
                <div className="w-full max-w-5xl bg-white/70 backdrop-blur-xl border border-white/40 rounded-full px-6 h-16 flex items-center justify-between shadow-lg shadow-black/5 ring-1 ring-black/5">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3"
                    >
                        <img src={Logo} alt="InventoryX Logo" className="w-8 h-8 object-contain" />
                        <span className="text-lg font-bold tracking-tight text-secondary-900">InventoryX</span>
                    </motion.div>

                    {/* Navigation Links */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="hidden md:flex items-center gap-8"
                    >
                        {['Problem', 'Features', 'Analytics'].map((item) => (
                            <a
                                key={item}
                                href={`#${item.toLowerCase()}`}
                                className="relative text-sm font-medium text-secondary-600 hover:text-primary-500 transition-colors"
                            >
                                {item}
                                <motion.div
                                    className="absolute bottom-[-4px] left-0 h-[2px] bg-primary-500 rounded-full"
                                    initial={{ width: 0 }}
                                    whileHover={{ width: '100%' }}
                                    transition={{ duration: 0.3 }}
                                />
                            </a>
                        ))}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <Button
                            onClick={handleLogin}
                            className="bg-secondary-900 text-white hover:bg-secondary-800 shadow-lg shadow-secondary-900/10 px-6 rounded-full text-sm h-10"
                        >
                            Login
                        </Button>
                    </motion.div>
                </div>
            </nav>

            {/* HERO SECTION */}
            <section className="relative w-full pt-44 pb-32 overflow-hidden">
                {/* Animated Background Grid */}
                <div className="absolute inset-0 z-0 opacity-[0.03]"
                    style={{
                        backgroundImage: 'linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(90deg, #0f172a 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }}>
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                        className="text-center max-w-4xl mx-auto mb-16"
                    >


                        <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold tracking-tight text-secondary-900 mb-6 leading-tight">
                            Control Every Component.<br />
                            <span className="text-primary-500">Power Every PCB.</span>
                        </motion.h1>

                        <motion.p variants={itemVariants} className="text-xl text-secondary-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Orchestrate your entire manufacturing inventory with intelligent automation, real-time tracking, and enterprise-grade security.
                        </motion.p>

                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button onClick={handleLogin} className="px-8 py-4 text-lg bg-primary-500 hover:bg-primary-700 shadow-lg shadow-primary-700/20">
                                Get Started Now
                            </Button>
                        </motion.div>
                    </motion.div>

                    {/* Floating Dashboard Preview */}
                    <div style={{ perspective: '1000px' }}>
                        <motion.div
                            initial={{ opacity: 0, y: 100, rotateX: 30 }}
                            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 2, ease: "easeOut" }}
                            className="relative mx-auto max-w-5xl"
                        >
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-indigo-600 rounded-2xl blur opacity-20"></div>
                            <img
                                src={DashboardImage}
                                alt="InventoryX Dashboard Interface"
                                className="relative w-full h-auto rounded-xl shadow-2xl border border-secondary-200"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* PROBLEM SECTION */}
            <section id="problem" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-6">Manufacturing Logic,<br />Not Spreadsheet Chaos.</h2>
                            <p className="text-lg text-secondary-600 mb-8 leading-relaxed">
                                Traditional inventory tracking creates bottlenecks. InventoryX eliminates the guesswork with precision tracking and automated component lifecycle management.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "Eliminate component stockouts",
                                    "Reduce procurement latency",
                                    "Real-time PCB assembly status"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center text-secondary-600">
                                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-danger/10 text-danger mr-3">
                                            <ArrowRight size={14} />
                                        </span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                        <div className="relative">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-100 rounded-full blur-3xl opacity-50"></div>
                            {/* Live Monitor Widget */}
                            <div className="relative bg-white p-1 rounded-2xl border border-secondary-200 shadow-2xl overflow-hidden">
                                <div className="absolute inset-0 bg-slate-50 opacity-50"
                                    style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                                </div>

                                {/* Header */}
                                <div className="relative flex items-center justify-between px-6 py-4 border-b border-secondary-100 bg-white/80 backdrop-blur-sm z-10">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                                        <span className="text-xs font-bold tracking-wider text-secondary-900 uppercase">Live Operations Monitor</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-2 py-1 bg-red-50 text-red-600 rounded text-[10px] font-mono font-medium border border-red-100">
                                        ANOMALY DETECTED
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 relative z-10">
                                    <motion.div
                                        className="space-y-3 mb-8"
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true, margin: "-100px" }}
                                        variants={{
                                            hidden: { opacity: 0 },
                                            visible: {
                                                opacity: 1,
                                                transition: {
                                                    staggerChildren: 0.4,
                                                    delayChildren: 0.3
                                                }
                                            }
                                        }}
                                    >
                                        {[
                                            { text: "CRITICAL_LOW_STOCK", color: "text-danger", bg: "bg-red-50", border: "border-red-100", time: "2m ago" },
                                            { text: "PROCUREMENT_DELAY", color: "text-warning", bg: "bg-amber-50", border: "border-amber-100", time: "15m ago" },
                                            { text: "PRODUCTION_HALTED", color: "text-slate-600", bg: "bg-slate-50", border: "border-slate-100", time: "1h ago" }
                                        ].map((card, index) => (
                                            <motion.div
                                                key={index}
                                                variants={{
                                                    hidden: { opacity: 0, x: 50 },
                                                    visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 50 } }
                                                }}
                                                className={`flex items-center justify-between p-3 ${card.bg} rounded border ${card.border}`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className={`font-mono text-xs font-bold ${card.color}`}>{card.text}</span>
                                                </div>
                                                <span className="text-[10px] text-secondary-400 font-mono">{card.time}</span>
                                            </motion.div>
                                        ))}
                                    </motion.div>

                                    {/* System Diagnostics Footer */}
                                    <div className="pt-6 border-t border-secondary-100">
                                        <div className="flex justify-between items-end mb-2">
                                            <span className="text-xs font-semibold text-secondary-700">System Diagnostics</span>
                                            <span className="text-[10px] text-secondary-400">Server: US-East-1a</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <div className="flex justify-between text-[10px] text-secondary-500 mb-1">
                                                    <span>Efficiency</span>
                                                    <span className="text-danger font-bold">42%</span>
                                                </div>
                                                <div className="h-1.5 bg-secondary-100 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        whileInView={{ width: "42%" }}
                                                        transition={{ duration: 1, delay: 1 }}
                                                        className="h-full bg-danger rounded-full"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex justify-between text-[10px] text-secondary-500 mb-1">
                                                    <span>Latency</span>
                                                    <span className="text-warning font-bold">850ms</span>
                                                </div>
                                                <div className="h-1.5 bg-secondary-100 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        whileInView={{ width: "75%" }}
                                                        transition={{ duration: 1, delay: 1.2 }}
                                                        className="h-full bg-warning rounded-full"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURE GRID */}
            <section id="features" className="py-24 bg-secondary-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-secondary-900 mb-4">Engineered for Efficiency</h2>
                        <p className="text-secondary-600">Everything you need to scale production without the friction.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Layers,
                                title: "Inventory Control",
                                desc: "Granular tracking of every capacitor, resistor, and IC."
                            },
                            {
                                icon: Cpu,
                                title: "PCB Lifecycle",
                                desc: "Track boards from bare metal to fully assembled units."
                            },
                            {
                                icon: BarChart3,
                                title: "Real-time Analytics",
                                desc: "Instant insight into burn rates and production velocity."
                            },
                            {
                                icon: Zap,
                                title: "Automated Alerts",
                                desc: "Prevent line-down situations with predictive stock warnings."
                            },
                            {
                                icon: ShieldCheck,
                                title: "Audit Trails",
                                desc: "Complete history of every component movement and access."
                            },
                            {
                                icon: Activity,
                                title: "Vendor Management",
                                desc: "Streamline procurement with integrated supplier data."
                            }
                        ].map((feature, i) => (
                            <div key={i} className="relative h-64 w-full group">
                                <GlowEffect
                                    colors={['#0894FF', '#C959DD', '#FF2E54', '#FF9004']}
                                    mode="static"
                                    blur="medium"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"
                                />
                                <div className="relative h-full w-full rounded-xl bg-white p-6 border border-secondary-200 shadow-sm transition-all duration-300 group-hover:border-transparent flex flex-col items-start text-left z-10">
                                    <div className="h-12 w-12 bg-primary-50 rounded-lg flex items-center justify-center text-primary-500 mb-6 group-hover:bg-primary-500 group-hover:text-white transition-colors duration-300">
                                        <feature.icon size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold text-secondary-900 mb-2">{feature.title}</h3>
                                    <p className="text-secondary-600">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ANALYTICS DARK SECTION */}
            <section id="analytics" className="py-24 bg-secondary-900 text-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="order-2 md:order-1">
                            <div className="bg-slate-800/50 rounded-xl p-6 border border-secondary-600 shadow-2xl h-[400px] flex flex-col">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">Production Velocity</h3>
                                        <p className="text-sm text-secondary-400">Daily burn rate vs. output</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="flex items-center text-xs text-secondary-300">
                                            <span className="w-2 h-2 rounded-full bg-primary-500 mr-1"></span> Output
                                        </span>
                                        <span className="flex items-center text-xs text-secondary-300">
                                            <span className="w-2 h-2 rounded-full bg-indigo-500 mr-1"></span> Efficiency
                                        </span>
                                    </div>
                                </div>

                                <div className="flex-1 w-full min-h-0">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart
                                            data={[
                                                { name: 'Mon', output: 4000, efficiency: 2400 },
                                                { name: 'Tue', output: 3000, efficiency: 1398 },
                                                { name: 'Wed', output: 2000, efficiency: 9800 },
                                                { name: 'Thu', output: 2780, efficiency: 3908 },
                                                { name: 'Fri', output: 1890, efficiency: 4800 },
                                                { name: 'Sat', output: 2390, efficiency: 3800 },
                                                { name: 'Sun', output: 3490, efficiency: 4300 },
                                            ]}
                                            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                                        >
                                            <defs>
                                                <linearGradient id="colorOutput" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="colorEfficiency" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} vertical={false} />
                                            <XAxis
                                                dataKey="name"
                                                stroke="#94a3b8"
                                                fontSize={12}
                                                tickLine={false}
                                                axisLine={false}
                                                dy={10}
                                            />
                                            <YAxis
                                                stroke="#94a3b8"
                                                fontSize={12}
                                                tickLine={false}
                                                axisLine={false}
                                                tickFormatter={(value) => `${value / 1000}k`}
                                            />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
                                                itemStyle={{ color: '#e2e8f0', fontSize: '12px' }}
                                                labelStyle={{ color: '#94a3b8', fontSize: '12px', marginBottom: '4px' }}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="output"
                                                stroke="#0ea5e9"
                                                strokeWidth={2}
                                                fillOpacity={1}
                                                fill="url(#colorOutput)"
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="efficiency"
                                                stroke="#6366f1"
                                                strokeWidth={2}
                                                fillOpacity={1}
                                                fill="url(#colorEfficiency)"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                        <div className="order-1 md:order-2">
                            <h2 className="text-3xl font-bold mb-6">Data-Driven Decisions</h2>
                            <p className="text-secondary-300 text-lg mb-8">
                                Stop guessing. InventoryX transforms raw inventory data into actionable intelligence, visualizing burn rates and forecasting shortages before they happen.
                            </p>
                            <div className="flex gap-4">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-primary-100">99.9%</div>
                                    <div className="text-xs text-secondary-300 uppercase tracking-wider mt-1">Accuracy</div>
                                </div>
                                <div className="w-px bg-secondary-600"></div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-success">-40%</div>
                                    <div className="text-xs text-secondary-300 uppercase tracking-wider mt-1">Waste</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>



            {/* SECURITY SECTION */}
            <section className="py-24 bg-secondary-50">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center justify-center p-3 bg-primary-50 text-primary-700 rounded-full mb-8">
                            <Lock size={20} />
                        </div>
                        <h2 className="text-3xl font-bold text-secondary-900 mb-6">Enterprise Security Core</h2>
                        <p className="text-secondary-600 mb-12">
                            Built with Role-Based Access Control (RBAC) and immutable audit logs to ensure your proprietary manufacturing data stays secure.
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid md:grid-cols-2 gap-4 text-left"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: {
                                    staggerChildren: 0.1
                                }
                            }
                        }}
                    >
                        {[
                            "JWT Authenticated Sessions",
                            "Role-Based Access Control",
                            "Encrypted Data Transmission",
                            "Detailed Audit Logging",
                            "Secure API Gateways",
                            "Automated Backups"
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                variants={{
                                    hidden: { opacity: 0, y: 10 },
                                    visible: { opacity: 1, y: 0 }
                                }}
                                whileHover={{ scale: 1.02, backgroundColor: "#f8fafc", borderColor: "#6366f1" }}
                                className="flex items-center p-3 bg-white rounded border border-secondary-200 shadow-sm cursor-default transition-colors"
                            >
                                <ShieldCheck size={18} className="text-success mr-3" />
                                <span className="text-secondary-600 font-medium">{item}</span>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-secondary-900">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f46e5,#0ea5e9)] opacity-10"></div>
                    <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.1 }}></div>
                </div>

                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                            Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-indigo-400">Optimize</span>?
                        </h2>
                        <p className="text-xl text-secondary-300 mb-10 max-w-2xl mx-auto">
                            Join the leading manufacturers using InventoryX to streamline their PCB production and eliminate waste.
                        </p>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button
                                onClick={handleLogin}
                                className="px-8 py-4 text-lg bg-primary-500 hover:bg-primary-400 text-white rounded-full font-semibold shadow-[0_0_20px_rgba(99,102,241,0.5)] flex items-center gap-2 mx-auto"
                            >
                                Access Dashboard
                                <ArrowRight size={20} />
                            </Button>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default LandingPage;
