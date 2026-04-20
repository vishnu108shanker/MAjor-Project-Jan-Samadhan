import { useState } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';

const STEPS = ['Submitted', 'Assigned', 'In Progress', 'Resolved'];
const STEP_META = {
  Submitted:    { icon: '📋', color: '#f97316' },
  Assigned:     { icon: '👮', color: '#3b82f6' },
  'In Progress':{ icon: '⚙️',  color: '#a855f7' },
  Resolved:     { icon: '✅', color: '#22c55e' },
};

const card = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 20,
  padding: '2rem',
  backdropFilter: 'blur(12px)',
  boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
  width: '100%',
  maxWidth: 660,
};

export default function TrackStatus() {
  const [token, setToken]     = useState('');
  const [issue, setIssue]     = useState(null);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!token.trim()) return;
    setError(''); setIssue(null); setLoading(true);
    try {
      const res = await api.get(`/issues/${token.trim().toUpperCase()}`);
      setIssue(res.data.issue);
    } catch (err) {
      setError(err.response?.data?.error || 'No issue found for that token.');
    } finally {
      setLoading(false);
    }
  };

  const currentIdx = issue ? STEPS.indexOf(issue.status) : -1;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg,#0f0c29,#302b63,#24243e)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '2rem 1rem',
      fontFamily: "'Inter','Segoe UI',sans-serif",
    }}>
      <div style={{ width: '100%', maxWidth: 660, marginBottom: '1.2rem' }}>
        <Link to="/report" style={{ color: '#a78bfa', textDecoration: 'none', fontSize: '0.85rem' }}>
          ← Back
        </Link>
      </div>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
        <div style={{
          width: 60, height: 60, borderRadius: 14, margin: '0 auto 0.8rem',
          background: 'linear-gradient(135deg,#f97316,#f43f5e)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 26, boxShadow: '0 8px 24px rgba(249,115,22,0.4)',
        }}>🔍</div>
        <h1 style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>
          Track Your Complaint
        </h1>
        <p style={{ color: '#a78bfa', marginTop: 6, fontSize: '0.9rem' }}>
          Enter your token to see live status updates
        </p>
      </div>

      {/* Search card */}
      <div style={{ ...card, marginBottom: '1.2rem' }}>
        <form onSubmit={handleTrack} style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <input
            id="track-token-input"
            type="text"
            value={token}
            onChange={e => setToken(e.target.value)}
            placeholder="e.g. TOK882931"
            style={{
              flex: 1, minWidth: 180,
              padding: '0.8rem 1.1rem',
              borderRadius: 10,
              border: '1.5px solid rgba(167,139,250,0.35)',
              background: 'rgba(255,255,255,0.07)',
              color: '#fff', fontSize: '1rem',
              fontFamily: 'monospace', letterSpacing: 2, outline: 'none',
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '0.8rem 1.6rem', borderRadius: 10, border: 'none',
              background: loading ? 'rgba(249,115,22,0.4)' : 'linear-gradient(135deg,#f97316,#f43f5e)',
              color: '#fff', fontWeight: 700, fontSize: '0.9rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 14px rgba(249,115,22,0.35)',
            }}
          >
            {loading ? 'Searching…' : '🔍 Track'}
          </button>
        </form>

        {error && (
          <div style={{
            marginTop: '0.9rem', padding: '0.8rem 1rem', borderRadius: 8,
            background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)',
            color: '#fca5a5', fontSize: '0.88rem',
          }}>
            ⚠️ {error}
          </div>
        )}
      </div>

      {/* Result */}
      {issue && (
        <div style={card}>
          {/* Meta */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
              <span style={{ fontFamily: 'monospace', color: '#f97316', fontWeight: 700, fontSize: '0.85rem', letterSpacing: 1 }}>
                {issue.token}
              </span>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                {new Date(issue.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
              </span>
            </div>
            <p style={{ color: '#e2e8f0', fontWeight: 600, margin: '0.5rem 0 0.3rem', fontSize: '1rem' }}>
              {issue.description}
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <span style={{ color: '#94a3b8', fontSize: '0.82rem' }}>🏛 {issue.department}</span>
              <span style={{ color: '#94a3b8', fontSize: '0.82rem' }}>📍 {issue.location}</span>
            </div>
          </div>

          {/* Timeline */}
          <p style={{ color: '#a78bfa', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: '1rem' }}>
            Status Timeline
          </p>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {STEPS.map((step, idx) => {
              const done    = idx <= currentIdx;
              const current = idx === currentIdx;
              const meta    = STEP_META[step];
              return (
                <div key={step} style={{ display: 'flex', gap: '0.9rem', alignItems: 'flex-start' }}>
                  {/* Dot + line */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 36 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                      background: current ? `${meta.color}22` : done ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.04)',
                      border: current ? `2px solid ${meta.color}` : done ? '2px solid rgba(34,197,94,0.45)' : '2px solid rgba(255,255,255,0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: done ? '1rem' : '0.8rem',
                      boxShadow: current ? `0 0 14px ${meta.color}55` : 'none',
                    }}>
                      {done ? meta.icon : '○'}
                    </div>
                    {idx < STEPS.length - 1 && (
                      <div style={{
                        width: 2, height: 32,
                        background: idx < currentIdx ? 'rgba(34,197,94,0.4)' : 'rgba(255,255,255,0.07)',
                        margin: '3px 0',
                      }} />
                    )}
                  </div>
                  {/* Label */}
                  <div style={{ paddingTop: 7, paddingBottom: idx < STEPS.length - 1 ? 20 : 0 }}>
                    <span style={{
                      fontWeight: current ? 700 : 500,
                      fontSize: current ? '0.95rem' : '0.88rem',
                      color: current ? '#fff' : done ? '#94a3b8' : 'rgba(255,255,255,0.25)',
                    }}>
                      {step}
                    </span>
                    {current && (
                      <span style={{
                        marginLeft: 8, fontSize: '0.68rem', fontWeight: 700,
                        background: meta.color, color: '#fff',
                        padding: '2px 8px', borderRadius: 20,
                      }}>CURRENT</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Officer Notes */}
          {issue.officerNotes && (
            <div style={{
              marginTop: '1.4rem', padding: '1rem 1.1rem',
              background: 'rgba(167,139,250,0.08)',
              border: '1px solid rgba(167,139,250,0.22)', borderRadius: 10,
            }}>
              <p style={{ margin: '0 0 0.3rem', fontSize: '0.75rem', color: '#a78bfa', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
                📝 Officer Note
              </p>
              <p style={{ margin: 0, color: '#e2e8f0', fontSize: '0.9rem', lineHeight: 1.6 }}>
                {issue.officerNotes}
              </p>
            </div>
          )}
        </div>
      )}

      <p style={{ color: 'rgba(255,255,255,0.18)', fontSize: '0.72rem', marginTop: '2rem' }}>
        Govt. of India · Jan Samadhan Grievance Portal
      </p>
    </div>
  );
}
