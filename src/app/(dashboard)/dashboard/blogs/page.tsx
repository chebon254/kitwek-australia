import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

export default async function BlogsPage() {

  const blogs = await prisma.blog.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Blogs/New</h1>
        <div></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div key={blog.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="relative h-48">
              <Image
                src={blog.thumbnail}
                alt={blog.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
              <p className="text-gray-600 line-clamp-2">{blog.description}</p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </span>
                <Link
                  href={`dashboard/blogs/${blog.id}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}