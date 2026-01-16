import { Heart, MessageCircle, Bookmark, Share2, Sparkles, Repeat2 } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toggleLike, repostSource } from "@/lib/api"; // Import your API functions

interface FeedCardProps {
  post: any;
}

export default function FeedCard({ post }: FeedCardProps) {
  
  // 1. Define the handleRepost function
  const handleRepost = async () => {
    try {
      await repostSource(post.id);
      alert("Recycled to your profile!");
    } catch (err) {
      console.error("Repost failed", err);
    }
  };

  // 2. Define the handleLike function (Bonus - for the Like button)
  const handleLike = async () => {
    try {
      await toggleLike(post.id);
    } catch (err) {
      console.error("Like failed", err);
    }
  };

  return (
    <Card className="overflow-hidden border-white/10 bg-card/40 backdrop-blur-sm group transition-all hover:border-pink-hot/30">
      
      {/* Repost Label at the very top */}
      {post.isRepost && (
        <div className="px-4 pt-3 flex items-center gap-2 text-xs text-white/40 italic border-b border-white/5 pb-1">
          <Repeat2 className="h-3 w-3 text-green-400" />
          <span>Reposted by @{post.reposterName}</span>
        </div>
      )}

      {/* 1. Author Header */}
      <CardHeader className="p-4 flex-row items-center gap-3 space-y-0">
        <Avatar className="h-8 w-8 border border-white/10">
          <AvatarImage src={post.author.profilePic} />
          <AvatarFallback>{post.author.username?.[0] || "P"}</AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium hover:text-pink-hot cursor-pointer">
          @{post.author.username}
        </span>
      </CardHeader>

      {/* 2. Content Area */}
      <div className="relative aspect-auto min-h-[300px] bg-black/20">
        {post.media[0]?.includes("video") ? (
          <video src={post.media[0]} className="w-full h-full object-cover" controls={false} loop muted autoPlay />
        ) : (
          <img src={post.media[0]} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        )}
        
        <Button 
          size="sm" 
          className="absolute bottom-4 right-4 bg-purple-600/80 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Sparkles className="mr-2 h-3 w-3" />
          Ask Gemmi
        </Button>
      </div>

      {/* 3. Text content */}
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg line-clamp-1">{post.title}</h3>
        <p className="text-sm text-white/60 line-clamp-2 mt-1">{post.synopsis || post.content}</p>
      </CardContent>

      {/* 4. Action Buttons */}
      <CardFooter className="p-4 pt-0 flex justify-between">
        <div className="flex gap-4">
          <button onClick={handleLike} className="flex items-center gap-1.5 text-white/70 hover:text-pink-hot transition-colors">
            <Heart className="h-5 w-5" />
            <span className="text-xs">{post._count?.likes || 0}</span>
          </button>
          
          <button className="flex items-center gap-1.5 text-white/70 hover:text-cyan-400 transition-colors">
            <MessageCircle className="h-5 w-5" />
            <span className="text-xs">{post._count?.comments || 0}</span>
          </button>
          
          <button onClick={handleRepost} className="flex items-center gap-1.5 text-white/70 hover:text-green-400 transition-colors">
            <Repeat2 className="h-5 w-5" />
            <span className="text-xs">{post._count?.shares || 0}</span>
          </button>
        </div>

        <div className="flex gap-3">
          <Bookmark className="h-5 w-5 text-white/70 hover:text-yellow-400 cursor-pointer" />
          <Share2 className="h-5 w-5 text-white/70 hover:text-cyan-400 cursor-pointer" />
        </div>
      </CardFooter>
    </Card>
  );
}