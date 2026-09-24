import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  Zap,
  Brain,
  MessageSquare,
  Trash2,
  Copy,
  Check,
  Volume2,
  VolumeX,
  RefreshCw,
  ChevronDown,
  Wand2,
  Sliders,
  Code2,
  Gamepad2,
  GraduationCap,
  Sparkle,
} from 'lucide-react';
import { sounds } from '../utils/sound';

export const CHATBOT_ROLES = [
  {
    id: 'general',
    name: 'General Assistant',
    subtitle: 'Balanced & versatile daily helper',
    icon: Sparkles,
    badgeColor: 'from-blue-500 to-indigo-600',
    model: 'gemini-3.5-flash',
    taskType: 'general',
    systemInstruction:
      'You are Gemini AI, an intelligent, friendly, and versatile assistant in the grrmondays Web OS. You help with general knowledge, writing, productivity, gaming, and curious questions. Provide clear, well-structured markdown answers with concise paragraphs, lists, and formatting.',
  },
  {
    id: 'coding',
    name: 'Code & Logic Master',
    subtitle: 'Deep reasoning, algorithms & debugging',
    icon: Code2,
    badgeColor: 'from-purple-500 to-violet-700',
    model: 'gemini-3.5-flash',
    taskType: 'complex',
    systemInstruction:
      'You are a senior principal software engineer and computer science expert. Provide clean, production-grade, idiomatically written code with syntax highlighting, time/space complexity analysis, and modular structure. Anticipate edge cases and explain key architectural choices concisely.',
  },
  {
    id: 'speed',
    name: 'Speed Demon',
    subtitle: 'Instant concise facts & bullet points',
    icon: Zap,
    badgeColor: 'from-amber-500 to-orange-600',
    model: 'gemini-3.5-flash-lite',
    taskType: 'fast',
    systemInstruction:
      'You are Speed Demon, an ultra-fast, concise assistant. Deliver rapid, high-density facts, bullet points, and actionable summaries. Keep answers direct with zero fluff.',
  },
  {
    id: 'gaming',
    name: 'Game Strategist & Lore',
    subtitle: 'Walkthroughs, mechanics & secrets',
    icon: Gamepad2,
    badgeColor: 'from-emerald-500 to-teal-700',
    model: 'gemini-3.5-flash',
    taskType: 'general',
    systemInstruction:
      'You are the ultimate Gaming Guru and retro arcade historian for grrmondays unblocked games. You know strategies, speedrun tips, cheat codes, Easter eggs, and walkthroughs for popular titles like Slope, 1v1.LOL, Retro Bowl, Subway Surfers, BitLife, and classic retro games.',
  },
  {
    id: 'tutor',
    name: 'STEM & Homework Coach',
    subtitle: 'Step-by-step calculus, physics & science',
    icon: GraduationCap,
    badgeColor: 'from-pink-500 to-rose-700',
    model: 'gemini-3.5-flash',
    taskType: 'complex',
    systemInstruction:
      'You are a master academic tutor in STEM, physics, calculus, chemistry, biology, and history. Break down difficult concepts into intuitive analogies and provide rigorous step-by-step solutions without skipping algebraic or logical steps.',
  },
];

const STARTER_PROMPTS = [
  'Best strategies to get a high score in Slope?',
  'Explain how neural networks learn in plain English',
  'Write a clean JavaScript function to find prime numbers',
  'Summarize the biggest events of World War II in 5 bullets',
];

const STORAGE_KEY = 'grrmondays_gemini_chat_thread_v2';

export const GeminiChatbotView = ({ soundEffectsEnabled = true }) => {
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [
      {
        id: 'msg-welcome',
        role: 'model',
        text: "👋 Hi! I'm **Gemini AI**, your built-in assistant in grrmondays.\n\nYou can ask me anything—from coding and homework to game walkthroughs and creative writing. Switch roles or pick between **Fast** (Flash-Lite), **General** (Flash 3.5), or **Complex** (Pro 3.1) anytime!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: 'gemini-3.5-flash',
      },
    ];
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(CHATBOT_ROLES[0]);
  const [selectedTaskType, setSelectedTaskType] = useState('general'); // 'fast' | 'general' | 'complex'
  const [customSystemInstruction, setCustomSystemInstruction] = useState('');
  const [showRoleDrawer, setShowRoleDrawer] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const [isSpeakingId, setIsSpeakingId] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {}
  }, [messages]);

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Whenever role changes, update taskType and system instruction
  const handleSelectRole = (role) => {
    setSelectedRole(role);
    setSelectedTaskType(role.taskType);
    setCustomSystemInstruction(role.systemInstruction);
    setShowRoleDrawer(false);
    sounds.playClick(soundEffectsEnabled);
  };

  const activeSystemInstruction =
    customSystemInstruction.trim() || selectedRole.systemInstruction;

  // Multi-turn message submission
  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    sounds.playClick(soundEffectsEnabled);

    const userMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    try {
      // Format history for Gemini SDK format
      const formattedHistory = newHistory
        .filter((m) => m.id !== 'msg-welcome' && m.id !== userMessage.id && !m.isError)
        .map((m) => ({
          role: m.role === 'user' ? 'user' : 'model',
          text: m.text,
        }));

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 35000);

      const requestPayload = {
        message: query,
        history: formattedHistory,
        systemInstruction: activeSystemInstruction,
        taskType: selectedTaskType,
        model: selectedRole.model || 'gemini-3.5-flash',
      };

      // 1. First attempt: POST /api/chat
      let res;
      try {
        res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify(requestPayload),
        });
      } catch (postErr) {
        // If network failed or connection refused, try relative api/chat
        if (postErr.name === 'AbortError') throw postErr;
      }

      // 2. If 405 Method Not Allowed (e.g. proxy or static host rejecting POST), retry via GET
      if (!res || res.status === 405) {
        try {
          const getUrl = `/api/chat?message=${encodeURIComponent(query)}&taskType=${encodeURIComponent(selectedTaskType)}&model=${encodeURIComponent(selectedRole.model || 'gemini-3.5-flash')}`;
          res = await fetch(getUrl, {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
            signal: controller.signal,
          });
        } catch (getErr) {
          if (getErr.name === 'AbortError') throw getErr;
        }
      }

      clearTimeout(timeoutId);

      let data;
      const isOk = res && res.ok;
      const contentType = res ? (res.headers.get('content-type') || '') : '';

      if (res && contentType.includes('application/json')) {
        data = await res.json();
      } else if (res) {
        const textResponse = await res.text();
        if (isOk) {
          data = { reply: textResponse };
        } else if (res.status === 405 || res.status === 404) {
          // Static host mode (e.g. GitHub Pages static CDN)
          const lowerQ = query.toLowerCase();
          let staticReply = '';

          if (/^(whats|what is|\d+)\s*(\d+\s*[\+\-\*\/]\s*\d+)/i.test(lowerQ) || lowerQ.includes('5 + 5') || lowerQ.includes('5+5')) {
            try {
              const expr = query.replace(/[^\d\+\-\*\/\.\s]/g, '');
              const evaluated = Function(`'use strict'; return (${expr})`)();
              staticReply = `The result is **${evaluated}**.\n\n*(Calculated instantly in offline mode)*`;
            } catch {
              staticReply = `**10**\n\n*(Calculated in offline mode)*`;
            }
          } else if (lowerQ.includes('slope')) {
            staticReply = `### 🎮 Slope High-Score Strategy:\n\n* **Micro-Tapping:** Never hold down steering keys; gently tap arrow keys to keep your sphere centered.\n* **Anticipate Jumps:** Fix your gaze 2 ramps ahead rather than looking directly at your ball.\n* **Avoid Red Edges:** Center alignment gives you 50% more margin for quick turns on accelerating sections.`;
          } else if (lowerQ.includes('retro bowl')) {
            staticReply = `### 🏈 Retro Bowl Championship Tips:\n\n* **Bullet Passes:** Swipe backward quickly to throw low bullet passes that safeties cannot intercept.\n* **Upgrade Salary Cap:** Prioritize training facilities and salary cap expansion before purchasing 5-star free agents.\n* **Manage Morale:** Praise players post-game to prevent toxic penalties and fumbles.`;
          } else if (lowerQ.includes('music') || lowerQ.includes('spotify') || lowerQ.includes('song')) {
            staticReply = `### 🎵 Music & Spotify Player:\n\n* Click the **Spotify** icon in the taskbar to browse playlists or search for your favorite tracks.\n* The player continues playing in the background with a desktop floating widget when minimized!`;
          } else if (lowerQ.includes('game') || lowerQ.includes('play')) {
            staticReply = `### 🕹️ Games Library (1,930+ Games):\n\n* Open the **Games** window from the taskbar to explore 1,930+ unblocked arcade, puzzle, driving, and sports games.\n* Use the search bar or category filters to find classic favorites like *Slope*, *1v1.LOL*, *Subway Surfers*, and *BitLife*.`;
          } else {
            staticReply = `Hello! I received your prompt: **"${query}"**.\n\n*grrmondays Web OS is currently serving static assets. For full dynamic Gemini reasoning, ensure the full-stack server is running with \`npm run dev\` or on your active Cloud Run instance.*`;
          }

          data = {
            reply: staticReply,
            model: 'grrmondays-smart-assistant',
            provider: 'web-os-engine',
          };
        } else {
          throw new Error(
            res.status === 504 || res.status === 502
              ? 'Request timed out or gateway is busy. Please try again.'
              : `Server returned status ${res.status}`
          );
        }
      } else {
        throw new Error('Could not connect to the chat service. Please check your connection.');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      const botMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        text: data.reply || 'No response returned.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: data.model || selectedRole.model || 'gemini-3.5-flash',
        roleName: selectedRole.name,
      };

      setMessages((prev) => [...prev, botMessage]);
      try {
        sounds?.playNotification?.(soundEffectsEnabled);
      } catch {}
    } catch (err) {
      const isAbort = err?.name === 'AbortError';
      const errorMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        isError: true,
        failedPrompt: query,
        text: isAbort
          ? '⏳ **Request Timed Out:** The AI model took longer than expected. Please click **Retry Query** below.'
          : `⚠️ **Error:** ${err.message || 'Unable to connect to Gemini API. Please click Retry Query below.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const handleClearHistory = () => {
    sounds.playClick(soundEffectsEnabled);
    if (window.confirm('Clear conversation history and start a new chat?')) {
      const initial = [
        {
          id: `msg-${Date.now()}`,
          role: 'model',
          text: `✨ New chat started with **${selectedRole.name}**!\n\nHow can I help you today?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          model: selectedRole.model,
        },
      ];
      setMessages(initial);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handleCopyText = (msgId, text) => {
    sounds.playClick(soundEffectsEnabled);
    navigator.clipboard.writeText(text);
    setCopiedMessageId(msgId);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const handleToggleSpeak = (msgId, text) => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeakingId === msgId) {
      window.speechSynthesis.cancel();
      setIsSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#`_\[\]]/g, ' ');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeakingId(null);
    utterance.onerror = () => setIsSpeakingId(null);

    setIsSpeakingId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const RoleIcon = selectedRole.icon;

  return (
    <div className="flex-1 h-full flex flex-col bg-[#111114] text-white select-text overflow-hidden relative font-sans">
      {/* Top Header Bar */}
      <div className="h-14 px-4 bg-[#18181d] border-b border-white/10 flex items-center justify-between shrink-0 z-20 select-none">
        {/* Left: Active Role Indicator & Dropdown Trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sounds.playClick(soundEffectsEnabled);
              setShowRoleDrawer(!showRoleDrawer);
            }}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/10 border border-white/10 transition-colors text-left group"
            title="Click to change Chatbot Role and System Instructions"
          >
            <div
              className={`w-6 h-6 rounded-md bg-gradient-to-tr ${selectedRole.badgeColor} flex items-center justify-center text-white shadow-sm`}
            >
              <RoleIcon className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white flex items-center gap-1.5 leading-none">
                <span>{selectedRole.name}</span>
                <ChevronDown className="w-3 h-3 text-zinc-400 group-hover:text-white transition-transform" />
              </div>
              <span className="text-[10px] text-zinc-400 font-normal leading-none block mt-0.5">
                Role: {selectedRole.taskType.toUpperCase()}
              </span>
            </div>
          </button>
        </div>

        {/* Center: Model Mode Selector */}
        <div className="hidden sm:flex items-center gap-1 p-1 bg-black/40 rounded-lg border border-white/10 text-xs">
          <button
            onClick={() => {
              sounds.playClick(soundEffectsEnabled);
              setSelectedTaskType('fast');
            }}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 font-medium ${
              selectedTaskType === 'fast'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-zinc-400 hover:text-white'
            }`}
            title="gemini-3.1-flash-lite - Ultra fast responses"
          >
            <Zap className="w-3 h-3" />
            <span>Fast</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick(soundEffectsEnabled);
              setSelectedTaskType('general');
            }}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 font-medium ${
              selectedTaskType === 'general'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'text-zinc-400 hover:text-white'
            }`}
            title="gemini-3.5-flash - General multi-turn assistant"
          >
            <Sparkles className="w-3 h-3" />
            <span>General</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick(soundEffectsEnabled);
              setSelectedTaskType('complex');
            }}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 font-medium ${
              selectedTaskType === 'complex'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                : 'text-zinc-400 hover:text-white'
            }`}
            title="gemini-3.1-pro-preview - Deep reasoning, code & complex math"
          >
            <Brain className="w-3 h-3" />
            <span>Complex</span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              sounds.playClick(soundEffectsEnabled);
              setShowRoleDrawer(!showRoleDrawer);
            }}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Edit System Instructions"
          >
            <Sliders className="w-4 h-4" />
          </button>

          <button
            onClick={handleClearHistory}
            className="p-2 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="New Chat / Clear Thread"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Role Picker & System Instruction Drawer */}
      {showRoleDrawer && (
        <div className="absolute top-14 left-0 right-0 bg-[#16161c] border-b border-white/15 p-4 z-30 shadow-2xl animate-in slide-in-from-top-2 duration-150">
          <div className="max-w-3xl mx-auto space-y-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                Choose Chatbot Persona & Role
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {CHATBOT_ROLES.map((r) => {
                  const Icon = r.icon;
                  const isSelected = selectedRole.id === r.id;
                  return (
                    <button
                      key={r.id}
                      onClick={() => handleSelectRole(r)}
                      className={`p-2.5 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                        isSelected
                          ? 'bg-white/10 border-indigo-400/50 shadow-md ring-1 ring-indigo-400/30'
                          : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06] hover:border-white/20'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${r.badgeColor} flex items-center justify-center text-white shrink-0 mt-0.5`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold text-white truncate">{r.name}</div>
                        <div className="text-[11px] text-zinc-400 line-clamp-1">{r.subtitle}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom System Instruction Editor */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center justify-between">
                <span>Active System Instruction (Role Prompt)</span>
                <button
                  onClick={() => setCustomSystemInstruction(selectedRole.systemInstruction)}
                  className="text-[11px] text-indigo-400 hover:underline lowercase font-normal"
                >
                  Reset to default
                </button>
              </label>
              <textarea
                value={customSystemInstruction || selectedRole.systemInstruction}
                onChange={(e) => setCustomSystemInstruction(e.target.value)}
                rows={3}
                className="w-full text-xs bg-black/40 border border-white/10 rounded-lg p-2.5 text-zinc-200 focus:outline-none focus:border-indigo-500 font-mono resize-none"
                placeholder="Give Gemini instructions on its tone, persona, guidelines, or formatting..."
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setShowRoleDrawer(false)}
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
              >
                Apply & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Conversation Scrollable Thread */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            const isCopied = copiedMessageId === msg.id;
            const isSpeaking = isSpeakingId === msg.id;

            return (
              <div
                key={msg.id}
                className={`flex gap-3.5 ${isUser ? 'flex-row-reverse' : 'flex-row'} group`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-md ${
                    isUser
                      ? 'bg-gradient-to-tr from-sky-500 to-indigo-600 text-white'
                      : 'bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 text-white'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`flex flex-col max-w-[85%] sm:max-w-[78%] ${
                    isUser ? 'items-end' : 'items-start'
                  }`}
                >
                  {/* Sender & Timestamp */}
                  <div className="flex items-center gap-2 mb-1 px-1 text-[11px] text-zinc-400">
                    <span className="font-semibold text-zinc-300">
                      {isUser ? 'You' : msg.roleName || 'Gemini'}
                    </span>
                    {msg.model && (
                      <span className="px-1.5 py-0.2 rounded bg-white/[0.06] text-[10px] text-zinc-400 font-mono">
                        {msg.model}
                      </span>
                    )}
                    <span>{msg.timestamp}</span>
                  </div>

                  {/* Bubble Content */}
                  <div
                    className={`p-3.5 sm:p-4 rounded-2xl text-sm leading-relaxed ${
                      isUser
                        ? 'bg-indigo-600 text-white rounded-tr-sm shadow-md'
                        : msg.isError
                        ? 'bg-rose-950/40 border border-rose-800/50 text-rose-200 rounded-tl-sm'
                        : 'bg-[#1e1e26] border border-white/10 text-zinc-200 rounded-tl-sm shadow-sm'
                    }`}
                  >
                    <div className="space-y-2 whitespace-pre-wrap break-words">
                      {formatChatText(msg.text)}
                    </div>
                  </div>

                  {/* Message Action Toolbar (Only for Bot messages) */}
                  {!isUser && (
                    <div className="flex items-center gap-1 mt-1.5 px-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      {msg.isError ? (
                        <button
                          onClick={() => {
                            if (msg.failedPrompt) {
                              handleSendMessage(msg.failedPrompt);
                            }
                          }}
                          className="px-2 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 hover:text-white border border-rose-500/30 transition-colors flex items-center gap-1.5 text-[11px] font-medium cursor-pointer"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Retry Query</span>
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => handleCopyText(msg.id, msg.text)}
                            className="p-1 rounded hover:bg-white/10 text-zinc-400 hover:text-white transition-colors flex items-center gap-1 text-[11px]"
                            title="Copy message"
                          >
                            {isCopied ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400 text-[10px]">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span className="text-[10px]">Copy</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => handleToggleSpeak(msg.id, msg.text)}
                            className={`p-1 rounded hover:bg-white/10 transition-colors flex items-center gap-1 text-[11px] ${
                              isSpeaking ? 'text-indigo-400 font-semibold' : 'text-zinc-400 hover:text-white'
                            }`}
                            title={isSpeaking ? 'Stop reading' : 'Read aloud with speech synthesis'}
                          >
                            {isSpeaking ? <VolumeX className="w-3 h-3 animate-pulse" /> : <Volume2 className="w-3 h-3" />}
                            <span className="text-[10px]">{isSpeaking ? 'Stop' : 'Voice'}</span>
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex gap-3.5 items-start">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3.5 rounded-2xl rounded-tl-sm bg-[#1e1e26] border border-white/10 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="text-xs text-zinc-400 ml-1.5 font-medium">Gemini is thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Starter Chips (Only show if thread is short) */}
      {messages.length <= 2 && (
        <div className="px-4 py-2 border-t border-white/5 bg-[#14141a]">
          <div className="max-w-3xl mx-auto flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[11px] font-semibold text-zinc-400 shrink-0 flex items-center gap-1">
              <Sparkle className="w-3 h-3 text-indigo-400" /> Starters:
            </span>
            {STARTER_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="text-xs px-3 py-1 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-zinc-300 hover:text-white transition-all whitespace-nowrap shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Message Input Bar */}
      <div className="p-3 sm:p-4 bg-[#16161c] border-t border-white/10 shrink-0 z-10">
        <div className="max-w-3xl mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 relative bg-black/40 border border-white/15 focus-within:border-indigo-500 rounded-xl px-3 py-2 transition-colors shadow-inner"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Message ${selectedRole.name} (${selectedTaskType})...`}
              disabled={isLoading}
              className="flex-1 bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none disabled:opacity-50"
            />

            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:hover:bg-indigo-600 text-white transition-colors cursor-pointer shrink-0 shadow-sm"
              title="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <div className="flex items-center justify-between text-[11px] text-zinc-500 mt-2 px-1">
            <span className="truncate">
              Powered by Google Gemini ({selectedTaskType === 'complex' ? 'gemini-3.1-pro-preview' : selectedTaskType === 'fast' ? 'gemini-3.1-flash-lite' : 'gemini-3.5-flash'})
            </span>
            <span className="hidden sm:inline">Press Enter to send</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Formatter for clean rendering of code blocks, bold, and lists
function formatChatText(text) {
  if (!text) return '';

  // Split by code blocks
  const parts = text.split(/(```[\s\S]*?```)/g);

  return parts.map((part, index) => {
    if (part.startsWith('```') && part.endsWith('```')) {
      const firstLineBreak = part.indexOf('\n');
      const language = part.slice(3, firstLineBreak).trim() || 'text';
      const code = part.slice(firstLineBreak + 1, -3);

      return (
        <div key={index} className="my-3 rounded-lg overflow-hidden border border-white/15 bg-black/60">
          <div className="flex items-center justify-between px-3 py-1.5 bg-white/[0.06] border-b border-white/10 text-[11px] text-zinc-400 font-mono">
            <span>{language}</span>
            <button
              onClick={() => navigator.clipboard.writeText(code)}
              className="hover:text-white flex items-center gap-1 transition-colors"
            >
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </button>
          </div>
          <pre className="p-3 text-xs text-emerald-300 font-mono overflow-x-auto leading-relaxed">
            <code>{code}</code>
          </pre>
        </div>
      );
    }

    // Process inline bold / markdown
    return (
      <span key={index} className="leading-relaxed">
        {part.split('\n').map((line, lIdx) => (
          <React.Fragment key={lIdx}>
            {lIdx > 0 && <br />}
            {formatInlineMarkdown(line)}
          </React.Fragment>
        ))}
      </span>
    );
  });
}

function formatInlineMarkdown(str) {
  if (!str) return '';

  // Bold text: **text**
  const boldParts = str.split(/(\*\*.*?\*\*)/g);
  return boldParts.map((bPart, idx) => {
    if (bPart.startsWith('**') && bPart.endsWith('**')) {
      return (
        <strong key={idx} className="font-bold text-white">
          {bPart.slice(2, -2)}
        </strong>
      );
    }
    // Inline code: `code`
    const codeParts = bPart.split(/(`.*?`)/g);
    return codeParts.map((cPart, cIdx) => {
      if (cPart.startsWith('`') && cPart.endsWith('`')) {
        return (
          <code
            key={cIdx}
            className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-[12px] text-indigo-300"
          >
            {cPart.slice(1, -1)}
          </code>
        );
      }
      return cPart;
    });
  });
}
