import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Search,
  PlusCircle,
  Edit,
  Trash2,
  CheckCircle,
  PowerOff,
  RefreshCw,
  AlertTriangle,
  ExternalLink,
  Clock,
  Eye,
  FileText,
  Link2,
  X,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { BLOG_ARTICLES } from '../../data/blogData';

export const AdminBlogsPage = () => {
  const { getAuthHeaders } = useAdminAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Delete modal state
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Status updating state
  const [updatingId, setUpdatingId] = useState(null);

  const statusTabs = [
    { key: 'all', label: 'All Articles' },
    { key: 'published', label: 'Published' },
    { key: 'draft', label: 'Drafts' },
  ];

  const fetchBlogs = async (silent = false, searchOverride = null, statusOverride = null) => {
    if (!silent) setLoading(true);
    setError('');
    try {
      let url = '/api/admin/blogs';
      const params = new URLSearchParams();
      const effectiveStatus = statusOverride !== null ? statusOverride : selectedStatus;
      const effectiveSearch = searchOverride !== null ? searchOverride : searchTerm;

      if (effectiveStatus !== 'all') {
        params.append('status', effectiveStatus);
      }
      if (effectiveSearch && effectiveSearch.trim()) {
        params.append('search', effectiveSearch.trim());
      }
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await fetch(url, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setBlogs(data.blogs || []);
      } else if (!silent) {
        setError(data.message || 'Failed to fetch blogs.');
      }
    } catch {
      // Clean fallback for static mode
      const staticBlogs = BLOG_ARTICLES.map((b) => ({
        ...b,
        status: 'published',
      }));
      setBlogs(staticBlogs);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [selectedStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchBlogs(false, searchTerm);
  };

  // Status toggle handler
  const handleToggleStatus = async (blog) => {
    const newStatus = blog.status === 'published' ? 'draft' : 'published';
    setUpdatingId(blog.id);

    // Optimistic UI update
    setBlogs((prev) =>
      prev.map((b) => (b.id === blog.id ? { ...b, status: newStatus } : b))
    );

    try {
      const res = await fetch(`/api/admin/blogs/${blog.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        // Rollback
        setBlogs((prev) =>
          prev.map((b) => (b.id === blog.id ? { ...b, status: blog.status } : b))
        );
        alert('Failed to update blog status on server.');
      }
    } catch {
      // Rollback
      setBlogs((prev) =>
        prev.map((b) => (b.id === blog.id ? { ...b, status: blog.status } : b))
      );
      alert('Network error while updating blog status.');
    } finally {
      setUpdatingId(null);
    }
  };

  // Delete handler
  const confirmDelete = async () => {
    if (!blogToDelete) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/blogs/${blogToDelete.id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setBlogs((prev) => prev.filter((b) => b.id !== blogToDelete.id));
        setBlogToDelete(null);
      } else {
        alert(data.message || 'Failed to delete blog.');
      }
    } catch {
      alert('Unable to connect to server to delete blog.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <BookOpen className="w-7 h-7 text-[#C74E23]" />
            <span>Blogs Management</span>
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Create, edit, and publish blog articles, tech insights, and external resource links.
          </p>
        </div>

        {/* Primary CTA */}
        <Link
          to="/admin/blogs/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#C74E23] hover:bg-[#B83E15] text-white font-bold text-sm transition-all shadow-xs shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Blogs</span>
        </Link>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl w-fit">
          {statusTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedStatus(tab.key)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedStatus === tab.key
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-md w-full">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, excerpt, or category..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-300 focus:border-[#C74E23] focus:ring-2 focus:ring-[#C74E23]/20 outline-none text-xs sm:text-sm bg-white"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors shrink-0"
          >
            Search
          </button>
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                fetchBlogs(false, '', selectedStatus);
              }}
              className="p-2 text-slate-400 hover:text-slate-600"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => fetchBlogs()} className="font-semibold underline ml-2">
            Retry
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-white border border-stone-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : blogs.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#C74E23] flex items-center justify-center mx-auto">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No Blog Articles Found</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            {searchTerm
              ? `No articles matched your search query "${searchTerm}".`
              : 'Start sharing updates, retail tech insights, and software tutorials with your audience.'}
          </p>
          <div className="pt-2">
            <Link
              to="/admin/blogs/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C74E23] hover:bg-[#B83E15] text-white text-xs sm:text-sm font-bold transition-all shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Your First Blog</span>
            </Link>
          </div>
        </div>
      ) : (
        /* Blogs List */
        <div className="space-y-3">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-white rounded-2xl border border-stone-200 hover:border-orange-300 p-4 sm:p-5 transition-all shadow-2xs hover:shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              {/* Left Details */}
              <div className="flex items-start gap-4 min-w-0 flex-1">
                {/* Thumbnail */}
                <div className="w-20 h-16 sm:w-24 sm:h-20 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0 flex items-center justify-center">
                  {blog.image ? (
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <BookOpen className="w-6 h-6 text-stone-300" />
                  )}
                </div>

                {/* Text Content */}
                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-[#C74E23] uppercase tracking-wide">
                      {blog.category}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                        blog.status === 'published'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {blog.status === 'published' ? 'Live' : 'Draft'}
                    </span>
                    {blog.readTime && (
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3" />
                        <span>{blog.readTime}</span>
                      </span>
                    )}
                    {Array.isArray(blog.externalLinks) && blog.externalLinks.length > 0 && (
                      <span className="text-[11px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md font-semibold flex items-center gap-1">
                        <Link2 className="w-3 h-3" />
                        <span>
                          {blog.externalLinks.length} link{blog.externalLinks.length > 1 ? 's' : ''}
                        </span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-1 hover:text-[#C74E23] transition-colors">
                    <Link to={`/admin/blogs/${blog.id}/edit`}>{blog.title}</Link>
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-1 max-w-2xl font-normal">
                    {blog.excerpt || blog.subtitle || 'No excerpt provided.'}
                  </p>

                  <div className="text-[11px] text-slate-400 pt-0.5">
                    Author: <span className="font-semibold text-slate-600">{blog.author?.name || 'CEO'}</span>
                    {' • '}
                    <span>
                      {blog.createdAt
                        ? new Date(blog.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : 'Recent'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0 pt-2 sm:pt-0">
                {/* View Live */}
                {blog.status === 'published' && (
                  <Link
                    to={`/resources/blog/${blog.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="View live article"
                    className="p-2 rounded-xl border border-stone-200 text-slate-600 hover:text-[#C74E23] hover:bg-orange-50 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                )}

                {/* Edit */}
                <Link
                  to={`/admin/blogs/${blog.id}/edit`}
                  title="Edit article"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 text-slate-700 hover:text-slate-900 hover:bg-stone-50 text-xs font-bold transition-colors"
                >
                  <Edit className="w-3.5 h-3.5 text-slate-500" />
                  <span>Edit</span>
                </Link>

                {/* Toggle Status */}
                <button
                  type="button"
                  onClick={() => handleToggleStatus(blog)}
                  disabled={updatingId === blog.id}
                  title={blog.status === 'published' ? 'Switch to Draft' : 'Publish Article'}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    blog.status === 'published'
                      ? 'bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-800'
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {blog.status === 'published' ? (
                    <>
                      <PowerOff className="w-3 h-3 text-stone-500" />
                      <span>Unpublish</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      <span>Publish</span>
                    </>
                  )}
                </button>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => setBlogToDelete(blog)}
                  title="Delete article"
                  className="p-2 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {blogToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">Delete Blog Article?</h3>
                <p className="text-xs text-slate-500">
                  Are you sure you want to delete &ldquo;{blogToDelete.title}&rdquo;? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setBlogToDelete(null)}
                className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-slate-700 hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors disabled:opacity-60"
              >
                {isDeleting ? 'Deleting...' : 'Delete Article'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBlogsPage;
