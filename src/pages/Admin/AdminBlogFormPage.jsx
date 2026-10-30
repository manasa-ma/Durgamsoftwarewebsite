import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Upload,
  Image as ImageIcon,
  ExternalLink,
  Eye,
  FileText,
  Sparkles,
  Link2,
  Globe,
  Clock,
  X,
  BookOpen,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

const CATEGORIES = [
  'Technology',
  'Software Development',
  'Business',
  'Digital Solutions',
  'Retail POS',
  'Billing Hardware',
  'Enterprise Solutions',
];

export const AdminBlogFormPage = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { getAuthHeaders } = useAdminAuth();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    subtitle: '',
    category: 'Technology',
    authorName: 'CEO',
    authorRole: 'Founder & CEO, Durgam Soft',
    image: '',
    excerpt: '',
    content: '',
    readTime: '5 min read',
    tags: 'Business, Technology, Software',
    status: 'published',
    externalLinks: [
      { title: '', url: '' },
    ],
  });

  const [imageInputMode, setImageInputMode] = useState('upload'); // 'upload' | 'url'
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successBlog, setSuccessBlog] = useState(null);

  // If editing, load existing blog details
  useEffect(() => {
    if (!isEditing) return;

    const fetchBlog = async () => {
      setLoading(true);
      setErrorMessage('');
      try {
        const res = await fetch(`/api/admin/blogs/${id}`, {
          headers: getAuthHeaders(),
        });
        const data = await res.json();
        if (res.ok && data.success && data.blog) {
          const b = data.blog;
          setFormData({
            title: b.title || '',
            slug: b.slug || '',
            subtitle: b.subtitle || '',
            category: b.category || 'Technology',
            authorName: b.authorName || b.author?.name || 'CEO',
            authorRole: b.authorRole || b.author?.role || 'Founder & CEO, Durgam Soft',
            image: b.image || '',
            excerpt: b.excerpt || '',
            content: b.content || '',
            readTime: b.readTime || '5 min read',
            tags: Array.isArray(b.tags) ? b.tags.join(', ') : b.tags || '',
            status: b.status || 'published',
            externalLinks:
              Array.isArray(b.externalLinks) && b.externalLinks.length > 0
                ? b.externalLinks
                : [{ title: '', url: '' }],
          });
          if (b.image) {
            if (b.image.startsWith('data:')) {
              setImageInputMode('upload');
            } else {
              setImageInputMode('url');
              setCustomImageUrl(b.image);
            }
          }
        } else {
          setErrorMessage(data.message || 'Blog not found.');
        }
      } catch {
        setErrorMessage('Failed to connect to backend server.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, isEditing]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Image Upload handler (converts file to base64 Data URL)
  const handleImageFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, WebP, SVG).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      alert('Image file is larger than 8MB. Please choose a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (typeof dataUrl === 'string') {
        setImageError(false);
        handleChange('image', dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  // External Links helpers
  const handleExternalLinkChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.externalLinks];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, externalLinks: updated };
    });
  };

  const addExternalLink = () => {
    setFormData((prev) => ({
      ...prev,
      externalLinks: [...prev.externalLinks, { title: '', url: '' }],
    }));
  };

  const removeExternalLink = (index) => {
    setFormData((prev) => {
      const updated = prev.externalLinks.filter((_, i) => i !== index);
      return {
        ...prev,
        externalLinks: updated.length > 0 ? updated : [{ title: '', url: '' }],
      };
    });
  };

  // Form Submit
  const handleSubmit = async (overrideStatus) => {
    setErrorMessage('');
    setSuccessBlog(null);

    if (!formData.title.trim()) {
      setErrorMessage('Please enter an article title.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!formData.content.trim()) {
      setErrorMessage('Please enter the article content / text.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const effectiveStatus = overrideStatus || formData.status || 'published';

    // Filter valid external links
    const filteredLinks = formData.externalLinks
      .map((l) => ({
        title: (l.title || '').trim(),
        url: (l.url || '').trim(),
      }))
      .filter((l) => l.title || l.url)
      .map((l) => {
        let cleanUrl = l.url;
        if (cleanUrl && !cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://') && !cleanUrl.startsWith('/')) {
          cleanUrl = `https://${cleanUrl}`;
        }
        return {
          title: l.title || l.url,
          url: cleanUrl,
        };
      });

    const payload = {
      title: formData.title.trim(),
      slug: formData.slug.trim(),
      subtitle: formData.subtitle.trim(),
      category: formData.category,
      authorName: formData.authorName.trim() || 'CEO',
      authorRole: formData.authorRole.trim() || 'Founder & CEO, Durgam Soft',
      image: formData.image || '',
      excerpt: formData.excerpt.trim() || formData.content.trim().slice(0, 180) + '...',
      content: formData.content.trim(),
      readTime: formData.readTime.trim() || '5 min read',
      tags: formData.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      externalLinks: filteredLinks,
      status: effectiveStatus,
    };

    setSubmitting(true);
    try {
      const url = isEditing ? `/api/admin/blogs/${id}` : '/api/admin/blogs';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessBlog(data.blog);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setErrorMessage(data.message || 'Failed to save blog article.');
      }
    } catch {
      setErrorMessage('Failed to connect to backend server. Please verify the server is running.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-orange-500/20 border-t-[#F97316] animate-spin" />
        <p className="text-sm text-slate-500">Loading blog details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Top Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <Link
            to="/admin/blogs"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#C74E23] transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Blogs Management</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <BookOpen className="w-7 h-7 text-[#C74E23]" />
            <span>{isEditing ? 'Edit Blog Article' : 'Add Blog Article'}</span>
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Publish articles, technology guides, or company announcements with images, text, and external references.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => handleSubmit('draft')}
            disabled={submitting}
            className="px-4 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-slate-700 text-xs sm:text-sm font-semibold transition-all shadow-2xs disabled:opacity-60"
          >
            Save as Draft
          </button>
          <button
            type="button"
            onClick={() => handleSubmit('published')}
            disabled={submitting}
            className="px-5 py-2.5 rounded-xl bg-[#C74E23] hover:bg-[#B83E15] text-white text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center gap-2 disabled:opacity-60"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{submitting ? 'Publishing...' : isEditing ? 'Update Article' : 'Publish Blog'}</span>
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successBlog && (
        <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 shadow-sm space-y-3">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <h3 className="text-base font-bold text-emerald-950">
                {isEditing ? 'Blog Updated Successfully!' : 'Blog Published Successfully!'}
              </h3>
              <p className="text-xs sm:text-sm text-emerald-800">
                &ldquo;{successBlog.title}&rdquo; is now saved in the system with status:{' '}
                <span className="font-semibold uppercase tracking-wider">{successBlog.status}</span>.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-emerald-200/60">
            <Link
              to={`/resources/blog/${successBlog.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-2xs"
            >
              <span>View Article Live</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/admin/blogs"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white border border-emerald-300 text-emerald-900 hover:bg-emerald-100/50 text-xs font-semibold transition-colors"
            >
              <span>Back to Blogs List</span>
            </Link>
            {!isEditing && (
              <button
                type="button"
                onClick={() => {
                  setSuccessBlog(null);
                  setFormData({
                    title: '',
                    slug: '',
                    subtitle: '',
                    category: 'Technology',
                    authorName: 'CEO',
                    authorRole: 'Founder & CEO, Durgam Soft',
                    image: '',
                    excerpt: '',
                    content: '',
                    readTime: '5 min read',
                    tags: 'Business, Technology, Software',
                    status: 'published',
                    externalLinks: [{ title: '', url: '' }],
                  });
                }}
                className="text-xs text-emerald-800 hover:text-emerald-950 underline font-medium"
              >
                + Add Another Blog
              </button>
            )}
          </div>
        </div>
      )}

      {/* Error Message Alert */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">Unable to Save Blog</p>
            <p className="text-xs text-red-800 mt-0.5">{errorMessage}</p>
          </div>
          <button onClick={() => setErrorMessage('')} className="text-red-400 hover:text-red-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="space-y-8"
      >
        {/* ============================================================== */}
        {/* 1. Article Core Information (Text)                             */}
        {/* ============================================================== */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-stone-100">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#C74E23] flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">Article Text &amp; Details</h2>
              <p className="text-xs text-slate-500">Provide the title, category, and main written content.</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Article Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="e.g. 5 Reasons Why Barcode POS Systems Speed Up Supermarket Checkout"
                className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-[#C74E23] focus:ring-2 focus:ring-[#C74E23]/20 outline-none text-slate-900 text-sm sm:text-base font-semibold placeholder:text-slate-400 transition-all"
              />
            </div>

            {/* Subtitle / Catchphrase */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Subtitle / Lead Line (Optional)
              </label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                placeholder="e.g. Practical insights from deploying Billmaster across 500+ Indian retail counters"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-[#C74E23] focus:ring-2 focus:ring-[#C74E23]/20 outline-none text-slate-800 text-xs sm:text-sm placeholder:text-slate-400 transition-all"
              />
            </div>

            {/* Category & Status & Read Time Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-[#C74E23] focus:ring-2 focus:ring-[#C74E23]/20 outline-none text-slate-800 text-xs sm:text-sm font-medium bg-white"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Publish Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-[#C74E23] focus:ring-2 focus:ring-[#C74E23]/20 outline-none text-slate-800 text-xs sm:text-sm font-medium bg-white"
                >
                  <option value="published">Published (Visible Live)</option>
                  <option value="draft">Draft (Hidden)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Estimated Read Time
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.readTime}
                    onChange={(e) => handleChange('readTime', e.target.value)}
                    placeholder="e.g. 5 min read"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-[#C74E23] focus:ring-2 focus:ring-[#C74E23]/20 outline-none text-slate-800 text-xs sm:text-sm"
                  />
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>
            </div>

            {/* Short Excerpt */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Brief Excerpt / Summary (Appears on cards &amp; previews)
              </label>
              <textarea
                rows={2}
                value={formData.excerpt}
                onChange={(e) => handleChange('excerpt', e.target.value)}
                placeholder="A concise 1-2 sentence preview introducing the article..."
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-[#C74E23] focus:ring-2 focus:ring-[#C74E23]/20 outline-none text-slate-800 text-xs sm:text-sm placeholder:text-slate-400 transition-all resize-y"
              />
            </div>

            {/* Main Content (Spacious & Simple) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Article Body Text <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400 font-medium">
                  Tip: Press Enter twice between paragraphs
                </span>
              </div>
              <textarea
                rows={12}
                required
                value={formData.content}
                onChange={(e) => handleChange('content', e.target.value)}
                placeholder={`Write your article or editorial here. 

You can write normal paragraphs naturally. When visitors read the article, double newlines will be rendered as clean, formatted paragraphs.

Feel free to write as much as needed to explain your topic thoroughly.`}
                className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-[#C74E23] focus:ring-2 focus:ring-[#C74E23]/20 outline-none text-slate-900 text-sm leading-relaxed placeholder:text-slate-400 font-normal transition-all"
              />
            </div>

            {/* Author & Tags */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Author Name
                </label>
                <input
                  type="text"
                  value={formData.authorName}
                  onChange={(e) => handleChange('authorName', e.target.value)}
                  placeholder="e.g. CEO or Durgam Venu Gopal"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-[#C74E23] focus:ring-2 focus:ring-[#C74E23]/20 outline-none text-slate-800 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => handleChange('tags', e.target.value)}
                  placeholder="e.g. Retail POS, Billmaster, Business Growth"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-[#C74E23] focus:ring-2 focus:ring-[#C74E23]/20 outline-none text-slate-800 text-xs sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 2. Featured Image Section (Image Upload or URL)               */}
        {/* ============================================================== */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-stone-100">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#C74E23] flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">Featured Article Image</h2>
              <p className="text-xs text-slate-500">Upload an image file from your computer or enter an external image link.</p>
            </div>
          </div>

          {/* Mode Selector Tabs (Upload vs URL) */}
          <div className="flex items-center gap-2 bg-stone-100 p-1.5 rounded-xl max-w-xs">
            <button
              type="button"
              onClick={() => setImageInputMode('upload')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                imageInputMode === 'upload'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Upload Image File
            </button>
            <button
              type="button"
              onClick={() => setImageInputMode('url')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                imageInputMode === 'url'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Image URL / Path
            </button>
          </div>

          {/* File Upload Mode */}
          {imageInputMode === 'upload' && (
            <div className="border-2 border-dashed border-stone-300 hover:border-[#C74E23] rounded-2xl p-6 text-center transition-colors bg-[#FAF7F2]/40">
              <Upload className="w-8 h-8 text-[#C74E23] mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-800 mb-1">Click to select an image from your device</p>
              <p className="text-xs text-slate-500 mb-4">Supports PNG, JPG, WebP, or SVG up to 8MB</p>
              <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#C74E23] text-xs font-bold cursor-pointer transition-colors border border-orange-200">
                <span>Choose Image File</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {/* Direct URL Mode */}
          {imageInputMode === 'url' && (
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Image Web Link or Path
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customImageUrl}
                  onChange={(e) => {
                    setCustomImageUrl(e.target.value);
                    setImageError(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (customImageUrl.trim()) {
                        setImageError(false);
                        handleChange('image', customImageUrl.trim());
                      }
                    }
                  }}
                  placeholder="e.g. https://images.unsplash.com/photo-... or /images/blog/blog-pos-checkout.webp"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-stone-300 focus:border-[#C74E23] outline-none text-xs sm:text-sm bg-white"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customImageUrl.trim()) {
                      setImageError(false);
                      handleChange('image', customImageUrl.trim());
                    }
                  }}
                  className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors shrink-0"
                >
                  Load Image
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Type or paste the full image link, then click &quot;Load Image&quot; to preview.
              </p>
            </div>
          )}

          {/* Live Image Preview Card */}
          {formData.image ? (
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs flex flex-col sm:flex-row items-center gap-4">
              <div className="w-full sm:w-48 h-32 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 relative shrink-0 flex items-center justify-center">
                {imageError ? (
                  <div className="flex flex-col items-center justify-center p-3 text-center text-xs text-stone-500 space-y-1">
                    <AlertCircle className="w-6 h-6 text-amber-500" />
                    <span className="font-semibold text-stone-700">Image Load Failed</span>
                    <span className="text-[10px] text-stone-400">Check URL link</span>
                  </div>
                ) : (
                  <img
                    src={formData.image}
                    alt="Article banner preview"
                    className="w-full h-full object-cover"
                    onError={() => {
                      setImageError(true);
                    }}
                  />
                )}
              </div>

              <div className="flex-1 text-center sm:text-left space-y-1.5 w-full min-w-0">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <span
                    className={`inline-block w-2.5 h-2.5 rounded-full ${
                      imageError ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                  />
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    {imageError ? 'Image Link Needs Check' : 'Active Image Selected'}
                  </span>
                </div>

                <p className="text-xs text-slate-500 font-mono break-all line-clamp-2">
                  {formData.image.startsWith('data:')
                    ? 'Uploaded file from device (ready to save)'
                    : formData.image}
                </p>

                <div className="pt-1 flex items-center gap-3 justify-center sm:justify-start">
                  <button
                    type="button"
                    onClick={() => {
                      handleChange('image', '');
                      setCustomImageUrl('');
                      setImageError(false);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 font-bold px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove Image</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-stone-50 border border-dashed border-stone-200 text-center text-xs text-slate-500">
              No image currently selected. Choose an image file from your device or enter a web link above.
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* 3. External Links Section (Explicit User Requirement)         */}
        {/* ============================================================== */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100 flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#C74E23] flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span>External Links &amp; References</span>
                  <ExternalLink className="w-4 h-4 text-[#C74E23]" />
                </h2>
                <p className="text-xs text-slate-500">
                  Add helpful external websites, documentation links, or resource URLs for readers.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={addExternalLink}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#C74E23] text-xs font-bold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Another Link</span>
            </button>
          </div>

          <div className="space-y-3">
            {formData.externalLinks.map((link, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3.5 rounded-xl bg-[#FAF7F2] border border-stone-200/80"
              >
                <div className="flex-1 space-y-1">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase">
                    Link Title / Label
                  </label>
                  <input
                    type="text"
                    value={link.title}
                    onChange={(e) => handleExternalLinkChange(index, 'title', e.target.value)}
                    placeholder="e.g. Official GST Portal or Billmaster Documentation"
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:border-[#C74E23] outline-none text-xs sm:text-sm bg-white"
                  />
                </div>

                <div className="flex-1 space-y-1">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase">
                    Destination Web URL
                  </label>
                  <input
                    type="text"
                    value={link.url}
                    onChange={(e) => handleExternalLinkChange(index, 'url', e.target.value)}
                    placeholder="e.g. https://www.gst.gov.in"
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:border-[#C74E23] outline-none text-xs sm:text-sm bg-white"
                  />
                </div>

                <div className="sm:pt-5 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => removeExternalLink(index)}
                    title="Remove Link"
                    className="p-2 text-stone-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-500 italic">
            * Readers will see an interactive "External References &amp; Helpful Links" section on the published blog page.
          </p>
        </div>

        {/* ============================================================== */}
        {/* Bottom Submission & Action Bar                                */}
        {/* ============================================================== */}
        <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 text-center sm:text-left">
            <span>Articles are saved to your SQLite database and are instantly accessible at </span>
            <span className="font-mono font-semibold text-slate-700">/resources/blog</span>.
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <Link
              to="/admin/blogs"
              className="px-4 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-slate-700 text-xs sm:text-sm font-semibold transition-all"
            >
              Cancel
            </Link>
            <button
              type="button"
              onClick={() => handleSubmit('draft')}
              disabled={submitting}
              className="px-4 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-slate-700 text-xs sm:text-sm font-semibold transition-all disabled:opacity-60"
            >
              Save Draft
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-[#C74E23] hover:bg-[#B83E15] text-white text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center gap-2 disabled:opacity-60"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{submitting ? 'Saving...' : isEditing ? 'Update Article' : 'Publish Blog'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminBlogFormPage;
