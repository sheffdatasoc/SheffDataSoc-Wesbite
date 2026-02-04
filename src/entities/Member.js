/* ========================================
   Member.js - UPDATED
   ======================================== */

/**
 * Member Entity
 * Represents a team member from Supabase
 */

class Member {
  constructor(data) {
    this.id = data.id;
    this.notionId = data.notion_id;
    this.name = data.name;
    this.role = data.role;
    this.bio = data.bio;
    this.major = data.major || null; // now comes directly from DB
    this.imageUrl = data.image_url;
    this.githubUrl = data.github || data.github_url;
    this.linkedinUrl = data.linkedin || data.linkedin_url;
    this.interests = data.interests || [];
    this.academicYear = data.academic_year;
    this.is_committee = data.is_committee; // Capture explicit flag from DB
    this.createdAt = data.created_at;
  }

  // Extract year from bio (e.g., "2nd Year")
  getYear() {
    if (!this.bio) return null;
    const yearMatch = this.bio.match(/(\d+(?:st|nd|rd|th)\s+Year)/i);
    return yearMatch ? yearMatch[1] : null;
  }

  // Clean bio without year
  getCleanBio() {
    if (!this.bio) return 'No bio available';
    let cleanBio = this.bio;

    const year = this.getYear();
    if (year) cleanBio = cleanBio.replace(year, '').trim();

    return cleanBio || 'No bio available';
  }

  // Determine if member is in main committee
  isCommittee() {
    const committeeRoles = ['President', 'Vice President', 'Secretary', 'Treasurer', 'Events'];
    return committeeRoles.some(role =>
      this.role && this.role.toLowerCase().includes(role.toLowerCase())
    );
  }

  // Get initials for avatar fallback
  getInitials() {
    if (!this.name) return '?';
    return this.name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  // Check if member matches search query
  matchesSearch(query) {
    if (!query) return true;

    const searchLower = query.toLowerCase();
    const year = this.getYear();
    const major = this.major;

    return (
      this.name?.toLowerCase().includes(searchLower) ||
      this.role?.toLowerCase().includes(searchLower) ||
      year?.toLowerCase().includes(searchLower) ||
      (major && major.toLowerCase().includes(searchLower)) ||
      this.bio?.toLowerCase().includes(searchLower) ||
      this.interests?.some(interest => interest.toLowerCase().includes(searchLower))
    );
  }

  // Get academic year (e.g., "2024/25")
  getAcademicYear() {
    return this.academicYear || 'Unknown';
  }

  // Get social links object for component
  getSocialLinks() {
    const links = {};
    if (this.linkedinUrl) links.linkedin = this.linkedinUrl;
    if (this.githubUrl) links.github = this.githubUrl;
    return links;
  }

  // Check if member has any social links
  hasSocialLinks() {
    return !!(this.linkedinUrl || this.githubUrl);
  }

  // Get display role (shorten long titles)
  getDisplayRole(maxLength = 30) {
    if (!this.role) return 'Member';
    if (this.role.length <= maxLength) return this.role;
    return this.role.substring(0, maxLength) + '...';
  }

  // Convert to plain object for components
  toJSON() {
    return {
      id: this.id,
      notionId: this.notionId,
      name: this.name,
      role: this.role,
      bio: this.bio,
      cleanBio: this.getCleanBio(),
      year: this.getYear(),
      major: this.major,
      imageUrl: this.imageUrl,
      githubUrl: this.githubUrl,
      linkedinUrl: this.linkedinUrl,
      interests: this.interests,
      academicYear: this.academicYear,
      is_committee: this.is_committee,
      initials: this.getInitials(),
      isCommittee: this.isCommittee() || this.is_committee === true,
      socialLinks: this.getSocialLinks(),
      createdAt: this.createdAt
    };
  }
}

// Factory functions
export function createMember(data) {
  return new Member(data);
}

export function createMembers(dataArray) {
  return dataArray.map(data => new Member(data));
}

export default Member;
