import { useEffect, useState } from "react";
import { fetchFeed } from "@/lib/api";
import FeedCard from "@/components/FeedCard";
import GemmiChat from "@/components/Gemmichat";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const res = await fetchFeed();
        setPosts(res.data);
      } catch (err) {
        console.error("Feed failed:", err);
      } finally {
        setLoading(false);
      }
    };
    getPosts();
  }, []);

  if (loading) return (
    <div className="flex h-[80vh] items-center justify-center">
      <div className="animate-pulse text-pink-hot font-bold text-xl italic">
        Diving into the Ocean...
      </div>
    </div>
  );

  return (
    // We removed 'main' and 'pt-8' because App.tsx handles the main wrapper
    <div className="container mx-auto px-4 pb-20"> 
      
      {/* 1. Page Header (Optional but looks great) */}
      <header className="mb-10">
        <h1 className="text-3xl font-black italic text-white">Trending Waves</h1>
        <p className="text-white/40 text-sm">Discover what the Pink Ocean is creating today.</p>
      </header>

      {/* 2. Masonry-style Grid Layout */}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
        {posts.map((post: any) => (
          <div key={post.id} className="break-inside-avoid">
            <FeedCard post={post} />
          </div>
        ))}
      </div>
      
      {/* 3. Floating AI Assistant */}
      <GemmiChat />
    </div>
  );
}