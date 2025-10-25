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

  // Get status color
  getStatusColor() {
    switch(this.status) {
      case 'upcoming': return '#4cc9f0';
      case 'ongoing': return '#f72585';
      case 'completed': return '#7209b7';
      default: return '#666';
    }
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
      attendees: this.attendees,
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