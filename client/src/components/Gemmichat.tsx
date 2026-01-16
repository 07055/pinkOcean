import { useState } from "react";
import { MessageSquareText, Send, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

export default function GemmiChat() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <Button 
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full shadow-lg bg-primary hover:scale-110 transition-transform"
        >
          <MessageSquareText className="h-6 w-6" />
        </Button>
      ) : (
        <Card className="w-80 h-[450px] flex flex-col border-primary/20 bg-card/90 backdrop-blur-xl animate-in slide-in-from-bottom-5">
          <div className="p-4 border-b border-white/10 flex justify-between items-center">
            <h3 className="font-bold text-primary">Ask Gemmi</h3>
            <X className="h-4 w-4 cursor-pointer hover:text-primary" onClick={() => setIsOpen(false)} />
          </div>
          
          <ScrollArea className="flex-1 p-4">
            <div className="text-sm text-white/60 bg-white/5 p-2 rounded-lg mb-2">
              Hey! I'm Gemmi. I can help you design posters or find trending videos. What's up?
            </div>
          </ScrollArea>

          <div className="p-4 flex gap-2">
            <Input placeholder="Type a message..." className="bg-white/5 border-white/10" />
            <Button size="icon"><Send className="h-4 w-4" /></Button>
          </div>
        </Card>
      )}
    </div>
  );
}