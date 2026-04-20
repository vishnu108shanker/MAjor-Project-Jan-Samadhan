import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const STATUSES = ['Submitted', 'Assigned', 'In Progress', 'Resolved'];

const STATUS_COLOR = {
  Submitted:    '#f97316',
  Assigned:     '#3b82f6',
  'In Progress':'#a855f7',
  Resolved:     '#22c55e',
};

const DEPT_ICON = {
  Roads: '🛣️', Water: '💧', Sanitation: '🗑️',
  Electricity: '⚡', Health: '🏥', Education: '📚',
};

export default function AdminPanel() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [issues, setIssues]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [saves, setSaves]     = useState({}); // { id: 'saving' | 'saved' | 'error' }
  const [edits, setEdits]     = useState({}); // { id: { status, officerNotes } }
  const [filter, setFilter]   = useState('All');

  // Guard: must be logged-in admin
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  // Fetch all issues
  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    (async () => {
      try {
        const res = await api.get('/issues');
        setIssues(res.data.issues);
        // Pre-populate edits with current values
        const init = {};
        res.data.issues.forEach(i => {
          init[i._id] = { status: i.status, officerNotes: i.officerNotes || '' };
        });
        setEdits(init);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load issues.');
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const handleEdit = (id, field, value) => {
    setEdits(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  };

  const handleSave = async (id) => {
    setSaves(prev => ({ ...prev, [id]: 'saving' }));
    try {
      const { status, officerNotes } = edits[id];
      const res = await api.patch(`/issues/${id}/status`, { status, officerNotes });
      // Update local state
      setIssues(prev => prev.map(i => i._id === id ? res.data.issue : i));
      setSaves(prev => ({ ...prev, [id]: 'saved' }));
      setTimeout(() => setSaves(prev => ({ ...prev, [id]: null })), 2000);
    } catch {
      setSaves(prev => ({ ...prev, [id]: 'error' }));
      setTimeout(() => setSaves(prev => ({ ...prev, [id]: null })), 3000);
    }
  };

  const filtered = filter === 'All' ? issues : issues.filter(i => i.status === filter);
  const counts   = STATUSES.reduce((acc, s) => {
    acc[s] = issues.filter(i => i.status === s).length;
    return acc;
  }, {});

  const pg = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg,#0f0c29,#302b63,#24243e)',
    fontFamily: "'Inter','Segoe UI',sans-serif",
    padding: '2rem 1rem',
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div style={pg}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.8rem', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <h1 style={{ color: '#fff', fontSize: '1.7rem', fontWeight: 800, margin: 0 }}>
              🛡️ Admin Panel
            </h1>
            <p style={{ color: '#a78bfa', margin: '4px 0 0', fontSize: '0.85rem' }}>
              Logged in as <strong>{user.name || user.email}</strong>
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link to="/dashboard" style={{
              padding: '0.55rem 1.1rem', borderRadius: 10,
              background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
              color: '#a78bfa', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600,
            }}>📊 Dashboard</Link>
            <button onClick={() => { logout(); navigate('/login'); }} style={{
              padding: '0.55rem 1.1rem', borderRadius: 10, border: 'none',
              background: 'rgba(239,68,68,0.15)', color: '#fca5a5',
              fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
            }}>Logout</button>
          </div>
        </div>

        {/* Stats pills */}
        <div style={{ display: 'flex', gap: 10, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {['All', ...STATUSES].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              style={{
                padding: '0.4rem 1rem', borderRadius: 20, border: 'none', cursor: 'pointer',
                fontSize: '0.82rem', fontWeight: 600,
                background: filter === s
                  ? (s === 'All' ? '#a78bfa' : STATUS_COLOR[s])
                  : 'rgba(255,255,255,0.07)',
                color: filter === s ? '#fff' : '#94a3b8',
                transition: 'all 0.18s',
              }}
            >
              {s} {s !== 'All' ? `(${counts[s] ?? 0})` : `(${issues.length})`}
            </button>
          ))}
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
          <div style={{ textAlign: 'center', color: '#a78bfa', padding: '3rem', fontSize: '1.1rem' }}>
            ⏳ Loading issues…
          </div>
        )}

        {/* Issues list */}
        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', color: '#64748b', padding: '3rem' }}>
            No issues found for this filter.
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filtered.map(issue => {
            const edit = edits[issue._id] || { status: issue.status, officerNotes: issue.officerNotes || '' };
            const saveState = saves[issue._id];
            const color = STATUS_COLOR[edit.status] || '#a78bfa';

            return (
              <div key={issue._id} style={{
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid rgba(255,255,255,0.1)`,
                borderLeft: `3px solid ${color}`,
                borderRadius: 14,
                padding: '1.2rem 1.4rem',
                backdropFilter: 'blur(10px)',
              }}>
                {/* Top row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: '0.7rem' }}>
                  <div>
                    <span style={{ fontFamily: 'monospace', color: '#f97316', fontWeight: 700, fontSize: '0.82rem', letterSpacing: 1 }}>
                      {issue.token}
                    </span>
                    <span style={{ marginLeft: 10, fontSize: '0.8rem', color: '#94a3b8' }}>
                      {DEPT_ICON[issue.department] || '🏛'} {issue.department}
                    </span>
                    <span style={{ marginLeft: 10, fontSize: '0.8rem', color: '#94a3b8' }}>
                      📍 {issue.location}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    {new Date(issue.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                  </span>
                </div>

                <p style={{ color: '#e2e8f0', fontSize: '0.92rem', margin: '0 0 1rem', lineHeight: 1.5 }}>
                  {issue.description}
                </p>

                {/* Controls */}
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                  {/* Status dropdown */}
                  <div style={{ flex: '0 0 auto' }}>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: '#a78bfa', fontWeight: 700, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>
                      Status
                    </label>
                    <select
                      value={edit.status}
                      onChange={e => handleEdit(issue._id, 'status', e.target.value)}
                      style={{
                        padding: '0.55rem 1rem', borderRadius: 8,
                        border: `1.5px solid ${color}55`,
                        background: `${color}15`,
                        color: color, fontWeight: 700, fontSize: '0.85rem',
                        cursor: 'pointer', outline: 'none',
                      }}
                    >
                      {STATUSES.map(s => (
                        <option key={s} value={s} style={{ background: '#1e1b4b', color: '#fff' }}>{s}</option>
                      ))}
                    </select>
                  </div>

                  {/* Notes */}
                  <div style={{ flex: 1, minWidth: 180 }}>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: '#a78bfa', fontWeight: 700, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>
                      Officer Notes
                    </label>
                    <input
                      type="text"
                      value={edit.officerNotes}
                      onChange={e => handleEdit(issue._id, 'officerNotes', e.target.value)}
                      placeholder="Add a note for the citizen…"
                      style={{
                        width: '100%', padding: '0.55rem 0.9rem',
                        borderRadius: 8, border: '1.5px solid rgba(167,139,250,0.25)',
                        background: 'rgba(255,255,255,0.06)', color: '#e2e8f0',
                        fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  {/* Save */}
                  <button
                    onClick={() => handleSave(issue._id)}
                    disabled={saveState === 'saving'}
                    style={{
                      padding: '0.55rem 1.3rem', borderRadius: 8, border: 'none',
                      background: saveState === 'saved'
                        ? 'rgba(34,197,94,0.25)'
                        : saveState === 'error'
                          ? 'rgba(239,68,68,0.2)'
                          : 'linear-gradient(135deg,#a855f7,#6366f1)',
                      color: saveState === 'saved' ? '#86efac' : saveState === 'error' ? '#fca5a5' : '#fff',
                      fontWeight: 700, fontSize: '0.85rem',
                      cursor: saveState === 'saving' ? 'not-allowed' : 'pointer',
                      whiteSpace: 'nowrap',
                      alignSelf: 'flex-end',
                    }}
                  >
                    {saveState === 'saving' ? '⏳ Saving…'
                      : saveState === 'saved' ? '✅ Saved'
                      : saveState === 'error' ? '❌ Failed'
                      : '💾 Save'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
