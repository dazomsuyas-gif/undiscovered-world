import React, { useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import BlogCard from '@/components/BlogCard';
import AnimatedSection from '@/components/AnimatedSection';
import { getSortedPostsData } from '@/lib/blog';
import { Post } from '@/lib/blog';

interface BlogPageProps {
  allPosts: Post[];
}

export default function BlogPage({ allPosts }: BlogPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(allPosts.map((post) => post.category)));

  const filteredPosts = selectedCategory
    ? allPosts.filter((post) => post.category === selectedCategory)
    : allPosts;

  return (
    <>
      <Head>
        <title>Blog - Undiscovered World</title>
        <meta name="description" content="Read stories and adventures from Undiscovered World" />
      </Head>

      {/* Header */}
      <section className="py-16 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <AnimatedSection>
            <h1 className="text-5xl font-bold text-light mb-4">
              Our <span className="text-highlight">Blog</span>
            </h1>
            <p className="text-xl text-gray-300">
              Discover stories, tips, and adventures from around the world
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-primary">
        <div className="max-w-7xl mx-auto px-4">
          {/* Category Filter */}
          <AnimatedSection className="mb-12">
            <div className="flex flex-wrap gap-3 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelectedCategory(null)}
                className={`px-6 py-2 rounded-full transition ${
                  selectedCategory === null
                    ? 'bg-highlight text-primary'
                    : 'bg-secondary text-light border border-gray-600 hover:border-highlight'
                }`}
              >
                All Posts
              </motion.button>
              {categories.map((category) => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full transition ${
                    selectedCategory === category
                      ? 'bg-highlight text-primary'
                      : 'bg-secondary text-light border border-gray-600 hover:border-highlight'
                  }`}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </AnimatedSection>

          {/* Posts Grid */}
          {filteredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <AnimatedSection key={post.id} delay={index * 0.1}>
                  <BlogCard
                    id={post.id}
                    title={post.title}
                    description={post.description}
                    featuredImage={post.featuredImage}
                    date={post.date}
                    author={post.author}
                    category={post.category}
                  />
                </AnimatedSection>
              ))}
            </div>
          ) : (
            <AnimatedSection className="text-center py-12">
              <p className="text-2xl text-gray-400">No posts found in this category.</p>
            </AnimatedSection>
          )}
        </div>
      </section>
    </>
  );
}

export async function getStaticProps() {
  const allPosts = await getSortedPostsData();

  return {
    props: { allPosts },
    revalidate: 3600,
  };
}
