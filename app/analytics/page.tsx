'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import Sidebar from '@/components/Sidebar';
import { fetchAnalytics, AnalyticsData } from '@/lib/analytics';
import { REVIEW_TYPE_LABELS, ReviewType } from '@/types';

const TYPE_COLORS: Record<ReviewType, string> = {
  review:        '#00d4a4',
  session:       '#6366f1',
  group_session: '#f59e0b',
  group_project: '#ef4444',
};

const RANGE_OPTIONS = [
  { label: '3M',  months: 3 },
  { label: '6M',  months: 6 },
  { label: '1Y',  months: 12 },
  { label: 'All', months: 999 },
];

function KpiCard({ label, value, sub, color }: { label:string; value:string|number; sub:string; color:string }) {
  return (
    <div className="kpi-card">
      <p className="kpi-label">{label}</p>
      <p className="kpi-value">{value}</p>
      <p className="kpi-sub">{sub}</p>
      <div className="kpi-bar" style={{ background: color }}/>
    </div>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="ct-label">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} className="ct-row">
          <span className="ct-dot" style={{ background: p.color }}/>
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  const [data, setData]           = useState<AnalyticsData | null>(null);
  const [loading, setLoading]     = useState(true);
  const [trendRange, setTrendRange] = useState(6);

  useEffect(() => {
    fetchAnalytics().then(d => { setData(d); setLoading(false); });
  }, []);

  const filteredTrend = data?.monthlyTrend.slice(-trendRange) ?? [];

  return (
    <div className="app-shell">
      <Sidebar/>
      <main className="main-content">
        <div className="page-header">
          <h1 className="page-title">Analytics</h1>
          <p className="page-sub">All time insights</p>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spin-ring"/>
            <p>Building your analytics…</p>
          </div>
        ) : data ? (
          <div className="analytics-grid">

            {/* ── KPI row ── */}
            <div className="kpi-row">
              <KpiCard label="All-Time Entries"  value={data.totalAllTime}   sub="Since account creation" color="#00d4a4"/>
              <KpiCard label="This Month"        value={data.totalThisMonth} sub="Current month activity" color="#6366f1"/>
              <KpiCard label="Today"  value={data.totalToday}  sub="Todays Activity" color="#f59e0b"/>
              <KpiCard 
  label="Most in a Day" 
  value={data.mostInADay} 
  sub={data.mostInADayDate ? new Date(data.mostInADayDate).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) : '—'} 
  color="#f59e0b"
/>
            </div>

            {/* ── Monthly trend ── */}
            <div className="chart-card chart-wide">
              <div className="chart-card-head">
                <div>
                  <h3 className="chart-title">Monthly Trend</h3>
                  <p className="chart-sub">Entries per month</p>
                </div>
                <div className="range-btns">
                  {RANGE_OPTIONS.map(opt => (
                    <button
                      key={opt.label}
                      onClick={() => setTrendRange(opt.months)}
                      className={`range-btn ${trendRange === opt.months ? 'range-btn-active' : ''}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={filteredTrend} margin={{ top:10, right:10, left:-20, bottom:0 }}>
                  <defs>
                    {(Object.keys(TYPE_COLORS) as ReviewType[]).map(t => (
                      <linearGradient key={t} id={`grad_${t}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={TYPE_COLORS[t]} stopOpacity={0.25}/>
                        <stop offset="95%" stopColor={TYPE_COLORS[t]} stopOpacity={0}/>
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid stroke="#1a2030" strokeDasharray="3 3"/>
                  <XAxis dataKey="month" tick={{ fill:'#4b5563', fontSize:10 }} axisLine={false} tickLine={false}/>
                  <YAxis tick={{ fill:'#4b5563', fontSize:10 }} axisLine={false} tickLine={false}/>
                  <Tooltip content={<CustomTooltip/>}/>
                  <Legend wrapperStyle={{ fontSize:11, color:'#6b7280' }}/>
                  <Area type="monotone" dataKey="review"        name="Review"        stroke={TYPE_COLORS.review}        fill={`url(#grad_review)`}        strokeWidth={2}/>
                  <Area type="monotone" dataKey="session"       name="Session"       stroke={TYPE_COLORS.session}       fill={`url(#grad_session)`}       strokeWidth={2}/>
                  <Area type="monotone" dataKey="group_session" name="Group Session" stroke={TYPE_COLORS.group_session} fill={`url(#grad_group_session)`} strokeWidth={2}/>
                  <Area type="monotone" dataKey="group_project" name="Group Project" stroke={TYPE_COLORS.group_project} fill={`url(#grad_group_project)`} strokeWidth={2}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* ── Type distribution ── */}
            <div className="chart-card chart-sm">
              <div className="chart-card-head">
                <h3 className="chart-title">Type Distribution</h3>
                <p className="chart-sub">All time</p>
              </div>
              {data.typeDistribution.length === 0 ? (
                <div className="empty-chart">No data yet</div>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie data={data.typeDistribution} cx="50%" cy="50%" innerRadius={48} outerRadius={75}
                        dataKey="value" paddingAngle={3}>
                        {data.typeDistribution.map((entry, i) => (
                          <Cell key={i} fill={entry.color} opacity={0.9}/>
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ background:'#0d1117', border:'1px solid #1f2937', borderRadius:8, fontSize:12 }} itemStyle={{ color:'#d1d5db' }}/>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="donut-legend">
                    {data.typeDistribution.map(d => {
                      const total = data.typeDistribution.reduce((s,x)=>s+x.value,0);
                      return (
                        <div key={d.name} className="dl-item">
                          <span className="dl-dot" style={{ background:d.color }}/>
                          <span className="dl-name">{d.name}</span>
                          <span className="dl-pct" style={{ color:d.color }}>
                            {d.value} <span style={{opacity:.5,fontWeight:400}}>({(d.value/total*100).toFixed(1)}%)</span>
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* ── Top advisors ── */}
            <div className="chart-card chart-sm">
              <div className="chart-card-head">
                <h3 className="chart-title">Top Advisors</h3>
                <p className="chart-sub">By total entries</p>
              </div>
              {data.topAdvisors.length === 0 ? (
                <div className="empty-chart">No data yet</div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={data.topAdvisors} layout="vertical" margin={{ top:0, right:10, left:10, bottom:0 }}>
                    <CartesianGrid stroke="#1a2030" strokeDasharray="3 3" horizontal={false}/>
                    <XAxis type="number" tick={{ fill:'#4b5563', fontSize:10 }} axisLine={false} tickLine={false}/>
                    <YAxis type="category" dataKey="advisor_name" tick={{ fill:'#9ca3af', fontSize:11 }} axisLine={false} tickLine={false} width={70}/>
                    <Tooltip contentStyle={{ background:'#0d1117', border:'1px solid #1f2937', borderRadius:8, fontSize:12 }} itemStyle={{ color:'#d1d5db' }}/>
                    <Bar dataKey="total" fill="#00d4a4" radius={[0,4,4,0]} barSize={12}/>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* ── Most reviewed interns ── */}
            <div className="chart-card chart-sm">
              <div className="chart-card-head">
                <h3 className="chart-title">Most Reviewed Interns</h3>
                <p className="chart-sub">All time</p>
              </div>
              {data.topInterns.length === 0 ? (
                <div className="empty-chart">No data yet</div>
              ) : (
                <div className="intern-list">
                  {data.topInterns.map((intern, i) => (
                    <div key={intern.intern_name} className="intern-row">
                      <span className="intern-rank">#{i+1}</span>
                      <div className="intern-info">
                        <p className="intern-name">{intern.intern_name}</p>
                        <p className="intern-last">Last: {new Date(intern.lastDate).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</p>
                      </div>
                      <div className="intern-bar-wrap">
                        <div className="intern-bar-fill" style={{ width:`${(intern.count/data.topInterns[0].count)*100}%` }}/>
                      </div>
                      <span className="intern-count">{intern.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Recent activity ── */}
            <div className="chart-card chart-sm">
              <div className="chart-card-head">
                <h3 className="chart-title">Recent Activity</h3>
                <p className="chart-sub">Last 5 entries</p>
              </div>
              {data.recentActivity.length === 0 ? (
                <div className="empty-chart">No entries yet</div>
              ) : (
                <div className="activity-list">
                  {data.recentActivity.map(r => (
                    <div key={r.id} className="activity-row">
                      <div className="act-dot" style={{ background: TYPE_COLORS[r.type] }}/>
                      <div className="act-info">
                        <p className="act-name">{r.intern_name}</p>
                        <p className="act-type">{REVIEW_TYPE_LABELS[r.type]} · {r.advisor_name}</p>
                      </div>
                      <span className="act-date">
                        {new Date(r.review_date).toLocaleDateString('en-US',{month:'short',day:'numeric'})}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        ) : null}
      </main>

      <style suppressHydrationWarning>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Instrument+Sans:wght@400;500;600&display=swap');
        *{box-sizing:border-box;}
        .app-shell{display:flex;min-height:100vh;background:#07090f;font-family:'Instrument Sans',sans-serif;}
        .main-content{flex:1;margin-left:240px;padding:2rem;min-height:100vh;}
        @media(max-width:768px){.main-content{margin-left:0;padding:1rem;padding-top:68px;}}

        .page-header{margin-bottom:1.5rem;}
        .page-title{font-family:'Syne',sans-serif;font-size:1.75rem;font-weight:800;color:#fff;margin:0 0 .2rem;}
        @media(max-width:400px){.page-title{font-size:1.4rem;}}
        .page-sub{font-size:.83rem;color:#4b5563;margin:0;}

        .loading-state{display:flex;flex-direction:column;align-items:center;justify-content:center;height:60vh;gap:1rem;color:#4b5563;font-size:.9rem;}
        .spin-ring{width:32px;height:32px;border:3px solid #1f2937;border-top-color:#00d4a4;border-radius:50%;animation:spin .7s linear infinite;}
        @keyframes spin{to{transform:rotate(360deg);}}

        /* Grid */
        .analytics-grid{display:grid;grid-template-columns:repeat(12,1fr);gap:1rem;}
       .kpi-row{grid-column:span 12;display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;}
@media(max-width:768px){.kpi-row{grid-template-columns:repeat(2,1fr);gap:.75rem;}}
@media(max-width:400px){.kpi-row{gap:.5rem;}}

        /* KPI cards */
        .kpi-card{background:#0d1117;border:1px solid #1f2937;border-radius:14px;padding:1.1rem 1.1rem .9rem;position:relative;overflow:hidden;}
        .kpi-label{font-size:.65rem;font-weight:600;text-transform:uppercase;letter-spacing:.1em;color:#4b5563;margin:0 0 .4rem;}
        .kpi-value{font-family:'Syne',sans-serif;font-size:1.9rem;font-weight:800;color:#fff;margin:0 0 .2rem;line-height:1;}
        @media(max-width:400px){.kpi-value{font-size:1.5rem;}}
        .kpi-sub{font-size:.72rem;color:#374151;margin:0;}
        .kpi-bar{position:absolute;bottom:0;left:0;right:0;height:3px;border-radius:0 0 14px 14px;opacity:.7;}

        /* Chart cards */
        .chart-card{background:#0d1117;border:1px solid #1f2937;border-radius:16px;padding:1.25rem;}
        .chart-wide{grid-column:span 12;}
        .chart-sm{grid-column:span 6;}
        @media(max-width:768px){.chart-sm{grid-column:span 12;}}

        .chart-card-head{display:flex;align-items:flex-start;justify-content:space-between;gap:.75rem;margin-bottom:1rem;flex-wrap:wrap;}
        .chart-title{font-family:'Syne',sans-serif;font-size:.95rem;font-weight:700;color:#e5e7eb;margin:0 0 .15rem;}
        .chart-sub{font-size:.72rem;color:#374151;margin:0;}

        /* Range buttons */
        .range-btns{display:flex;gap:.3rem;flex-shrink:0;}
        .range-btn{padding:.28rem .6rem;border-radius:7px;border:1px solid #1f2937;background:transparent;color:#4b5563;font-size:.72rem;font-weight:600;cursor:pointer;transition:all .15s;}
        .range-btn:hover{color:#9ca3af;border-color:#374151;}
        .range-btn-active{border-color:#00d4a4 !important;background:rgba(0,212,164,.1) !important;color:#00d4a4 !important;}

        /* Tooltip */
        .chart-tooltip{background:#0d1117;border:1px solid #1f2937;border-radius:10px;padding:.65rem .9rem;font-size:.78rem;}
        .ct-label{color:#9ca3af;font-weight:600;margin:0 0 .35rem;}
        .ct-row{display:flex;align-items:center;gap:.4rem;margin:.15rem 0;color:#d1d5db;}
        .ct-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0;}

        /* Donut legend */
        .donut-legend{display:grid;grid-template-columns:1fr 1fr;gap:.35rem .4rem;margin-top:.6rem;}
        .dl-item{display:flex;align-items:center;gap:.35rem;}
        .dl-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0;}
        .dl-name{font-size:.72rem;color:#6b7280;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
        .dl-pct{font-size:.72rem;font-weight:700;white-space:nowrap;}

        /* Intern list */
        .intern-list{display:flex;flex-direction:column;gap:.65rem;}
        .intern-row{display:flex;align-items:center;gap:.6rem;}
        .intern-rank{font-family:'Syne',sans-serif;font-size:.72rem;font-weight:700;color:#374151;width:22px;flex-shrink:0;}
        .intern-info{min-width:80px;flex-shrink:0;}
        .intern-name{font-size:.82rem;font-weight:600;color:#d1d5db;margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:110px;}
        @media(max-width:400px){.intern-name{max-width:80px;}}
        .intern-last{font-size:.67rem;color:#374151;margin:0;}
        .intern-bar-wrap{flex:1;height:5px;background:#1f2937;border-radius:3px;overflow:hidden;}
        .intern-bar-fill{height:100%;background:linear-gradient(90deg,#00d4a4,#6366f1);border-radius:3px;transition:width .6s ease;}
        .intern-count{font-family:'Syne',sans-serif;font-size:.82rem;font-weight:700;color:#00d4a4;width:22px;text-align:right;flex-shrink:0;}

        /* Activity */
        .activity-list{display:flex;flex-direction:column;gap:.65rem;}
        .activity-row{display:flex;align-items:center;gap:.65rem;}
        .act-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0;}
        .act-info{flex:1;min-width:0;}
        .act-name{font-size:.83rem;font-weight:600;color:#d1d5db;margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
        .act-type{font-size:.7rem;color:#4b5563;margin:0;}
        .act-date{font-size:.72rem;color:#374151;white-space:nowrap;flex-shrink:0;}

        .empty-chart{display:flex;align-items:center;justify-content:center;height:160px;color:#374151;font-size:.83rem;}
      `}</style>
    </div>
  );
}