/* ========================================
   Event.js - REVIEWED & ENHANCED
   ======================================== */

/**
 * Event Entity
 * Represents an event from Supabase
 */

export class Event {
  constructor(data) {
    this.id = data.id;
    this.notion_id = data.notion_id;
    this.title = data.title;
    this.date = data.date;
    this.location = data.location;
    this.description = data.description;
    this.status = data.status || 'upcoming';
    this.attendees = data.attendees || 0;
    this.max_attendees = data.max_attendees || null; // SUGGESTION: Add max capacity
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Check if event is upcoming
  isUpcoming() {
    return new Date(this.date) > new Date() && this.status === 'upcoming';
  }

  // Check if event is past
  isPast() {
    return new Date(this.date) < new Date() || this.status === 'completed';
  }

  // SUGGESTION: Check if event is today
  isToday() {
    const eventDate = new Date(this.date);
    const today = new Date();
    return eventDate.toDateString() === today.toDateString();
  }

  // SUGGESTION: Check if event is full
  isFull() {
    if (!this.max_attendees) return false;
    return this.attendees >= this.max_attendees;
  }

  // SUGGESTION: Get days until event
  getDaysUntil() {
    const eventDate = new Date(this.date);
    const today = new Date();
    const diffTime = eventDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  // Get formatted date - GOOD!
  getFormattedDate() {
    const date = new Date(this.date);
    return date.toLocaleDateString('en-GB', { 
      weekday: 'short',
      day: 'numeric', 
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // SUGGESTION: Get short date for cards (without time)
  getShortDate() {
    const date = new Date(this.date);
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    });
  }

  // Get status color - GOOD!
  // Note: This is OK in entity since it's business logic
  // But component can override if needed
  getStatusColor() {
    switch(this.status) {
      case 'upcoming': return '#4cc9f0';
      case 'ongoing': return '#667eea';
      case 'completed': return '#999';
      default: return '#666';
    }
  }

  // Convert to plain object for components - GOOD!
  toJSON() {
    return {
      id: this.id,
      notion_id: this.notion_id,
      title: this.title,
      date: this.date,
      location: this.location,
      description: this.description,
      status: this.status,
      attendees: this.attendees,
      max_attendees: this.max_attendees,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}

export function createEvent(data) {
  return new Event(data);
}

export function createEvents(dataArray) {
  return dataArray.map(data => new Event(data));
}