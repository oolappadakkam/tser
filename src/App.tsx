import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, Lock, Unlock, Music, Play, Pause, 
  Upload, Plus, Trash2, Edit2, Sparkles, Cake, 
  Camera, Gift, Eye, EyeOff, RotateCcw, Check, 
  ChevronRight, Volume2, Save, X, BookOpen, MessageSquare,
  Trophy, Award
} from 'lucide-react';

// --- Default Data ---
interface Badge {
  key: string;
  name: string;
  emoji: string;
  description: string;
  color: string;
}

const BADGES: Badge[] = [
  {
    key: "first_wish",
    name: "First Wish",
    emoji: "🥇",
    description: "Awarded to the very first wish left on this magical board.",
    color: "bg-amber-50 text-amber-700 border-amber-200"
  },
  {
    key: "most_dramatic",
    name: "Most Dramatic",
    emoji: "🎭",
    description: "Full of exclamation marks (!!), ALL CAPS excitement, or crazy dramatic words!",
    color: "bg-purple-50 text-purple-700 border-purple-200"
  },
  {
    key: "sweetest",
    name: "Sweetest",
    emoji: "🍬",
    description: "Bursting with love, affection, kisses, hearts, or adorable sweet words.",
    color: "bg-rose-50 text-rose-700 border-rose-200"
  },
  {
    key: "poetic_master",
    name: "Poetic Master",
    emoji: "✍️",
    description: "Thoughtfully crafted with beautiful imagery of stars, moon, galaxy, or forever.",
    color: "bg-blue-50 text-blue-700 border-blue-200"
  },
  {
    key: "jester",
    name: "Pure Comedian",
    emoji: "🃏",
    description: "Guaranteed to make the birthday princess laugh with hilarious, funny energy.",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200"
  }
];

const getEarnedBadges = (wish: { id: number; name: string; relation: string; message: string }, allWishes: { id: number; name: string; relation: string; message: string }[]) => {
  const earned: string[] = [];
  const msg = wish.message.toLowerCase();
  
  // 1. First Wish
  const allIds = allWishes.map(w => w.id);
  if (allIds.length > 0 && wish.id === Math.min(...allIds)) {
    earned.push("first_wish");
  }

  // 2. Most Dramatic
  const hasExclamations = wish.message.includes("!!") || wish.message.includes("!!!") || (wish.message.match(/!/g) || []).length >= 2;
  const isAllCaps = wish.message.split(' ').filter(w => w.length > 2).every(w => w === w.toUpperCase() && /[A-Z]/.test(w));
  const dramaticWords = ["omg", "literally", "menace", "shocked", "screaming", "crazy", "chaos", "chaotic", "unreal", "omggg", "crying", "😭", "😮", "😱", "🔥", "shut up"];
  const hasDramaticWord = dramaticWords.some(word => msg.includes(word));
  if (hasExclamations || isAllCaps || hasDramaticWord) {
    earned.push("most_dramatic");
  }

  // 3. Sweetest
  const sweetestWords = ["love", "sweet", "angel", "princess", "gorgeous", "perfect", "adore", "wifuyyy", "thathuyyy", "husband", "cuddl", "precious", "cheeks", "💕", "💖", "🌸", "🥺", "🥰", "💏", "favorite", "favourite", "kisses", "heart"];
  const hasSweetWord = sweetestWords.some(word => msg.includes(word));
  if (hasSweetWord) {
    earned.push("sweetest");
  }

  // 4. Poetic Master
  const poeticWords = ["star", "moon", "galaxy", "dreams", "lifetime", "forever", "sparkle", "heaven", "melody", "verses", "poem", "poet", "sky", "breathe", "heartbeat"];
  const hasPoeticWord = poeticWords.some(word => msg.includes(word));
  const isLong = wish.message.length > 115;
  if (hasPoeticWord || isLong) {
    earned.push("poetic_master");
  }

  // 5. Jester (Pure Comedian)
  const funnyWords = ["haha", "hehe", "lmao", "lol", "funny", "joke", "laugh", "😂", "😹", "😜", "🤪", "cheeky", "sassy"];
  const hasFunnyWord = funnyWords.some(word => msg.includes(word));
  if (hasFunnyWord) {
    earned.push("jester");
  }

  return earned;
};

const DEFAULT_NICKNAMES = ["Thathuyyy", "Wifuyyy", "My Everything", "Absolute Menace 💅", "Cutest Girl Alive", "Princess 👑"];

const DEFAULT_REASONS = [
  { id: 1, emoji: "😭", text: "The way you're literally the funniest person alive and you don't even try" },
  { id: 2, emoji: "🌸", text: "Your smile can fix literally anything, I'm not even joking" },
  { id: 3, emoji: "🎀", text: "How dramatic you get over small things — it's so cute I can't even" },
  { id: 4, emoji: "💖", text: "The way you make me feel like the luckiest person in the universe" },
  { id: 5, emoji: "🦋", text: "You're genuinely the prettiest girl and you don't even realize it" },
  { id: 6, emoji: "✨", text: "Your energy is so contagious — you light up every single room" },
  { id: 7, emoji: "🌷", text: "The soft, gentle version of you that not everyone gets to see 🥺" },
  { id: 8, emoji: "🎶", text: "How passionate you get about the things you love — it's the best" },
  { id: 9, emoji: "💌", text: "You make even boring days feel special just by being there" },
  { id: 10, emoji: "🫶", text: "Your hugs feel like home and I would travel anywhere for one" },
  { id: 11, emoji: "🌙", text: "Late-night talks with you are literally my favourite thing ever" },
  { id: 12, emoji: "😂", text: "You laugh at your own jokes before finishing them — iconic behaviour" },
  { id: 13, emoji: "🌺", text: "The way you care so deeply about the people you love 🥺" },
  { id: 14, emoji: "💅", text: "Main character energy 24/7 — honestly you deserve a whole movie" },
  { id: 15, emoji: "🍰", text: "You make everything more fun, more colourful, more worth it" },
  { id: 16, emoji: "⭐", text: "You're literally my favourite person to ever exist, no contest" },
  { id: 17, emoji: "💕", text: "And most of all — because you're you. Perfectly, wonderfully, beautifully YOU." }
];

const DEFAULT_MEMORIES = [
  { id: 1, emoji: "🌸", caption: " she is my Sweet laughter 💕", description: "The gorgeous smile that heals every single heavy corner of my heart.", image: "https://raw.githubusercontent.com/cripso-zhoyoto/image-hosting/f0364526ce8d2d13989e1415244ade3c1e57165e/crip/Snapchat-19817384.jpg" },
  { id: 2, emoji: "⭐", caption: "she is my gem ✨", description: "You shining brighter than the entire night sky. Absolutely dazzling in every way.", image: "https://raw.githubusercontent.com/cripso-zhoyoto/image-hosting/f0364526ce8d2d13989e1415244ade3c1e57165e/crip/Snapchat-285974296.jpg" },
  { id: 3, emoji: "🦋", caption: "So Her is mine  🦋", description: "The most beautiful butterfly in my cozy garden of absolute sweet dreams.", image: "https://raw.githubusercontent.com/cripso-zhoyoto/image-hosting/f0364526ce8d2d13989e1415244ade3c1e57165e/crip/Snapchat-598812323.jpg" },
  { id: 4, emoji: "💌", caption: "she is the baby  💌", description: "How can someone look this stunningly perfect every single frame of existence? 🥺", image: "https://raw.githubusercontent.com/cripso-zhoyoto/image-hosting/f0364526ce8d2d13989e1415244ade3c1e57165e/crip/Untitled%20design.png" },
  { id: 5, emoji: "🎀", caption: "Main Character of life  🎀", description: "A dynamic bundle of custom sass, precious laugh lines, and elite pouts.", image: "https://raw.githubusercontent.com/cripso-zhoyoto/image-hosting/f0364526ce8d2d13989e1415244ade3c1e57165e/crip/awrag7vf29rmy0cvpcc9nwpz9w.png" },
  { id: 6, emoji: "🫶", caption: "Cutest Princess 👑", description: "The cozy version of you that I want to cherish forever, through all lifetimes.", image: "https://raw.githubusercontent.com/cripso-zhoyoto/image-hosting/c7ccc548ef4b789318cec7e8bbdbc6f02b093ade/crip/Snapchat-636268614.jpg" },
  { id: 7, emoji: "💖", caption: "Always & Forever 💕", description: "Our happy ever afters and beautiful cozy tomorrows, written in the pink skies.", image: "https://raw.githubusercontent.com/cripso-zhoyoto/image-hosting/c7ccc548ef4b789318cec7e8bbdbc6f02b093ade/crip/Snapchat-1344314484.jpg" }
];

const DEFAULT_WISHES = [
  { id: 1, name: "Your Favourite", relation: "Main Squeeze", message: "May every single day of your 17th year be filled with the kind of joy that makes your cheeks hurt from laughing so hard! 🎂" },
  { id: 2, name: "Secret Admirer", relation: "Obsessed Fan", message: "I hope you chase every single big dream of yours with that beautiful dramatic energy you bring to life. You deserve it all! 💫" },
  { id: 3, name: "Always Yours", relation: "Forever Supporter", message: "May you always feel as gorgeous, protected, and fully loved as you truly are. The world is genuinely better because you are in it. 🌸" }
];

const DEFAULT_QUIZ = [
  {
    question: "What is my absolute favorite thing about you?",
    options: ["Your cute chaotic laugh", "Your adorable dramatic pouts", "Everything, no exceptions! 💖", "Your main character sassy energy"],
    correctIndex: 2,
    praise: "YES! How could anyone choose? You are perfect in every single way! 🥺🌸"
  },
  {
    question: "What level of dramatic are you naturally?",
    options: ["Super Soft & Quiet", "Slightly Sassy", "Certified Main Character 👑", "A Beautiful Cosmic Menace 🚨"],
    correctIndex: 3,
    praise: "Exactly! A level of gorgeous drama that lights up the whole block! 😂💅"
  },
  {
    question: "What is the key to making you smile instantly?",
    options: ["Praising you endlessly", "Endless virtual cuddles", "Playing your favourite sweet jam", "All of the above combined! 🥰"],
    correctIndex: 3,
    praise: "Correct! You deserve ALL the royal treatment, princess! ✨🦋"
  }
];

// --- Draw Glowing Heart Bubble on HTML5 Canvas ---
function drawHeartBubble(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, opacity: number) {
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.beginPath();
  
  // Clean bezier curve math for drawing a perfectly symmetrical heart at center (x, y)
  const topY = y - size * 0.35;
  const bottomY = y + size * 0.55;
  
  ctx.moveTo(x, y - size * 0.1);
  // Left half curve
  ctx.bezierCurveTo(x - size * 0.55, topY - size * 0.4, x - size * 0.95, y + size * 0.05, x, bottomY);
  // Right half curve
  ctx.bezierCurveTo(x + size * 0.95, y + size * 0.05, x + size * 0.55, topY - size * 0.4, x, y - size * 0.1);
  ctx.closePath();
  
  // Beautiful glass bubble-like custom gradient fill!
  const gradient = ctx.createRadialGradient(x - size * 0.2, y - size * 0.2, 1, x, y, size);
  gradient.addColorStop(0, `rgba(255, 192, 203, ${opacity * 0.55})`); // Soft coral pink inside
  gradient.addColorStop(0.7, `rgba(244, 63, 94, ${opacity * 0.18})`); // Translucent reddish pink middle
  gradient.addColorStop(0.95, `rgba(232, 67, 110, ${opacity * 0.8})`); // Hot pink bubble outline sheen
  gradient.addColorStop(1, `rgba(255, 255, 255, ${opacity * 0.95})`); // Clean glass highlight rim
  
  ctx.fillStyle = gradient;
  ctx.fill();
  
  // Draw stroke helper for glossy finish
  ctx.strokeStyle = `rgba(232, 67, 110, ${opacity * 0.45})`;
  ctx.lineWidth = 1;
  ctx.stroke();
  
  // Highlight reflection circle at top-left
  ctx.beginPath();
  ctx.arc(x - size * 0.25, y - size * 0.25, size * 0.12, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.85})`;
  ctx.fill();
  
  ctx.restore();
}

export default function App() {
  // State variables list
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [unlockError, setUnlockError] = useState("");
  
  // Custom states that persist in LocalStorage
  const [nicknames, setNicknames] = useState<string[]>(DEFAULT_NICKNAMES);
  const [reasons, setReasons] = useState(DEFAULT_REASONS);
  const [memories, setMemories] = useState(DEFAULT_MEMORIES);
  const [wishes, setWishes] = useState(DEFAULT_WISHES);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizAnswered, setQuizAnswered] = useState<number | null>(null);
  const [customLetter, setCustomLetter] = useState({
    greeting: "Dear Thathuyyy / Wifuyyy,",
    p1: "Happy 17th birthday, my absolute love 🎂 You have no idea how much you mean to me. Every single day you make me smile in the most ridiculous ways — I'm just stupid happy because you exist in my life.",
    p2: "You are Thamanna — beautiful, loud, hilarious, incredibly dramatic, and so so so special. I love every single version of you, even when you are being the most chaotic little menace on the planet 😭💕",
    p3: "17 looks breathtakingly incredible on you. This is your year, Wifuyyy. I hope it brings you everything your beautiful heart has ever wished for — and more. I will be right here cheering for you, embarrassingly in love, every step of the way. 🌸",
    sign: "Yours always & forever 💕"
  });

  // Editor states
  const [editingLetter, setEditingLetter] = useState(false);
  const [activeTab, setActiveTab] = useState<'view' | 'edit'>('view');
  
  // Memory Editor Modal
  const [activeMemoryId, setActiveMemoryId] = useState<number | null>(null);
  const [memoryEditCaption, setMemoryEditCaption] = useState("");
  const [memoryEditDesc, setMemoryEditDesc] = useState("");

  // Reasons States
  const [flipState, setFlipState] = useState<{ [key: number]: boolean }>({});
  const [editingReasonId, setEditingReasonId] = useState<number | null>(null);
  const [reasonEditText, setReasonEditText] = useState("");
  const [newReasonText, setNewReasonText] = useState("");
  const [newReasonEmoji, setNewReasonEmoji] = useState("💖");

  // Guestbook inputs
  const [guestName, setGuestName] = useState("");
  const [guestRelation, setGuestRelation] = useState("");
  const [guestMessage, setGuestMessage] = useState("");

  // Custom audio variables
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [activePlaylistIndex, setActivePlaylistIndex] = useState(0); // 0 = Musicbox synth, 1 = Custom audio URL

  // UI Popup
  const [showPopup, setShowPopup] = useState(false);

  // Carousel & Happy Birthday Audio state
  const [galleryViewMode, setGalleryViewMode] = useState<'carousel' | 'grid'>('carousel');
  const [carouselIndex, setCarouselIndex] = useState(0);
  const bdayAudioRef = useRef<HTMLAudioElement | null>(null);
  const warmMemoriesRef = useRef<HTMLAudioElement | null>(null);

  // Autoplay carousel cycle effect
  useEffect(() => {
    if (!unlocked || galleryViewMode !== 'carousel') return;
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % memories.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [unlocked, galleryViewMode, memories.length]);

  // Elegant Countdown State to Next Birthday Milestone (May 24)
  const [countdownText, setCountdownText] = useState({
    days: 0,
    hours: 0,
    mins: 0,
    secs: 0,
    isToday: false
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      let targetDate = new Date(`May 24, ${currentYear} 00:00:00`);
      
      // If we are currently past or on May 24 today, count to next year's milestone
      if (now > targetDate) {
        targetDate = new Date(`May 24, ${currentYear + 1} 00:00:00`);
      }

      const diff = targetDate.getTime() - now.getTime();
      
      const d = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
      const h = Math.max(0, Math.floor((diff / (1000 * 60 * 60)) % 24));
      const m = Math.max(0, Math.floor((diff / (1000 * 60)) % 60));
      const s = Math.max(0, Math.floor((diff / 1000) % 60));

      setCountdownText({
        days: d,
        hours: h,
        mins: m,
        secs: s,
        isToday: now.getMonth() === 4 && now.getDate() === 24
      });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, []);

  // --- Play Chic Custom Interaction Chime (Web Audio API) ---
  const playInteractionChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      
      const actx = audioContextRef.current || new AudioCtx();
      if (!audioContextRef.current) {
        audioContextRef.current = actx;
      }
      if (actx.state === 'suspended') {
        actx.resume();
      }

      const now = actx.currentTime;
      
      // Dual-note elegant magical arpeggio bell chime
      const osc1 = actx.createOscillator();
      const gain1 = actx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(659.25, now); // E5
      osc1.frequency.exponentialRampToValueAtTime(880.00, now + 0.1); // A5
      
      gain1.gain.setValueAtTime(0, now);
      gain1.gain.linearRampToValueAtTime(0.08, now + 0.02);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
      
      osc1.connect(gain1);
      gain1.connect(actx.destination);
      osc1.start(now);
      osc1.stop(now + 0.45);

      // Second note delayed slightly for elegant cozy gold echo
      const osc2 = actx.createOscillator();
      const gain2 = actx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(880.00, now + 0.08); // A5
      osc2.frequency.exponentialRampToValueAtTime(1318.51, now + 0.2); // E6
      
      gain2.gain.setValueAtTime(0, now + 0.08);
      gain2.gain.linearRampToValueAtTime(0.06, now + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
      
      osc2.connect(gain2);
      gain2.connect(actx.destination);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.52);

    } catch (e) {
      console.warn("Audio Context interact chime deferred", e);
    }
  };

  // References
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const synthIntervalRef = useRef<NodeJS.Timeout | any>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const cursorRingRef = useRef<HTMLDivElement | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // --- Load localStorage on Mount ---
  useEffect(() => {
    try {
      // Clear legacy unlock state so every refresh requires passcode unlock
      localStorage.removeItem('thathuyyy_bday_unlocked');
    } catch (e) {
      console.error("Failed to clear legacy lock state", e);
    }

    try {
      const storedNicks = localStorage.getItem('thathuyyy_nicknames');
      if (storedNicks) setNicknames(JSON.parse(storedNicks));
    } catch (e) {
      console.warn("Resetting corrupt nicknames from localStorage", e);
    }

    try {
      const storedReasons = localStorage.getItem('thathuyyy_reasons');
      if (storedReasons) setReasons(JSON.parse(storedReasons));
    } catch (e) {
      console.warn("Resetting corrupt reasons from localStorage", e);
    }

    try {
      const storedMemories = localStorage.getItem('thathuyyy_memories');
      if (storedMemories) {
        const parsed = JSON.parse(storedMemories);
        const hasSnapchatImages = parsed.some((m: any) => m.image && m.image.includes('Snapchat'));
        if (hasSnapchatImages) {
          setMemories(parsed);
        } else {
          setMemories(DEFAULT_MEMORIES);
          localStorage.setItem('thathuyyy_memories', JSON.stringify(DEFAULT_MEMORIES));
        }
      } else {
        setMemories(DEFAULT_MEMORIES);
      }
    } catch (e) {
      console.warn("Resetting corrupt memories from localStorage", e);
      setMemories(DEFAULT_MEMORIES);
    }

    try {
      const storedWishes = localStorage.getItem('thathuyyy_wishes');
      if (storedWishes) setWishes(JSON.parse(storedWishes));
    } catch (e) {
      console.warn("Resetting corrupt wishes from localStorage", e);
    }

    try {
      const storedLetter = localStorage.getItem('thathuyyy_letter');
      if (storedLetter) setCustomLetter(JSON.parse(storedLetter));
    } catch (e) {
      console.warn("Resetting corrupt letter from localStorage", e);
    }

    try {
      const storedAudioUrl = localStorage.getItem('thathuyyy_audio_url');
      if (storedAudioUrl) setAudioUrl(storedAudioUrl);
    } catch (e) {
      console.warn("Resetting corrupt audio URL state", e);
    }
  }, []);

  // --- Particle Background Engine with Glass Heart Bubbles ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{
      x: number;
      y: number;
      size: number;
      sym: string;
      vy: number;
      vx: number;
      op: number;
      rot: number;
      rotV: number;
      isBubble?: boolean;
    }> = [];

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Seed background particles balancing lovely flowers and shining heart bubbles!
    const symbols = ['🌸', '💕', '✨', '🌷', '🎀', '⭐', '💖', '🦋'];
    for (let i = 0; i < 35; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: 14 + Math.random() * 18,
        sym: symbols[Math.floor(Math.random() * symbols.length)],
        vy: -(0.3 + Math.random() * 0.6),
        vx: (Math.random() - 0.5) * 0.4,
        op: 0.15 + Math.random() * 0.3,
        rot: Math.random() * Math.PI * 2,
        rotV: (Math.random() - 0.5) * 0.02,
        isBubble: Math.random() > 0.45 // Balanced ~50% portion of custom glass heart bubbles!
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p, idx) => {
        if (p.isBubble) {
          // Render beautiful glass heart-shaped bubble
          drawHeartBubble(ctx, p.x, p.y, p.size, p.op);
        } else {
          // Render standard floating symbol emoji/flower
          ctx.save();
          ctx.globalAlpha = p.op;
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.font = `${p.size}px Arial, serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(p.sym, 0, 0);
          ctx.restore();
        }

        // Update Position
        p.y += p.vy;
        p.x += p.vx;
        p.rot += p.rotV;

        // Wrap around edges to drift up continuously
        if (p.y < -40) {
          p.y = canvas.height + 40;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -40 || p.x > canvas.width + 40) {
          p.vx = -p.vx;
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // --- Mouse Glitter Burst Effect ---
  const handlePointerDown = (e: React.PointerEvent) => {
    // Generate lovely custom quick particles on pointer contact position
    const cols = ['#e8436e', '#f7aec3', '#ffd6e7', '#f5c842', '#ffffff', '#c0305a', '#ff9eba'];
    const container = document.body;
    
    for (let i = 0; i < 12; i++) {
      const g = document.createElement('div');
      g.className = 'glitter';
      const gx = (Math.random() - 0.5) * 110;
      const gy = (Math.random() - 0.5) * 110;
      
      g.style.position = 'fixed';
      g.style.pointerEvents = 'none';
      g.style.zIndex = '999999';
      g.style.width = '8px';
      g.style.height = '8px';
      g.style.borderRadius = '50%';
      g.style.backgroundColor = cols[Math.floor(Math.random() * cols.length)];
      g.style.left = `${e.clientX}px`;
      g.style.top = `${e.clientY}px`;
      g.style.transform = `translate(0px, 0px) scale(1)`;
      g.style.transition = 'all 0.8s cubic-bezier(0.1, 0.8, 0.3, 1)';
      
      container.appendChild(g);
      
      // Delay transition to trigger CSS layout values
      setTimeout(() => {
        g.style.transform = `translate(${gx}px, ${gy}px) scale(0)`;
        g.style.opacity = '0';
      }, 20);

      setTimeout(() => g.remove(), 900);
    }
  };

  // --- Smooth Custom Cursor Pointer Tracking ---
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (cursorRef.current && cursorRingRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
        
        // Slight structural delay for the cursor ring helper
        cursorRingRef.current.style.left = `${e.clientX}px`;
        cursorRingRef.current.style.top = `${e.clientY}px`;
      }
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  // --- Audiobox Synth Loop Engine ---
  // Web Audio synth provides absolute bulletproof music playback with lovely echoing delays
  const stopSynth = () => {
    if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
  };

  const startSynth = () => {
    stopSynth();
    
    // Initialize standard context lazy layout
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const actx = audioContextRef.current;
    if (actx.state === 'suspended') {
      actx.resume();
    }

    // Build soft delay node lines for sweet fairy-tail box chime echo
    const delay = actx.createDelay(1.5);
    const feedback = actx.createGain();
    const delayGain = actx.createGain();

    delay.delayTime.value = 0.38;
    feedback.gain.value = 0.45;
    delayGain.gain.value = 0.25;

    // Connect feedback path
    delay.connect(feedback);
    feedback.connect(delay);
    
    // Connect output routing path
    delay.connect(delayGain);
    delayGain.connect(actx.destination);

    // Chime melody notes sequence & frequencies (C major / love theme vibe)
    // Notes: C5, E5, G5, B5, A5, G5, F5, E5, D5, C5, ...
    const freqs = [
      523.25, 659.25, 783.99, 987.77, 880.00, 783.99, 698.46, 659.25,
      587.33, 523.25, 659.25, 783.99, 1046.50, 987.77, 880.00, 783.99,
      659.25, 587.33, 523.25, 440.00, 493.88, 523.25, 587.33, 659.25
    ];

    let step = 0;
    
    const playNote = () => {
      const f = freqs[step % freqs.length];
      const osc = actx.createOscillator();
      const gain = actx.createGain();

      // Soft musicbox acoustic bell setting using sine + triangle waves
      osc.type = 'triangle';
      osc.frequency.value = f;

      gain.gain.setValueAtTime(0, actx.currentTime);
      gain.gain.linearRampToValueAtTime(0.18, actx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(actx.destination);
      gain.connect(delay); // Route to dreamy echo

      osc.start();
      osc.stop(actx.currentTime + 1.3);

      step++;
    };

    // Play first note immediately, then repeat
    playNote();
    synthIntervalRef.current = setInterval(playNote, 420);
  };

  // Play "Happy Birthday To You" chime-box arpeggios
  const playBirthdayMelodySynth = () => {
    try {
      stopSynth();
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const actx = audioContextRef.current;
      if (actx.state === 'suspended') {
        actx.resume();
      }
      
      const delay = actx.createDelay(1.5);
      const feedback = actx.createGain();
      const delayGain = actx.createGain();
      delay.delayTime.value = 0.35;
      feedback.gain.value = 0.45;
      delayGain.gain.value = 0.22;
      delay.connect(feedback);
      feedback.connect(delay);
      delay.connect(delayGain);
      delayGain.connect(actx.destination);

      const g4 = 392.00, a4 = 440.00, b4 = 493.88, c5 = 523.25, d5 = 587.33, e5 = 659.25, f5 = 698.46, g5 = 783.99;
      
      const notes = [
        { f: g4, d: 250 }, { f: g4, d: 250 }, { f: a4, d: 500 }, { f: g4, d: 500 }, { f: c5, d: 500 }, { f: b4, d: 1100 },
        { f: g4, d: 250 }, { f: g4, d: 250 }, { f: a4, d: 500 }, { f: g4, d: 500 }, { f: d5, d: 500 }, { f: c5, d: 1100 },
        { f: g4, d: 250 }, { f: g4, d: 250 }, { f: g5, d: 500 }, { f: e5, d: 500 }, { f: c5, d: 500 }, { f: b4, d: 500 }, { f: a4, d: 850 },
        { f: f5, d: 250 }, { f: f5, d: 250 }, { f: e5, d: 500 }, { f: c5, d: 500 }, { f: d5, d: 500 }, { f: c5, d: 1300 }
      ];

      let accum = 0;
      notes.forEach((note) => {
        const playTime = actx.currentTime + (accum / 1000);
        const osc1 = actx.createOscillator();
        const osc2 = actx.createOscillator();
        const gainNode = actx.createGain();

        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(note.f, playTime);
        
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(note.f * 2, playTime); // Shimmering harmonic octave

        gainNode.gain.setValueAtTime(0, playTime);
        gainNode.gain.linearRampToValueAtTime(0.12, playTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, playTime + (note.d / 1000) * 1.5);

        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(actx.destination);
        gainNode.connect(delay);

        osc1.start(playTime);
        osc2.start(playTime);
        osc1.stop(playTime + (note.d / 1000) * 1.6);
        osc2.stop(playTime + (note.d / 1000) * 1.6);

        accum += note.d + 60;
      });
    } catch (e) {
      console.warn("Chime synth failed", e);
    }
  };

  // Play or pause any specified track in our rich romantic instrumentals playlist
  const playActiveTrack = (index: number, shouldPlay: boolean) => {
    // 1. Force halt all playing audios and background synth interval instances
    stopSynth();
    try {
      if (bdayAudioRef.current) {
        bdayAudioRef.current.pause();
      }
    } catch {}
    try {
      if (warmMemoriesRef.current) {
        warmMemoriesRef.current.pause();
      }
    } catch {}
    try {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
    } catch {}

    if (!shouldPlay) {
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);

    // 2. Play the selected track based on the playlist selection index
    if (index === 0) {
      if (bdayAudioRef.current) {
        bdayAudioRef.current.play().catch((e) => {
          console.warn("Direct MP3 Musicbox play failed, falling back to Retro synth loop", e);
          startSynth();
        });
      } else {
        startSynth();
      }
    } else if (index === 1) {
      if (warmMemoriesRef.current) {
        warmMemoriesRef.current.play().catch((e) => {
          console.warn("Direct MP3 Piano play failed, falling back to Retro synth loop", e);
          startSynth();
        });
      } else {
        startSynth();
      }
    } else if (index === 2) {
      startSynth();
    } else if (index === 3) {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.play().catch((e) => {
          console.warn("Custom user MP3 stream play deferred or blocked", e);
        });
      }
    }
  };

  // Toggle playing music
  const toggleMusic = () => {
    const nextState = !isPlaying;
    playActiveTrack(activePlaylistIndex, nextState);
  };

  // Handle playlist music source change
  const handlePlaylistChange = (index: number) => {
    setActivePlaylistIndex(index);
    playActiveTrack(index, isPlaying);
  };

  // Safe release of Audio variables on dismount
  useEffect(() => {
    return () => {
      stopSynth();
      try {
        if (bdayAudioRef.current) bdayAudioRef.current.pause();
        if (warmMemoriesRef.current) warmMemoriesRef.current.pause();
        if (audioPlayerRef.current) audioPlayerRef.current.pause();
      } catch {}
    };
  }, []);

  // --- Password Safelock Gate ---
  const handleUnlock = () => {
    const cleanPw = password.trim().toLowerCase();
    // "munnathathu" is the adorable unlock trigger
    if (cleanPw === "munnathathu" || cleanPw === "intepenney" || cleanPw === "thathuy") {
      setUnlocked(true);
      setUnlockError("");
      
      // Heartburst and start sweet music automatically
      setIsPlaying(true);
      setTimeout(() => {
        // Instantly play the magnificent, beautiful music box Happy Birthday theme loop!
        playActiveTrack(0, true);
        triggerBirthdayConfetti();
      }, 300);
    } else {
      setUnlockError("❌ That's not correct, try again my love! 🙈");
      setPassword("");
    }
  };

  // --- Birthday Rain Confetti Generator ---
  const triggerBirthdayConfetti = (count = 100) => {
    const cols = ['#e8436e', '#f7aec3', '#ffd6e7', '#f5c842', '#ffffff', '#c0305a', '#ff85a1', '#ffd700', '#df8bf0'];
    const emojis = ['🎈', '🌸', '✨', '💖', '🎂', '🍭', '🦋', '⭐', '������'];
    
    for (let i = 0; i < count; i++) {
      const c = document.createElement('div');
      c.className = 'confetti-piece';
      c.style.position = 'fixed';
      c.style.pointerEvents = 'none';
      c.style.zIndex = '99999';
      
      const size = 12 + Math.random() * 20;
      const isEmoji = Math.random() > 0.45;

      if (isEmoji) {
        c.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        c.style.fontSize = `${size}px`;
      } else {
        c.style.width = `${6 + Math.random() * 8}px`;
        c.style.height = `${10 + Math.random() * 12}px`;
        c.style.backgroundColor = cols[Math.floor(Math.random() * cols.length)];
        c.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      }

      const screenWidth = window.innerWidth;
      const startLeft = Math.random() * screenWidth;
      const spinDuration = 2 + Math.random() * 3;
      const driftX = (Math.random() - 0.5) * 250;

      c.style.left = `${startLeft}px`;
      c.style.top = `-40px`;
      c.style.opacity = '1';
      c.style.transform = `rotate(${Math.random() * 360}deg)`;
      c.style.transition = `transform ${spinDuration}s linear, top ${spinDuration}s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity ${spinDuration}s ease-out`;

      document.body.appendChild(c);

      // Force render cycle
      setTimeout(() => {
        c.style.top = `${window.innerHeight + 50}px`;
        c.style.transform = `rotate(${Math.random() * 720}deg) translateX(${driftX}px)`;
        c.style.opacity = '0.3';
      }, 50);

      setTimeout(() => {
        c.remove();
      }, spinDuration * 1000);
    }
  };

  // --- Custom Image Processing & Base64 Compression ---
  const handleMemoryImageUpload = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 480;  // Limit dimensions perfectly for smooth data payload
        const MAX_HEIGHT = 480;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // JPEG format with 0.65 quality delivers ultra-high-quality visuals under ~60kb size!
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.65);
        
        // Update specific polaroid image card state
        const updated = memories.map(m => {
          if (m.id === id) {
            return { ...m, image: compressedBase64 };
          }
          return m;
        });

        setMemories(updated);
        localStorage.setItem('thathuyyy_memories', JSON.stringify(updated));
        triggerBirthdayConfetti(15);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Reset Polaroid memory photo to fallback emoji
  const resetMemoryMedia = (id: number) => {
    const updated = memories.map(m => {
      if (m.id === id) {
        return { ...m, image: null };
      }
      return m;
    });
    setMemories(updated);
    localStorage.setItem('thathuyyy_memories', JSON.stringify(updated));
  };

  // --- Save custom modifications helper ---
  const saveNicknames = (newNicks: string[]) => {
    setNicknames(newNicks);
    localStorage.setItem('thathuyyy_nicknames', JSON.stringify(newNicks));
  };

  const handleReasonFlip = (id: number) => {
    playInteractionChime();
    setFlipState(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Reason Editor
  const handleSaveReason = (id: number) => {
    const updated = reasons.map(r => {
      if (r.id === id) {
        return { ...r, text: reasonEditText };
      }
      return r;
    });
    setReasons(updated);
    localStorage.setItem('thathuyyy_reasons', JSON.stringify(updated));
    setEditingReasonId(null);
  };

  // Append new Reason
  const handleAddNewReason = () => {
    if (!newReasonText.trim()) return;
    const nextId = reasons.length > 0 ? Math.max(...reasons.map(r => r.id)) + 1 : 1;
    const appended = [
      ...reasons,
      { id: nextId, emoji: newReasonEmoji, text: newReasonText }
    ];
    setReasons(appended);
    localStorage.setItem('thathuyyy_reasons', JSON.stringify(appended));
    setNewReasonText("");
    triggerBirthdayConfetti(15);
  };

  // Remove custom or existing reason
  const handleDeleteReason = (id: number) => {
    const filtered = reasons.filter(r => r.id !== id);
    setReasons(filtered);
    localStorage.setItem('thathuyyy_reasons', JSON.stringify(filtered));
  };

  // Memory caption/description text editor
  const openMemoryEditor = (id: number) => {
    const m = memories.find(item => item.id === id);
    if (!m) return;
    setActiveMemoryId(id);
    setMemoryEditCaption(m.caption);
    setMemoryEditDesc(m.description);
  };

  const saveMemoryTextDetails = () => {
    if (!activeMemoryId) return;
    const updated = memories.map(m => {
      if (m.id === activeMemoryId) {
        return { ...m, caption: memoryEditCaption, description: memoryEditDesc };
      }
      return m;
    });
    setMemories(updated);
    localStorage.setItem('thathuyyy_memories', JSON.stringify(updated));
    setActiveMemoryId(null);
  };

  // Custom Audio URL Save
  const handleSaveAudioUrl = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('thathuyyy_audio_url', audioUrl);
    triggerBirthdayConfetti(10);
    alert("Audio stream URL saved beautifully! 💖 Make sure to choose 'Custom MP3' in the player!");
  };

  // Reset All Local Edits on demand
  const handleFullReset = () => {
    if (confirm("Would you like to reset all personalized notes, photos, nicknames, and guestbook back to their sparkling default state? 💕")) {
      localStorage.clear();
      setNicknames(DEFAULT_NICKNAMES);
      setReasons(DEFAULT_REASONS);
      setMemories(DEFAULT_MEMORIES);
      setWishes(DEFAULT_WISHES);
      setCustomLetter({
        greeting: "Dear Thathuyyy / Wifuyyy,",
        p1: "Happy 17th birthday, my absolute love 🎂 You have no idea how much you mean to me. Every single day you make me smile in the most ridiculous ways — I'm just stupid happy because you exist in my life.",
        p2: "You are Thamanna — beautiful, loud, hilarious, incredibly dramatic, and so so so special. I love every single version of you, even when you are being the most chaotic little menace on the planet 😭💕",
        p3: "17 looks breathtakingly incredible on you. This is your year, Wifuyyy. I hope it brings you everything your beautiful heart has ever wished for — and more. I will be right here cheering for you, embarrassingly in love, every step of the way. 🌸",
        sign: "Yours always & forever 💕"
      });
      setAudioUrl("");
      setActivePlaylistIndex(0);
      setUnlocked(false);
      setIsPlaying(false);
      stopSynth();
      alert("App has reset back to standard pink fairytale glory! ✨");
    }
  };

  // Letter modification saver
  const saveLetterEdit = () => {
    localStorage.setItem('thathuyyy_letter', JSON.stringify(customLetter));
    setEditingLetter(false);
    triggerBirthdayConfetti(20);
  };

  // Nickname manager additions
  const handleAddNickname = (name: string) => {
    if (!name.trim()) return;
    if (nicknames.includes(name)) return;
    const next = [...nicknames, name];
    saveNicknames(next);
  };

  const handleRemoveNickname = (index: number) => {
    const next = nicknames.filter((_, idx) => idx !== index);
    saveNicknames(next);
  };

  // Trivia game answering helper
  const handleAnswerQuiz = (optionIdx: number) => {
    setQuizAnswered(optionIdx);
    if (optionIdx === DEFAULT_QUIZ[currentQuizIndex].correctIndex) {
      setQuizScore(prev => prev + 1);
      triggerBirthdayConfetti(35);
    }
  };

  const handleNextQuizQuestion = () => {
    setQuizAnswered(null);
    if (currentQuizIndex + 1 < DEFAULT_QUIZ.length) {
      setCurrentQuizIndex(prev => prev + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleResetQuiz = () => {
    setCurrentQuizIndex(0);
    setQuizScore(0);
    setQuizCompleted(false);
    setQuizAnswered(null);
  };

  // Guestbook wishes addition
  const handleAddWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !guestMessage.trim()) return;
    
    const nextId = wishes.length > 0 ? Math.max(...wishes.map(w => w.id)) + 1 : 1;
    const newWishItem = {
      id: nextId,
      name: guestName.trim(),
      relation: guestRelation.trim() || "Lovely Guest",
      message: guestMessage.trim()
    };

    const nextWishes = [...wishes, newWishItem];
    setWishes(nextWishes);
    localStorage.setItem('thathuyyy_wishes', JSON.stringify(nextWishes));
    
    // Reset form fields
    setGuestName("");
    setGuestRelation("");
    setGuestMessage("");
    
    triggerBirthdayConfetti(50);
  };

  const handleDeleteWish = (id: number) => {
    const filtered = wishes.filter(w => w.id !== id);
    setWishes(filtered);
    localStorage.setItem('thathuyyy_wishes', JSON.stringify(filtered));
  };

  // Climax birthday celebrate trigger
  const handleMainCelebrateClick = () => {
    // Elegant combination music solution: Try playing professional piano cover, else synthesized fallback!
    try {
      stopSynth();
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      
      if (bdayAudioRef.current) {
        bdayAudioRef.current.currentTime = 0;
        bdayAudioRef.current.play().catch(e => {
          console.warn("Direct MP3 play failed due to browser environment restrictions, running synths", e);
          playBirthdayMelodySynth();
        });
      } else {
        playBirthdayMelodySynth();
      }
      setIsPlaying(true);
    } catch (e) {
      console.warn("Player play error in celebrate climax trigger", e);
      playBirthdayMelodySynth();
    }

    triggerBirthdayConfetti(140);
    setShowPopup(true);
  };

  return (
    <div 
      className="min-h-screen font-nunito bg-[#fffbfd] text-slate-800 relative selection:bg-rose-200 overflow-x-hidden"
      onPointerDown={handlePointerDown}
      id="root-container"
    >
      {/* ── CUSTOM MOUSE CURSORS (Desktop Only, Pointer Enabled) ── */}
      <div 
        ref={cursorRef} 
        className="cursor hidden lg:block" 
        style={{ transform: 'translate(-50%, -50%)', transition: 'width 0.1s, height 0.1s' }}
      ></div>
      <div 
        ref={cursorRingRef} 
        className="cursor-ring hidden lg:block" 
        style={{ transform: 'translate(-50%, -50%)', transition: 'all 0.15s cubic-bezier(0.1, 0.8, 0.3, 1)' }}
      ></div>

      {/* ── FLOATING GRAPHICS BACKGROUND ── */}
      <canvas ref={canvasRef} id="particleCanvas" className="fixed inset-0 w-full h-full pointer-events-none z-0" />

      {/* ── HAPPY BIRTHDAY CORE INSTRUMENTAL TRACK ── */}
      <audio 
        ref={bdayAudioRef} 
        src="https://raw.githubusercontent.com/cripso-zhoyoto/image-hosting/7165ee9ee2c8dbd9eeb605abdebbadc0c0b6e251/crip/shidenbeatsmusic-happy-birthday-to-you-bossa-nova-style-arrangement-21399.mp3" 
        loop 
        className="hidden" 
        preload="auto"
      />

      {/* ── ROMANTIC PIANO BACKGROUND TRACK ── */}
      <audio 
        ref={warmMemoriesRef} 
        src="https://www.chosic.com/wp-content/uploads/2020/06/Warm-Memories-Emotional-Inspiring-Piano.mp3" 
        loop 
        className="hidden" 
        preload="auto"
      />

      {/* ── PRE-LOAD OPTIONAL AUDIO PLAYER STREAM ── */}
      {audioUrl && (
        <audio 
          ref={audioPlayerRef} 
          src={audioUrl} 
          loop 
          className="hidden" 
          preload="auto"
        />
      )}

      {/* ═════════════════════════════════════
           PASSWORD LOCK PROTECTION SCREEN
         ═════════════════════════════════════ */}
      {!unlocked ? (
        <div 
          id="lockScreen" 
          className="fixed inset-0 z-[9999] flex items-center justify-center flex-col px-4 overflow-y-auto py-6"
        >
          {/* Beautiful fairytale image background for Desktop */}
          <img 
            src="https://raw.githubusercontent.com/cripso-zhoyoto/image-hosting/c7ccc548ef4b789318cec7e8bbdbc6f02b093ade/crip/Snapchat-1289242329.jpg" 
            className="hidden sm:block absolute inset-0 w-full h-full object-cover select-none pointer-events-none z-0"
            referrerPolicy="no-referrer"
            alt="Cozy Fairytale Desktop Backdrop"
          />
          {/* Beautiful fairytale image background for Mobile */}
          <img 
            src="https://raw.githubusercontent.com/cripso-zhoyoto/image-hosting/7165ee9ee2c8dbd9eeb605abdebbadc0c0b6e251/crip/Untitled%20design.png" 
            className="block sm:hidden absolute inset-0 w-full h-full object-cover select-none pointer-events-none z-0"
            referrerPolicy="no-referrer"
            alt="Cozy Fairytale Mobile Backdrop"
          />
          {/* Sweet semi-transparent soft overlay to ensure magnificent text readability */}
          <div className="absolute inset-0 bg-rose-950/45 backdrop-blur-[3px] z-[1]" />

          {/* Sweet Floating Background floating icons */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-10">
            {['🌸', '💕', '🌷', '🎀', '🧁', '⭐', '🎂', '🧸', '💖', '💌', '💅', '👸'].map((emoji, i) => (
              <div 
                key={i} 
                className="absolute text-2xl sm:text-3xl opacity-20 animate-bounce"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDuration: `${3 + Math.random() * 5}s`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              >
                {emoji}
              </div>
            ))}
          </div>

          <div className="w-full max-w-sm sm:max-w-md bg-white/20 backdrop-blur-xl border border-white/40 rounded-3xl p-5 sm:p-8 text-center relative z-20 shadow-2xl animate-fade-in mx-auto my-auto">
            {/* Added "Happy Birthday My Wifuyyy" greetings text */}
            <div className="mb-3 sm:mb-4">
              <span className="font-dancing text-2xl sm:text-3xl md:text-4xl font-bold text-white drop-shadow-[0_2px_12px_rgba(232,67,110,0.85)] block animate-pulse">
                Happy Birthday My Wifuyyy! 💖
              </span>
              <span className="text-[8px] sm:text-[10px] text-pink-100 font-bold tracking-widest uppercase mt-0.5 sm:mt-1 block">
                You deserve the whole entire galaxy today
              </span>
            </div>

            {/* Passcode Countdown Display */}
            <div className="mb-3 sm:mb-5 p-2.5 sm:p-3.5 bg-rose-950/30 border border-white/25 rounded-2xl max-w-xs mx-auto text-white shadow-inner">
              {countdownText.isToday ? (
                <span className="text-[8px] sm:text-[9px] font-black text-pink-300 uppercase tracking-widest animate-pulse mb-1 block">
                  💖 IT'S HER 17TH BIRTHDAY TODAY! 💖
                </span>
              ) : (
                <span className="text-[7px] sm:text-[8px] font-bold text-pink-100 uppercase tracking-wider block mb-1">
                  🎂 THE COZY BIRTHDAY COUNTDOWN 🎂
                </span>
              )}
              <div className="flex gap-2 sm:gap-2.5 items-center justify-center">
                <div className="text-center min-w-[32px] sm:min-w-[36px]">
                  <span className="block font-dancing text-lg sm:text-xl text-white font-bold leading-none">{countdownText.days}</span>
                  <span className="text-[7px] sm:text-[8px] uppercase tracking-wider text-pink-200 font-semibold">Days</span>
                </div>
                <span className="text-pink-300 font-bold text-xs sm:text-sm leading-none">:</span>
                <div className="text-center min-w-[32px] sm:min-w-[36px]">
                  <span className="block font-dancing text-lg sm:text-xl text-white font-bold leading-none">{String(countdownText.hours).padStart(2, '0')}</span>
                  <span className="text-[7px] sm:text-[8px] uppercase tracking-wider text-pink-200 font-semibold">Hrs</span>
                </div>
                <span className="text-pink-300 font-bold text-xs sm:text-sm leading-none">:</span>
                <div className="text-center min-w-[32px] sm:min-w-[36px]">
                  <span className="block font-dancing text-lg sm:text-xl text-white font-bold leading-none">{String(countdownText.mins).padStart(2, '0')}</span>
                  <span className="text-[7px] sm:text-[8px] uppercase tracking-wider text-pink-200 font-semibold">Mins</span>
                </div>
                <span className="text-pink-300 font-bold text-xs sm:text-sm leading-none">:</span>
                <div className="text-center min-w-[32px] sm:min-w-[36px]">
                  <span className="block font-dancing text-lg sm:text-xl text-white font-bold leading-none">{String(countdownText.secs).padStart(2, '0')}</span>
                  <span className="text-[7px] sm:text-[8px] uppercase tracking-wider text-pink-200 font-semibold">Secs</span>
                </div>
              </div>
            </div>

            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4 shadow-inner scale-100 hover:scale-110 transition-transform duration-300">
              <span className="text-2xl sm:text-3xl animate-bounce" style={{ animationDuration: '3s' }}>🔒</span>
            </div>
            
            <h1 className="font-dancing text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2 drop-shadow-md">
              Inte Penninte  Magic Gate 🌸
            </h1>
            <p className="text-white/80 text-[11px] sm:text-sm mb-4 sm:mb-6 max-w-xs mx-auto leading-relaxed">
              This space is reserved strictly for a beautiful 17-year-old princess. Please enter the secret code! 🤫
            </p>

            <div className="space-y-3 sm:space-y-4 max-w-sm mx-auto">
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Type the secret magic word..."
                  className="w-full py-2.5 sm:py-3.5 px-5 sm:px-6 pr-10 sm:pr-12 rounded-full border-2 border-white/40 bg-white/25 text-white placeholder-white/60 focus:outline-none focus:border-white focus:bg-white/35 text-center font-bold tracking-widest text-sm sm:text-lg transition-all duration-300"
                  onKeyDown={(e) => { if (e.key === 'Enter') handleUnlock(); }}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {unlockError && (
                <p className="text-rose-100 text-[11px] sm:text-xs font-semibold drop-shadow animate-pulse">
                  {unlockError}
                </p>
              )}

              <button 
                onClick={handleUnlock}
                className="w-full bg-white text-rose-600 hover:bg-rose-50 font-bold py-2.5 sm:py-3.5 px-6 sm:px-8 rounded-full shadow-lg transition-transform active:scale-95 duration-200 flex items-center justify-center gap-2"
              >
                <Heart className="fill-rose-500 stroke-none animate-pulse" size={16} />
                <span className="font-dancing text-lg sm:text-xl tracking-wider">Open with Love 💌</span>
              </button>
            </div>

            <div className="mt-4 sm:mt-8 pt-3 sm:pt-5 border-t border-white/20 text-white/50 text-[10px] sm:text-xs text-center">
              <span className="block font-semibold uppercase tracking-wider mb-0.5 sm:mb-1 text-[8px] sm:text-[10px]">💡 HINT TO HELP</span>
              <span>It's the cute nickname she uses for herself! (11 letters, begins with 'm') 🌸</span>
            </div>
          </div>
        </div>
      ) : null}

      {/* ═════════════════════════════════════
           PERSISTENT MUSIC & CONFIG CONTROLS
         ═════════════════════════════════════ */}
      {unlocked && (
        <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2.5 max-w-xs">
          
          {/* Quick Config Reset Key */}
          <button 
            onClick={handleFullReset}
            title="Reset to sparkling default details"
            className="w-10 h-10 bg-white border border-rose-100 text-rose-400 hover:text-rose-600 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 group active:scale-95"
          >
            <RotateCcw size={16} className="group-hover:rotate-180 transition-transform duration-500" />
          </button>

          {/* Sweet Floating Music Player interface */}
          <div className="bg-white/95 border border-rose-100 rounded-2xl p-3.5 shadow-xl flex flex-col gap-2 w-56 md:w-64 animate-fade-in text-slate-700">
            <div className="flex items-center justify-between gap-2 border-b border-pink-50 pb-2">
              <div className="flex items-center gap-1.5 overflow-hidden">
                <Music size={16} className={`text-rose-500 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
                <span className="font-sans text-xs font-semibold text-rose-600 truncate">
                  {activePlaylistIndex === 0 && "Bossa Nova Style 🎂"}
                  {activePlaylistIndex === 1 && "Romantic Piano 🎹"}
                  {activePlaylistIndex === 2 && "Fairy-Tail Chimes 🔔"}
                  {activePlaylistIndex === 3 && "Custom audio stream 🎶"}
                </span>
              </div>
              
              <button 
                onClick={toggleMusic}
                className="w-7 h-7 bg-rose-500 hover:bg-rose-600 rounded-full flex items-center justify-center text-white text-xs transition-colors shadow-inner cursor-pointer"
              >
                {isPlaying ? <Pause size={12} /> : <Play size={12} className="ml-0.5" />}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              <button 
                type="button"
                onClick={() => { handlePlaylistChange(0); playInteractionChime(); }}
                className={`py-1.5 px-1 rounded-lg text-[10px] font-extrabold transition-all text-center cursor-pointer ${
                  activePlaylistIndex === 0 
                  ? 'bg-rose-100 text-rose-600 shadow-sm border border-rose-200' 
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                Bossa Nova
              </button>
              <button 
                type="button"
                onClick={() => { handlePlaylistChange(1); playInteractionChime(); }}
                className={`py-1.5 px-1 rounded-lg text-[10px] font-extrabold transition-all text-center cursor-pointer ${
                  activePlaylistIndex === 1 
                  ? 'bg-rose-100 text-rose-600 shadow-sm border border-rose-200' 
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                Soft Piano
              </button>
              <button 
                type="button"
                onClick={() => { handlePlaylistChange(2); playInteractionChime(); }}
                className={`py-1.5 px-1 rounded-lg text-[10px] font-extrabold transition-all text-center cursor-pointer ${
                  activePlaylistIndex === 2 
                  ? 'bg-rose-100 text-rose-600 shadow-sm border border-rose-200' 
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                Chime Synth
              </button>
              <button 
                type="button"
                onClick={() => {
                  playInteractionChime();
                  if (!audioUrl) {
                    const ans = prompt("Please enter a direct MP3 web URL:", "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3");
                    if (ans) {
                      setAudioUrl(ans);
                      localStorage.setItem('thathuyyy_audio_url', ans);
                      handlePlaylistChange(3);
                    }
                  } else {
                    handlePlaylistChange(3);
                  }
                }}
                className={`py-1.5 px-1 rounded-lg text-[10px] font-extrabold transition-all text-center cursor-pointer ${
                  activePlaylistIndex === 3 
                  ? 'bg-rose-100 text-rose-600 shadow-sm border border-rose-200' 
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                Custom MP3
              </button>
            </div>

            {/* Editable playlist stream form if they clicked custom */}
            {activePlaylistIndex === 3 && (
              <form onSubmit={handleSaveAudioUrl} className="flex gap-1 mt-1">
                <input 
                  type="url" 
                  placeholder="Paste direct .mp3 url..." 
                  value={audioUrl}
                  onChange={(e) => setAudioUrl(e.target.value)}
                  className="w-full text-[10px] px-2 py-1 border border-pink-100 rounded focus:outline-pink-300"
                />
                <button type="submit" className="bg-rose-400 text-white rounded p-1 hover:bg-rose-500 cursor-pointer">
                  <Save size={10} />
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════
           MAIN COZY BIRTHDAY SCREEN CONTENT
         ═════════════════════════════════════ */}
      {unlocked && (
        <div className="relative z-10">
          
          {/* ─────────────────────────────────
               SECTION 1: MAIN FANFARE HERO
             ───────────────────────────────── */}
          <section className="min-h-[105vh] flex flex-col justify-center items-center px-4 py-16 relative overflow-hidden bg-gradient-to-b from-rose-50 via-pink-100/50 to-[#fffbfd] text-center">
            
            {/* Romantic full-bleed background image */}
            <img 
              src="https://raw.githubusercontent.com/cripso-zhoyoto/image-hosting/c7ccc548ef4b789318cec7e8bbdbc6f02b093ade/crip/Snapchat-1289242329.jpg" 
              className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none z-0 opacity-15"
              referrerPolicy="no-referrer"
              alt="Romantic Hero Backdrop"
            />
            {/* Safe tint layer */}
            <div className="absolute inset-0 bg-gradient-to-b from-rose-50/70 via-pink-100/35 to-[#fffbfd] z-[1]" />

            {/* Top aesthetic element */}
            <div className="absolute top-8 select-none pointer-events-none text-rose-100 border border-rose-200/50 rounded-full px-5 py-2 text-[10px] uppercase font-bold tracking-widest bg-white/40 shadow-sm z-10">
              ✨ Interactive Magical Keepsake Card ✨
            </div>

            {/* Background elements blur glow effect */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] md:w-[500px] md:h-[500px] bg-gradient-to-tr from-pink-300 to-rose-400 opacity-20 rounded-full blur-3xl pointer-events-none z-0 animate-pulse" />

            <div className="relative z-10 max-w-3xl mx-auto space-y-6">
              
              {/* Beautiful Elegant Countdown Badge */}
              <div className="inline-flex flex-col items-center bg-white/75 backdrop-blur-md border border-rose-100/60 rounded-2xl px-5 py-2.5 shadow-sm max-w-xs mx-auto animate-fade-in">
                {countdownText.isToday && (
                  <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest animate-pulse mb-1 flex items-center gap-1">
                    💖 IT'S HER 17TH BIRTHDAY TODAY! 💖
                  </span>
                )}
                <div className="flex gap-3 items-center">
                  <div className="text-center">
                    <span className="block font-dancing text-lg text-rose-600 font-bold leading-none">{countdownText.days}</span>
                    <span className="text-[8px] uppercase tracking-wider text-slate-400 font-bold">Days</span>
                  </div>
                  <span className="text-rose-300 font-bold text-[10px]">:</span>
                  <div className="text-center">
                    <span className="block font-dancing text-lg text-rose-600 font-bold leading-none">{String(countdownText.hours).padStart(2, '0')}</span>
                    <span className="text-[8px] uppercase tracking-wider text-slate-400 font-bold">Hours</span>
                  </div>
                  <span className="text-rose-300 font-bold text-[10px]">:</span>
                  <div className="text-center">
                    <span className="block font-dancing text-lg text-rose-600 font-bold leading-none">{String(countdownText.mins).padStart(2, '0')}</span>
                    <span className="text-[8px] uppercase tracking-wider text-slate-400 font-bold">Mins</span>
                  </div>
                  <span className="text-rose-300 font-bold text-[10px]">:</span>
                  <div className="text-center">
                    <span className="block font-dancing text-lg text-rose-600 font-bold leading-none">{String(countdownText.secs).padStart(2, '0')}</span>
                    <span className="text-[8px] uppercase tracking-wider text-slate-400 font-bold">Secs</span>
                  </div>
                </div>
                <span className="text-[8px] text-slate-400 font-semibold tracking-wide mt-1.5 block leading-none">
                  CANDLES RUNNING TO 18TH SWEET MILESTONE MAY 24, 2027 🎂
                </span>
              </div>

              {/* Sweet tag */}
              <div className="inline-flex items-center gap-1 bg-rose-500 text-white font-semibold rounded-full py-1.5 px-6 text-xs tracking-widest uppercase shadow-md animate-bounce">
                <Sparkles size={12} className="animate-spin" style={{ animationDuration: '4s' }} />
                Today is the day!
                <Sparkles size={12} className="animate-spin" style={{ animationDuration: '4s' }} />
              </div>

              {/* Magnificent Age text */}
              <div className="relative inline-block my-2">
                <div className="font-dancing text-[10rem] md:text-[14rem] font-bold text-rose-500 leading-none select-none tracking-tighter drop-shadow-xl animate-float-slow">
                  17
                </div>
                {/* Visual decoration overlay */}
                <div className="absolute -top-4 -right-8 text-5xl md:text-6xl select-none animate-float-fast">
                  👑
                </div>
                <div className="absolute -bottom-2 -left-6 text-4xl select-none animate-bounce" style={{ animationDelay: '0.8s' }}>
                  🌸
                </div>
              </div>

              {/* Main Name */}
              <h1 className="font-dancing text-5xl md:text-7xl font-bold text-rose-700 tracking-wide drop-shadow-sm">
                Thamanna 💕
              </h1>

              {/* Heart-Framed Polaroid Piece of the Birthday Princess */}
              <div className="relative my-6 mx-auto w-64 max-w-full rotate-1 bg-white border border-rose-100 p-4 shadow-xl rounded-2xl transition-all duration-300 hover:rotate-0 hover:scale-105 hover:shadow-2xl z-10">
                <div className="relative overflow-hidden rounded-xl bg-pink-50 aspect-[3/4] flex items-center justify-center">
                  <img 
                    src="https://raw.githubusercontent.com/cripso-zhoyoto/image-hosting/f0364526ce8d2d13989e1415244ade3c1e57165e/crip/Snapchat-1289242329.jpg" 
                    className="w-full h-full object-cover select-none" 
                    referrerPolicy="no-referrer"
                    alt="Birthday Princess Thamanna" 
                  />
                  {/* Subtle glass reflection overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/20 pointer-events-none" />
                </div>
                <div className="pt-3 pb-1">
                  <span className="font-dancing text-2xl font-bold text-rose-600 block">The Birthday Princess 👑</span>
                  <span className="text-[9px] uppercase tracking-wider text-rose-400 font-bold block mt-0.5">May 24, 2026</span>
                </div>
              </div>

              {/* Editable Name Badges / Nicknames Pills */}
              <div className="space-y-3">
                <span className="text-xs uppercase tracking-wider font-semibold text-rose-400 block">Sweet Nicknames:</span>
                <div className="flex flex-wrap items-center justify-center gap-2 max-w-xl mx-auto">
                  {nicknames.map((val, idx) => (
                    <span 
                      key={idx} 
                      className="inline-flex items-center gap-1 bg-white border border-rose-100 hover:border-rose-300 text-rose-600 rounded-full py-1 px-3.5 text-xs md:text-sm font-semibold shadow-sm transition-all animate-fade-in group"
                    >
                      {val}
                      <button 
                        onClick={() => handleRemoveNickname(idx)}
                        className="text-rose-300 hover:text-rose-500 inline-block text-[10px] pl-1 h-3.5 w-3.5 items-center justify-center"
                        title={`Delete ${val}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  
                  {/* Nickname input appender */}
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.currentTarget;
                      const input = form.elements.namedItem('nickInput') as HTMLInputElement;
                      if (input && input.value) {
                        handleAddNickname(input.value);
                        input.value = "";
                      }
                    }}
                    className="flex inline-flex items-center"
                  >
                    <input 
                      type="text" 
                      name="nickInput"
                      placeholder="+ Add cozy name" 
                      className="bg-white/55 border border-dashed border-pink-200 focus:border-rose-400 focus:outline-none rounded-full py-1 px-3 text-xs md:text-sm text-center text-rose-500 w-32 placeholder-pink-300"
                    />
                  </form>
                </div>
              </div>

              {/* Romantic Tagline */}
              <p className="font-playfair italic text-rose-600 text-lg md:text-xl font-medium max-w-lg mx-auto leading-relaxed pt-2">
                "The girl who turned my whole world pink and filled every single day with warmth, lovely chaos, and the most cringe-beautiful love imaginable! 🌸"
              </p>

              <div className="flex justify-center gap-4 text-3xl font-normal py-4">
                <span>🎂</span>
                <span className="animate-spin" style={{ animationDuration: '8s' }}>👑</span>
                <span>🎀</span>
                <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>💖</span>
                <span>✨</span>
              </div>

              <div className="pt-6 animate-pulse">
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Scroll down for sweet surprises</span>
                <span className="block text-rose-300 text-lg mt-1 select-none">↓</span>
              </div>

            </div>
          </section>

          {/* ─────────────────────────────────
               SECTION 2: CUSTOMIZABLE LOVE LETTER
             ───────────────────────────────── */}
          <section className="py-20 px-4 max-w-5xl mx-auto">
            <div className="text-center space-y-2 mb-12">
              <h2 className="font-dancing text-4xl md:text-5xl font-bold text-rose-700">
                A Sweet Personal Letter for You 💌
              </h2>
              <p className="font-playfair italic text-rose-400 text-sm">
                From the person who is forever utterly obsessed with you
              </p>
            </div>

            <div className="w-full max-w-2xl mx-auto bg-white border border-pink-100 rounded-3xl p-6 md:p-12 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
              {/* Notebook Paper Styling Lines */}
              <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-rose-400 shadow-sm" />
              <div className="absolute top-0 bottom-0 left-8 md:left-14 w-[1px] bg-pink-100" />
              
              {/* Backside watermarked vectors */}
              <span className="absolute right-4 top-4 text-9xl text-slate-500/5 select-none pointer-events-none">💌</span>
              <span className="absolute left-8 bottom-4 text-8xl text-slate-500/5 select-none pointer-events-none">🧸</span>

              <div className="pl-4 md:pl-10 space-y-6 relative z-10 font-playfair text-slate-700 leading-loose text-base md:text-lg">
                
                {/* Editor Tab toggle buttons */}
                <div className="flex justify-end gap-2 border-b border-pink-50 pb-4">
                  <button 
                    onClick={() => setEditingLetter(!editingLetter)}
                    className="inline-flex items-center gap-1.5 text-xs bg-rose-50 text-rose-500 font-semibold py-1.5 px-3.5 rounded-full hover:bg-rose-100 transition-colors"
                  >
                    <Edit2 size={12} />
                    {editingLetter ? "Cancel" : "Edit This Letter"}
                  </button>
                </div>

                {editingLetter ? (
                  // Letter editing fields
                  <div className="space-y-4 font-nunito text-sm">
                    <div>
                      <label className="block text-xs font-bold text-rose-500 mb-1">GREETING</label>
                      <input 
                        type="text" 
                        value={customLetter.greeting}
                        onChange={(e) => setCustomLetter({ ...customLetter, greeting: e.target.value })}
                        className="w-full px-3 py-2 border border-pink-100 rounded-md focus:outline-pink-400 text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-rose-500 mb-1">PARAGRAPH 1</label>
                      <textarea 
                        rows={3}
                        value={customLetter.p1}
                        onChange={(e) => setCustomLetter({ ...customLetter, p1: e.target.value })}
                        className="w-full px-3 py-2 border border-pink-100 rounded-md focus:outline-pink-400 text-slate-800 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-rose-500 mb-1">PARAGRAPH 2</label>
                      <textarea 
                        rows={3}
                        value={customLetter.p2}
                        onChange={(e) => setCustomLetter({ ...customLetter, p2: e.target.value })}
                        className="w-full px-3 py-2 border border-pink-100 rounded-md focus:outline-pink-400 text-slate-800 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-rose-500 mb-1">PARAGRAPH 3</label>
                      <textarea 
                        rows={3}
                        value={customLetter.p3}
                        onChange={(e) => setCustomLetter({ ...customLetter, p3: e.target.value })}
                        className="w-full px-3 py-2 border border-pink-100 rounded-md focus:outline-pink-400 text-slate-800 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-rose-500 mb-1">SIGNATURE</label>
                      <input 
                        type="text" 
                        value={customLetter.sign}
                        onChange={(e) => setCustomLetter({ ...customLetter, sign: e.target.value })}
                        className="w-full px-3 py-2 border border-pink-100 rounded-md focus:outline-pink-400 text-slate-800"
                      />
                    </div>
                    <button 
                      onClick={saveLetterEdit}
                      className="bg-rose-500 text-white font-bold py-2 px-6 rounded-md hover:bg-rose-600 transition-colors flex items-center gap-1 text-xs"
                    >
                      <Check size={14} /> Save Letter
                    </button>
                  </div>
                ) : (
                  // Render Beautiful Letter
                  <div className="space-y-6">
                    <p className="font-dancing text-2xl md:text-3xl text-rose-600 font-bold mb-4">
                      {customLetter.greeting}
                    </p>
                    
                    <p className="indent-8 leading-relaxed">
                      {customLetter.p1}
                    </p>
                    
                    <p className="indent-8 leading-relaxed">
                      {customLetter.p2}
                    </p>
                    
                    <p className="indent-8 leading-relaxed">
                      {customLetter.p3}
                    </p>
                    
                    <div className="pt-8 text-right space-y-1">
                      <p className="font-dancing text-2xl text-rose-500 font-bold">
                        {customLetter.sign}
                      </p>
                      <p className="text-xs text-rose-300 italic font-sans font-semibold">
                        — your biggest, most embarrassing fan 🌷
                      </p>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </section>

          {/* ─────────────────────────────────
               SECTION 3: 17 REASONS I LOVE YOU (Interactive Flip Grid)
             ───────────────────────────────── */}
          <section className="py-20 bg-rose-50/20 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center space-y-2 mb-12">
                <h2 className="font-dancing text-4xl md:text-5xl font-bold text-rose-700">
                  17 Beautiful Reasons I Love You 💖
                </h2>
                <p className="font-playfair italic text-rose-400 text-sm">
                  Click on any card to flip and reveal the sweet details. Feel free to modify or append your own!
                </p>
              </div>

              {/* Reasons list Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {reasons.map((r, index) => {
                  const isFlipped = flipState[r.id] || false;
                  return (
                    <div 
                      key={r.id}
                      className="h-56 relative group perspective cursor-pointer"
                      onClick={() => handleReasonFlip(r.id)}
                    >
                      {/* Inner Container to support 3D Flipping */}
                      <div className={`w-full h-full duration-500 transform-style preserve-3d relative ${isFlipped ? 'rotate-y-180' : ''}`}>
                        
                        {/* Front of Card */}
                        <div className="absolute inset-0 backface-hidden bg-white border border-rose-100 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-md hover:shadow-lg transition-all group-hover:-translate-y-1 duration-200">
                          <span className="text-5xl mb-3 animate-pulse">{r.emoji}</span>
                          <span className="font-sans text-[10px] text-rose-300 font-bold uppercase tracking-wider mb-1">Reason #{index + 1}</span>
                          <h3 className="font-dancing text-xl text-rose-600 font-bold truncate w-full">
                            Click to View ✨
                          </h3>
                        </div>

                        {/* Back of Card */}
                        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-white to-rose-50/40 border border-rose-200 rounded-2xl p-5 flex flex-col justify-between shadow-inner">
                          {editingReasonId === r.id ? (
                            <div className="space-y-1 h-full flex flex-col justify-between" onClick={(e) => e.stopPropagation()}>
                              <textarea 
                                value={reasonEditText}
                                onChange={(e) => setReasonEditText(e.target.value)}
                                className="w-full flex-1 p-1 text-xs border border-pink-200 focus:outline-pink-400 rounded resize-none"
                              />
                              <div className="flex gap-1 justify-end">
                                <button 
                                  onClick={() => handleSaveReason(r.id)}
                                  className="p-1 text-white bg-green-500 rounded text-xs hover:bg-green-600"
                                >
                                  Save
                                </button>
                                <button 
                                  onClick={() => setEditingReasonId(null)}
                                  className="p-1 text-slate-500 bg-slate-100 rounded text-xs hover:bg-slate-200"
                                >
                                  X
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex justify-between items-start gap-1">
                                <span className="text-xl">{r.emoji}</span>
                                <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                                  <button 
                                    onClick={() => { setEditingReasonId(r.id); setReasonEditText(r.text); }}
                                    className="p-1 bg-pink-50 hover:bg-pink-100 rounded-md text-pink-500 transition-colors"
                                    title="Edit details"
                                  >
                                    <Edit2 size={11} />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteReason(r.id)}
                                    className="p-1 bg-slate-50 hover:bg-rose-50 rounded-md text-slate-400 hover:text-rose-500 transition-colors"
                                    title="Delete reason"
                                  >
                                    <Trash2 size={11} />
                                  </button>
                                </div>
                              </div>
                              <p className="font-playfair italic text-xs md:text-sm text-slate-700 leading-relaxed text-center my-auto">
                                "{r.text}"
                              </p>
                              <span className="text-[9px] text-right font-bold text-rose-300 pt-1 pointer-events-none">
                                click to flip
                              </span>
                            </>
                          )}
                        </div>

                      </div>
                    </div>
                  );
                })}

                {/* Adding custom reason slot card */}
                <div className="border-2 border-dashed border-pink-200 rounded-2xl p-5 flex flex-col justify-between bg-white/50 h-56 min-h-[14rem]">
                  <div className="space-y-2">
                    <span className="text-xs uppercase font-bold text-rose-400 tracking-wider">Create Custom Reason:</span>
                    <div className="flex gap-2.5">
                      <select 
                        value={newReasonEmoji} 
                        onChange={(e) => setNewReasonEmoji(e.target.value)}
                        className="p-1 bg-white border border-pink-100 rounded text-sm focus:outline-none"
                      >
                        {['💖', '🌸', '🧁', '💎', '🎨', '🔥', '😻', '🌷', '🦋', '⭐', '🎈', '🍪'].map(em => (
                          <option key={em} value={em}>{em}</option>
                        ))}
                      </select>
                      <span className="text-xs text-slate-400 self-center">Choose Emoji icon</span>
                    </div>
                    <textarea 
                      placeholder="Why do you love her? Write here..."
                      value={newReasonText}
                      onChange={(e) => setNewReasonText(e.target.value)}
                      rows={3}
                      className="w-full text-xs p-2 border border-pink-100 focus:outline-pink-400 bg-white rounded-lg resize-none"
                    />
                  </div>
                  <button 
                    onClick={handleAddNewReason}
                    className="w-full mt-2 bg-rose-500 hover:bg-rose-600 text-white font-semibold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow"
                  >
                    <Plus size={14} /> Append Reason #{reasons.length + 1}
                  </button>
                </div>
              </div>

            </div>
          </section>

          {/* ─────────────────────────────────
               SECTION 4: COZY STATS CORNER
             ───────────────────────────────── */}
          <section className="py-20 bg-gradient-to-r from-rose-500 to-rose-600 text-white px-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent pointer-events-none" />
            <div className="max-w-5xl mx-auto text-center space-y-12 relative z-10">
              
              <div className="space-y-2">
                <h2 className="font-dancing text-4xl md:text-5xl font-bold">
                  Thathuyyy in Exact Numbers 📊
                </h2>
                <p className="text-rose-100 italic font-playfair text-sm">
                  The undeniable exact science of being incredible
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { value: "17", label: "Happy Candles 🎂" },
                  { value: "∞", label: "Endless Affection 💖" },
                  { value: "100%", label: "Pure Icon Queen 💅" },
                  { value: "0", label: "Physical Flaws 🌸" },
                  { value: "No. 1", label: "Only Wifuyyy ✨" }
                ].map((st, i) => (
                  <div key={i} className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-lg transition-transform hover:-translate-y-1 duration-200">
                    <div className="font-dancing text-4xl md:text-5xl font-bold mb-1">{st.value}</div>
                    <div className="text-white/80 text-[10px] uppercase font-bold tracking-widest">{st.label}</div>
                  </div>
                ))}
              </div>

            </div>
          </section>

          {/* ─────────────────────────────────
               SECTION 5: CUSTOMIZABLE POLAROID PHOTO GALLERY
             ───────────────────────────────── */}
          <section className="py-20 px-4 max-w-6xl mx-auto">
            <div className="text-center space-y-2 mb-12">
              <h2 className="font-dancing text-4xl md:text-5xl font-bold text-rose-700">
                Our Cozy Little World 📂
              </h2>
              <p className="font-playfair italic text-rose-400 text-sm">
                Upload custom memories directly from your device! Your files are compressed locally & saved so they always stay fresh!
              </p>
            </div>

            {/* View Mode Toggle Controls */}
            <div className="flex justify-center mb-10">
              <div className="bg-pink-50/70 p-1 rounded-full inline-flex border border-pink-100 shadow-xs">
                <button
                  type="button"
                  onClick={() => { setGalleryViewMode('carousel'); playInteractionChime(); }}
                  className={`px-6 py-2 rounded-full font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                    galleryViewMode === 'carousel' 
                    ? 'bg-rose-500 text-white shadow-md font-extrabold' 
                    : 'text-rose-400 hover:text-rose-600'
                  }`}
                >
                  <Sparkles size={11} />
                  ✨ Storybook Carousel
                </button>
                <button
                  type="button"
                  onClick={() => { setGalleryViewMode('grid'); playInteractionChime(); }}
                  className={`px-6 py-2 rounded-full font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                    galleryViewMode === 'grid' 
                    ? 'bg-rose-500 text-white shadow-md font-extrabold' 
                    : 'text-rose-400 hover:text-rose-600'
                  }`}
                >
                  <BookOpen size={11} />
                  📂 Cozy Memory Grid
                </button>
              </div>
            </div>

            {/* Custom Carousel View */}
            {galleryViewMode === 'carousel' ? (
              <div className="relative max-w-sm md:max-w-md mx-auto mb-16 animate-fade-in z-10">
                {/* Main Carousel Card Wrapper */}
                <div className="bg-white border-2 border-pink-100 rounded-3xl p-5 shadow-xl relative transition-all duration-300">
                  
                  {/* Outer Left handle button */}
                  <button
                    type="button"
                    onClick={() => {
                      setCarouselIndex((prev) => (prev - 1 + memories.length) % memories.length);
                      playInteractionChime();
                    }}
                    className="absolute left-[-16px] md:left-[-32px] top-1/2 -translate-y-1/2 bg-white hover:bg-rose-50 border border-pink-100 w-10 h-10 rounded-full flex items-center justify-center text-rose-500 hover:text-rose-600 shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer z-20"
                    title="Previous Slide"
                  >
                    <ChevronRight size={18} className="translate-x-[-1px] rotate-180" />
                  </button>

                  {/* Outer Right handle button */}
                  <button
                    type="button"
                    onClick={() => {
                      setCarouselIndex((prev) => (prev + 1) % memories.length);
                      playInteractionChime();
                    }}
                    className="absolute right-[-16px] md:right-[-32px] top-1/2 -translate-y-1/2 bg-white hover:bg-rose-50 border border-pink-100 w-10 h-10 rounded-full flex items-center justify-center text-rose-500 hover:text-rose-600 shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer z-20"
                    title="Next Slide"
                  >
                    <ChevronRight size={18} className="translate-x-[1px]" />
                  </button>

                  {/* Active Slide Display */}
                  {memories.map((m, idx) => {
                    if (idx !== carouselIndex) return null;
                    return (
                      <div key={m.id} className="animate-fade-in space-y-4">
                        
                        {/* Image Frame */}
                        <div className="aspect-square bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl overflow-hidden border border-pink-100 relative group flex items-center justify-center shadow-inner">
                          {m.image ? (
                            <img 
                              src={m.image} 
                              alt={m.caption} 
                              className="w-full h-full object-cover select-none"
                            />
                          ) : (
                            <div className="text-center space-y-2 cursor-pointer" onClick={() => openMemoryEditor(m.id)}>
                              <span className="text-7xl block animate-bounce" style={{ animationDuration: '4s' }}>{m.emoji}</span>
                              <span className="text-[10px] text-pink-400 bg-pink-50/80 rounded-full px-3 py-1 font-semibold">
                                Tap to personalize photo
                              </span>
                            </div>
                          )}

                          {/* Quick Actions Hover overlay */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                            <label className="p-2.5 bg-white text-rose-600 rounded-full hover:bg-rose-50 cursor-pointer shadow-md transition-all hover:scale-110">
                              <Camera size={18} />
                              <input 
                                type="file" 
                                accept="image/*"
                                onChange={(e) => handleMemoryImageUpload(m.id, e)}
                                className="hidden" 
                              />
                            </label>

                            <button 
                              type="button"
                              onClick={() => openMemoryEditor(m.id)}
                              className="p-2.5 bg-white text-rose-600 rounded-full hover:bg-rose-50 shadow-md transition-all hover:scale-110"
                              title="Edit text captions"
                            >
                              <Edit2 size={18} />
                            </button>

                            {m.image && (
                              <button 
                                type="button"
                                onClick={() => resetMemoryMedia(m.id)}
                                className="p-2.5 bg-white text-rose-600 hover:bg-rose-50 rounded-full shadow-md transition-all hover:scale-110"
                                title="Reset back to standard emoji"
                              >
                                <Trash2 size={18} />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Caption Heading & Text */}
                        <div className="text-center pt-2 space-y-1">
                          <p className="font-dancing text-2xl text-rose-600 font-bold">
                            {m.caption}
                          </p>
                          <p className="text-xs text-slate-500 font-playfair italic px-2 h-14 overflow-y-auto leading-relaxed">
                            {m.description}
                          </p>
                        </div>

                      </div>
                    );
                  })}

                  {/* Indicator Ticking dots */}
                  <div className="flex justify-center gap-1.5 pt-4">
                    {memories.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => { setCarouselIndex(i); playInteractionChime(); }}
                        className={`transition-all duration-300 rounded-full cursor-pointer h-2 ${
                          i === carouselIndex ? 'w-5 bg-rose-500' : 'w-2 bg-rose-200 hover:bg-rose-300'
                        }`}
                        title={`Slide ${i + 1}`}
                      />
                    ))}
                  </div>

                </div>
              </div>
            ) : (
              /* Custom Memory Polaroids Grid (Original Cozy Layout Option) */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {memories.map((m, idx) => (
                  <div 
                    key={m.id}
                    className={`bg-white border border-pink-100 rounded-3xl p-5 shadow-lg max-w-sm mx-auto w-full transition-all duration-300 relative group cursor-pointer ${
                      ['-rotate-2', 'rotate-1', 'rotate-2', '-rotate-1', 'rotate-3', '-rotate-3'][idx % 6]
                    } hover:rotate-0 hover:scale-[1.04] hover:-translate-y-4 hover:shadow-2xl hover:z-20`}
                  >
                    
                    {/* Render Polaroid Image Area with fallback Emoji frame */}
                    <div className="aspect-square bg-gradient-to-br from-pink-100 to-rose-100/30 rounded-2xl overflow-hidden relative flex flex-col items-center justify-center border border-pink-100">
                      {m.image ? (
                        <img 
                          src={m.image} 
                          alt={m.caption} 
                          className="w-full h-full object-cover select-none"
                        />
                      ) : (
                        <div className="text-center space-y-2 cursor-pointer" onClick={() => openMemoryEditor(m.id)}>
                          <span className="text-7xl block animate-bounce" style={{ animationDuration: '4s' }}>{m.emoji}</span>
                          <span className="text-[10px] text-pink-400 bg-pink-50 rounded-full px-3 py-1 font-semibold">
                            Tap to personalize photo
                          </span>
                        </div>
                      )}

                      {/* Overlay Action Toolbar triggers */}
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        
                        {/* Image Upload Button trigger */}
                        <label className="p-2.5 bg-white text-rose-600 rounded-full hover:bg-rose-50 cursor-pointer shadow-md transition-all hover:scale-105">
                          <Camera size={18} />
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => handleMemoryImageUpload(m.id, e)}
                            className="hidden" 
                          />
                        </label>

                        {/* Manual Caption Edit Slot */}
                        <button 
                          onClick={() => openMemoryEditor(m.id)}
                          className="p-2.5 bg-white text-rose-600 rounded-full hover:bg-rose-50 shadow-md transition-all hover:scale-105"
                          title="Edit text captions"
                        >
                          <Edit2 size={18} />
                        </button>

                        {/* Clean/Reset media block */}
                        {m.image && (
                          <button 
                            onClick={() => resetMemoryMedia(m.id)}
                            className="p-2.5 bg-white text-rose-600 hover:bg-rose-50 rounded-full shadow-md transition-all hover:scale-105"
                            title="Reset back to standard emoji"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Polaroid Paper Caption Text */}
                    <div className="pt-5 space-y-1 text-center">
                      <p className="font-dancing text-2xl text-rose-600 font-bold">
                        {m.caption}
                      </p>
                      <p className="text-xs text-slate-500 font-playfair italic px-1 h-12 overflow-y-auto leading-relaxed">
                        {m.description}
                      </p>
                    </div>

                  </div>
                ))}
              </div>
            )}

            {/* Editing Polaroid details overlay Modal */}
            {activeMemoryId && (
              <div className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white border border-rose-100 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-pink-50">
                    <span className="font-bold text-rose-600 text-sm uppercase tracking-wider">Configure Polaroid Text</span>
                    <button onClick={() => setActiveMemoryId(null)} className="text-slate-400 hover:text-slate-600">
                      <X size={18} />
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">CAPTION HEADING</label>
                      <input 
                        type="text" 
                        value={memoryEditCaption}
                        onChange={(e) => setMemoryEditCaption(e.target.value)}
                        className="w-full px-3 py-2 border border-pink-100 rounded-lg text-sm focus:outline-pink-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">LOVE DESCRIPTION</label>
                      <textarea 
                        rows={3}
                        value={memoryEditDesc}
                        onChange={(e) => setMemoryEditDesc(e.target.value)}
                        className="w-full px-3 py-2 border border-pink-100 rounded-lg text-sm focus:outline-pink-400 resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-1.5 pt-2">
                    <button 
                      onClick={() => setActiveMemoryId(null)}
                      className="px-4 py-2 bg-slate-100 text-slate-600 text-xs rounded-lg hover:bg-slate-200"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={saveMemoryTextDetails}
                      className="px-4 py-2 bg-rose-500 text-white text-xs font-bold rounded-lg hover:bg-rose-600"
                    >
                      Save details
                    </button>
                  </div>
                </div>
              </div>
            )}

          </section>

          {/* ─────────────────────────────────
               SECTION 6: GORGEOUS TRIVIA CHALLENGE
             ───────────────────────────────── */}
          <section className="py-20 bg-pink-50/10 border-y border-pink-50 px-4">
            <div className="max-w-3xl mx-auto bg-white border border-pink-100 rounded-3xl p-6 md:p-10 shadow-xl overflow-hidden">
              
              <div className="text-center space-y-2 mb-8">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-2 text-pink-500">
                  <BookOpen size={20} />
                </div>
                <h3 className="font-dancing text-3xl font-bold text-rose-700">
                  "How Well Do You Know Wifuyyy?" 💕
                </h3>
                <p className="text-xs text-slate-500">
                  Take a small, sweet trivia quiz customized just for fun!
                </p>
              </div>

              {!quizCompleted ? (
                <div className="space-y-6">
                  {/* Current progress */}
                  <div className="flex justify-between items-center text-xs font-bold text-rose-400 uppercase tracking-widest border-b border-pink-50 pb-3">
                    <span>Question {currentQuizIndex + 1} of {DEFAULT_QUIZ.length}</span>
                    <span>Score: {quizScore}</span>
                  </div>

                  {/* Question */}
                  <h4 className="font-playfair text-lg text-slate-700 font-semibold leading-snug">
                    {DEFAULT_QUIZ[currentQuizIndex].question}
                  </h4>

                  {/* Options */}
                  <div className="grid grid-cols-1 gap-2.5">
                    {DEFAULT_QUIZ[currentQuizIndex].options.map((opt, oIdx) => {
                      const isAnswered = quizAnswered !== null;
                      const isCorrect = oIdx === DEFAULT_QUIZ[currentQuizIndex].correctIndex;
                      const isSelectedByUser = quizAnswered === oIdx;

                      // Decide background colors of buttons
                      let btnBg = 'bg-slate-50 border border-slate-100 hover:bg-rose-50 hover:border-rose-100 text-slate-800';
                      
                      if (isAnswered) {
                        if (isCorrect) {
                          btnBg = 'bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold';
                        } else if (isSelectedByUser) {
                          btnBg = 'bg-rose-100 border border-rose-300 text-rose-800 font-bold';
                        } else {
                          btnBg = 'bg-slate-50 border border-slate-100 opacity-60 text-slate-400';
                        }
                      }

                      return (
                        <button 
                          key={oIdx}
                          disabled={isAnswered}
                          onClick={() => handleAnswerQuiz(oIdx)}
                          className={`w-full py-3.5 px-5 rounded-xl text-left text-xs md:text-sm font-semibold transition-all duration-150 ${btnBg}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {/* Praise / Feedback */}
                  {quizAnswered !== null && (
                    <div className="p-4 bg-rose-50/70 border border-rose-100 rounded-xl space-y-2 animate-fade-in text-center">
                      <p className="text-xs md:text-sm text-rose-700 font-bold">
                        {quizAnswered === DEFAULT_QUIZ[currentQuizIndex].correctIndex 
                          ? "✨ Amazing! Correct! " 
                          : "❌ Oops! Dramatic miss-step! "
                        }
                      </p>
                      <p className="text-xs text-slate-600 leading-relaxed font-semibold italic">
                        {DEFAULT_QUIZ[currentQuizIndex].praise}
                      </p>
                      <button 
                        onClick={handleNextQuizQuestion}
                        className="mt-3 bg-rose-500 hover:bg-rose-600 text-white font-bold py-2 px-6 rounded-lg text-xs tracking-wider inline-flex items-center gap-1.5 transition-colors shadow"
                      >
                        <span>{currentQuizIndex + 1 === DEFAULT_QUIZ.length ? "Finish Quiz" : "Next Question"}</span>
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  )}

                </div>
              ) : (
                // Quiz completed summary
                <div className="text-center py-6 space-y-4 animate-fade-in">
                  <span className="text-6xl block">🏅</span>
                  <h4 className="font-dancing text-3xl font-bold text-rose-600">Quiz Completed beautifully!</h4>
                  <p className="text-slate-600 text-sm max-w-md mx-auto">
                    You scored <strong className="text-rose-500 text-lg">{quizScore}</strong> out of <strong className="text-slate-800">{DEFAULT_QUIZ.length}</strong>! That counts as a certified, true romantic scholar certificate! 📜🌸
                  </p>
                  <button 
                    onClick={handleResetQuiz}
                    className="mt-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-2.5 px-6 rounded-xl text-xs transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}

            </div>
          </section>

          {/* ─────────────────────────────────
               SECTION 7: HORIZONTAL GUEST BOOK SCROLLER
             ───────────────────────────────── */}
          <section className="py-20 px-4 max-w-6xl mx-auto">
            <div className="text-center space-y-2 mb-12 animate-fade-in">
              <h2 className="font-dancing text-4xl md:text-5xl font-bold text-rose-700">
                Birthday Wishes Guestbook 🌠
              </h2>
              <p className="font-playfair italic text-rose-400 text-sm">
                Write a sweet message, select a cute relationship, and sign the gorgeous fairytale guestbook!
              </p>
            </div>

            {/* Guestbook Submission Form */}
            <div className="max-w-xl mx-auto bg-white border border-pink-100 p-6 md:p-8 rounded-3xl shadow-lg mb-12 space-y-4">
              <div className="flex items-center gap-1.5 border-b border-pink-50 pb-3">
                <MessageSquare className="text-rose-500" size={16} />
                <span className="font-dancing text-lg font-bold text-rose-600">Write Your Sweet Memory Message</span>
              </div>

              <form onSubmit={handleAddWish} className="space-y-3 font-nunito text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 uppercase font-bold text-[9px] mb-1">Your Lovely Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Your biggest fan"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-pink-100 focus:outline-pink-400 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 uppercase font-bold text-[9px] mb-1">Who Are You to Her?</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Secret Admirer"
                      value={guestRelation}
                      onChange={(e) => setGuestRelation(e.target.value)}
                      className="w-full px-3 py-2 border border-pink-100 focus:outline-pink-400 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 uppercase font-bold text-[9px] mb-1">Heartfelt Birthday Blessing</label>
                  <textarea 
                    rows={3}
                    placeholder="Write your sweet words here to shine forever..."
                    value={guestMessage}
                    onChange={(e) => setGuestMessage(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-pink-100 focus:outline-pink-400 rounded-lg text-xs resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-2.5 rounded-xl transition-colors shadow flex items-center justify-center gap-1.5 text-xs uppercase"
                >
                  <Plus size={14} /> Post Wish message
                </button>
              </form>
            </div>

            {/* Achievement Badges Showcase Dashboard */}
            <div className="max-w-4xl mx-auto bg-gradient-to-br from-amber-50/40 via-rose-50/40 to-pink-50/40 border border-pink-100 rounded-3xl p-6 md:p-8 shadow-lg mb-12 animate-fade-in text-slate-700">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-pink-100/80 pb-4 mb-6 text-left">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-100/80 rounded-xl text-amber-600 shadow-inner">
                    <Trophy size={20} className="animate-bounce" style={{ animationDuration: '3s' }} />
                  </div>
                  <div>
                    <h3 className="font-sans text-base font-extrabold text-rose-800">Guestbook Achievement Badges</h3>
                    <p className="text-[11px] text-slate-500 font-nunito font-semibold">Write a sweet wish message with the right ingredients to unlock these legendary badges! ✨</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 self-start sm:self-center bg-white/80 border border-pink-100 rounded-full px-3.5 py-1 text-xs shadow-sm">
                  <Award size={13} className="text-pink-500" />
                  <span className="font-extrabold text-pink-600">
                    {BADGES.reduce((acc, badge) => {
                      const hasEarner = wishes.some(w => getEarnedBadges(w, wishes).includes(badge.key));
                      return acc + (hasEarner ? 1 : 0);
                    }, 0)} / {BADGES.length} Badges Unlocked
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-left">
                {BADGES.map((badge) => {
                  const badgeEarners = wishes
                    .filter(w => getEarnedBadges(w, wishes).includes(badge.key))
                    .map(w => w.name);
                  const isUnlocked = badgeEarners.length > 0;

                  return (
                    <div 
                      key={badge.key} 
                      className={`flex flex-col justify-between p-4 rounded-2xl border transition-all duration-300 relative group overflow-hidden ${
                        isUnlocked 
                          ? `${badge.color} shadow-sm translate-y-0 scale-100` 
                          : 'bg-slate-50/45 text-slate-400 border-slate-150 grayscale opacity-70 hover:opacity-90 hover:grayscale-0'
                      }`}
                    >
                      {/* Subtle ray reflection for unlocked badges */}
                      {isUnlocked && (
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
                      )}

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-3xl filter drop-shadow-sm select-none">{badge.emoji}</span>
                          <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                            isUnlocked ? 'bg-white/60 border-current/25' : 'bg-slate-100 text-slate-400 border-slate-200'
                          }`}>
                            {isUnlocked ? 'Unlocked' : 'Locked'}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-sans text-xs font-black tracking-tight leading-tight">
                            {badge.name}
                          </h4>
                          <p className="text-[10px] leading-snug font-semibold opacity-90 font-nunito">
                            {badge.description}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 pt-2.5 border-t border-current/10 text-[9px] font-nunito">
                        {isUnlocked ? (
                          <div className="space-y-0.5">
                            <span className="font-extrabold uppercase tracking-wider text-[8px] opacity-70 block">Earned By:</span>
                            <div className="font-bold truncate" title={badgeEarners.join(', ')}>
                              {badgeEarners.join(', ')}
                            </div>
                          </div>
                        ) : (
                          <span className="font-bold italic text-slate-400">Not earned yet 🔒</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Scrolling Wishes Grid Layout */}
            <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-pink-100 scrollbar-track-transparent">
              {wishes.map((w) => {
                const earnedKeys = getEarnedBadges(w, wishes);
                return (
                  <div 
                    key={w.id} 
                    className="flex-shrink-0 w-80 bg-white border border-pink-50 hover:border-pink-200 rounded-2xl p-6 shadow-md relative group hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
                  >
                    {/* Speech Bubble aesthetic quote mark */}
                    <span className="absolute right-4 top-2 text-6xl text-rose-500/5 font-serif select-none pointer-events-none">“</span>
                    
                    <div className="space-y-4 w-full">
                      {/* Dynamic Badges Earned Container */}
                      {earnedKeys.length > 0 ? (
                        <div className="flex flex-wrap gap-1 pt-0.5">
                          {earnedKeys.map(key => {
                            const bObj = BADGES.find(b => b.key === key);
                            if (!bObj) return null;
                            return (
                              <span 
                                key={key} 
                                title={bObj.description} 
                                className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full border ${bObj.color} shadow-sm cursor-help`}
                              >
                                <span>{bObj.emoji}</span>
                                <span>{bObj.name}</span>
                              </span>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="h-4" />
                      )}

                      <p className="font-playfair italic text-xs md:text-sm text-slate-700 leading-relaxed min-h-[4.50rem] max-h-[7.5rem] overflow-y-auto">
                        "{w.message}"
                      </p>

                      <div className="flex justify-between items-end pt-3 border-t border-pink-50">
                        <div>
                          <h4 className="font-dancing text-lg text-rose-600 font-bold leading-none">
                            {w.name}
                          </h4>
                          <span className="text-[9px] text-rose-300 font-bold uppercase tracking-wider">
                            {w.relation}
                          </span>
                        </div>

                        {/* Delete button option */}
                        <button 
                          onClick={() => handleDeleteWish(w.id)}
                          className="text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 cursor-pointer"
                          title="Delete message"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

          </section>

          {/* ─────────────────────────────────
               SECTION 8: CLIMAX CELEBRATORY SPARKS
             ───────────────────────────────── */}
          <section className="py-24 bg-gradient-to-t from-pink-100/60 via-[#fffbfd] to-[#fffbfd] text-center px-4">
            <div className="max-w-2xl mx-auto space-y-6">
              <span className="text-5xl block animate-bounce" style={{ animationDuration: '3.5s' }}>🎁</span>
              
              <h2 className="font-dancing text-4xl md:text-5xl font-bold text-rose-700">
                Ready to Celebrate, Thathuyyy? 🎉
              </h2>
              <p className="font-playfair italic text-rose-400 text-sm max-w-sm mx-auto">
                Go ahead and click the big button to burst amazing fairytale confetti rain over your head!
              </p>
              
              <div className="pt-4">
                <button 
                  onClick={handleMainCelebrateClick} 
                  className="big-btn px-10 py-5 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-dancing text-2xl rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all outline-none"
                >
                  🎂 Happy Birthday Thathuyyy!! 🎂
                </button>
              </div>
            </div>
          </section>

          {/* ─────────────────────────────────
               COZY FOOTER FOOTNOTE
             ───────────────────────────────── */}
          <footer className="py-12 bg-rose-700 text-white text-center space-y-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-radial from-white/5 to-transparent pointer-events-none" />
            <div className="max-w-3xl mx-auto space-y-1.5 relative z-10 px-4">
              <h3 className="font-dancing text-3xl font-bold">
                Happy 17th,inte kunjipenne Thamanneyyy 💕
              </h3>
              <p className="text-rose-200 text-[10px] md:text-xs uppercase font-bold tracking-widest leading-loose">
                Thathuyyy • Wifuyyy • My Everything • Cozy Companion • Always & Forever 🧸🌸
              </p>
              
              <div className="pt-4 text-rose-300 text-lg flex items-center justify-center gap-2 tracking-widest select-none">
                <Heart className="fill-rose-300 stroke-none" size={14} />
                <span>🌷</span>
                <Heart className="fill-rose-300 stroke-none" size={14} />
                <span>👑</span>
                <Heart className="fill-rose-300 stroke-none" size={14} />
              </div>
            </div>
          </footer>

          {/* ─────────────────────────────────
               SWEET CLIMAX POPUP MODAL
             ───────────────────────────────── */}
          {showPopup && (
            <div className="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-md flex items-center justify-center p-4">
              <div className="bg-white border-2 border-rose-100 rounded-[32px] p-6 md:p-10 max-w-md w-full shadow-2xl text-center space-y-5 animate-pop-in relative overflow-hidden">
                <span className="absolute -top-10 -right-10 text-9xl text-slate-500/5 select-none pointer-events-none">🎂</span>
                <span className="text-7xl block animate-bounce" style={{ animationDuration: '3s' }}>🥳</span>
                
                <h3 className="font-dancing text-3xl md:text-4xl text-rose-600 font-bold">
                  Happy Birthday Wifuyyy!! 💕
                </h3>
                
                <p className="font-playfair italic text-xs md:text-sm text-slate-600 leading-relaxed px-2">
                  "I love you more than words could ever convey, Thathuyyy. 17 looks absolutely breathtaking on you. May this beautiful chapter of yours bring you every sparkle, every smile, and everything your gentle heart deserves!" 🌸✨
                </p>

                <div className="pt-2">
                  <button 
                    onClick={() => { setShowPopup(false); triggerBirthdayConfetti(50); }}
                    className="bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-dancing text-lg py-2.5 px-8 rounded-full shadow-md transition-all active:scale-95"
                  >
                    💖 I love you too!!
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
