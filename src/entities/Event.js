/* ========================================
   Event.js - WITH TYPE FIELD
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
    this.type = data.type || 'workshop';
    this.attendees = data.attendees || 0;
    this.max_attendees = data.max_attendees || null;
    this.image_url = data.image_url || null;
    this.end_date = data.end_date || null;
    this.registration_url = data.registration_url || null;
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

  // Check if event is today
  isToday() {
    const eventDate = new Date(this.date);
    const today = new Date();
    return eventDate.toDateString() === today.toDateString();
  }

  // Check if event is full
  isFull() {
    if (!this.max_attendees) return false;
    return this.attendees >= this.max_attendees;
  }

  // Get days until event
  getDaysUntil() {
    const eventDate = new Date(this.date);
    const today = new Date();
    const diffTime = eventDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  // Get formatted date
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

  // Get short date for cards (without time)
  getShortDate() {
    const date = new Date(this.date);
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    });
  }

  // Get status color
  getStatusColor() {
    switch(this.status) {
      case 'upcoming': return '#4cc9f0';
      case 'ongoing': return '#667eea';
      case 'completed': return '#999';
      default: return '#666';
    }
  }

  // Get type color/badge styling
  getTypeColor() {
    switch(this.type) {
      case 'volunteering': return '#10b981'; // green
      case 'workshop': return '#3b82f6';     // blue
      case 'social': return '#f59e0b';       // orange
      case 'competition': return '#ef4444';  // red
      case 'networking': return '#8b5cf6';   // purple
      default: return '#6b7280';             // gray
    }
  }

  // Get type icon/emoji
  getTypeIcon() {
    switch(this.type) {
      case 'volunteering': return '🤝';
      case 'workshop': return '🛠️';
      case 'social': return '🎉';
      case 'competition': return '🏆';
      case 'networking': return '🌐';
      default: return '📅';
    }
  }

  // Get formatted type label
  getTypeLabel() {
    return this.type.charAt(0).toUpperCase() + this.type.slice(1);
  }

  // Convert to plain object for components
  toJSON() {
    return {
      id: this.id,
      notion_id: this.notion_id,
      title: this.title,
      date: this.date,
      location: this.location,
      description: this.description,
      status: this.status,
      type: this.type,
      attendees: this.attendees,
      max_attendees: this.max_attendees,
      image_url: this.image_url,
      end_date: this.end_date,
      registration_url: this.registration_url,
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

// Utility: Get all valid event types
export const EVENT_TYPES = [
  'volunteering',
  'workshop',
  'social',
  'competition',
  'networking'
];

// Utility: Filter events by type
export function filterEventsByType(events, type) {
  return events.filter(event => event.type === type);
}

// Utility: Group events by type
export function groupEventsByType(events) {
  return events.reduce((acc, event) => {
    const type = event.type || 'workshop';
    if (!acc[type]) acc[type] = [];
    acc[type].push(event);
    return acc;
  }, {});
}