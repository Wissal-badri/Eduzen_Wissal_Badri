import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import PlanningService from "../services/planning.service";
import FormationService from "../services/formation.service";
import FormateurService from "../services/formateur.service";
import EntrepriseService from "../services/entreprise.service";
import { FiUser, FiBriefcase, FiCalendar, FiAlertTriangle, FiX, FiPlus, FiClock } from 'react-icons/fi';

const localizer = momentLocalizer(moment);

const messages = {
    allDay: 'Journée',
    previous: 'Précédent',
    next: 'Suivant',
    today: 'Aujourd\'hui',
    month: 'Mois',
    week: 'Semaine',
    day: 'Jour',
    agenda: 'Agenda',
    date: 'Date',
    time: 'Heure',
    event: 'Événement',
    noEventsInRange: 'Aucun événement dans cette plage',
    showMore: total => `+ ${total} de plus`
};

const CalendarView = ({ role }) => {
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false); // New state
    const [view, setView] = useState('month');
    const [date, setDate] = useState(new Date());
    const [formations, setFormations] = useState([]);
    const [formateurs, setFormateurs] = useState([]);
    const [entreprises, setEntreprises] = useState([]);
    const [newEvent, setNewEvent] = useState({
        id: null,
        formation: "",
        formateur: "",
        entreprise: "",
        start: new Date(),
        end: new Date(),
        allDay: false
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        PlanningService.getAllPlannings().then(response => {
            const mappedEvents = response.data.map(p => ({
                id: p.id,
                title: `${p.formation.titre} - ${p.entreprise.nom}`,
                start: new Date(p.dateDebut),
                end: new Date(p.dateFin),
                allDay: p.allDay || false,
                resource: p
            }));
            setEvents(mappedEvents);
        });

        if (role === 'ADMIN' || role === 'ASSISTANT') {
            FormationService.getAllFormations().then(res => setFormations(res.data));
            FormateurService.getAllFormateurs().then(res => setFormateurs(res.data));
            EntrepriseService.getAllEntreprises().then(res => setEntreprises(res.data));
        }
    };

    const handleSelectEvent = (event) => {
        setSelectedEvent(event);
        setShowViewModal(true);
    };

    const handleEditClick = () => {
        setNewEvent({
            id: selectedEvent.id,
            formation: selectedEvent.resource.formation.id,
            formateur: selectedEvent.resource.formateur.id,
            entreprise: selectedEvent.resource.entreprise.id,
            start: new Date(selectedEvent.start),
            end: new Date(selectedEvent.end),
            allDay: selectedEvent.allDay
        });
        setShowViewModal(false);
        setShowModal(true);
    };

    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        PlanningService.deletePlanning(selectedEvent.id).then(() => {
            setShowDeleteModal(false);
            setShowViewModal(false);
            loadData();
        });
    };

    const handleSelectSlot = ({ start, end, action }) => {
        // If clicking a day in month view, switch to day view
        if (view === 'month' && start) {
            setView('day');
            setDate(start);
            return;
        }

        if (role !== 'ADMIN' && role !== 'ASSISTANT') return;
        setNewEvent({ ...newEvent, id: null, start, end, allDay: false });
        setShowModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            formation: formations.find(f => f.id === parseInt(newEvent.formation)),
            formateur: formateurs.find(f => f.id === parseInt(newEvent.formateur)),
            entreprise: entreprises.find(e => e.id === parseInt(newEvent.entreprise)),
            dateDebut: newEvent.start,
            dateFin: newEvent.end,
            allDay: newEvent.allDay
        };

        const apiCall = newEvent.id
            ? PlanningService.updatePlanning(newEvent.id, payload)
            : PlanningService.createPlanning(payload);

        apiCall.then(() => {
            setShowModal(false);
            loadData();
            setNewEvent({
                id: null,
                formation: "",
                formateur: "",
                entreprise: "",
                start: new Date(),
                end: new Date(),
                allDay: false
            });
        });
    };

    const eventStyleGetter = (event, start, end, isSelected) => {
        const style = {
            backgroundColor: 'var(--primary)', // uses CSS variable
            borderRadius: '5px',
            opacity: 0.8,
            color: 'white',
            border: '0px',
            display: 'block'
        };
        return { style };
    };

    return (
        <div className="glass card" style={{ height: '650px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 className="text-gradient font-black" style={{ fontSize: '1.8rem', margin: 0 }}>Calendrier des Formations</h2>
                {(role === 'ADMIN' || role === 'ASSISTANT') && (
                    <button
                        className="btn-add-custom"
                        onClick={() => {
                            setNewEvent({
                                id: null,
                                formation: "",
                                formateur: "",
                                entreprise: "",
                                start: new Date(),
                                end: moment().add(1, 'hours').toDate(),
                                allDay: false
                            });
                            setShowModal(true);
                        }}
                    >
                        <FiPlus /> Planifier une session
                    </button>
                )}
            </div>

            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 'calc(100% - 80px)', color: 'var(--text)', fontFamily: 'var(--font-sans)', fontWeight: 500 }}
                selectable={true}
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
                messages={messages}
                eventPropGetter={eventStyleGetter}
                views={['month', 'week', 'day', 'agenda']}
                step={60}
                timeslots={1}
                view={view}
                date={date}
                onView={setView}
                onNavigate={setDate}
            />

            {/* Modal de Création / Modification */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', textAlign: 'left' }}>
                        <h3 className="text-gradient" style={{ marginBottom: '1.5rem' }}>
                            {newEvent.id ? "Modifier la session" : "Planifier une formation"}
                        </h3>
                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label className="input-label">Formation</label>
                                <select
                                    className="input-field"
                                    value={newEvent.formation}
                                    onChange={e => setNewEvent({ ...newEvent, formation: e.target.value })}
                                    required
                                >
                                    <option value="">Sélectionner une formation</option>
                                    {formations.map(f => (
                                        <option key={f.id} value={f.id}>{f.titre}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="input-group">
                                <label className="input-label">Formateur</label>
                                <select
                                    className="input-field"
                                    value={newEvent.formateur}
                                    onChange={e => setNewEvent({ ...newEvent, formateur: e.target.value })}
                                    required
                                >
                                    <option value="">Sélectionner un formateur</option>
                                    {formateurs.map(f => (
                                        <option key={f.id} value={f.id}>{f.user.username}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="input-group">
                                <label className="input-label">Entreprise</label>
                                <select
                                    className="input-field"
                                    value={newEvent.entreprise}
                                    onChange={e => setNewEvent({ ...newEvent, entreprise: e.target.value })}
                                    required
                                >
                                    <option value="">Sélectionner une entreprise</option>
                                    {entreprises.map(e => (
                                        <option key={e.id} value={e.id}>{e.nom}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="input-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <input
                                    type="checkbox"
                                    id="allDay"
                                    checked={newEvent.allDay}
                                    onChange={e => setNewEvent({ ...newEvent, allDay: e.target.checked })}
                                    style={{ width: '1.2rem', height: '1.2rem', cursor: 'pointer' }}
                                />
                                <label htmlFor="allDay" className="input-label" style={{ marginBottom: 0, cursor: 'pointer', fontSize: '0.95rem', color: 'var(--text)' }}>
                                    Toute la journée
                                </label>
                            </div>

                            <div className="form-row">
                                <div className="input-group">
                                    <label className="input-label">Début</label>
                                    <input
                                        type={newEvent.allDay ? "date" : "datetime-local"}
                                        className="input-field"
                                        value={moment(newEvent.start).format(newEvent.allDay ? 'YYYY-MM-DD' : 'YYYY-MM-DDTHH:mm')}
                                        onChange={e => setNewEvent({ ...newEvent, start: new Date(e.target.value) })}
                                        required
                                    />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Fin</label>
                                    <input
                                        type={newEvent.allDay ? "date" : "datetime-local"}
                                        className="input-field"
                                        value={moment(newEvent.end).format(newEvent.allDay ? 'YYYY-MM-DD' : 'YYYY-MM-DDTHH:mm')}
                                        onChange={e => setNewEvent({ ...newEvent, end: new Date(e.target.value) })}
                                        required
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" className="btn-back-custom" onClick={() => setShowModal(false)} style={{ flex: 1, justifyContent: 'center' }}>Annuler</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                                    {newEvent.id ? "Mettre à jour" : "Planifier"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Modal de Détails */}
            {showViewModal && selectedEvent && (
                <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px', textAlign: 'left' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 className="text-secondary" style={{ margin: 0, fontWeight: 800 }}>Détails de la Session</h3>
                            <button className="btn-close" style={{ background: 'none', border: 'none', color: 'var(--text)', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowViewModal(false)}><FiX /></button>
                        </div>

                        <div className="detail-item" style={{ marginBottom: '1.5rem' }}>
                            <label style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--secondary)', letterSpacing: '1px', fontWeight: 700 }}>Formation</label>
                            <p style={{ margin: '0.3rem 0 0', fontSize: '1.2rem', fontWeight: 600 }}>{selectedEvent.resource.formation.titre}</p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                            <div className="detail-item">
                                <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <FiUser size={12} /> Formateur
                                </label>
                                <p style={{ margin: '0.2rem 0 0', fontWeight: 500 }}>{selectedEvent.resource.formateur.user.username}</p>
                            </div>
                            <div className="detail-item">
                                <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <FiBriefcase size={12} /> Entreprise
                                </label>
                                <p style={{ margin: '0.2rem 0 0', fontWeight: 500 }}>{selectedEvent.resource.entreprise.nom}</p>
                            </div>
                        </div>

                        <div className="detail-item" style={{ marginBottom: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <FiCalendar size={12} /> Date et Heure
                            </label>
                            <p style={{ margin: '0.2rem 0 0', color: 'var(--secondary)', fontWeight: 600 }}>
                                {selectedEvent.allDay
                                    ? `Toute la journée • ${moment(selectedEvent.start).format('DD MMMM YYYY')}`
                                    : `${moment(selectedEvent.start).format('DD/MM/YYYY')} • ${moment(selectedEvent.start).format('HH:mm')} - ${moment(selectedEvent.end).format('HH:mm')}`
                                }
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1rem' }}>
                            <button className="btn-back-custom" onClick={() => setShowViewModal(false)} style={{ flex: 1, justifyContent: 'center' }}>Fermer</button>

                            {(role === 'ADMIN' || role === 'ASSISTANT') && (
                                <>
                                    <button
                                        className="btn btn-primary"
                                        style={{ flex: 2, background: 'var(--secondary)', minWidth: '100px', fontWeight: 700 }}
                                        onClick={handleEditClick}
                                    >
                                        Modifier
                                    </button>
                                    <button
                                        className="btn"
                                        style={{ flex: 1, backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', minWidth: '100px', fontWeight: 700 }}
                                        onClick={handleDeleteClick}
                                    >
                                        Supprimer
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Confirmation de Suppression */}
            {showDeleteModal && (
                <div className="modal-overlay" style={{ zIndex: 1100 }}>
                    <div className="modal-content" style={{ maxWidth: '400px', textAlign: 'center', border: '1px solid var(--error)' }}>
                        <div style={{ width: '50px', height: '50px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                            <FiAlertTriangle size={24} color="var(--error)" />
                        </div>
                        <h3 style={{ marginBottom: '1rem', fontSize: '1.4rem' }}>Confirmer la suppression</h3>
                        <p className="text-muted" style={{ marginBottom: '2rem' }}>
                            Êtes-vous sûr de vouloir supprimer cette session ? Cette action est irréversible.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                className="btn btn-ghost"
                                onClick={() => setShowDeleteModal(false)}
                                style={{ flex: 1 }}
                            >
                                Annuler
                            </button>
                            <button
                                className="btn"
                                style={{ flex: 1, backgroundColor: 'var(--error)', color: 'white', border: 'none' }}
                                onClick={confirmDelete}
                            >
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalendarView;
