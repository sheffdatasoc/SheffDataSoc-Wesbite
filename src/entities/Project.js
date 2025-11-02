/* ========================================
   Project.js - Complete Entity
   ======================================== */

/**
 * Project Entity
 * Represents a project from Supabase
 */

class Project {
  constructor(data) {
    this.id = data.id;
    this.notionId = data.notion_id;
    this.title = data.title;
    this.description = data.description;
    this.status = data.status || 'planning'; // planning, active, completed, on hold
    this.tags = data.tags || [];
    this.members = data.members || 0;
    this.githubUrl = data.github_url;
    this.demoUrl = data.demo_url;
    this.imageUrl = data.image_url;
    this.startDate = data.start_date;
    this.endDate = data.end_date;
    this.isFeatured = data.is_featured || false;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  // Check if project is active
  isActive() {
    return this.status === 'active';
  }

  // Check if project is completed
  isCompleted() {
    return this.status === 'completed';
  }

  // Check if project is in planning phase
  isPlanning() {
    return this.status === 'planning';
  }

  // Check if project is on hold
  isOnHold() {
    return this.status === 'on hold';
  }

  // Get status color for UI
  getStatusColor() {
    switch(this.status.toLowerCase()) {
      case 'active': return '#4cc9f0';
      case 'completed': return '#667eea';
      case 'planning': return '#ffd166';
      case 'on hold': return '#999';
      default: return '#667eea';
    }
  }

  // Check if project has GitHub repo
  hasGithubRepo() {
    return !!(this.githubUrl && this.githubUrl.trim() !== '');
  }

  // Check if project has live demo
  hasDemo() {
    return !!(this.demoUrl && this.demoUrl.trim() !== '');
  }

  // Check if project has any links
  hasLinks() {
    return this.hasGithubRepo() || this.hasDemo();
  }

  // Get formatted start date
  getFormattedStartDate() {
    if (!this.startDate) return 'Not started';
    const date = new Date(this.startDate);
    return date.toLocaleDateString('en-GB', { 
      month: 'short',
      year: 'numeric'
    });
  }

  // Get formatted end date
  getFormattedEndDate() {
    if (!this.endDate) return 'Ongoing';
    const date = new Date(this.endDate);
    return date.toLocaleDateString('en-GB', { 
      month: 'short',
      year: 'numeric'
    });
  }

  // Get project duration in months
  getDuration() {
    if (!this.startDate) return null;
    
    const start = new Date(this.startDate);
    const end = this.endDate ? new Date(this.endDate) : new Date();
    
    const months = (end.getFullYear() - start.getFullYear()) * 12 
                  + (end.getMonth() - start.getMonth());
    
    return months;
  }

  // Get duration text for display
  getDurationText() {
    const duration = this.getDuration();
    if (duration === null) return 'Duration unknown';
    if (duration === 0) return 'Less than a month';
    if (duration === 1) return '1 month';
    return `${duration} months`;
  }

  // Check if project matches search query
  matchesSearch(query) {
    if (!query) return true;
    
    const searchLower = query.toLowerCase();
    
    return (
      this.title?.toLowerCase().includes(searchLower) ||
      this.description?.toLowerCase().includes(searchLower) ||
      this.tags?.some(tag => tag.toLowerCase().includes(searchLower)) ||
      this.status?.toLowerCase().includes(searchLower)
    );
  }

  // Filter by status
  matchesStatus(statusFilter) {
    if (!statusFilter || statusFilter === 'all') return true;
    return this.status.toLowerCase() === statusFilter.toLowerCase();
  }

  // Filter by tag
  hasTag(tag) {
    if (!tag) return true;
    return this.tags?.some(t => t.toLowerCase() === tag.toLowerCase());
  }

  // Get short description for cards
  getShortDescription(maxLength = 150) {
    if (!this.description) return 'No description available';
    if (this.description.length <= maxLength) return this.description;
    return this.description.substring(0, maxLength).trim() + '...';
  }

  // Get all unique tags from project list (static method)
  static getAllTags(projects) {
    const tagSet = new Set();
    projects.forEach(project => {
      project.tags?.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }

  // Sort projects by date (static method)
  static sortByDate(projects, ascending = false) {
    return [...projects].sort((a, b) => {
      const dateA = new Date(a.startDate || a.createdAt);
      const dateB = new Date(b.startDate || b.createdAt);
      return ascending ? dateA - dateB : dateB - dateA;
    });
  }

  // Sort projects by status priority (static method)
  static sortByStatus(projects) {
    const statusPriority = { 'active': 1, 'planning': 2, 'on hold': 3, 'completed': 4 };
    return [...projects].sort((a, b) => {
      return (statusPriority[a.status] || 999) - (statusPriority[b.status] || 999);
    });
  }

  // Convert to plain object for components
  toJSON() {
    return {
      id: this.id,
      notionId: this.notionId,
      title: this.title,
      description: this.description,
      shortDescription: this.getShortDescription(),
      status: this.status,
      statusColor: this.getStatusColor(),
      tags: this.tags,
      members: this.members,
      githubUrl: this.githubUrl,
      demoUrl: this.demoUrl,
      imageUrl: this.imageUrl,
      startDate: this.startDate,
      endDate: this.endDate,
      formattedStartDate: this.getFormattedStartDate(),
      formattedEndDate: this.getFormattedEndDate(),
      duration: this.getDurationText(),
      isFeatured: this.isFeatured,
      hasLinks: this.hasLinks(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

// Factory functions
export function createProject(data) {
  return new Project(data);
}

export function createProjects(dataArray) {
  return dataArray.map(data => new Project(data));
}

export default Project;