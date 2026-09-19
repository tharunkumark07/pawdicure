import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bot,
  Send,
  Sparkles,
  Trash2,
  HelpCircle,
  Clock,
  CheckCircle,
  Lightbulb,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
}

export function AIAssistantView() {
  const { activePet, showToast } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: `Hello! I am your PAWdiCURE Clinical Companion. I have loaded ${activePet.name}'s biometric profile (${activePet.breed}, ${activePet.age}, ${activePet.weight} kg). How can I assist your care routine today?`,
      time: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const suggestedPrompts = [
    `How much exercise does ${activePet.name} need?`,
    `Create a balanced daily feeding routine.`,
    `Why is ${activePet.name} less active today?`,
    `What should I ask Dr. Rostova at our next visit?`,
    `Is salmon oil good for ${activePet.breed}s?`,
  ];

  const generateSimulatedResponse = (query: string): string => {
    const q = query.toLowerCase();

    if (q.includes('exercise') || q.includes('walk') || q.includes('activity')) {
      return `For a ${activePet.age} ${activePet.breed} weighing ${activePet.weight} kg, veterinary exercise guidelines recommend 60 to 90 minutes of combined daily physical activity. 

Recommended routine:
• Morning: 30-minute moderate sniffari walk to stimulate olfactory mental pathways.
• Afternoon / Evening: 20-minute active play session (fetch with rubber disc or flirt pole sprints).
• Mental Stimulation: 10 minutes of trick training or treat maze puzzle work.`;
    }

    if (q.includes('feed') || q.includes('routine') || q.includes('portion') || q.includes('food')) {
      return `Based on ${activePet.name}'s clinical MER (Maintenance Energy Requirement of approx ${activePet.dailyCaloriesGoal || 1240} kcal/day):

Optimal 2-Meal Feeding Routine:
• Breakfast (08:00 AM): 180g Pacific Salmon formula + 1 joint glucosamine chew.
• Dinner (06:30 PM): 180g portion topped with 2 pumps (5ml) Wild Alaskan Salmon Oil for coat radiance.
• Water: Clean filtered fountain water refreshed daily (goal: ${activePet.goalMl} ml).`;
    }

    if (q.includes('less active') || q.includes('letharg') || q.includes('tired')) {
      return `If ${activePet.name} seems less active today, consider these common clinical factors:
1. Weather / Ambient Temperature: Retrievers and long-coated breeds naturally slow down in warmer weather.
2. Muscle Soreness: Check for stiffness after yesterday's active walks.
3. Hydration Level: Ensure fresh cool water is readily available (${activePet.name} is currently at ${activePet.hydrationPercent}% hydration).
4. Paw Pad Check: Inspect paw pads between toes for burrs, fox-tails, or minor abrasions.

If lethargy persists beyond 24 hours, contact your clinic (${activePet.vetClinic}).`;
    }

    if (q.includes('vet') || q.includes('ask') || q.includes('doctor')) {
      return `Here are 4 prioritized clinical questions for your next consult:
1. "Given ${activePet.name}'s current weight of ${activePet.weight} kg, is body condition score (BCS) on target?"
2. "Should we schedule the DHPP 5-in-1 core booster before October?"
3. "Are the current Omega-3 and Glucosamine dosages sufficient for joint preservation?"
4. "Would an annual ultrasonic dental polishing benefit ${activePet.name} at this stage?"`;
    }

    return `That's a thoughtful question regarding ${activePet.name}'s care! For ${activePet.breed}s of this age and vitality profile (${activePet.careScore}/100 PAW Care Score), consistent routines, balanced macronutrient feeding, and preventive veterinary visits are key to lifelong well-being. Would you like me to generate a tailored routine schedule for this?`;
  };

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: query.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const reply = generateSimulatedResponse(query);
      const botMsg: ChatMessage = {
        id: 'bot-' + Date.now(),
        sender: 'assistant',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 850);
  };

  const handleClear = () => {
    setMessages([
      {
        id: 'msg-start',
        sender: 'assistant',
        text: `Chat reset. I am ready to advise on ${activePet.name}'s nutrition, agility, health records, or behavior.`,
        time: 'Just now',
      },
    ]);
    showToast('Conversation cleared', 'info');
  };

  return (
    <div className="flex flex-col w-full h-[calc(100vh-140px)] min-h-[500px] pb-4 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-[var(--card-bg)] p-3 sm:p-4 rounded-3xl border border-[var(--card-border)] shadow-xs flex items-center justify-between shrink-0 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[var(--primary)] text-white flex items-center justify-center shadow-md shadow-[var(--primary)]/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-heading font-black text-base text-[var(--primary)]">
                PAWdiCURE AI
              </h1>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[11px] text-[var(--text-muted)]">
              Personalized for {activePet.name} ({activePet.breed})
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleClear}
          className="p-2 text-[var(--text-muted)] hover:text-red-500 rounded-xl hover:bg-[var(--background-alt)] transition"
          title="Clear chat"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto space-y-3 px-1 no-scrollbar">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[75%] p-3.5 rounded-3xl text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[var(--primary)] text-white rounded-tr-xs shadow-md shadow-[var(--primary)]/15'
                  : 'bg-[var(--card-bg)] text-[var(--text)] border border-[var(--card-border)] rounded-tl-xs shadow-2xs'
              }`}
            >
              <div className="whitespace-pre-line font-normal">{msg.text}</div>
              <span
                className={`text-[9px] mt-1.5 block font-mono ${
                  msg.sender === 'user' ? 'text-white/70 text-right' : 'text-[var(--text-muted)]'
                }`}
              >
                {msg.time}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] w-fit text-xs text-[var(--text-muted)] animate-pulse">
            <Bot className="w-4 h-4 text-[var(--primary)]" />
            <span>PAWdiCURE AI is analyzing {activePet.name}'s records...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Questions */}
      <div className="py-2 overflow-x-auto flex items-center gap-1.5 no-scrollbar shrink-0">
        {suggestedPrompts.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(p)}
            className="px-3 py-1.5 rounded-full bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-200 text-[11px] font-semibold text-slate-700 whitespace-nowrap transition shadow-2xs active:scale-95"
          >
            💡 {p}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="mt-1 flex items-center gap-2 shrink-0"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask about ${activePet.name}'s care, health, diet...`}
          className="flex-1 px-4 py-3 rounded-2xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff6b4a] shadow-xs"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="w-12 h-12 rounded-2xl bg-[var(--primary)] text-white flex items-center justify-center shadow-md shadow-[var(--primary)]/20 disabled:opacity-40 disabled:cursor-not-allowed transition active:scale-95 shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
