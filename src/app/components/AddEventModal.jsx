'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../page.module.css';

export default function AddEventModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    if (new Date(startDate) > new Date(endDate)) {
      setError('La date de début doit être antérieure à la date de fin.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          startDate,
          endDate,
          location,
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
        setStartDate('');
        setEndDate('');
        setLocation('');
        router.push('/planning');
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
        className={styles.btnSecondary} 
        onClick={() => setIsOpen(true)}
      >
        Ajouter un événement
      </button>

      {isOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsOpen(false)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Créer un événement</h2>
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
              {success && <div className={styles.modalSuccess}>Événement créé avec succès !</div>}

              <div className={styles.inputGroup}>
                <label className={styles.modalLabel} htmlFor="event-title">Titre de l'événement *</label>
                <input
                  className={styles.modalInput}
                  type="text"
                  id="event-title"
                  placeholder="ex: Hackathon Web3 2026"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label className={styles.modalLabel} htmlFor="event-start">Date de début *</label>
                  <input
                    className={styles.modalInput}
                    type="datetime-local"
                    id="event-start"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.modalLabel} htmlFor="event-end">Date de fin *</label>
                  <input
                    className={styles.modalInput}
                    type="datetime-local"
                    id="event-end"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.modalLabel} htmlFor="event-location">Lieu de l'événement</label>
                <input
                  className={styles.modalInput}
                  type="text"
                  id="event-location"
                  placeholder="ex: Paris, France ou En ligne"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.modalLabel} htmlFor="event-desc">Description</label>
                <textarea
                  className={styles.modalTextarea}
                  id="event-desc"
                  rows="3"
                  placeholder="Décrivez brièvement le programme ou le but de l'événement..."
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
                  {loading ? 'Création...' : 'Créer l\'événement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
