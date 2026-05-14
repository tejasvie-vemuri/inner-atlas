"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { clsx } from "clsx";
import { ALL_FRAMEWORKS, THINKER_LABELS } from "@/lib/frameworks";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const STARTER_PROMPTS = [
  "I'm avoiding a hard conversation. Where do I start?",
  "I feel burned out but I can't stop. What do the frameworks say?",
  "How do I rebuild trust after I broke it?",
  "I keep self-sabotaging. What's actually going on?",
  "I want to feel more joy in my daily life.",
  "Help me understand the difference between ego and soul.",
];

interface CoachClientProps {
  initialFrameworkId?: string;
}

export function CoachClient({ initialFrameworkId }: CoachClientProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const initialFramework = initialFrameworkId
    ? ALL_FRAMEWORKS.find((f) => f.id === initialFrameworkId)
    : null;

  useEffect(() => {
    if (initialFramework && messages.length === 0) {
      setInput(`I want to explore the "${initialFramework.title}" framework by ${THINKER_LABELS[initialFramework.thinker]}. Can you walk me through it and help me apply it to my life?`);
    }
  }, [initialFramework, messages.length]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(text?: string) {
    const content = text ?? input.trim();
    if (!content || loading) return;

    const userMsg: Message = { role: "user", content };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantText += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: assistantText };
          return updated;
        });
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong. Please check your API key and try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)]">
      {/* Message thread */}
      <div className="flex-1 overflow-y-auto space-y-6 pb-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-16">
            <div className="w-14 h-14 rounded-full bg-[#F0E9DF] flex items-center justify-center mb-5">
              <Bot size={26} className="text-[#C4843A]" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#2C1A0E] mb-2">Your Inner Atlas Coach</h2>
            <p className="text-[#7A6655] text-sm max-w-md mb-8">
              Ask anything about life, relationships, mental health, or growth. Every response
              draws from Brené, Oprah, Huberman, and Bartlett&apos;s frameworks.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-xl">
              {STARTER_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="text-left rounded-xl border border-[#E0D5C8] bg-white px-4 py-3 text-sm text-[#2C1A0E] hover:bg-[#F0E9DF] hover:border-[#C4843A]/40 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              className={clsx("flex gap-3", msg.role === "user" ? "justify-end" : "justify-start")}
            >
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-[#F0E9DF] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot size={16} className="text-[#C4843A]" />
                </div>
              )}
              <div
                className={clsx(
                  "max-w-[75%] rounded-2xl px-5 py-3.5 text-sm leading-7",
                  msg.role === "user"
                    ? "bg-[#2C1A0E] text-white rounded-br-sm"
                    : "bg-white border border-[#E0D5C8] text-[#2C1A0E] rounded-bl-sm"
                )}
              >
                {msg.content.split("\n").map((line, j) => (
                  <p key={j} className={line === "" ? "h-3" : ""}>
                    {line}
                  </p>
                ))}
                {loading && i === messages.length - 1 && msg.role === "assistant" && msg.content === "" && (
                  <Loader2 size={16} className="animate-spin text-[#7A6655]" />
                )}
              </div>
              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-[#2C1A0E] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User size={16} className="text-white" />
                </div>
              )}
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-[#E0D5C8] pt-4 bg-[#FAF6F1]">
        <div className="flex gap-3 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask your coach anything... (Enter to send, Shift+Enter for new line)"
            rows={2}
            className="flex-1 rounded-2xl border border-[#E0D5C8] bg-white px-4 py-3 text-sm text-[#2C1A0E] placeholder-[#7A6655] focus:outline-none focus:ring-2 focus:ring-[#C4843A]/30 focus:border-[#C4843A] resize-none transition-colors"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="w-11 h-11 rounded-full bg-[#C4843A] text-white flex items-center justify-center hover:bg-[#A36A2A] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </div>
        <p className="text-xs text-[#7A6655] mt-2 text-center">
          Powered by Claude · Grounded in Brené, Oprah, Huberman & Bartlett
        </p>
      </div>
    </div>
  );
}
