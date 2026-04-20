import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DEPT_ICON = {
  Roads: '🛣️', Water: '💧', Sanitation: '🗑️',
  Electricity: '⚡', Health: '🏥', Education: '📚',
};

const scoreColor = (score) => {
  if (score >= 75) return '#22c55e';
  if (score >= 45) return '#f97316';
  return '#ef4444';
};

const scoreLabel = (score) => {
  if (score >= 75) return 'Excellent';
  if (score >= 45) return 'Average';
  return 'Poor';
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [scores, setScores]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/stats');
        setScores(res.data.scores);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load department scores.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const pg = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg,#0f0c29,#302b63,#24243e)',
    fontFamily: "'Inter','Segoe UI',sans-serif",
    padding: '2rem 1rem',
  };

  return (
    <div style={pg}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>

        {/* Top bar */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: 10,
        }}>
          <div>
            <h1 style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>
              📊 Credibility Dashboard
            </h1>
            <p style={{ color: '#a78bfa', margin: '4px 0 0', fontSize: '0.85rem' }}>
              Department performance scores — updated in real time
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link to="/track" style={{
              padding: '0.5rem 1rem', borderRadius: 10,
              background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
              color: '#a78bfa', textDecoration: 'none', fontSize: '0.83rem', fontWeight: 600,
            }}>🔍 Track Issue</Link>
            <Link to="/report" style={{
              padding: '0.5rem 1rem', borderRadius: 10,
              background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
              color: '#a78bfa', textDecoration: 'none', fontSize: '0.83rem', fontWeight: 600,
            }}>📝 Report</Link>
            {user?.role === 'admin' && (
              <Link to="/admin" style={{
                padding: '0.5rem 1rem', borderRadius: 10,
                background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.3)',
                color: '#c4b5fd', textDecoration: 'none', fontSize: '0.83rem', fontWeight: 700,
              }}>🛡️ Admin</Link>
            )}
            {user && (
              <button
                onClick={() => logout()}
                style={{
                  padding: '0.5rem 1rem', borderRadius: 10, border: 'none',
                  background: 'rgba(239,68,68,0.12)', color: '#fca5a5',
                  fontSize: '0.83rem', fontWeight: 600, cursor: 'pointer',
                }}
              >Logout</button>
            )}
          </div>
        </div>

        {/* Intro */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.09)',
          borderRadius: 16, padding: '1.2rem 1.5rem',
          marginBottom: '1.8rem',
          display: 'flex', gap: '1rem', alignItems: 'flex-start',
        }}>
          <span style={{ fontSize: '1.8rem' }}>🏛️</span>
          <div>
            <p style={{ color: '#e2e8f0', margin: 0, fontWeight: 600, fontSize: '0.95rem' }}>
              Jan Samadhan Credibility Index
            </p>
            <p style={{ color: '#94a3b8', margin: '4px 0 0', fontSize: '0.83rem', lineHeight: 1.6 }}>
              Each score is calculated from the resolution rate (70%) and average resolution speed (30%).
              A score of 75+ is excellent, 45–74 is average, and below 45 needs improvement.
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            padding: '0.9rem 1.1rem', borderRadius: 10, marginBottom: '1rem',
            background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)',
            color: '#fca5a5', fontSize: '0.88rem',
          }}>⚠️ {error}</div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', color: '#a78bfa', padding: '4rem', fontSize: '1.1rem' }}>
            ⏳ Computing department scores…
          </div>
        )}

        {/* Score Grid */}
        {!loading && !error && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '1rem',
          }}>
            {scores.map(({ department, score }) => {
              const color = scoreColor(score);
              const label = scoreLabel(score);
              const pct   = Math.min(score, 100);

              return (
                <div key={department} style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: `1px solid rgba(255,255,255,0.09)`,
                  borderTop: `3px solid ${color}`,
                  borderRadius: 16,
                  padding: '1.4rem',
                  transition: 'transform 0.18s, box-shadow 0.18s',
                }}>
                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div>
                      <span style={{ fontSize: '1.6rem' }}>{DEPT_ICON[department] || '🏛'}</span>
                      <p style={{ color: '#e2e8f0', fontWeight: 700, margin: '4px 0 0', fontSize: '0.95rem' }}>
                        {department}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ color, fontSize: '1.8rem', fontWeight: 900, margin: 0, lineHeight: 1 }}>
                        {score}
                      </p>
                      <p style={{ color: '#64748b', fontSize: '0.7rem', margin: 0 }}>/100</p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div style={{
                    height: 6, borderRadius: 10,
                    background: 'rgba(255,255,255,0.07)',
                    marginBottom: '0.8rem', overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${pct}%`,
                      borderRadius: 10,
                      background: `linear-gradient(90deg, ${color}88, ${color})`,
                      transition: 'width 1s ease',
                    }} />
                  </div>

                  {/* Badge */}
                  <span style={{
                    display: 'inline-block',
                    padding: '2px 10px', borderRadius: 20,
                    background: `${color}20`,
                    border: `1px solid ${color}44`,
                    color, fontSize: '0.75rem', fontWeight: 700,
                  }}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Legend */}
        {!loading && !error && (
          <div style={{
            marginTop: '1.8rem',
            display: 'flex', gap: '1.2rem', justifyContent: 'center', flexWrap: 'wrap',
          }}>
            {[['#22c55e','Excellent (75+)'], ['#f97316','Average (45–74)'], ['#ef4444','Poor (< 45)']].map(([c, l]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
                <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>{l}</span>
              </div>
            ))}
          </div>
        )}

        <p style={{ color: 'rgba(255,255,255,0.15)', fontSize: '0.72rem', textAlign: 'center', marginTop: '2rem' }}>
          Govt. of India · Jan Samadhan Grievance Portal
        </p>
      </div>
    </div>
  );
}
