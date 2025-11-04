/**
 * BlogPost Entity
 * Represents a blog post from Supabase
 */

export class BlogPost {
  constructor(data) {
    this.id = data.id;
    this.notion_id = data.notion_id;
    this.title = data.title;
    this.author = data.author;
    this.published_date = data.published_date;
    this.excerpt = data.excerpt;
    this.status = data.status || 'draft';
    this.image = data.image;  // ADD THIS
    this.slug = data.slug;    // ADD THIS
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Check if post is published
  isPublished() {
    return this.status === 'published';
  }

  // Get formatted date
  getFormattedDate() {
    const date = new Date(this.published_date);
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    });
  }

  // Calculate estimated read time based on excerpt length
  getEstimatedReadTime() {
    const wordsPerMinute = 200;
    const words = this.excerpt ? this.excerpt.split(' ').length : 0;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
  }

  // ADD THIS: Get image URL with fallback
  getImageUrl() {
    return this.image || '/images/default-blog.jpg'; // Provide a default image path
  }

  // ADD THIS: Get URL-friendly slug
  getSlug() {
    return this.slug || this.notion_id;
  }

  // Convert to plain object for components
  toJSON() {
    return {
      id: this.id,
      notion_id: this.notion_id,
      title: this.title,
      author: this.author,
      published_date: this.published_date,
      excerpt: this.excerpt,
      status: this.status,
      image: this.image,        // ADD THIS
      slug: this.slug,          // ADD THIS
      imageUrl: this.getImageUrl(), // ADD THIS (computed)
      readTime: this.getEstimatedReadTime(),
      formattedDate: this.getFormattedDate(), // ADD THIS for convenience
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}

// Factory function to create BlogPost instances from Supabase data
export function createBlogPost(data) {
  return new BlogPost(data);
}

// Factory function to create multiple BlogPost instances
export function createBlogPosts(dataArray) {
  return dataArray.map(data => new BlogPost(data));
}