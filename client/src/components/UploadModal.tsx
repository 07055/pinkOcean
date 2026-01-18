import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Video, 
  Palette, 
  ArrowLeft, 
  Image as ImageIcon, 
  X, 
  Sparkles, 
  PenTool 
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import api, { uploadMedia } from "@/lib/api";
import PosterDesigner from "./PosterDesigner";

type UploadMode = "menu" | "story" | "designer";

export default function UploadModal() {
  const [mode, setMode] = useState<UploadMode>("menu");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Story State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mediaFiles, setMediaFiles] = useState<{ file: File; preview: string; type: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetAll = () => {
    setMode("menu");
    setTitle("");
    setContent("");
    setMediaFiles([]);
    setLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newMedia = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith("video") ? "video" : "image",
    }));
    setMediaFiles([...mediaFiles, ...newMedia]);
  };

  const handleStorySubmit = async () => {
    setLoading(true);
    try {
      const uploadedUrls: string[] = [];
      
      // Upload media files one by one
      for (const item of mediaFiles) {
        const formData = new FormData();
        formData.append("file", item.file);
        const res = await uploadMedia(formData);
        uploadedUrls.push(res.data.url);
      }

      // POST to backend with required synopsis field
      await api.post("/sources", {
        title: title || "Untitled Wave",
        content,
        // BUG FIX: Generate synopsis to satisfy Prisma schema
        synopsis: content ? content.substring(0, 100) : "Media post",
        media: uploadedUrls,
        isDesign: false
      });

      setIsOpen(false);
      resetAll();
      window.location.reload();
    } catch (err) {
      // Professional debugging: See the error in F12 console
      console.error("Upload error details:", err);
      alert("Failed to share story. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) resetAll();
    }}>
      <DialogTrigger asChild>
        <Button className="bg-pink-hot hover:bg-pink-hot/90 text-white font-bold rounded-full px-6 shadow-[0_0_20px_rgba(255,0,127,0.3)]">
          Create
        </Button>
      </DialogTrigger>

      <DialogContent className={
        mode === "designer" ? "sm:max-w-[95vw] h-[90vh] bg-ocean-deep border-white/10 p-0 overflow-hidden" :
        mode === "story" ? "sm:max-w-[600px] bg-ocean-deep border-white/10 text-white" :
        "sm:max-w-[425px] bg-ocean-deep border-white/10 text-white"
      }>
        
        <DialogHeader className="p-6 flex-row items-center gap-4 space-y-0 border-b border-white/5">
          {mode !== "menu" && (
            <Button variant="ghost" size="icon" onClick={() => setMode("menu")} className="text-white/50 hover:text-white">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <DialogTitle className="text-xl font-black italic flex items-center gap-2">
            {mode === "menu" && "Start Creating"}
            {mode === "story" && <><PenTool className="text-cyan-400 h-5 w-5" /> Share a Story</>}
            {mode === "designer" && <><Sparkles className="text-pink-hot h-5 w-5" /> Gemmi Designer</>}
          </DialogTitle>
        </DialogHeader>

        {/* MODE 1: MENU */}
        {mode === "menu" && (
          <div className="grid grid-cols-2 gap-4 p-8">
            <button 
              onClick={() => setMode("story")}
              className="flex flex-col items-center justify-center p-8 rounded-2xl border border-white/5 bg-white/5 hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-all group"
            >
              <PenTool className="h-12 w-12 mb-3 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="font-bold">Write Story</span>
              <p className="text-[10px] text-white/40 mt-1 uppercase tracking-widest">Feed Style</p>
            </button>

            <button 
              onClick={() => setMode("designer")}
              className="flex flex-col items-center justify-center p-8 rounded-2xl border border-white/5 bg-white/5 hover:bg-pink-500/10 hover:border-pink-500/30 transition-all group"
            >
              <Palette className="h-12 w-12 mb-3 text-pink-hot group-hover:scale-110 transition-transform" />
              <span className="font-bold">Design Poster</span>
              <p className="text-[10px] text-white/40 mt-1 uppercase tracking-widest">Canvas Mode</p>
            </button>
          </div>
        )}

        {/* MODE 2: STORY COMPOSER */}
        {mode === "story" && (
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <Input 
              placeholder="Title of your wave..." 
              className="bg-white/5 border-white/10 text-lg font-bold"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Textarea 
              placeholder="What's on your mind?" 
              className="min-h-[120px] bg-transparent border-none text-base resize-none focus-visible:ring-0 p-0"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            
            {/* Media Preview */}
            <div className="grid grid-cols-2 gap-2">
              {mediaFiles.map((file, i) => (
                <div key={i} className="relative aspect-video rounded-lg overflow-hidden border border-white/10">
                   {file.type === "video" ? (
                    <video src={file.preview} className="w-full h-full object-cover" />
                  ) : (
                    <img src={file.preview} className="w-full h-full object-cover" />
                  )}
                  <Button 
                    size="icon" 
                    type="button"
                    className="absolute top-1 right-1 h-6 w-6 bg-black/60 hover:bg-pink-hot"
                    onClick={() => {
                      const updated = [...mediaFiles];
                      updated.splice(i, 1);
                      setMediaFiles(updated);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4">
              <div className="flex gap-2">
                <input type="file" hidden ref={fileInputRef} multiple accept="image/*,video/*" onChange={handleFileChange} />
                <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} className="text-cyan-400">
                  <ImageIcon className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} className="text-pink-hot">
                  <Video className="h-5 w-5" />
                </Button>
              </div>
              <Button 
                onClick={handleStorySubmit} 
                disabled={loading || (!content && mediaFiles.length === 0)}
                className="bg-pink-hot rounded-full px-8"
              >
                {loading ? "Posting..." : "Share to Feed"}
              </Button>
            </div>
          </div>
        )}

        {/* MODE 3: POSTER DESIGNER */}
        {mode === "designer" && (
          <div className="flex-1 h-full overflow-hidden bg-[#0a0a0c]">
            <PosterDesigner />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}