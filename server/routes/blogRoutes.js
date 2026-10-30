import express from 'express';
import db from '../db/database.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Helper to safely parse JSON or return fallback
function safeParseJson(val, fallback = []) {
  if (!val) return fallback;
  if (Array.isArray(val) || (typeof val === 'object' && val !== null)) return val;
  try {
    const parsed = JSON.parse(val);
    return parsed;
  } catch {
    if (typeof val === 'string' && val.includes(',')) {
      return val.split(',').map((s) => s.trim()).filter(Boolean);
    }
    return fallback;
  }
}

// Helper to slugify titles
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start
    .replace(/-+$/, ''); // Trim - from end
}

// Calculate estimated read time from content
function calculateReadTime(text) {
  if (!text) return '3 min read';
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 180));
  return `${minutes} min read`;
}

// Normalize blog object from database row
function formatBlog(row) {
  if (!row) return null;
  return {
    ...row,
    tags: safeParseJson(row.tags, []),
    externalLinks: safeParseJson(row.externalLinks, []),
    featured: Boolean(row.featured),
    isHeroPick: Boolean(row.featured),
    date: row.createdAt
      ? new Date(row.createdAt).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })
      : 'October 2026',
    author: {
      name: row.authorName || 'CEO',
      role: row.authorRole || 'Founder & CEO, Durgam Soft',
      avatar: row.authorAvatar || '/images/about/testimonial-avatar-1.webp',
    },
    createdBy: row.createdBy || 'CEO',
    updatedBy: row.updatedBy || 'CEO',
  };
}

// ==========================================
// PUBLIC BLOG ENDPOINTS
// ==========================================

/**
 * GET /api/blogs
 * Public: Get published blog articles
 */
router.get('/blogs', (req, res) => {
  try {
    const { category, search, limit } = req.query;
    let query = "SELECT * FROM blogs WHERE status = 'published'";
    const params = [];

    if (category && category !== 'All') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (search && search.trim()) {
      query += ' AND (title LIKE ? OR subtitle LIKE ? OR excerpt LIKE ? OR content LIKE ?)';
      const s = `%${search.trim()}%`;
      params.push(s, s, s, s);
    }

    query += ' ORDER BY createdAt DESC';

    if (limit && Number(limit) > 0) {
      query += ' LIMIT ?';
      params.push(Number(limit));
    }

    const rows = db.prepare(query).all(...params);
    const blogs = rows.map(formatBlog);

    return res.json({
      success: true,
      count: blogs.length,
      blogs,
    });
  } catch (err) {
    console.error('[API] Error fetching public blogs:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch blog articles.',
    });
  }
});

/**
 * GET /api/blogs/:slugOrId
 * Public: Get single article by slug or id
 */
router.get('/blogs/:slugOrId', (req, res) => {
  try {
    const { slugOrId } = req.params;
    const row = db
      .prepare("SELECT * FROM blogs WHERE (slug = ? OR id = ?) AND status = 'published'")
      .get(slugOrId, slugOrId);

    if (!row) {
      return res.status(404).json({
        success: false,
        message: 'Blog article not found.',
      });
    }

    return res.json({
      success: true,
      blog: formatBlog(row),
    });
  } catch (err) {
    console.error('[API] Error fetching single blog:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch article details.',
    });
  }
});

// ==========================================
// PROTECTED ADMIN BLOG ENDPOINTS
// ==========================================

/**
 * GET /api/admin/blogs
 * Protected: Get all blogs for admin management
 */
router.get('/admin/blogs', authenticateAdmin, (req, res) => {
  try {
    const { status, search } = req.query;
    let query = 'SELECT * FROM blogs WHERE 1=1';
    const params = [];

    if (status && status !== 'all') {
      query += ' AND status = ?';
      params.push(status);
    }

    if (search && search.trim()) {
      query += ' AND (title LIKE ? OR excerpt LIKE ? OR category LIKE ?)';
      const s = `%${search.trim()}%`;
      params.push(s, s, s);
    }

    query += ' ORDER BY createdAt DESC';

    const rows = db.prepare(query).all(...params);
    const blogs = rows.map(formatBlog);

    return res.json({
      success: true,
      count: blogs.length,
      blogs,
    });
  } catch (err) {
    console.error('[API] Error fetching admin blogs:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to load blog management list.',
    });
  }
});

/**
 * GET /api/admin/blogs/:id
 * Protected: Get single blog for editing
 */
router.get('/admin/blogs/:id', authenticateAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const row = db.prepare('SELECT * FROM blogs WHERE id = ?').get(id);

    if (!row) {
      return res.status(404).json({
        success: false,
        message: 'Blog article not found.',
      });
    }

    return res.json({
      success: true,
      blog: formatBlog(row),
    });
  } catch (err) {
    console.error('[API] Error fetching admin blog by id:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve blog details.',
    });
  }
});

/**
 * POST /api/admin/blogs
 * Protected: Create a new blog with image, text, and external links
 */
router.post('/admin/blogs', authenticateAdmin, (req, res) => {
  try {
    const {
      title,
      slug: customSlug,
      subtitle = '',
      excerpt = '',
      category = 'Technology',
      authorName = 'CEO',
      authorRole = 'Founder & CEO, Durgam Soft',
      authorAvatar = '/images/about/testimonial-avatar-1.webp',
      image = '',
      content = '',
      externalLinks = [],
      tags = [],
      status = 'published',
      featured = 0,
      readTime = '',
    } = req.body || {};

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Blog title is required.',
      });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Blog content or article text is required.',
      });
    }

    const cleanTitle = title.trim();
    let baseSlug = customSlug && customSlug.trim() ? slugify(customSlug) : slugify(cleanTitle);
    if (!baseSlug) baseSlug = `article-${Date.now()}`;

    // Ensure slug is unique
    let finalSlug = baseSlug;
    let slugCounter = 1;
    while (db.prepare('SELECT id FROM blogs WHERE slug = ?').get(finalSlug)) {
      finalSlug = `${baseSlug}-${slugCounter}`;
      slugCounter++;
    }

    const id = `blog-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const now = new Date().toISOString();
    const finalReadTime = readTime && readTime.trim() ? readTime.trim() : calculateReadTime(content);
    const finalExcerpt =
      excerpt && excerpt.trim()
        ? excerpt.trim()
        : content.trim().replace(/\n+/g, ' ').slice(0, 180) + '...';

    // Normalize external links
    const cleanExternalLinks = Array.isArray(externalLinks)
      ? externalLinks
          .filter((l) => l && (l.url || l.title))
          .map((l) => ({
            title: (l.title || l.url || '').trim(),
            url: (l.url || '').trim(),
          }))
      : [];

    // Normalize tags
    const cleanTags = Array.isArray(tags)
      ? tags.map((t) => t.toString().trim()).filter(Boolean)
      : typeof tags === 'string'
        ? tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [];

    const insert = db.prepare(`
      INSERT INTO blogs (
        id, slug, title, subtitle, excerpt, category, authorName, authorRole,
        authorAvatar, image, readTime, content, externalLinks, tags, status,
        featured, createdBy, updatedBy, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insert.run(
      id,
      finalSlug,
      cleanTitle,
      subtitle ? subtitle.trim() : '',
      finalExcerpt,
      category.trim() || 'Technology',
      authorName.trim() || 'CEO',
      authorRole.trim() || 'Founder & CEO, Durgam Soft',
      authorAvatar.trim(),
      image || '',
      finalReadTime,
      content.trim(),
      JSON.stringify(cleanExternalLinks),
      JSON.stringify(cleanTags),
      status === 'draft' ? 'draft' : 'published',
      featured ? 1 : 0,
      'CEO',
      'CEO',
      now,
      now
    );

    const createdRow = db.prepare('SELECT * FROM blogs WHERE id = ?').get(id);

    return res.status(201).json({
      success: true,
      message: 'Blog article successfully created!',
      blog: formatBlog(createdRow),
    });
  } catch (err) {
    console.error('[API] Error creating blog:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to create blog article. ' + (err.message || ''),
    });
  }
});

/**
 * PUT /api/admin/blogs/:id
 * Protected: Update existing blog
 */
router.put('/admin/blogs/:id', authenticateAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM blogs WHERE id = ?').get(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Blog article not found for update.',
      });
    }

    const {
      title,
      slug: customSlug,
      subtitle = existing.subtitle,
      excerpt = existing.excerpt,
      category = existing.category,
      authorName = existing.authorName,
      authorRole = existing.authorRole,
      authorAvatar = existing.authorAvatar,
      image = existing.image,
      content = existing.content,
      externalLinks = [],
      tags = [],
      status = existing.status,
      featured = existing.featured,
      readTime = existing.readTime,
    } = req.body || {};

    const cleanTitle = title && title.trim() ? title.trim() : existing.title;
    const cleanContent = content && content.trim() ? content.trim() : existing.content;

    // Slug update if provided
    let finalSlug = existing.slug;
    if (customSlug && customSlug.trim() && customSlug.trim() !== existing.slug) {
      const candidateSlug = slugify(customSlug);
      const conflict = db.prepare('SELECT id FROM blogs WHERE slug = ? AND id != ?').get(candidateSlug, id);
      if (!conflict) {
        finalSlug = candidateSlug;
      }
    }

    const cleanExternalLinks = Array.isArray(externalLinks)
      ? externalLinks
          .filter((l) => l && (l.url || l.title))
          .map((l) => ({
            title: (l.title || l.url || '').trim(),
            url: (l.url || '').trim(),
          }))
      : safeParseJson(existing.externalLinks, []);

    const cleanTags = Array.isArray(tags)
      ? tags.map((t) => t.toString().trim()).filter(Boolean)
      : typeof tags === 'string'
        ? tags.split(',').map((t) => t.trim()).filter(Boolean)
        : safeParseJson(existing.tags, []);

    const now = new Date().toISOString();
    const finalReadTime = readTime && readTime.trim() ? readTime.trim() : calculateReadTime(cleanContent);

    const update = db.prepare(`
      UPDATE blogs SET
        slug = ?,
        title = ?,
        subtitle = ?,
        excerpt = ?,
        category = ?,
        authorName = ?,
        authorRole = ?,
        authorAvatar = ?,
        image = ?,
        readTime = ?,
        content = ?,
        externalLinks = ?,
        tags = ?,
        status = ?,
        featured = ?,
        updatedBy = 'CEO',
        updatedAt = ?
      WHERE id = ?
    `);

    update.run(
      finalSlug,
      cleanTitle,
      subtitle ? subtitle.trim() : '',
      excerpt ? excerpt.trim() : existing.excerpt,
      category ? category.trim() : 'Technology',
      authorName ? authorName.trim() : 'CEO',
      authorRole ? authorRole.trim() : 'Founder & CEO, Durgam Soft',
      authorAvatar ? authorAvatar.trim() : existing.authorAvatar,
      image !== undefined ? image : existing.image,
      finalReadTime,
      cleanContent,
      JSON.stringify(cleanExternalLinks),
      JSON.stringify(cleanTags),
      status || 'published',
      featured ? 1 : 0,
      now,
      id
    );

    const updatedRow = db.prepare('SELECT * FROM blogs WHERE id = ?').get(id);

    return res.json({
      success: true,
      message: 'Blog article successfully updated!',
      blog: formatBlog(updatedRow),
    });
  } catch (err) {
    console.error('[API] Error updating blog:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update blog article.',
    });
  }
});

/**
 * PATCH /api/admin/blogs/:id/status
 * Protected: Quick status toggle (published, draft, archived)
 */
router.patch('/admin/blogs/:id/status', authenticateAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body || {};

    if (!status || !['published', 'draft', 'archived'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be 'published', 'draft', or 'archived'.",
      });
    }

    const now = new Date().toISOString();
    const result = db
      .prepare("UPDATE blogs SET status = ?, updatedAt = ?, updatedBy = 'CEO' WHERE id = ?")
      .run(status, now, id);

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: 'Blog article not found.',
      });
    }

    return res.json({
      success: true,
      message: `Blog status updated to ${status}.`,
      status,
    });
  } catch (err) {
    console.error('[API] Error updating blog status:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update blog status.',
    });
  }
});

/**
 * DELETE /api/admin/blogs/:id
 * Protected: Delete a blog article
 */
router.delete('/admin/blogs/:id', authenticateAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const result = db.prepare('DELETE FROM blogs WHERE id = ?').run(id);

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: 'Blog article not found for deletion.',
      });
    }

    return res.json({
      success: true,
      message: 'Blog article successfully deleted.',
    });
  } catch (err) {
    console.error('[API] Error deleting blog:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete blog article.',
    });
  }
});

export default router;
