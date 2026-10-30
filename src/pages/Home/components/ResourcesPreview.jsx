import React from 'react';
import { ArrowRight } from 'lucide-react';
import { SectionHeader } from '../../../components/common/SectionHeader';
import { BlogGrid } from '../../../components/resources/BlogGrid';
import { Button } from '../../../components/buttons/Button';
import { BLOG_POSTS } from '../../../data/resources';
export const ResourcesPreview = () => {
  return (
    <section className="bg-white py-16 md:py-24 border-b border-brand-border">
      <div className="container-custom">
        <SectionHeader
          badge="Knowledge Base"
          title="Resources — Latest from Our Blog"
          subtitle="Explore product guides, industry analysis, and technology updates published by our team."
        />

        <div className="mb-12">
          <BlogGrid posts={BLOG_POSTS} />
        </div>

        <div className="text-center">
          <Button variant="secondary" size="lg" to="/resources/blog" className="gap-2">
            <span>Read Our Blog</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};
