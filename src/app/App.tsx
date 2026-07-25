import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type CSSProperties,
  type ReactNode,
} from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

/* ─── types ──────────────────────────────────────────────── */
type Screen = "hero" | "welcome" | "intro" | "instructions" | "library" | "final";
type UnsealStage = "idle" | "cracking" | "unfolding" | "done";

interface LetterData {
  id: number;
  chapter: number;
  trigger: string;
  password: string;
  body: string[];
  isSecret?: boolean;
}

interface OpenedLetters {
  [id: number]: string;
}

/* ─── chapter data ───────────────────────────────────────── */
const CHAPTERS = [
  { id: 1, title: "For Difficult Days", subtitle: "When the weight feels heaviest" },
  { id: 2, title: "For Missing Home", subtitle: "When distance becomes distance" },
  { id: 3, title: "For Beautiful Days", subtitle: "When everything is right" },
  { id: 4, title: "For Quiet Nights", subtitle: "When the world goes still" },
];

/* ─── scatter positions (non-random, per chapter index) ──── */
const SCATTER = [
  { rotate: -0.6, offsetY: 0 },
  { rotate: 0.9, offsetY: 14 },
  { rotate: -1.3, offsetY: -6 },
  { rotate: 0.5, offsetY: 10 },
];

/* ─── letter data ────────────────────────────────────────── */
const LETTERS: LetterData[] = [
  // Chapter 1: Difficult Days
  {
    id: 1, chapter: 1, trigger: "you feel lonely", password: "ylenol",
    body: [
        "Hello Mrs.Jambhalepatil,",
  "",
  "so if you're reading this letter, it means today feels a little heavier than usual.",
  "",
  "Maybe the house feels too quiet.",
  "Maybe you feel its just u.",
  "Maybe you are getting hard on yourself.",
  "Maybe work was tiring.",
  "Maybe you miss home.",
  "Or maybe... you don't even know why you're feeling lonely.",
  "",
  "Let me tell you,",
  "It's really OKAYY <3",
  "It's so fkin True to say",
  "\"kuch pane ke liye kuch khona padta hai\"",
  "",
  "And you know what the best part is that u are finally away from the people who atleast once, made you cry, let you down as if you are nothing, made u feel even lonelier. And now is the time they are actually getting to know YOUR REAL VALUE (which ofc no one can ever ever even 1% know (Its just I who know it haha)) and understand.",
  "",
  "Just Remember diduu,",
  "you don't always have to be strong.",
  "You don't always have to smile.",
  "You don't always have to pretend that everything is okay.",
  "Sometimes life just feels... empty for a while.",
  "Even if there is no hard reason and its okayyy, ig its meant to be coz what we learn from this is exactly what's gonna take us up where you wanna be so which is actually needed.",
  "",
  "Loneliness doesn't mean you've lost your people.",
  "It only means you miss them.",
  "",
  "Anyways you always do your stupid things, do them again today.",
  "Rewatch your typical old movies again.",
  "Go for a walk.",
  "Listen to some deep music, it actually gives validation to your emotions n feels better.",
  "Have a good talk with Akki.",
  "Just be you man, which I would love the most.",
  "",
  "You are way stronger than you realise okay and you are way more loved than you think.",
  "One lonely evening cannot define your whole journey.",
  "",
  "The city will slowly become familiar and used to.",
  "The roads will become yours.",
  "The cafés will become your favourite.",
  "You'll have stories to tell.",
  "People to meet.",
  "Memories to create.",
  "",
  "And one day randomly u'll think,",
  "",
  "\"Remember when we just moved to Bangalore and lol it was a new city to us?\"",
  "",
  "This too shall pass.",
  "(hehehehehehehe if u know uk)",
  "",
  "Till then...",
  "",
  "Love you so very muchhh.",
  "We all are just a call away and thats not too far.",
  "",
  "Life is short for everything u did here, to worry, to be lonely, to get affected, so now just live it and kill it babyy ❤️"
    ],
  },
  {
    id: 2, chapter: 1, trigger: "life feels overwhelming", password: "overwhelmed",
    body: [
      "Stop. Just for a moment. Put the list down. Close all the tabs.",
      "You don't have to fix everything tonight. You don't have to be impressive right now. You don't have to be okay if you're not okay.",
      "Overwhelm makes everything feel urgent and nothing feel manageable. But that feeling lies. It makes Tuesday feel like a crisis. It makes normal tiredness feel like failure.",
      "You have handled hard things before. Quietly, without fanfare, without anyone writing it down. You've sat with uncertainty and come out the other side holding something you learned. You've survived every difficult day you've faced so far — that's one hundred percent of them.",
      "Tonight, you only have to do one thing: take care of yourself. Everything else can wait until morning. The world will not collapse if you rest.",
      "Make something warm. Find something that makes you feel held. Sleep if you can. And in the morning, the list will be shorter than it feels tonight.",
    ],
  },
  {
    id: 3, chapter: 1, trigger: "you feel like giving up", password: "surrender",
    body: [
      "Don't. Not today. Not this one.",
      "I know that what you're feeling right now is real. I'm not going to tell you it isn't hard, or that you should look on the bright side, or that everything happens for a reason. It's hard. That's true. I believe you.",
      "But I also know something you might be forgetting right now: you have survived one hundred percent of your worst days. Every single one. You're still here.",
      "The version of you reading this letter exists because she didn't give up before. She kept going through things that felt exactly like this, and she arrived here, in this moment, still trying.",
      "You don't have to fix it tonight. You don't have to feel better immediately. You just have to stay.",
      "And tomorrow — you call me. Not to report that you're fine. Just to talk. I will be there.",
    ],
  },
  {
    id: 4, chapter: 1, trigger: "you're scared", password: "scared",
    body: [
      "Good. That means it matters.",
      "Fear is the body's way of saying: this is real, this is significant, I care about what happens here. You can't feel scared about things that don't matter to you.",
      "So you are scared. And also — you are still here. Still reading. Still breathing through something that frightened you.",
      "I've watched you be scared before. I've watched you do the thing anyway. With shaking hands sometimes, or a too-fast heartbeat, or eyes that were filling up. But you did it.",
      "Fear isn't the opposite of courage. Fear is exactly where courage begins.",
      "Whatever this is — go toward it. Slowly if you need to. But go.",
    ],
  },

  // Chapter 2: Missing Home
  {
    id: 5, chapter: 2, trigger: "you miss home", password: "home",
    body: [
      "There will be a specific kind of afternoon — usually a Sunday — when the light is the wrong color and the air smells like somewhere that isn't home. That's when I know you're missing it.",
      "Home, for us, was never just a building. It was the sound of Mum's pressure cooker from two rooms away. Dad's specific way of folding the newspaper. The two of us fighting over the bathroom mirror and then sitting on the terrace afterward like nothing had happened.",
      "You can't fit those things in a suitcase. But you carry them anyway — in the way you make chai, in the way you laugh too loudly in quiet rooms, in the things that smell like memory and stop you mid-sentence in a supermarket aisle.",
      "Missing home means you were lucky enough to have one worth missing. That's not nothing. That's quite a lot, actually.",
      "And here's what I need you to remember: home didn't disappear when you left. It just learned to wait.",
    ],
  },
  {
    id: 6, chapter: 2, trigger: "you miss me", password: "missing",
    body: [
      "I miss you too. I need you to know that first.",
      "I miss you when something funny happens and I reach for my phone and then remember there's a time difference. I miss you when I find a meme that is specifically, perfectly you. I miss you when Mum says something that only we would find unreasonably funny. I miss you during the ordinary minutes, not just the important ones.",
      "But here's the thing about missing someone: it's proof of something real. You can't miss what wasn't worth having. This ache means we built something between us that geography can't fully touch.",
      "We are not the kind of sisters who disappear from each other. Distance is just a test of that, and we keep passing it.",
      "Call me whenever. I will always pick up. Even at 2 a.m. Even if I sound half-asleep at first. Even if we just sit on the phone together doing different things in different cities.",
      "I'm here. I'm always here.",
    ],
  },
  {
    id: 7, chapter: 2, trigger: "your first festival away", password: "festival",
    body: [
      "This one is different, I know. The lights will be there — somewhere — but they won't be ours. The sweets will exist, but they won't be Mum's. The noise will happen, but it won't be our specific noise.",
      "The first festival away from home is its own kind of grief. Let it be. You don't have to pretend it's fine or perform cheerfulness. Missing it is the right response. Missing it means something.",
      "But here's what I want you to do: find one thing. One candle, one sweet, one song, one call home. Make it a small ceremony. A private one. Just for you.",
      "You are not less because you're away. You're not failing at family because you're building a life somewhere new. Tradition isn't only location — it's intention. And you carry the intention with you.",
      "Light something tonight, di. And know that I'm lighting it with you from here.",
    ],
  },
  {
    id: 8, chapter: 2, trigger: "you need a hug", password: "hug",
    body: [
      "I know I can't cross the distance right now. So consider this letter a hug — a very long one, the kind you have to wiggle out of eventually.",
      "If I were there: I would make you tea without asking. I would sit beside you without filling the silence. I would find something stupid to watch until you felt better. I would remind you that you are allowed to need comfort, that needing it is not weakness, and that I am the last person who would ever think less of you for it.",
      "You have always taken care of everyone around you. You have always been the one who shows up. It is okay — it is more than okay, it is necessary — to let someone take care of you too.",
      "Let yourself be a little soft right now. Let this moment be for you. I'm sending you every warm thing I have.",
    ],
  },

  // Chapter 3: Beautiful Days
  {
    id: 9, chapter: 3, trigger: "you're happy", password: "happy",
    body: [
      "You're reading this because something is right. Something good happened. And I am so, so happy for you.",
      "Don't rush past this. Don't minimize it. Don't immediately think about the next thing or the thing that could go wrong. Just stay here, in this exact moment, a little while longer.",
      "Happiness has a texture — the specific lightness of a day when things align. I want you to memorize this particular shade of it. The way the room feels. What you were wearing. What you had for lunch. Because on the harder days, this memory will do real work.",
      "You deserve this. Not as a reward for surviving something difficult. Just because you exist and you're trying, and happiness is something you're allowed to have without earning it.",
      "Tell me all about it when you can. I'll want every single detail.",
    ],
  },
  {
    id: 10, chapter: 3, trigger: "you're proud of yourself", password: "proud",
    body: [
      "I want you to pause here.",
      "Don't read ahead. Don't move to the next thing. Just stay in this moment and feel it properly.",
      "You're proud of yourself. Maybe for the first time in a while. Maybe it crept up quietly and you almost didn't let yourself have it.",
      "You deserve to have it.",
      "Pride in yourself is not arrogance. It's recognition. It's the ability to look at your own work, your own choices, your own becoming, and say: this is good. I did something good.",
      "I see it too. I always see it.",
      "You've earned this feeling. Let it stay.",
    ],
  },
  {
    id: 11, chapter: 3, trigger: "you achieve something", password: "achieved",
    body: [
      "I KNEW IT.",
      "I knew it with the specific, unshakeable certainty of someone who has watched you work for years. Who has seen you do the unglamorous part — the revision, the doubt, the starting over, the trying again. I knew it before you did.",
      "Please don't minimize this. Don't immediately move to the next thing. Don't measure this achievement against someone else's or tell yourself it was luck.",
      "This is what effort looks like when it finally arrives. This is what you look like when you don't give up.",
      "Mum and Dad will be proud. I'm proud. But more importantly — are you proud? You should be. The kind of proud that sits quietly in your chest for years. The kind that reminds you, on harder days, of what you're capable of.",
      "Celebrate properly. You have earned every bit of this.",
    ],
  },
  {
    id: 12, chapter: 3, trigger: "you want to smile", password: "smile",
    body: [
      "Do you remember the great Mango Incident of 2017?",
      "You had convinced Mum that the mangoes were 'definitely still good' and then spent the entire dinner very confidently eating something that was absolutely, unambiguously not still good. You insisted until the end. You maintained eye contact while Mum watched. Dad had to leave the table he was laughing so hard.",
      "You never admitted it. To this day, you maintain the mangoes were fine.",
      "I love you so much for that. For the stubbornness, the commitment to the bit, the absolute theatrical sincerity of it all.",
      "This is what I want you to remember when you want to smile: we are ridiculous together. We are specific and funny in a way that only works between us. No one in the world knows the exact shade of our particular humor.",
      "That doesn't go away when we're apart. It just waits, patient, for the next time we're in the same room arguing about perfectly fine mangoes.",
    ],
  },

  // Chapter 4: Quiet Nights
  {
    id: 13, chapter: 4, trigger: "you can't sleep", password: "sleepless",
    body: [
      "Di.",
      "It's late. Or very early. The room is too quiet and your brain is too loud and all the things you meant to think about today are having a party without your permission.",
      "I know this room. I've been in it.",
      "Here's what I want you to do: stop trying to sleep. Just rest. Close your eyes and give yourself permission to simply lie there. Not sleep. Just be horizontal and quiet.",
      "Sometimes the hardest part of the hard nights is fighting them. Let this one be what it is.",
      "The 2 a.m. version of every problem is its most terrifying form. It gets better in the morning. It always gets better in the morning.",
      "I'm awake somewhere too, probably. In our different cities, in our different beds, both of us a little restless. Goodnight, di. Or good morning. Either way — I love you.",
    ],
  },
  {
    id: 14, chapter: 4, trigger: "you're angry", password: "angry",
    body: [
      "Anger is information. It's telling you something isn't right — that a line was crossed, a boundary was missed, something that matters to you wasn't honored. Don't ignore it.",
      "But sit with it first. Before you send the message. Before you say the thing that can't be unsaid. Before you make the decision that belongs to 3 a.m. and not to daylight.",
      "Anger in us runs hot and clean. It burns through and it passes. You know this.",
      "You are allowed to be angry. You are allowed to feel the full weight of something unfair. And then — when it quiets a little — you'll know what the anger was really about.",
      "Take a walk. Drink some water. Breathe through your nose, slowly.",
      "And if it's still there tomorrow, it was real. Deal with it then. With full dignity.",
    ],
  },
  {
    id: 15, chapter: 4, trigger: "you need motivation", password: "motivated",
    body: [
      "Do you remember when you were sixteen and you decided to learn calligraphy from a YouTube tutorial? You practiced for three weeks and then pronounced yourself 'adequate' and moved on. You were always like that — quietly ambitious, never needing applause.",
      "I need you to remember how far you've come. Not in a motivational-poster way. In the real, specific, undeniable way.",
      "You chose this life, this city, this version of yourself that you're still becoming. That took courage that most people never find. Courage isn't dramatic. It's making the hard choice again on an ordinary Wednesday when no one is watching.",
      "Whatever you're trying to do right now — the thing that feels too big or too slow or too uncertain — keep going. Not because it will definitely work, but because you won't forgive yourself if you stop here.",
      "I believe in you with the specific, evidence-based conviction of someone who has watched you her whole life. I know what you're made of, di. You should too.",
    ],
  },

  // Secret
  {
    id: 16, chapter: 0, trigger: "you've read everything", password: "always", isSecret: true,
    body: [
      "You found it.",
      "I wasn't sure you would. Or maybe I always knew you would, because that's who you are — the kind of person who opens all the doors, reads all the words, stays until the end.",
      "I need you to know something that I couldn't put in any of the other letters. Something I've been saving.",
      "Of all the things I've ever been — a student, a friend, a daughter, a dreamer — being your little sister has been the one that shaped me most. You don't know this, but you're the reason I believe that people can be gentle and strong at the same time. That someone can be both soft and unbreakable. You showed me that. You showed me it was possible.",
      "I built this place because I didn't know how else to tell you all of this. Words said out loud disappear into the air. But here — here they stay. Here, whenever you need to be reminded that you are loved completely, specifically, permanently — you can come back.",
      "This is yours. It always was.",
      "No matter where you go, no matter how long the distance becomes, no matter what life looks like five or ten or twenty years from now — there is a person in the world who thinks you are extraordinary. Who has always thought so. Who will never stop.",
      "That person is me.",
      "Come home soon.",
    ],
  },
];

const ALL_REGULAR_IDS = LETTERS.filter((l) => !l.isSecret).map((l) => l.id);

/* ─── stable particles ───────────────────────────────────── */
const PARTICLES = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  x: ((i * 41 + 17) % 95) + 2,
  y: ((i * 67 + 11) % 93) + 3,
  size: 1.2 + (i % 4) * 0.7,
  dur: 20 + (i % 8) * 2.8,
  delay: -(i * 2.7) % 16,
  opacity: 0.028 + (i % 6) * 0.01,
}));

/* ─── shared easing ──────────────────────────────────────── */
const ease = [0.4, 0, 0.2, 1] as const;

/* ─── localStorage helpers ───────────────────────────────── */
const LS_KEY = "openWhen_v1";

function loadOpened(): OpenedLetters {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveOpened(data: OpenedLetters) {
  localStorage.setItem(LS_KEY, JSON.stringify(data));
}

/* ─── shared small components ────────────────────────────── */
function GoldRule({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(201,169,110,0.4))" }} />
      <span style={{ color: "rgba(201,169,110,0.55)", fontSize: 9 }}>✦</span>
      <div className="flex-1 h-px" style={{ background: "linear-gradient(to left, transparent, rgba(201,169,110,0.4))" }} />
    </div>
  );
}

function LeafSvg({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 48 72" fill="none" aria-hidden>
      <path d="M24 72 C24 72 4 50 4 28 C4 10 14 2 24 2 C34 2 44 10 44 28 C44 50 24 72 24 72Z" fill="rgba(44,36,32,0.055)" />
      <path d="M24 72 L24 2" stroke="rgba(44,36,32,0.07)" strokeWidth="0.6" />
      <path d="M24 30 C14 22 10 14 16 8" stroke="rgba(44,36,32,0.07)" strokeWidth="0.6" fill="none" />
      <path d="M24 42 C34 34 38 26 32 20" stroke="rgba(44,36,32,0.07)" strokeWidth="0.6" fill="none" />
    </svg>
  );
}

function DustLayer() {
  return (
    <>
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          style={{
            position: "fixed",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: "#2C2420",
            opacity: p.opacity,
            animation: `dustFloat ${p.dur}s ease-in-out ${p.delay}s infinite alternate`,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      ))}
    </>
  );
}

function PrimaryButton({
  children,
  onClick,
  className = "",
}: {
  children: ReactNode;
  onClick: () => void;
  className?: string;
}) {
  return (
    <motion.button
      onClick={onClick}
      className={className}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: 11,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: "#2C2420",
        background: "transparent",
        border: "1px solid rgba(44,36,32,0.25)",
        padding: "14px 36px",
        cursor: "pointer",
        transition: "border-color 0.3s, background 0.3s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(201,169,110,0.6)";
        (e.currentTarget as HTMLButtonElement).style.background = "rgba(201,169,110,0.06)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(44,36,32,0.25)";
        (e.currentTarget as HTMLButtonElement).style.background = "transparent";
      }}
    >
      {children}
    </motion.button>
  );
}

/* ─── screens ────────────────────────────────────────────── */
function HeroScreen({ onBegin }: { onBegin: () => void }) {
  return (
    <div className="relative flex flex-col items-center justify-center" style={{ minHeight: "100svh" }}>
      {/* light leaks */}
      <div style={{ position: "absolute", top: "-8%", right: "-4%", width: "45%", height: "45%", background: "radial-gradient(ellipse, rgba(201,169,110,0.09) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-10%", left: "-5%", width: "38%", height: "38%", background: "radial-gradient(ellipse, rgba(201,169,110,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* soft vignette */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, transparent 50%, rgba(44,36,32,0.06) 100%)", pointerEvents: "none" }} />

      <div className="relative z-10 text-center px-6" style={{ maxWidth: 520 }}>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
          style={{ fontFamily: "'Inter', sans-serif", fontSize: 9, letterSpacing: "0.3em", color: "#8B7D72", textTransform: "uppercase", marginBottom: 28 }}
        >
          For my pretty hot and tempting Ladyy
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.9, ease }}
          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(58px, 14vw, 100px)", fontWeight: 300, fontStyle: "italic", color: "#2C2420", lineHeight: 1.0, letterSpacing: "-0.01em", marginBottom: 32 }}
        >
          Open When...
          For Swarali ❤️
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 1.6 }}
          style={{ height: 1, background: "linear-gradient(to right, transparent, rgba(201,169,110,0.5), transparent)", marginBottom: 28 }}
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 2 }}
          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 300, fontStyle: "italic", color: "#8B7D72", marginBottom: 52 }}
        >
          For every day life feels a little different.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.6 }}
        >
          <PrimaryButton onClick={onBegin}>Begin</PrimaryButton>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 3.2 }}
      >
        <p style={{ fontFamily: "'Caveat', cursive", fontSize: 17, color: "#8B7D72" }}>
          Made with all my love.
        </p>
      </motion.div>
    </div>
  );
}

function WelcomeScreen({ onContinue }: { onContinue: () => void }) {
  const lines = [
    { text: "Not every home has walls.", style: "italic" as const },
    { text: "Some have words.", style: "italic" as const },
    { text: "Some have people.", style: "italic" as const },
    { text: "And some...", style: "italic" as const },
    { text: "stay with you forever.", style: "normal" as const },
  ];

  return (
    <div className="relative flex flex-col items-center justify-center px-8" style={{ minHeight: "100svh" }}>
      <div style={{ maxWidth: 560, width: "100%", textAlign: "center" }}>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease }}
          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(38px, 9vw, 68px)", fontWeight: 300, fontStyle: "italic", color: "#2C2420", marginBottom: 40 }}
        >
          Welcome Home.
        </motion.h2>

        <GoldRule className="mb-10" />

        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 56 }}>
          {lines.map((l, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.7 + i * 0.12, ease }}
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 21,
                fontWeight: 300,
                fontStyle: l.style,
                color: i === lines.length - 1 ? "#2C2420" : "#5A4E49",
                lineHeight: 1.6,
              }}
            >
              {l.text}
            </motion.p>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.8 }}
        >
          <PrimaryButton onClick={onContinue}>Continue</PrimaryButton>
        </motion.div>
      </div>
    </div>
  );
}

function IntroScreen({ onContinue }: { onContinue: () => void }) {
  const introLines = [
    "I wanted to give these to you before you left.",
    "Life had other plans.",
    "",
    "So instead,",
    "I built you a place",
    "you can always come back to.",
    "",
    "Read these only when your heart asks you to.",
    "",
    "Until then...",
    "",
    "Keep them safe.",
    "And remember...",
    "",
    "Home never left you.",
  ];

  return (
    <div className="relative flex items-center justify-center px-6 py-16" style={{ minHeight: "100svh" }}>
      <div style={{ maxWidth: 560, width: "100%" }}>
        {/* paper card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease }}
          style={{
            background: "#F4F0E8",
            border: "1px solid rgba(44,36,32,0.1)",
            borderRadius: 3,
            padding: "clamp(32px, 8vw, 64px)",
            boxShadow: "0 20px 60px rgba(44,36,32,0.1), 0 6px 20px rgba(44,36,32,0.06)",
            position: "relative",
          }}
        >
          <LeafSvg className="absolute top-4 left-4 opacity-50" style={{ width: 28, height: 42 }} />
          <LeafSvg className="absolute top-4 right-4 opacity-50" style={{ width: 28, height: 42, transform: "scaleX(-1)" }} />

          <div style={{ height: 2, background: "linear-gradient(to right, transparent, rgba(201,169,110,0.45), transparent)", marginBottom: 36 }} />

          <div style={{ display: "flex", flexDirection: "column" }}>
            {introLines.map((line, i) =>
              line === "" ? (
                <div key={i} style={{ height: 16 }} />
              ) : (
                <motion.p
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 + i * 0.07 }}
                  style={{
                    fontFamily: line === "Home never left you." ? "'Caveat', cursive" : "'Cormorant Garamond', serif",
                    fontSize: line === "Home never left you." ? 26 : line === "Until then..." ? 20 : 18,
                    fontWeight: 300,
                    fontStyle: ["I wanted to give these to you before you left.", "So instead,", "I built you a place", "you can always come back to.", "Read these only when your heart asks you to."].includes(line) ? "italic" : "normal",
                    color: line === "Home never left you." ? "#2C2420" : "#5A4E49",
                    lineHeight: 1.75,
                  }}
                >
                  {line}
                </motion.p>
              )
            )}
          </div>

          <div style={{ height: 2, background: "linear-gradient(to right, transparent, rgba(201,169,110,0.45), transparent)", marginTop: 36 }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.2 }}
          className="mt-10 text-center"
        >
          <PrimaryButton onClick={onContinue}>Continue</PrimaryButton>
        </motion.div>
      </div>
    </div>
  );
}

function InstructionsScreen({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="relative flex items-center justify-center px-8" style={{ minHeight: "100svh" }}>
      <div style={{ maxWidth: 520, width: "100%", textAlign: "center" }}>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.3 }}
          style={{ fontFamily: "'Inter', sans-serif", fontSize: 9, letterSpacing: "0.28em", color: "#8B7D72", textTransform: "uppercase", marginBottom: 20 }}
        >
          Before you begin
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.6, ease }}
          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(30px, 7vw, 52px)", fontWeight: 300, color: "#2C2420", marginBottom: 40 }}
        >
          How these letters work.
        </motion.h2>

        <GoldRule className="mb-10" />

        {[
          "Every letter is sealed.",
          "Every letter has a key.",
          "The key has always been written on it.",
          "You simply have to look from another perspective.",
          "",
          "Read them only when your heart asks you to.",
        ].map((line, i) =>
          line === "" ? (
            <div key={i} style={{ height: 20 }} />
          ) : (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 + i * 0.12, ease }}
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 18,
                fontWeight: 300,
                fontStyle: i < 3 ? "normal" : "italic",
                color: i === 3 ? "#C9A96E" : "#5A4E49",
                lineHeight: 1.8,
                marginBottom: 4,
              }}
            >
              {line}
            </motion.p>
          )
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.2 }}
          className="mt-12"
        >
          <PrimaryButton onClick={onEnter}>Enter Library</PrimaryButton>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── envelope card ──────────────────────────────────────── */
function EnvelopeCard({
  letter,
  opened,
  openedDate,
  onOpen,
  chapterIndex,
  isSecret,
}: {
  letter: LetterData;
  opened: boolean;
  openedDate?: string;
  onOpen: (l: LetterData) => void;
  chapterIndex: number;
  isSecret?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const scatter = SCATTER[chapterIndex % SCATTER.length];

  const bgColor = isSecret ? "#1A1410" : "#EDE9DF";
  const flapColor = isSecret ? "#120E0A" : "#E4DDD0";
  const foldColor1 = isSecret ? "#1E1814" : "#E8E2D3";
  const foldColor2 = isSecret ? "#221C16" : "#EAE4D5";
  const textColor = isSecret ? "#C9A96E" : "#2C2420";
  const subtextColor = isSecret ? "rgba(201,169,110,0.6)" : "#8B7D72";
  const borderColor = isSecret ? "rgba(201,169,110,0.3)" : "rgba(44,36,32,0.13)";
  const sealColor = isSecret ? "rgba(201,169,110,0.25)" : "rgba(201,169,110,0.12)";
  const sealBorder = isSecret ? "rgba(201,169,110,0.7)" : "rgba(201,169,110,0.4)";

  return (
    <motion.div
      style={{
        transform: `rotate(${scatter.rotate}deg) translateY(${scatter.offsetY}px)`,
        cursor: "pointer",
        position: "relative",
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => onOpen(letter)}
      whileHover={{ y: -12, scale: 1.015 }}
      transition={{ duration: 0.5, ease }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onOpen(letter)}
      aria-label={`Open when ${letter.trigger}`}
    >
      {/* paper peek */}
      <motion.div
        style={{
          position: "absolute",
          left: "10%",
          right: "10%",
          top: 0,
          height: 18,
          background: isSecret ? "#2A2018" : "#F8F6F2",
          border: `1px solid ${isSecret ? "rgba(201,169,110,0.2)" : "rgba(44,36,32,0.09)"}`,
          borderRadius: 2,
          zIndex: 0,
        }}
        animate={{ y: hovered ? -14 : -4, opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.45, ease }}
      />

      {/* main envelope */}
      <motion.div
        style={{
          position: "relative",
          zIndex: 1,
          background: bgColor,
          border: `1px solid ${borderColor}`,
          borderRadius: 3,
          overflow: "hidden",
        }}
        animate={{
          boxShadow: hovered
            ? isSecret
              ? "0 28px 70px rgba(201,169,110,0.15), 0 10px 28px rgba(0,0,0,0.4)"
              : "0 24px 60px rgba(44,36,32,0.18), 0 8px 24px rgba(44,36,32,0.1)"
            : isSecret
              ? "0 8px 30px rgba(0,0,0,0.3)"
              : "0 4px 18px rgba(44,36,32,0.07)",
        }}
        transition={{ duration: 0.5 }}
      >
        {/* flap */}
        <motion.div
          style={{ position: "absolute", top: 0, left: 0, right: 0, height: 60, transformOrigin: "top center", zIndex: 2 }}
          animate={{ rotateX: hovered ? -130 : 0 }}
          transition={{ duration: 0.55, ease }}
        >
          <div style={{ width: "100%", height: "100%", clipPath: "polygon(0 0, 100% 0, 50% 100%)", background: flapColor }} />
        </motion.div>

        {/* bottom v-folds */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 55, zIndex: 1 }}>
          <div style={{ position: "absolute", bottom: 0, left: 0, width: "50%", height: "100%", clipPath: "polygon(0 100%, 100% 100%, 0 0)", background: foldColor1 }} />
          <div style={{ position: "absolute", bottom: 0, right: 0, width: "50%", height: "100%", clipPath: "polygon(0 100%, 100% 100%, 100% 0)", background: foldColor2 }} />
        </div>

        {/* wax seal */}
        <motion.div
          style={{
            position: "absolute",
            top: 68,
            left: "50%",
            transform: "translateX(-50%)",
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: sealColor,
            border: `1px solid ${sealBorder}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
          }}
          animate={{
            opacity: hovered ? 0 : 1,
            scale: hovered ? 0.7 : 1,
            boxShadow: hovered ? "0 0 16px rgba(201,169,110,0.6)" : "none",
          }}
          transition={{ duration: 0.35 }}
        >
          <span style={{ color: "#C9A96E", fontSize: 10 }}>✦</span>
        </motion.div>

        {/* content */}
        <div style={{ padding: "106px 24px 32px", textAlign: "center" }}>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 8.5, letterSpacing: "0.24em", color: subtextColor, textTransform: "uppercase", marginBottom: 8 }}>
            Open when
          </p>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15.5, fontWeight: 400, color: textColor, lineHeight: 1.35 }}>
            {letter.trigger}
          </p>

          {/* opened badge */}
          {opened && (
            <div style={{ marginTop: 16 }}>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 8, letterSpacing: "0.18em", color: isSecret ? "rgba(201,169,110,0.5)" : "rgba(44,36,32,0.3)", textTransform: "uppercase" }}>
                ✓ Opened · {openedDate}
              </p>
            </div>
          )}
        </div>

        {/* gold base on hover */}
        <motion.div
          style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: "linear-gradient(to right, transparent, rgba(201,169,110,0.5), transparent)" }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        />
      </motion.div>
    </motion.div>
  );
}

/* ─── library screen ─────────────────────────────────────── */
function LibraryScreen({
  openedLetters,
  onOpenEnvelope,
  showSecret,
}: {
  openedLetters: OpenedLetters;
  onOpenEnvelope: (l: LetterData) => void;
  showSecret: boolean;
}) {
  const secretLetter = LETTERS.find((l) => l.isSecret)!;

  return (
    <div className="relative min-h-screen px-5 md:px-10 py-16 md:py-24">
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        {/* heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease }}
          className="text-center mb-16 md:mb-20"
        >
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 9, letterSpacing: "0.28em", color: "#8B7D72", textTransform: "uppercase", marginBottom: 12 }}>
            Memory Library
          </p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px, 6vw, 48px)", fontWeight: 300, fontStyle: "italic", color: "#2C2420" }}>
            Fifteen letters, written just for you.
          </h2>
        </motion.div>

        {/* chapters */}
        {CHAPTERS.map((chapter, ci) => {
          const chapterLetters = LETTERS.filter((l) => l.chapter === chapter.id);
          return (
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: ci * 0.15, ease }}
              style={{ marginBottom: 64 }}
            >
              {/* chapter label */}
              <div style={{ marginBottom: 28 }}>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 9, letterSpacing: "0.25em", color: "#C9A96E", textTransform: "uppercase", marginBottom: 6 }}>
                  {["I", "II", "III", "IV"][ci]}
                </p>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 400, color: "#2C2420", marginBottom: 4 }}>
                  {chapter.title}
                </h3>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, fontStyle: "italic", color: "#8B7D72" }}>
                  {chapter.subtitle}
                </p>
              </div>
              <GoldRule className="mb-8" />

              {/* envelopes */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 200px), 1fr))",
                  gap: "20px 16px",
                  alignItems: "end",
                }}
              >
                {chapterLetters.map((letter, li) => (
                  <EnvelopeCard
                    key={letter.id}
                    letter={letter}
                    opened={!!openedLetters[letter.id]}
                    openedDate={openedLetters[letter.id]}
                    onOpen={onOpenEnvelope}
                    chapterIndex={li}
                  />
                ))}
              </div>
            </motion.div>
          );
        })}

        {/* secret letter */}
        <AnimatePresence>
          {showSecret && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4, ease }}
              style={{ textAlign: "center", paddingTop: 20, paddingBottom: 40 }}
            >
              <GoldRule className="mb-12" />
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 9, letterSpacing: "0.28em", color: "rgba(201,169,110,0.7)", textTransform: "uppercase", marginBottom: 24 }}>
                One last letter
              </p>
              <div style={{ maxWidth: 220, margin: "0 auto" }}>
                <EnvelopeCard
                  letter={secretLetter}
                  opened={!!openedLetters[secretLetter.id]}
                  openedDate={openedLetters[secretLetter.id]}
                  onOpen={onOpenEnvelope}
                  chapterIndex={0}
                  isSecret
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─── password modal ─────────────────────────────────────── */
function PasswordModal({
  letter,
  onClose,
  onCorrect,
}: {
  letter: LetterData;
  onClose: () => void;
  onCorrect: () => void;
}) {
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [stage, setStage] = useState<UnsealStage>("idle");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    if (input.trim().toLowerCase() === letter.password.toLowerCase()) {
      setError(false);
      setStage("cracking");
      setTimeout(() => setStage("unfolding"), 900);
      setTimeout(() => setStage("done"), 1900);
      setTimeout(() => onCorrect(), 2200);
    } else {
      setError(true);
      setInput("");
      setTimeout(() => setError(false), 3000);
    }
  };

  const isAnimating = stage !== "idle";
  const isSecret = letter.isSecret;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(44,36,32,0.6)", backdropFilter: "blur(10px)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      onClick={(e) => e.target === e.currentTarget && !isAnimating && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.55, ease }}
        style={{
          width: "100%",
          maxWidth: 440,
          background: isSecret ? "#1A1410" : "#F8F6F2",
          border: `1px solid ${isSecret ? "rgba(201,169,110,0.25)" : "rgba(44,36,32,0.1)"}`,
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: "0 40px 100px rgba(44,36,32,0.3)",
        }}
      >
        <div style={{ height: 2, background: "linear-gradient(to right, transparent, rgba(201,169,110,0.6), transparent)" }} />

        {/* unseal animation */}
        <AnimatePresence>
          {isAnimating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16 px-8"
            >
              {/* wax seal cracking */}
              <div style={{ position: "relative", width: 64, height: 64, marginBottom: 24 }}>
                <motion.div
                  style={{
                    width: 64, height: 64, borderRadius: "50%",
                    background: "rgba(201,169,110,0.15)",
                    border: "2px solid rgba(201,169,110,0.6)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                  animate={stage === "cracking" ? { scale: [1, 1.15, 0.95, 1.05, 0], opacity: [1, 1, 0.8, 0.5, 0] } : {}}
                  transition={{ duration: 0.8 }}
                >
                  <span style={{ color: "#C9A96E", fontSize: 22 }}>✦</span>
                </motion.div>
                {/* crack lines */}
                {stage !== "idle" && (
                  <motion.svg
                    style={{ position: "absolute", inset: -8, width: 80, height: 80 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.9, delay: 0.1 }}
                    viewBox="0 0 80 80"
                  >
                    <line x1="40" y1="40" x2="20" y2="10" stroke="rgba(201,169,110,0.7)" strokeWidth="1.2" />
                    <line x1="40" y1="40" x2="65" y2="20" stroke="rgba(201,169,110,0.5)" strokeWidth="0.8" />
                    <line x1="40" y1="40" x2="70" y2="55" stroke="rgba(201,169,110,0.6)" strokeWidth="1" />
                    <line x1="40" y1="40" x2="15" y2="60" stroke="rgba(201,169,110,0.4)" strokeWidth="0.8" />
                  </motion.svg>
                )}
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 18,
                  fontStyle: "italic",
                  color: isSecret ? "#C9A96E" : "#8B7D72",
                }}
              >
                {stage === "cracking" ? "Unsealing..." : "Opening..."}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* input form */}
        {!isAnimating && (
          <div style={{ padding: "clamp(28px, 6vw, 48px)" }}>
            {!isAnimating && (
              <button
                onClick={onClose}
                style={{ position: "absolute", top: 16, right: 16, background: "transparent", border: "none", cursor: "pointer", color: isSecret ? "#C9A96E" : "#8B7D72" }}
                aria-label="Close"
              >
                <X size={15} strokeWidth={1.5} />
              </button>
            )}

            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 9, letterSpacing: "0.24em", color: isSecret ? "rgba(201,169,110,0.6)" : "#8B7D72", textTransform: "uppercase", marginBottom: 12 }}>
              Open when
            </p>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 400, color: isSecret ? "#C9A96E" : "#2C2420", marginBottom: 28, lineHeight: 1.3 }}>
              {letter.trigger}
            </h3>

            <GoldRule className="mb-8" />

            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, fontStyle: "italic", color: isSecret ? "rgba(201,169,110,0.7)" : "#5A4E49", lineHeight: 1.75, marginBottom: 28 }}>
              This letter has remained sealed.
              <br />
              Write the feeling, exactly as it appears...
              <br />
              Only from the other side.
            </p>

            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Write your key..."
              style={{
                width: "100%",
                background: isSecret ? "rgba(201,169,110,0.05)" : "rgba(44,36,32,0.04)",
                border: `1px solid ${error ? "rgba(139,45,45,0.5)" : isSecret ? "rgba(201,169,110,0.2)" : "rgba(44,36,32,0.12)"}`,
                borderRadius: 2,
                padding: "12px 16px",
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 16,
                fontStyle: "italic",
                color: isSecret ? "#C9A96E" : "#2C2420",
                outline: "none",
                marginBottom: 12,
                boxSizing: "border-box",
                transition: "border-color 0.3s",
              }}
            />

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, fontStyle: "italic", color: isSecret ? "rgba(201,169,110,0.6)" : "#8B7D72", marginBottom: 12, lineHeight: 1.6 }}
                >
                  This letter isn't ready yet.
                  <br />
                  Look again. The answer is hiding in plain sight.
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button
              onClick={handleSubmit}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              style={{
                width: "100%",
                padding: "13px 0",
                background: "transparent",
                border: `1px solid ${isSecret ? "rgba(201,169,110,0.4)" : "rgba(44,36,32,0.2)"}`,
                borderRadius: 2,
                fontFamily: "'Inter', sans-serif",
                fontSize: 10,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: isSecret ? "#C9A96E" : "#2C2420",
                cursor: "pointer",
              }}
            >
              Unseal Letter
            </motion.button>
          </div>
        )}

        <div style={{ height: 2, background: "linear-gradient(to right, transparent, rgba(201,169,110,0.6), transparent)" }} />
      </motion.div>
    </motion.div>
  );
}

/* ─── letter view ────────────────────────────────────────── */
function LetterView({
  letter,
  onReturn,
}: {
  letter: LetterData;
  onReturn: () => void;
}) {
  const [showAfter, setShowAfter] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "auto";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const isSecret = letter.isSecret;

  return (
    <div
      style={{ minHeight: "100svh", background: isSecret ? "#120E0A" : "#F8F6F2", padding: "clamp(32px, 8vw, 80px) clamp(20px, 6vw, 40px)" }}
      className="flex flex-col items-center"
    >
      {/* back nav */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        style={{ width: "100%", maxWidth: 620, marginBottom: 48 }}
      >
        <button
          onClick={() => setShowAfter(true)}
          style={{ background: "transparent", border: "none", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: 9, letterSpacing: "0.2em", color: isSecret ? "rgba(201,169,110,0.5)" : "#8B7D72", textTransform: "uppercase", padding: 0 }}
        >
          ← Return to Library
        </button>
      </motion.div>

      {/* letter paper */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease }}
        style={{
          width: "100%",
          maxWidth: 620,
          background: isSecret ? "#1A1410" : "#F4F0E8",
          border: `1px solid ${isSecret ? "rgba(201,169,110,0.2)" : "rgba(44,36,32,0.1)"}`,
          borderRadius: 3,
          padding: "clamp(32px, 8vw, 64px)",
          boxShadow: isSecret ? "0 30px 80px rgba(0,0,0,0.5)" : "0 20px 60px rgba(44,36,32,0.1)",
          position: "relative",
        }}
      >
        <div style={{ height: 2, background: "linear-gradient(to right, transparent, rgba(201,169,110,0.5), transparent)", marginBottom: 36 }} />

        <LeafSvg className="absolute top-4 left-4" style={{ width: 26, height: 40, opacity: isSecret ? 0.3 : 0.45 }} />
        <LeafSvg className="absolute top-4 right-4" style={{ width: 26, height: 40, transform: "scaleX(-1)", opacity: isSecret ? 0.3 : 0.45 }} />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, fontStyle: "italic", color: isSecret ? "rgba(201,169,110,0.5)" : "#8B7D72", marginBottom: 6 }}
        >
          My dearest Di,
        </motion.p>

        <GoldRule className="mb-8" />

        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 8.5, letterSpacing: "0.24em", color: isSecret ? "rgba(201,169,110,0.5)" : "#8B7D72", textTransform: "uppercase", marginBottom: 6 }}>
          Open when
        </p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(22px, 5vw, 34px)", fontWeight: 400, color: isSecret ? "#C9A96E" : "#2C2420", lineHeight: 1.25, marginBottom: 40 }}
        >
          {letter.trigger}
        </motion.h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          {letter.body.map((para, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 + i * 0.08, ease }}
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 18,
                fontWeight: 300,
                color: isSecret ? "rgba(248,246,242,0.85)" : "#2C2420",
                lineHeight: 1.9,
              }}
            >
              {para}
            </motion.p>
          ))}
        </div>

        <GoldRule className="mt-10 mb-8" />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <p style={{ fontFamily: "'Caveat', cursive", fontSize: 22, color: isSecret ? "#C9A96E" : "#2C2420", lineHeight: 1.6 }}>
            With all my love,
            <br />
            Your little sister ❤️
          </p>
        </motion.div>

        <div style={{ height: 2, background: "linear-gradient(to right, transparent, rgba(201,169,110,0.5), transparent)", marginTop: 36 }} />
      </motion.div>

      {/* after reading */}
      <AnimatePresence>
        {showAfter && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            style={{ width: "100%", maxWidth: 620, marginTop: 48, textAlign: "center" }}
          >
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontStyle: "italic", color: isSecret ? "rgba(201,169,110,0.6)" : "#8B7D72", marginBottom: 28 }}>
              This letter will always stay open for you.
            </p>
            <PrimaryButton onClick={onReturn}>Return to Library</PrimaryButton>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── final screen ───────────────────────────────────────── */
function FinalScreen({ onReturn }: { onReturn: () => void }) {
  return (
    <div className="relative flex flex-col items-center justify-center px-8 text-center" style={{ minHeight: "100svh" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(201,169,110,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease }}
        style={{ maxWidth: 520, position: "relative", zIndex: 1 }}
      >
        <GoldRule className="mb-14" />
        <LeafSvg className="mx-auto mb-10" style={{ width: 38, height: 56, opacity: 0.45 }} />

        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(19px, 4vw, 26px)", fontWeight: 300, fontStyle: "italic", color: "#2C2420", lineHeight: 1.85, marginBottom: 40 }}>
          "No matter how many cities life takes you to...
          <br />
          You'll never have to search for home.
          <br />
          Because you'll always carry a part of it with you."
        </p>

        <GoldRule className="mb-12" />

        <p style={{ fontFamily: "'Caveat', cursive", fontSize: 28, color: "#2C2420", lineHeight: 1.6, marginBottom: 40 }}>
          Love,
          <br />
          Rashi ❤️
        </p>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }}>
          <PrimaryButton onClick={onReturn}>Return to Library</PrimaryButton>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ─── music button ───────────────────────────────────────── */
function MusicButton() {
  const [playing, setPlaying] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const startAudio = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      ctxRef.current = ctx;
      const master = ctx.createGain();
      master.gain.setValueAtTime(0, ctx.currentTime);
      master.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 4);
      master.connect(ctx.destination);
      gainRef.current = master;

      [
        { f: 130.81, g: 0.45, t: "triangle" as OscillatorType },
        { f: 196.0, g: 0.3, t: "sine" as OscillatorType },
        { f: 261.63, g: 0.25, t: "sine" as OscillatorType },
        { f: 329.63, g: 0.18, t: "sine" as OscillatorType },
        { f: 392.0, g: 0.12, t: "sine" as OscillatorType },
      ].forEach(({ f, g, t }) => {
        const osc = ctx.createOscillator();
        const gn = ctx.createGain();
        osc.type = t;
        osc.frequency.value = f + (Math.random() - 0.5) * 0.4;
        gn.gain.value = g;
        osc.connect(gn);
        gn.connect(master);
        osc.start();
      });
    } catch { /* audio unavailable */ }
  }, []);

  const stopAudio = useCallback(() => {
    if (gainRef.current && ctxRef.current) {
      gainRef.current.gain.linearRampToValueAtTime(0, ctxRef.current.currentTime + 2);
      const ref = ctxRef.current;
      setTimeout(() => ref.close().catch(() => {}), 2500);
      ctxRef.current = null;
      gainRef.current = null;
    }
  }, []);

  const toggle = () => {
    playing ? stopAudio() : startAudio();
    setPlaying((p) => !p);
  };

  useEffect(() => () => stopAudio(), [stopAudio]);

  return (
    <motion.button
      onClick={toggle}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full"
      style={{
        background: "rgba(248,246,242,0.9)",
        border: "1px solid rgba(44,36,32,0.12)",
        boxShadow: "0 4px 20px rgba(44,36,32,0.1)",
        padding: "9px 15px",
        backdropFilter: "blur(14px)",
        cursor: "pointer",
      }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      aria-label={playing ? "Pause music" : "Play ambient music"}
    >
      <div className="flex items-end gap-[2px]" style={{ height: 11 }}>
        {[10, 7, 12].map((maxH, i) => (
          <motion.div
            key={i}
            style={{ width: 2, background: "#C9A96E", borderRadius: 1 }}
            animate={playing ? { height: [3, maxH, 4] } : { height: 3 }}
            transition={playing ? { duration: 0.65 + i * 0.18, repeat: Infinity, ease: "easeInOut" } : { duration: 0.4 }}
          />
        ))}
      </div>
      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 9, letterSpacing: "0.18em", color: "#8B7D72", textTransform: "uppercase" }}>
        {playing ? "Pause" : "Music"}
      </span>
    </motion.button>
  );
}

/* ─── app ────────────────────────────────────────────────── */
export default function App() {
  const [screen, setScreen] = useState<Screen>("hero");
  const [openedLetters, setOpenedLetters] = useState<OpenedLetters>(loadOpened);
  const [passwordModal, setPasswordModal] = useState<LetterData | null>(null);
  const [activeLetter, setActiveLetter] = useState<LetterData | null>(null);

  const allRegularOpened = ALL_REGULAR_IDS.every((id) => !!openedLetters[id]);

  /* inject global styles */
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes dustFloat {
        0%   { transform: translateY(0px) translateX(0px); }
        33%  { transform: translateY(-18px) translateX(9px); }
        66%  { transform: translateY(6px) translateX(-7px); }
        100% { transform: translateY(-10px) translateX(5px); }
      }
      html { scroll-behavior: smooth; }
      ::-webkit-scrollbar { width: 0; }
      * { box-sizing: border-box; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const handleOpenEnvelope = (letter: LetterData) => {
    if (openedLetters[letter.id]) {
      // already opened — go straight to letter
      setActiveLetter(letter);
    } else {
      setPasswordModal(letter);
    }
  };

  const handleCorrectPassword = (letter: LetterData) => {
    const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    const updated = { ...openedLetters, [letter.id]: today };
    setOpenedLetters(updated);
    saveOpened(updated);
    setPasswordModal(null);
    setTimeout(() => setActiveLetter(letter), 300);
  };

  const handleReturnFromLetter = () => {
    setActiveLetter(null);
    const updatedAll = ALL_REGULAR_IDS.every((id) => !!openedLetters[id]);
    if (updatedAll && !openedLetters[16]) {
      // all 15 opened, show final
      setScreen("final");
    }
  };

  /* cursor glow */
  const [cursor, setCursor] = useState({ x: -200, y: -200 });
  useEffect(() => {
    const move = (e: MouseEvent) => setCursor({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  if (activeLetter) {
    return (
      <>
        <DustLayer />
        <LetterView letter={activeLetter} onReturn={handleReturnFromLetter} />
        <MusicButton />
      </>
    );
  }

  return (
    <div style={{ background: "#F8F6F2", minHeight: "100svh", overflowX: "hidden", position: "relative" }}>
      {/* cursor glow */}
      <div
        style={{
          position: "fixed",
          left: cursor.x - 160,
          top: cursor.y - 160,
          width: 320,
          height: 320,
          background: "radial-gradient(circle, rgba(201,169,110,0.055) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 1,
          transition: "left 0.1s ease-out, top 0.1s ease-out",
        }}
      />

      <DustLayer />

      <AnimatePresence mode="wait">
        {screen === "hero" && (
          <motion.div key="hero" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.8, ease }}>
            <HeroScreen onBegin={() => setScreen("welcome")} />
          </motion.div>
        )}

        {screen === "welcome" && (
          <motion.div key="welcome" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.8, ease }}>
            <WelcomeScreen onContinue={() => setScreen("intro")} />
          </motion.div>
        )}

        {screen === "intro" && (
          <motion.div key="intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.8, ease }}>
            <IntroScreen onContinue={() => setScreen("instructions")} />
          </motion.div>
        )}

        {screen === "instructions" && (
          <motion.div key="instructions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.8, ease }}>
            <InstructionsScreen onEnter={() => setScreen("library")} />
          </motion.div>
        )}

        {screen === "library" && (
          <motion.div key="library" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.9 }}>
            <LibraryScreen
              openedLetters={openedLetters}
              onOpenEnvelope={handleOpenEnvelope}
              showSecret={allRegularOpened}
            />
          </motion.div>
        )}

        {screen === "final" && (
          <motion.div key="final" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 1.2, ease }}>
            <FinalScreen onReturn={() => setScreen("library")} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* password modal */}
      <AnimatePresence>
        {passwordModal && (
          <PasswordModal
            letter={passwordModal}
            onClose={() => setPasswordModal(null)}
            onCorrect={() => handleCorrectPassword(passwordModal)}
          />
        )}
      </AnimatePresence>

      <MusicButton />
    </div>
  );
}
