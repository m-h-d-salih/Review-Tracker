'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    const { error: err } = await signIn(email, password);
    setLoading(false);
    if (err) { setError(err.message); return; }
    router.push('/dashboard');
  };

  return (
    <div className="auth-root">
      {/* Left panel — hidden on mobile */}
      <div className="auth-panel-left">
        <div className="geo-bg">
          <svg className="geo-svg" viewBox="0 0 600 700" fill="none">
            {Array.from({ length: 12 }).map((_, i) => (
              <line key={`h${i}`} x1="0" y1={i*60} x2="600" y2={i*60} stroke="#00d4a4" strokeOpacity="0.06" strokeWidth="1"/>
            ))}
            {Array.from({ length: 10 }).map((_, i) => (
              <line key={`v${i}`} x1={i*66} y1="0" x2={i*66} y2="700" stroke="#00d4a4" strokeOpacity="0.06" strokeWidth="1"/>
            ))}
            <polygon points="300,80 420,150 420,290 300,360 180,290 180,150" stroke="#00d4a4" strokeOpacity="0.15" strokeWidth="1.5" fill="none"/>
            <polygon points="300,110 400,165 400,275 300,330 200,275 200,165" stroke="#00d4a4" strokeOpacity="0.25" strokeWidth="1" fill="none"/>
            <polygon points="300,145 375,185 375,265 300,305 225,265 225,185" stroke="#00d4a4" strokeOpacity="0.4" strokeWidth="1" fill="none" className="geo-pulse"/>
            <circle cx="300" cy="220" r="38" fill="#00d4a4" fillOpacity="0.08" stroke="#00d4a4" strokeOpacity="0.5" strokeWidth="1.5"/>
            <circle cx="300" cy="220" r="22" fill="#00d4a4" fillOpacity="0.15" stroke="#00d4a4" strokeOpacity="0.8" strokeWidth="1"/>
            <circle cx="300" cy="220" r="8" fill="#00d4a4" fillOpacity="0.9"/>
            {[{x:420,y:150},{x:420,y:290},{x:300,y:360},{x:180,y:290},{x:180,y:150},{x:300,y:80}].map((p,i)=>(
              <circle key={i} cx={p.x} cy={p.y} r="5" fill="#00d4a4" fillOpacity="0.7"/>
            ))}
            {[{x:420,y:150},{x:420,y:290},{x:300,y:360},{x:180,y:290},{x:180,y:150},{x:300,y:80}].map((p,i)=>(
              <line key={i} x1="300" y1="220" x2={p.x} y2={p.y} stroke="#00d4a4" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="4 4"/>
            ))}
            {[0.4,0.7,0.55,0.85,0.6,0.9,0.5].map((h,i)=>(
              <rect key={i} x={148+i*48} y={520-h*80} width="28" height={h*80} rx="4" fill="#00d4a4" fillOpacity={0.08+h*0.15} stroke="#00d4a4" strokeOpacity="0.3" strokeWidth="1"/>
            ))}
          </svg>
        </div>
        <div className="panel-left-content">
          <div className="brand-mark"><span className="brand-icon">IR</span></div>
          <h1 className="panel-title">Review<br/>Tracker</h1>
          <p className="panel-sub">Track sessions, measure growth,<br/>export beautiful reports.</p>
          <div className="panel-stats">
            <div className="pstat"><span className="pstat-n">4</span><span className="pstat-l">Review Types</span></div>
            <div className="pstat-div"/>
            <div className="pstat"><span className="pstat-n">PDF</span><span className="pstat-l">Export</span></div>
            <div className="pstat-div"/>
            <div className="pstat"><span className="pstat-n">∞</span><span className="pstat-l">History</span></div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="auth-panel-right">
        {/* Mobile brand shown only on small screens */}
        <div className="mobile-brand">
          <span className="brand-icon">RT</span>
          <span className="mobile-brand-name">Review Tracker</span>
        </div>

        <div className="auth-form-wrap">
          <div className="auth-form-head">
            <h2 className="form-title">Welcome back</h2>
            <p className="form-sub">Sign in to your reviewer account</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="field">
              <label className="field-label">Email address</label>
              <div className="field-wrap">
                <svg className="field-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 6.5l7.5 5 7.5-5M2.5 5h15a1 1 0 011 1v8a1 1 0 01-1 1h-15a1 1 0 01-1-1V6a1 1 0 011-1z"/>
                </svg>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" className="field-input"/>
              </div>
            </div>

            <div className="field">
              <label className="field-label">Password</label>
              <div className="field-wrap">
                <svg className="field-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <rect x="3" y="9" width="14" height="10" rx="2" strokeLinecap="round"/>
                  <path strokeLinecap="round" d="M7 9V6a3 3 0 016 0v3"/>
                </svg>
                <input type={showPw ? 'text' : 'password'} required value={password}
                  onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="field-input field-input-pw"/>
                <button type="button" className="pw-toggle" onClick={() => setShowPw(v => !v)}>
                  {showPw ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            {error && <div className="auth-error">{error}</div>}

            <button type="submit" disabled={loading} className="auth-btn">
              {loading ? <span className="btn-spinner"/> : 'Sign In'}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="auth-link">Create one →</Link>
          </p>
        </div>
      </div>

      <style suppressHydrationWarning>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Instrument+Sans:wght@400;500;600&display=swap');
        *{box-sizing:border-box;}
        .auth-root{display:flex;min-height:100vh;background:#070d1a;font-family:'Instrument Sans',sans-serif;}

        /* Left panel */
        .auth-panel-left{position:relative;flex:1;display:none;overflow:hidden;background:linear-gradient(135deg,#070d1a 0%,#0a1628 60%,#071a1a 100%);}
        @media(min-width:800px){.auth-panel-left{display:flex;}}
        .geo-bg{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;}
        .geo-svg{width:100%;height:100%;max-width:560px;}
        .geo-pulse{animation:pulse 3s ease-in-out infinite;}
        @keyframes pulse{0%,100%{stroke-opacity:.4;}50%{stroke-opacity:.9;}}
        .panel-left-content{position:relative;z-index:1;display:flex;flex-direction:column;justify-content:flex-end;padding:2.5rem;width:100%;}
        .brand-mark{margin-bottom:1.25rem;}
        .brand-icon{display:inline-flex;align-items:center;justify-content:center;width:42px;height:42px;background:#00d4a4;border-radius:10px;font-family:'Syne',sans-serif;font-weight:800;font-size:14px;color:#070d1a;}
        .panel-title{font-family:'Syne',sans-serif;font-size:clamp(1.8rem,3vw,2.6rem);font-weight:800;color:#fff;line-height:1.1;margin:0 0 .65rem;}
        .panel-sub{font-size:.9rem;color:#6b8fa8;line-height:1.6;margin:0 0 1.75rem;}
        .panel-stats{display:flex;align-items:center;gap:1.25rem;}
        .pstat{display:flex;flex-direction:column;gap:.15rem;}
        .pstat-n{font-family:'Syne',sans-serif;font-size:1.3rem;font-weight:700;color:#00d4a4;}
        .pstat-l{font-size:.65rem;text-transform:uppercase;letter-spacing:.1em;color:#4a6a7a;}
        .pstat-div{width:1px;height:28px;background:#1a3040;}

        /* Right panel */
        .auth-panel-right{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2rem 1.5rem;background:#070d1a;min-height:100vh;}
        @media(min-width:800px){.auth-panel-right{padding:2rem;}}
        .auth-form-wrap{width:100%;max-width:380px;}

        /* Mobile brand */
        .mobile-brand{display:flex;align-items:center;gap:.65rem;margin-bottom:2rem;}
        @media(min-width:800px){.mobile-brand{display:none;}}
        .mobile-brand-name{font-family:'Syne',sans-serif;font-weight:700;font-size:1rem;color:#fff;}

        .auth-form-head{margin-bottom:2rem;}
        .form-title{font-family:'Syne',sans-serif;font-size:1.9rem;font-weight:800;color:#fff;margin:0 0 .35rem;}
        @media(max-width:400px){.form-title{font-size:1.6rem;}}
        .form-sub{font-size:.88rem;color:#4a6a7a;margin:0;}

        .auth-form{display:flex;flex-direction:column;gap:1.1rem;margin-bottom:1.25rem;}
        .field{display:flex;flex-direction:column;gap:.45rem;}
        .field-label{font-size:.7rem;font-weight:600;text-transform:uppercase;letter-spacing:.1em;color:#4a6a7a;}
        .field-wrap{position:relative;display:flex;align-items:center;}
        .field-icon{position:absolute;left:13px;width:15px;height:15px;color:#4a6a7a;pointer-events:none;}
        .field-input{width:100%;background:#0e1e2e;border:1.5px solid #1a3040;border-radius:12px;padding:.8rem 1rem .8rem 2.6rem;font-size:.9rem;color:#e0f0ff;font-family:'Instrument Sans',sans-serif;outline:none;transition:border-color .2s,box-shadow .2s;}
        .field-input-pw{padding-right:2.5rem;}
        .field-input::placeholder{color:#2a4a5a;}
        .field-input:focus{border-color:#00d4a4;box-shadow:0 0 0 3px rgba(0,212,164,.12);}
        .pw-toggle{position:absolute;right:13px;background:none;border:none;cursor:pointer;font-size:.85rem;color:#4a6a7a;padding:2px;}

        .auth-error{background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.25);border-radius:10px;padding:.65rem 1rem;font-size:.83rem;color:#f87171;}
        .auth-btn{width:100%;padding:.88rem;background:#00d4a4;border:none;border-radius:12px;font-family:'Syne',sans-serif;font-weight:700;font-size:.92rem;color:#070d1a;cursor:pointer;transition:background .2s,transform .1s;display:flex;align-items:center;justify-content:center;gap:.5rem;}
        .auth-btn:hover{background:#00efb8;}
        .auth-btn:active{transform:scale(.98);}
        .auth-btn:disabled{opacity:.5;cursor:not-allowed;}
        .btn-spinner{width:17px;height:17px;border:2px solid rgba(7,13,26,.35);border-top-color:#070d1a;border-radius:50%;animation:spin .7s linear infinite;}
        @keyframes spin{to{transform:rotate(360deg);}}

        .auth-switch{text-align:center;font-size:.84rem;color:#4a6a7a;margin:0;}
        .auth-link{color:#00d4a4;font-weight:600;text-decoration:none;}
        .auth-link:hover{text-decoration:underline;}
      `}</style>
    </div>
  );
}