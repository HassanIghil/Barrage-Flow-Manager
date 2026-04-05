import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    BarChart3,
    Droplet,
    CloudRain,
    Users,
    AlertTriangle,
    TrendingUp,
    MapPin,
    ExternalLink,
    ChevronRight
} from 'lucide-react';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Dashboard = () => {
    const [overview, setOverview] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const [overviewRes, historyRes] = await Promise.all([
                    axios.get('http://localhost:8000/api/dashboard/overview', config),
                    axios.get('http://localhost:8000/api/dashboard/history', config)
                ]);
                setOverview(overviewRes.data[0]);
                setHistory(historyRes.data.slice(0, 5));
            } catch (error) {
                console.error("Erreur dashboard:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return <div className="p-20 text-center font-syne font-bold text-slate-400">SYNCING TELEMETRY...</div>;

    const barData = {
        labels: overview?.level_history?.map(p => p.date) || [],
        datasets: [{
            label: 'Telemetry',
            data: overview?.level_history?.map(p => p.volume_m3) || [],
            backgroundColor: '#00C8AE',
            borderRadius: 6,
            barThickness: 40,
        }]
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: { grid: { display: false }, ticks: { color: '#005E70', font: { family: 'Syne', size: 10, weight: 'bold' } } },
            y: { display: false }
        }
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');

                .db-glass-root {
                    padding: 32px 40px;
                    display: flex;
                    flex-direction: column;
                    gap: 32px;
                    min-height: 100%;
                    font-family: 'DM Sans', sans-serif;
                    background: rgba(255,255,255,0.45);
                    backdrop-filter: blur(25px);
                    -webkit-backdrop-filter: blur(25px);
                }

                /* ALERT BANNER GLASS */
                .le-alert {
                    background: rgba(239, 68, 68, 0.1);
                    backdrop-filter: blur(10px);
                    border-radius: 16px; padding: 18px 24px;
                    display: flex; align-items: center; justify-content: space-between;
                    border: 1.5px solid rgba(239, 68, 68, 0.2);
                }
                .le-alert-title { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 13px; color: #EF4444; letter-spacing: 0.1em; }
                .le-alert-msg { font-size: 13px; color: #1A3A42; opacity: 0.7; font-weight: 500; }
                .le-alert-btn { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 11px; color: #EF4444; background: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; }

                /* KPI GRID GLASS */
                .le-kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; }
                .le-kpi-card { 
                    background: rgba(255,255,255,0.8); border-radius: 20px; padding: 24px; 
                    border: 1.5px solid white; box-shadow: 0 10px 30px rgba(0,94,112,0.04);
                }
                .le-kpi-title { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 10px; color: #8AACB2; text-transform: uppercase; letter-spacing: 0.15em; }
                .le-kpi-icon { color: #005E70; background: rgba(0, 184, 160, 0.08); padding: 8px; border-radius: 10px; }
                .le-kpi-val { font-family: 'Syne', sans-serif; font-size: 32px; font-weight: 800; color: #005E70; letter-spacing: -0.02em; margin-top: 12px; }
                .le-kpi-sub { font-size: 11px; font-weight: 600; color: #00C8AE; margin-top: 8px; display: flex; align-items: center; gap: 4px; }

                /* MIDDLE GRID */
                .le-main-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 24px; }
                .le-chart-card { background: rgba(255,255,255,0.9); border-radius: 24px; padding: 32px; border: 1.5px solid white; }
                .le-chart-title { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 800; color: #005E70; }
                .le-chart-sub { font-size: 13px; color: #8AACB2; font-weight: 500; }

                .le-map-card { 
                   background-image: url('https://images.unsplash.com/photo-1541417901794-437060ca74cd?auto=format&fit=crop&q=80&w=1200');
                   background-size: cover; background-position: center;
                   border-radius: 24px; position: relative; overflow: hidden; min-height: 420px;
                   border: 1.5px solid white; box-shadow: 0 20px 50px rgba(0,0,0,0.1);
                }
                .le-map-overlay { 
                    position: absolute; bottom: 24px; left: 24px; right: 24px;
                    background: rgba(255,255,255,0.85); backdrop-filter: blur(15px);
                    border-radius: 16px; padding: 20px; display: flex; justify-content: space-between; align-items: center; border: 1px solid white;
                }

                /* FOOTER */
                .le-footer-grid { display: grid; grid-template-columns: 1fr 2fr; gap: 24px; }
                .le-score-card { 
                    background: #005E70; padding: 24px; border-radius: 24px; color: white;
                    display: flex; flex-direction: column; justify-content: space-between;
                }
                .le-analysis-card { background: white; border-radius: 24px; padding: 24px; display: flex; align-items: center; gap: 24px; border: 1.5px solid white; }
                .le-analysis-img { width: 130px; height: 130px; border-radius: 16px; flex-shrink: 0; overflow: hidden; }

            `}</style>

            <div className="db-glass-root">
                {/* RED BANNER */}
                <div className="le-alert">
                    <div className="flex items-center gap-4">
                        <div className="bg-red-500 p-2.5 rounded-xl text-white shadow-lg shadow-red-200">
                            <AlertTriangle size={20} />
                        </div>
                        <div>
                            <span className="le-alert-title uppercase">Critical System Alert</span>
                            <p className="le-alert-msg mt-0.5">Abnormal pressure surge detected in Souss-Massa Zone C. Evaluation in progress.</p>
                        </div>
                    </div>
                    <button className="le-alert-btn uppercase">Acknowledge</button>
                </div>

                {/* KPIs */}
                <div className="le-kpi-grid">
                    <div className="le-kpi-card">
                        <div className="flex justify-between items-start">
                            <span className="le-kpi-title">Water Level</span>
                            <BarChart3 size={18} className="le-kpi-icon" />
                        </div>
                        <div className="le-kpi-val">{overview?.pourcentage_remplissage}%</div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full mt-4 overflow-hidden">
                            <div className="h-full bg-aqua rounded-full" style={{ width: `${overview?.pourcentage_remplissage}%`, background: '#00C8AE' }}></div>
                        </div>
                        <div className="le-kpi-sub font-syne uppercase tracking-tighter mt-3 text-[9px]"><TrendingUp size={12} /> +2.4% last cycle</div>
                    </div>

                    <div className="le-kpi-card">
                        <div className="flex justify-between items-start">
                            <span className="le-kpi-title">Irrigation Flow</span>
                            <Droplet size={18} className="le-kpi-icon" />
                        </div>
                        <div className="le-kpi-val">1.2k <span className="text-xl opacity-40">m³/s</span></div>
                        <div className="le-kpi-sub font-syne uppercase text-[9px]">Status: OPTIMAL FLOW</div>
                    </div>

                    <div className="le-kpi-card">
                        <div className="flex justify-between items-start">
                            <span className="le-kpi-title">Rainfall Index</span>
                            <CloudRain size={18} className="le-kpi-icon" />
                        </div>
                        <div className="le-kpi-val">12 <span className="text-xl opacity-40">mm</span></div>
                        <div className="le-kpi-sub font-syne uppercase text-[9px]">Trend: INCREASING</div>
                    </div>

                    <div className="le-kpi-card">
                        <div className="flex justify-between items-start">
                            <span className="le-kpi-title">Active Co-ops</span>
                            <Users size={18} className="le-kpi-icon" />
                        </div>
                        <div className="le-kpi-val">312 <span className="text-xl opacity-40">units</span></div>
                        <div className="le-kpi-sub font-syne uppercase text-[9px] text-blue-500"><div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" /> Linked and Synced</div>
                    </div>
                </div>

                {/* MAIN VISUALS */}
                <div className="le-main-grid">
                    <div className="le-chart-card shadow-sm">
                        <div className="flex justify-between items-start mb-10">
                            <div>
                                <h3 className="le-chart-title">Souss Basin Fluid Dynamics</h3>
                                <p className="le-chart-sub">Real-time telemetry / Channel A-12</p>
                            </div>
                            <div className="flex items-center gap-1 bg-slate-100 px-3 py-1.5 rounded-lg text-[9px] font-black text-slate-500 uppercase tracking-widest">
                                <TrendingUp size={12} /> 24h Realtime
                            </div>
                        </div>
                        <div style={{ height: 260 }}>
                            <Bar data={barData} options={barOptions} />
                        </div>
                    </div>

                    <div className="le-map-card">
                        <div className="absolute top-6 left-6 flex items-center gap-2 text-white font-syne font-extrabold uppercase text-xs bg-black/40 px-4 py-2 rounded-full backdrop-blur-md border border-white/20">
                            <MapPin size={16} /> Taroudant Catchment
                        </div>
                        <div className="le-map-overlay shadow-2xl">
                            <div>
                                <div className="text-[10px] font-syne font-extrabold text-[#8AACB2] uppercase tracking-widest">Basin Visual Feed</div>
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="flex -space-x-1.5">
                                        {[1, 2, 3].map(i => <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-slate-200" />)}
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-500 ml-2 tracking-tight">+12 engineers online</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 bg-[#00C8AE]/10 px-3 py-1.5 rounded-lg">
                                <Activity size={14} className="text-[#00C8AE]" />
                                <span className="text-[10px] font-syne font-extrabold text-[#00C8AE] uppercase">Active</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FOOTER SECTION */}
                <div className="le-footer-grid">
                    <div className="le-score-card">
                        <div>
                            <span className="text-[10px] font-syne font-extrabold opacity-70 uppercase tracking-widest">Sustainable Index</span>
                            <h3 className="font-syne font-extrabold text-xl mt-1">Sustainability Score</h3>
                        </div>
                        <div className="flex justify-between items-end">
                            <span className="text-5xl font-syne font-extrabold tracking-tighter">A+</span>
                            <span className="text-[10px] font-syne font-extrabold opacity-60 flex items-center gap-1">OPTIMIZED <ChevronRight size={12} /></span>
                        </div>
                    </div>

                    <div className="le-analysis-card">
                        <div className="le-analysis-img">
                            <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=400" className="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-700" alt="thermal" />
                        </div>
                        <div className="le-analysis-content">
                            <span className="text-[10px] font-syne font-extrabold text-[#00C8AE] uppercase tracking-widest">Satellite Insight</span>
                            <h3 className="font-syne font-extrabold text-lg text-[#005E70] mt-1">Sector VII Thermal Analysis</h3>
                            <p className="text-xs text-slate-500 mt-2 leading-relaxed font-medium">Remote sensing indicates healthy soil moisture in the eastern citrus groves. Water levels remain within safety thresholds.</p>
                            <button className="mt-4 text-[10px] font-syne font-extrabold text-[#005E70] uppercase tracking-widest flex items-center gap-1 hover:gap-3 transition-all underline decoration-aqua decoration-2 underline-offset-4">
                                View Full Report <ChevronRight size={12} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

const Activity = ({ size, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
    </svg>
);

export default Dashboard;
