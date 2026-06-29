'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../admin/events/page.module.css';

export default function AddSessionModal({ eventId }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [roomName, setRoomName] = useState('');
  const [speakers, setSpeakers] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    if (new Date(startTime) > new Date(endTime)) {
      setError("L'heure de début doit être antérieure à l'heure de fin.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          startTime,
          endTime,
          roomName,
          speakers,
          eventId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Une erreur est survenue.");
      }

      setSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(false);
        setTitle('');
        setDescription('');
        setStartTime('');
        setEndTime('');
        setRoomName('');
        setSpeakers('');
        router.refresh();
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        type="button" 
        className={styles.btnPrimary} 
        onClick={() => setIsOpen(true)}
      >
        Ajouter une session
      </button>

      {isOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsOpen(false)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Créer une session</h2>
              <button 
                type="button" 
                className={styles.closeBtn} 
                onClick={() => setIsOpen(false)}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.modalForm}>
              {error && <div className={styles.modalError}>{error}</div>}
              {success && <div className={styles.modalSuccess}>Session créée avec succès !</div>}

              <div className={styles.inputGroup}>
                <label className={styles.modalLabel} htmlFor="session-title">Titre de la session *</label>
                <input
                  className={styles.modalInput}
                  type="text"
                  id="session-title"
                  placeholder="ex: Intro au Web3"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label className={styles.modalLabel} htmlFor="session-start">Heure de début *</label>
                  <input
                    className={styles.modalInput}
                    type="datetime-local"
                    id="session-start"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.modalLabel} htmlFor="session-end">Heure de fin *</label>
                  <input
                    className={styles.modalInput}
                    type="datetime-local"
                    id="session-end"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label className={styles.modalLabel} htmlFor="session-room">Salle *</label>
                  <input
                    className={styles.modalInput}
                    type="text"
                    id="session-room"
                    placeholder="ex: Salle A"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.modalLabel} htmlFor="session-speakers">Intervenants (séparés par des virgules)</label>
                  <input
                    className={styles.modalInput}
                    type="text"
                    id="session-speakers"
                    placeholder="ex: Alice, Bob"
                    value={speakers}
                    onChange={(e) => setSpeakers(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.modalLabel} htmlFor="session-desc">Description</label>
                <textarea
                  className={styles.modalTextarea}
                  id="session-desc"
                  rows="3"
                  placeholder="Décrivez brièvement le sujet de la session..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className={styles.modalActions}>
                <button 
                  type="button" 
                  className={styles.btnSecondary} 
                  onClick={() => setIsOpen(false)}
                  disabled={loading}
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className={styles.btnPrimary}
                  disabled={loading}
                >
                  {loading ? 'Création...' : 'Créer la session'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
