"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { MessageCircle, ArrowLeft, Send, Loader2 } from "lucide-react";
import Link from "next/link";
import { checkMembershipAndRedirect } from "@/utils/membershipCheck";

interface Forum {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface Comment {
  id: string;
  content: string;
  name: string;
  email: string;
  createdAt: string;
}

export default function ForumDetail() {
  const params = useParams();
  const router = useRouter();
  const [forum, setForum] = useState<Forum | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchForumAndComments = async () => {
      const canAccess = await checkMembershipAndRedirect(router);
      if (!canAccess) return;
      try {
        // Fetch forum details
        const forumResponse = await fetch(`/api/forums/${params.id}`);
        if (!forumResponse.ok) throw new Error("Failed to fetch forum");
        const forumData = await forumResponse.json();
        setForum(forumData);

        // Fetch comments
        const commentsResponse = await fetch(
          `/api/forums/${params.id}/comments`
        );
        if (!commentsResponse.ok) throw new Error("Failed to fetch comments");
        const commentsData = await commentsResponse.json();
        setComments(commentsData);
      } catch (error) {
        console.error("Error:", error);
        setError("Failed to load forum data");
      } finally {
        setLoading(false);
      }
    };

    fetchForumAndComments();
  }, [params.id]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(`/api/forums/${params.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment }),
      });

      if (!response.ok) {
        const data = await response.json();
        if (response.status === 401) {
          router.push("/sign-in");
          return;
        }
        throw new Error(data.error || "Failed to post comment");
      }

      const comment = await response.json();
      setComments((prev) => [comment, ...prev]);
      setNewComment("");
    } catch (error) {
      console.error("Error:", error);
      setError(
        error instanceof Error ? error.message : "Failed to post comment"
      );
    } finally {
      setSubmitting(false);
    }
  };

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

  if (!forum) {
    return (
      <main className="flex-1 mt-24">
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Forum not found
              </h2>
              <Link
                href={"dashboard/forums"}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Forums
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 mt-24">
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => router.back()}
            className="mb-6 inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Forums
          </button>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900">
                {forum.title}
              </h1>
              <p className="mt-2 text-gray-600">{forum.description}</p>
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <MessageCircle className="h-4 w-4 mr-1" />
                {comments.length} comments
                <span className="mx-2">•</span>
                {format(new Date(forum.createdAt), "MMM d, yyyy")}
              </div>
            </div>

            <div className="border-t border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Comments
              </h2>

              {/* Comment Form */}
              <form onSubmit={handleSubmitComment} className="mb-8">
                <div className="mb-4">
                  <label htmlFor="comment" className="sr-only">
                    Add a comment
                  </label>
                  <textarea
                    id="comment"
                    rows={3}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    disabled={submitting}
                  />
                </div>
                {error && (
                  <div className="mb-4 text-sm text-red-600">{error}</div>
                )}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting || !newComment.trim()}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                        Posting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Post Comment
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">
                        {comment.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {format(
                          new Date(comment.createdAt),
                          "MMM d, yyyy h:mm a"
                        )}
                      </span>
                    </div>
                    <p className="text-gray-600">{comment.content}</p>
                  </div>
                ))}

                {comments.length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    No comments yet. Be the first to comment!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
