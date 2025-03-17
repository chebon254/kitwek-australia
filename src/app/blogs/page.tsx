"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, ChevronRight } from "lucide-react";
import Footer from "@/components/Footer/Footer";

interface Blog {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  blogTag: string;
  createdAt: string;
}

export default function Blogs() {
  const [posts, setPosts] = useState<Blog[]>([]);
  const [activeTag, setActiveTag] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/blogs");
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <main className="flex-1 mt-24">
        <div className="py-6">
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </main>
    );
  }

  const filteredPosts =
    activeTag === "all"
      ? posts
      : posts.filter((post) => post.blogTag === activeTag);

  return (
    <>
      <main className="flex-1 mt-24">
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="md:flex md:items-center md:justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Latest Updates
                </h1>
                <p className="mt-2 text-lg text-gray-500">
                  Stay informed with our latest blogs and news
                </p>
              </div>
            </div>

            <div className="mb-8 flex space-x-4">
              <button
                onClick={() => setActiveTag("all")}
                className={`px-4 py-2 rounded-full ${
                  activeTag === "all"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTag("Blog")}
                className={`px-4 py-2 rounded-full ${
                  activeTag === "Blog"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Blogs
              </button>
              <button
                onClick={() => setActiveTag("News")}
                className={`px-4 py-2 rounded-full ${
                  activeTag === "News"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                News
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blogs/${encodeURIComponent(
                    post.title.toLowerCase().replace(/\s+/g, "-")
                  )}`}
                  className="group bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="relative h-48">
                    <Image
                      src={post.thumbnail}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          post.blogTag === "Blog"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {post.blogTag}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600">
                      {post.title}
                    </h3>

                    <p className="mt-3 text-gray-600 line-clamp-3">
                      {post.description}
                    </p>

                    <div className="mt-4 flex items-center text-gray-500">
                      <Calendar className="h-5 w-5 mr-2" />
                      {new Date(post.createdAt).toLocaleDateString()}
                    </div>

                    <div className="mt-4 flex items-center text-indigo-600 group-hover:text-indigo-500">
                      Read More
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No posts found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Check back later for updates.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
