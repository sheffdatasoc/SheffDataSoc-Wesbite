/* ========================================
   Member.js - REVIEWED & ENHANCED
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
    this.imageUrl = data.image_url;
    this.githubUrl = data.github_url;
    this.linkedinUrl = data.linkedin_url;
    this.twitterUrl = data.twitter_url; // SUGGESTION: Add if you use Twitter
    this.skills = data.skills || []; // SUGGESTION: Add skills array
    this.createdAt = data.created_at;
  }

  // Extract year from bio (e.g., "2nd Year") - GOOD!
  getYear() {
    if (!this.bio) return null;
    const yearMatch = this.bio.match(/(\d+(?:st|nd|rd|th)\s+Year)/i);
    return yearMatch ? yearMatch[1] : null;
  }

  // Extract major/course from bio - GOOD!
  getMajor() {
    if (!this.bio) return null;
    // Common patterns: "Data Science", "Computer Science", etc.
    const majorMatch = this.bio.match(/(?:Major|Course|Studying|Studies):\s*([^\n.]+)/i);
    if (majorMatch) return majorMatch[1].trim();
    
    // Fallback: Look for common majors
    const commonMajors = ['Data Science', 'Computer Science', 'Mathematics', 'Statistics', 'Engineering'];
    for (const major of commonMajors) {
      if (this.bio.toLowerCase().includes(major.toLowerCase())) {
        return major;
      }
    }
    return null;
  }

  // Get clean bio without year and major - GOOD!
  getCleanBio() {
    if (!this.bio) return 'No bio available';
    let cleanBio = this.bio;
    
    // Remove year
    const year = this.getYear();
    if (year) cleanBio = cleanBio.replace(year, '').trim();
    
    // Remove major line
    cleanBio = cleanBio.replace(/(?:Major|Course|Studying|Studies):\s*[^\n.]+/gi, '').trim();
    
    return cleanBio || 'No bio available';
  }

  // Determine if member is in main committee - GOOD!
  isCommittee() {
    const committeeRoles = ['President', 'Vice President', 'Secretary', 'Treasurer', 'Events'];
    return committeeRoles.some(role => 
      this.role && this.role.toLowerCase().includes(role.toLowerCase())
    );
  }

  // Get initials for avatar fallback - GOOD!
  getInitials() {
    if (!this.name) return '?';
    return this.name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  // Check if member matches search query - GOOD!
  matchesSearch(query) {
    if (!query) return true;
    
    const searchLower = query.toLowerCase();
    const year = this.getYear();
    const major = this.getMajor();
    
    return (
      this.name?.toLowerCase().includes(searchLower) ||
      this.role?.toLowerCase().includes(searchLower) ||
      year?.toLowerCase().includes(searchLower) ||
      major?.toLowerCase().includes(searchLower) ||
      this.bio?.toLowerCase().includes(searchLower)
    );
  }

  // SUGGESTION: Get social links object for component
  getSocialLinks() {
    const links = {};
    if (this.linkedinUrl) links.linkedin = this.linkedinUrl;
    if (this.githubUrl) links.github = this.githubUrl;
    if (this.twitterUrl) links.twitter = this.twitterUrl;
    return links;
  }

  // SUGGESTION: Check if member has any social links
  hasSocialLinks() {
    return !!(this.linkedinUrl || this.githubUrl || this.twitterUrl);
  }

  // SUGGESTION: Get display role (shorten long titles)
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
      major: this.getMajor(),
      imageUrl: this.imageUrl,
      githubUrl: this.githubUrl,
      linkedinUrl: this.linkedinUrl,
      twitterUrl: this.twitterUrl,
      skills: this.skills,
      initials: this.getInitials(),
      isCommittee: this.isCommittee(),
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