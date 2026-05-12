'use client';

import { useState, useEffect } from 'react';
import styles from './events.module.css';

const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
        day: '2-digit', month: 'short', year: 'numeric',
    }); 
};

const toInputDate = (dateStr) => {
    return new Date(dateStr).toISOString().slice(0, 16);
};

const EMPTY_FORM = { title: '', description: '', startDate: '', endDate: '', location: '' };

export default function EventsPage() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);
    const [editingId, setEditingId] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [deletingId, setDeletingId] = useState(null);
    const [search, setSearch] = useState('');

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/events');
            const data = await res.json();
            setEvents(data);
        } catch {
            setError('Impossible de charger les événements.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchEvents(); }, []);

    const openCreate = () => {
        setForm(EMPTY_FORM);
        setEditingId(null);
        setError('');
        setShowForm(true);
    };

    const openEdit = (event) => {
        setForm({
            title: event.title,
            description: event.description || '',
            startDate: toInputDate(event.startDate),
            endDate: toInputDate(event.endDate),
            location: event.location || '',
        });
        setEditingId(event.id);
        setError('');
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingId(null);
        setForm(EMPTY_FORM);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        try {
            const url = editingId ? `/api/events/${editingId}` : '/api/events';
            const method = editingId ? 'PUT' : 'POST';
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) { setError(data.error || 'Une erreur est survenue'); return; }
            await fetchEvents();
            closeForm();
        } catch {
            setError('Erreur réseau. Réessayez.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        setDeletingId(id);
        try {
            await fetch(`/api/events/${id}`, { method: 'DELETE' });
            setEvents((prev) => prev.filter((e) => e.id !== id));
        } catch {
            setError('Erreur lors de la suppression.');
        } finally {
            setDeletingId(null);
        }
    };

    const filtered = events.filter((e) =>
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        (e.location || '').toLowerCase().includes(search.toLowerCase())
    );

    const now = new Date();
    const upcoming = filtered.filter((e) => new Date(e.startDate) > now);
    const ongoing = filtered.filter((e) => new Date(e.startDate) <= now && new Date(e.endDate) >= now);
    const past = filtered.filter((e) => new Date(e.endDate) < now);

    return (
        <div className={styles.page}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.logo}>
                    <span className={styles.logoIcon}>⚡</span>
                    <span className={styles.logoText}>EventSync</span>
                </div>
                <nav className={styles.nav}>
                    <a href="/events" className={styles.navItemActive}>
                        <span>📅</span> Événements
                    </a>
                    <a href="#" className={styles.navItem}>
                        <span>🎤</span> Intervenants
                    </a>
                    <a href="#" className={styles.navItem}>
                        <span>🏛️</span> Salles
                    </a>
                    <a href="#" className={styles.navItem}>
                        <span>❓</span> Questions
                    </a>
                </nav>
                <div className={styles.sidebarFooter}>
                    <div className={styles.adminBadge}>Admin</div>
                </div>
            </aside>

            {/* Main */}
            <main className={styles.main}>
                {/* Header */}
                <header className={styles.header}>
                    <div>
                        <h1 className={styles.pageTitle}>Événements</h1>
                        <p className={styles.pageSubtitle}>{events.length} événement{events.length !== 1 ? 's' : ''} au total</p>
                    </div>
                    <div className={styles.headerActions}>
                        <input
                            className={styles.searchInput}
                            placeholder="Rechercher..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button className={styles.btnPrimary} onClick={openCreate}>
                            + Créer un événement
                        </button>
                    </div>
                </header>

                {/* Stats */}
                <div className={styles.statsRow}>
                    <div className={styles.statCard}>
                        <div className={styles.statLabel}>En cours</div>
                        <div className={styles.statValue} style={{ color: '#00D4AA' }}>{ongoing.length}</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statLabel}>À venir</div>
                        <div className={styles.statValue} style={{ color: '#6C63FF' }}>{upcoming.length}</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statLabel}>Terminés</div>
                        <div className={styles.statValue} style={{ color: '#888' }}>{past.length}</div>
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className={styles.emptyState}>
                        <div className={styles.spinner}></div>
                        <p>Chargement...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>📅</div>
                        <p className={styles.emptyText}>Aucun événement trouvé</p>
                        <button className={styles.btnPrimary} onClick={openCreate}>Créer le premier</button>
                    </div>
                ) : (
                    <div className={styles.sections}>
                        {ongoing.length > 0 && (
                            <Section title="En cours" events={ongoing} onEdit={openEdit} onDelete={handleDelete} deletingId={deletingId} status="live" />
                        )}
                        {upcoming.length > 0 && (
                            <Section title="À venir" events={upcoming} onEdit={openEdit} onDelete={handleDelete} deletingId={deletingId} status="upcoming" />
                        )}
                        {past.length > 0 && (
                            <Section title="Terminés" events={past} onEdit={openEdit} onDelete={handleDelete} deletingId={deletingId} status="past" />
                        )}
                    </div>
                )}
            </main>

            {/* Modal formulaire */}
            {showForm && (
                <div className={styles.overlay} onClick={closeForm}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>
                                {editingId ? 'Modifier l\'événement' : 'Nouvel événement'}
                            </h2>
                            <button className={styles.modalClose} onClick={closeForm}>✕</button>
                        </div>

                        <form onSubmit={handleSubmit} className={styles.form}>
                            {error && <div className={styles.errorBanner}>{error}</div>}

                            <div className={styles.field}>
                                <label className={styles.label}>Titre *</label>
                                <input
                                    className={styles.input}
                                    placeholder="Ex: DevFest 2026"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    required
                                />
                            </div>

                            <div className={styles.field}>
                                <label className={styles.label}>Description</label>
                                <textarea
                                    className={styles.textarea}
                                    placeholder="Décrivez l'événement..."
                                    rows={3}
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                />
                            </div>

                            <div className={styles.fieldRow}>
                                <div className={styles.field}>
                                    <label className={styles.label}>Date de début *</label>
                                    <input
                                        className={styles.input}
                                        type="datetime-local"
                                        value={form.startDate}
                                        onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className={styles.field}>
                                    <label className={styles.label}>Date de fin *</label>
                                    <input
                                        className={styles.input}
                                        type="datetime-local"
                                        value={form.endDate}
                                        onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className={styles.field}>
                                <label className={styles.label}>Lieu</label>
                                <input
                                    className={styles.input}
                                    placeholder="Ex: Paris, Palais des Congrès"
                                    value={form.location}
                                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                                />
                            </div>

                            <div className={styles.formActions}>
                                <button type="button" className={styles.btnSecondary} onClick={closeForm}>
                                    Annuler
                                </button>
                                <button type="submit" className={styles.btnPrimary} disabled={submitting}>
                                    {submitting ? 'Enregistrement...' : editingId ? 'Modifier' : 'Créer l\'événement'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

function Section({ title, events, onEdit, onDelete, deletingId, status }) {
    const statusDot = { live: '#00D4AA', upcoming: '#6C63FF', past: '#888' };
    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: statusDot[status], display: 'inline-block' }}></span>
                <h2 style={{ fontSize: 13, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{title}</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                {events.map((event) => (
                    <EventCard key={event.id} event={event} onEdit={onEdit} onDelete={onDelete} deletingId={deletingId} status={status} />
                ))}
            </div>
        </div>
    );
}

function EventCard({ event, onEdit, onDelete, deletingId, status }) {
    const [confirm, setConfirm] = useState(false);
    const isDeleting = deletingId === event.id;

    return (
        <div style={{
            background: '#fff',
            border: '0.5px solid #dde0ef',
            borderRadius: 12,
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            opacity: isDeleting ? 0.5 : 1,
            transition: 'all 0.2s',
        }}>
            {/* Date badge */}
            <div style={{
                minWidth: 52, height: 52, borderRadius: 10,
                background: status === 'live' ? '#e0faf5' : status === 'upcoming' ? '#eeecff' : '#f3f3f3',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            }}>
                <span style={{ fontSize: 18, fontWeight: 700, color: status === 'live' ? '#00D4AA' : status === 'upcoming' ? '#6C63FF' : '#aaa', lineHeight: 1 }}>
                    {new Date(event.startDate).getDate()}
                </span>
                <span style={{ fontSize: 10, fontWeight: 500, color: '#aaa', textTransform: 'uppercase' }}>
                    {new Date(event.startDate).toLocaleDateString('fr-FR', { month: 'short' })}
                </span>
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <span style={{ fontWeight: 600, fontSize: 15, color: '#1a1a2e', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {event.title}
                    </span>
                    {status === 'live' && (
                        <span style={{ background: '#00D4AA', color: '#004d3e', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>● LIVE</span>
                    )}
                </div>
                <div style={{ fontSize: 12, color: '#888', display: 'flex', gap: 12 }}>
                    {event.location && <span>📍 {event.location}</span>}
                    <span>📅 {formatDate(event.startDate)} → {formatDate(event.endDate)}</span>
                    {event._count && <span>🗂️ {event._count.sessions} session{event._count.sessions !== 1 ? 's' : ''}</span>}
                </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                {confirm ? (
                    <>
                        <span style={{ fontSize: 12, color: '#FF6B6B', alignSelf: 'center' }}>Confirmer ?</span>
                        <button onClick={() => onDelete(event.id)} style={{ background: '#FF6B6B', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
                            Oui
                        </button>
                        <button onClick={() => setConfirm(false)} style={{ background: 'transparent', color: '#888', border: '0.5px solid #dde0ef', borderRadius: 8, padding: '6px 12px', fontSize: 12, cursor: 'pointer' }}>
                            Non
                        </button>
                    </>
                ) : (
                    <>
                        <button onClick={() => onEdit(event)} style={{ background: 'transparent', color: '#6C63FF', border: '0.5px solid #6C63FF', borderRadius: 8, padding: '6px 14px', fontSize: 12, cursor: 'pointer', fontWeight: 500 }}>
                            Modifier
                        </button>
                        <button onClick={() => setConfirm(true)} style={{ background: 'transparent', color: '#FF6B6B', border: '0.5px solid #FF6B6B', borderRadius: 8, padding: '6px 14px', fontSize: 12, cursor: 'pointer', fontWeight: 500 }}>
                            Supprimer
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
