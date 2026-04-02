import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import AnimatedSection from '@/components/AnimatedSection';
import { getSortedPostsData, getPostData } from '@/lib/blog';
import { Post } from '@/lib/blog';

interface PostPageProps {
  post: Post;
  relatedPosts: Post[];
}

export default function PostPage({ post, relatedPosts }: PostPageProps) {
  return (
    <>
      <Head>
        <title>{post.title} - Undiscovered World</title>
        <meta name="description" content={post.description} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.description} />
        <meta property="og:image" content={post.featuredImage} />
        <meta name="author" content={post.author} />
      </Head>

      {/* Featured Image */}
      <section className="relative h-96 bg-gray-700 overflow-hidden">
        <motion.img
          src={post.featuredImage}
          alt={post.title}
          className="w-full h-full object-cover"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary to-transparent" />
      </section>

      {/* Article Content */}
      <section className="py-12 bg-primary">
        <div className="max-w-4xl mx-auto px-4">
          <AnimatedSection>
            {/* Metadata */}
            <div className="flex flex-wrap gap-4 items-center mb-6 text-gray-400 text-sm">
              <span>By {post.author}</span>
              <span>•</span>
              <span>{post.date}</span>
              <span>•</span>
              <span className="bg-highlight bg-opacity-20 text-highlight px-3 py-1 rounded">
                {post.category}
              </span>
            </div>

            {/* Title */}
            <motion.h1
              className="text-5xl font-bold text-light mb-8 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {post.title}
            </motion.h1>

            {/* Article Body */}
            <motion.div
              className="prose prose-invert max-w-none mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div
                dangerouslySetInnerHTML={{ __html: post.content }}
                className="text-gray-300 leading-relaxed"
              />
            </motion.div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <AnimatedSection className="py-6 border-t border-b border-gray-700">
                <div className="flex flex-wrap gap-3">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-secondary px-4 py-2 rounded-full text-sm text-highlight border border-gray-600"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </AnimatedSection>
            )}

            {/* Back Button */}
            <AnimatedSection className="mt-12">
              <Link
                href="/blog"
                className="inline-block px-6 py-3 bg-secondary border border-highlight text-highlight rounded hover:bg-highlight hover:text-primary transition"
              >
                ← Back to Blog
              </Link>
            </AnimatedSection>
          </AnimatedSection>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-secondary">
          <div className="max-w-7xl mx-auto px-4">
            <AnimatedSection className="text-center mb-12">
              <h2 className="text-4xl font-bold text-light">
                Related <span className="text-highlight">Stories</span>
              </h2>
            </AnimatedSection>

            <div className="grid md:grid-cols-3 gap-8">
              {relatedPosts.slice(0, 3).map((relatedPost, index) => (
                <AnimatedSection key={relatedPost.id} delay={index * 0.1}>
                  <Link href={`/blog/${relatedPost.id}`}> 
                    <motion.div
                      className="bg-primary p-6 rounded-lg border border-gray-700 hover:border-highlight transition cursor-pointer"
                      whileHover={{ y: -5 }}
                    >
                      <h3 className="text-xl font-bold text-light mb-2 hover:text-highlight transition">
                        {relatedPost.title}
                      </h3>
                      <p className="text-gray-400 text-sm">{relatedPost.description}</p>
                    </motion.div>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export async function getStaticPaths() {
  const posts = await getSortedPostsData();

  return {
    paths: posts.map((post) => ({
      params: { id: post.id },
    })),
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  const post = await getPostData(params.id);
  const allPosts = await getSortedPostsData();
  const relatedPosts = allPosts.filter((p) => p.category === post.category && p.id !== post.id);

  return {
    props: {
      post,
      relatedPosts,
    },
    revalidate: 3600,
  };
}