import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import api from "@/lib/api";
// import { useTypingEffect } from "@/hooks/use-typing-effect";

interface Message {
  type: "user" | "ai";
  content: string;
  isTyping?: boolean;
}

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
}
export function useTypingEffect(text: string, speed: number = 30) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let i = 0;
    setIsTyping(true);
    setDisplayedText("");

    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((current) => current + text.charAt(i));
        i++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return { displayedText, isTyping };
}
export function AIChat({ isOpen, onClose }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { type: "user", content: userMessage }]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await api.post("/play/ai/chat/", {
        data: {
          prompt: userMessage,
        },
      });

      setMessages((prev) => [
        ...prev,
        { type: "ai", content: response.data.content, isTyping: true },
      ]);
    } catch (error) {
      console.error("AI 응답 오류:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card
      className={cn(
        "fixed bottom-20 left-1/2 -translate-x-1/2 w-[600px]",
        "bg-white shadow-xl rounded-lg flex flex-col",
        "transition-all duration-300 ease-in-out z-[99999]",
        "max-h-[calc(100vh-120px)]",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      <ScrollAreaPrimitive.Root className="flex-1 w-full min-h-[200px]">
        <ScrollAreaPrimitive.Viewport className="w-full h-full max-h-[calc(100vh-200px)]">
          <div className="p-4 flex flex-col">
            {messages.map((message, index) => (
              <div
                key={index}
                ref={index === messages.length - 1 ? lastMessageRef : null}
                className={cn(
                  "mb-4 p-3 rounded-lg max-w-[80%]",
                  message.type === "user"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                {message.type === "ai" && message.isTyping ? (
                  <TypewriterEffect
                    text={message.content}
                    onComplete={() => {
                      setMessages((messages) =>
                        messages.map((m, i) =>
                          i === index ? { ...m, isTyping: false } : m
                        )
                      );
                    }}
                  />
                ) : (
                  <p className="whitespace-pre-wrap">{message.content}</p>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="bg-muted p-3 rounded-lg max-w-[80%]">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
          </div>
        </ScrollAreaPrimitive.Viewport>
        <ScrollAreaPrimitive.Scrollbar
          className="flex select-none touch-none p-0.5 bg-black/5 transition-colors duration-150 ease-out hover:bg-black/10 data-[orientation=vertical]:w-2 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2"
          orientation="vertical"
        >
          <ScrollAreaPrimitive.Thumb className="flex-1 bg-black/40 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
        </ScrollAreaPrimitive.Scrollbar>
      </ScrollAreaPrimitive.Root>
      <div className="p-4 border-t bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex space-x-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="AI에게 질문하기..."
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
}

function TypewriterEffect({
  text,
  onComplete,
}: {
  text: string;
  onComplete: () => void;
}) {
  const { displayedText, isTyping } = useTypingEffect(text);

  useEffect(() => {
    if (!isTyping) {
      onComplete();
    }
  }, [isTyping, onComplete]);

  return <p className="whitespace-pre-wrap">{displayedText}</p>;
}
