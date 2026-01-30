import { prisma } from "@/lib/prisma";
import Footer from "@/components/Footer/Footer";
import BlogsClient from "./BlogsClient";

export const revalidate = 300; // Revalidate every 5 minutes

interface Blog {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  blogTag: string;
  createdAt: Date;
}

async function getBlogs(): Promise<Blog[]> {
  try {
    const blogs = await prisma.blog.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        thumbnail: true,
        blogTag: true,
        createdAt: true,
      },
    });
    return blogs;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
}

export default async function Blogs() {
  const posts = await getBlogs();

  return (
    <>
      <main className="flex-1 mt-24">
        <div className="py-6">
          <BlogsClient posts={posts} />
        </div>
      </main>
      <Footer />
    </>
  );
}
