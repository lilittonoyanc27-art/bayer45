import { useState, useEffect, useRef } from 'react';
import {
  Headphones,
  Volume2,
  VolumeX,
  Music,
  Play,
  Square,
  RotateCcw,
  CheckCircle,
  XCircle,
  Award,
  Sparkles,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  HelpCircle,
  Map,
  Sun,
  Home,
  Table,
  Guitar,
  Briefcase,
  Hand,
  Camera,
  Bike,
  Radio,
  GraduationCap,
  Mic,
  Phone,
  FileText,
  PenTool,
  Cat,
  Dog,
  Globe,
  Sliders,
  Sparkle
} from 'lucide-react';
import { AppLanguage, AppScreen, SpanishWord, QuizQuestion } from './types';
import { SPANISH_WORDS, DJ_PRAISES, UI_TEXTS, generateQuizQuestions } from './data';
import { djsynth } from './audio';

// Dynamic Icon Renderer
const IconRenderer = ({ name, className }: { name: string; className?: string }) => {
  switch (name) {
    case 'BookOpen': return <BookOpen className={className} id={`icon-${name}`} />;
    case 'Cat': return <Cat className={className} id={`icon-${name}`} />;
    case 'Dog': return <Dog className={className} id={`icon-${name}`} />;
    case 'Music': return <Music className={className} id={`icon-${name}`} />;
    case 'Music2': return <Music className={className} id={`icon-${name}`} />;
    case 'Mic': return <Mic className={className} id={`icon-${name}`} />;
    case 'Phone': return <Phone className={className} id={`icon-${name}`} />;
    case 'FileText': return <FileText className={className} id={`icon-${name}`} />;
    case 'PenTool': return <PenTool className={className} id={`icon-${name}`} />;
    case 'HelpCircle': return <HelpCircle className={className} id={`icon-${name}`} />;
    case 'Map': return <Map className={className} id={`icon-${name}`} />;
    case 'Sun': return <Sun className={className} id={`icon-${name}`} />;
    case 'Home': return <Home className={className} id={`icon-${name}`} />;
    case 'Table': return <Table className={className} id={`icon-${name}`} />;
    case 'Guitar': return <Guitar className={className} id={`icon-${name}`} />;
    case 'Briefcase': return <Briefcase className={className} id={`icon-${name}`} />;
    case 'Hand': return <Hand className={className} id={`icon-${name}`} />;
    case 'Camera': return <Camera className={className} id={`icon-${name}`} />;
    case 'Bike': return <Bike className={className} id={`icon-${name}`} />;
    case 'Radio': return <Radio className={className} id={`icon-${name}`} />;
    case 'GraduationCap': return <GraduationCap className={className} id={`icon-${name}`} />;
    default: return <Music className={className} id={`icon-default`} />;
  }
};

// Animated Vector Mascot Component (DJ ElLa)
interface DJVinylProps {
  emotion: 'cool' | 'happy' | 'thinking' | 'celebrating' | 'sad';
  dancing?: boolean;
}

const DJVinyl = ({ emotion, dancing = false }: DJVinylProps) => {
  return (
    <div className={`relative flex items-center justify-center transition-transform duration-300 ${dancing ? 'animate-bounce' : 'hover:scale-105'}`} id="dj-mascot-container">
      {/* Glow Backing */}
      <div className="absolute w-44 h-44 rounded-full bg-gradient-to-tr from-pink-500 to-cyan-500 opacity-20 blur-xl animate-pulse" id="dj-glow" />

      <svg width="180" height="180" viewBox="0 0 100 100" className="relative z-10" id="dj-svg">
        {/* Outer Vinyl Body */}
        <circle cx="50" cy="50" r="45" fill="#111827" stroke="#374151" strokeWidth="1" />
        {/* Vinyl Grooves */}
        <circle cx="50" cy="50" r="38" fill="none" stroke="#1f2937" strokeWidth="0.5" strokeDasharray="3 2" />
        <circle cx="50" cy="50" r="32" fill="none" stroke="#1f2937" strokeWidth="0.5" />
        <circle cx="50" cy="50" r="26" fill="none" stroke="#374151" strokeWidth="0.5" strokeDasharray="5 4" />

        {/* Record Center Label (Neon Gradient) */}
        <defs>
          <linearGradient id="centerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <linearGradient id="shadesGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="18" fill="url(#centerGrad)" />
        <circle cx="50" cy="50" r="4" fill="#111827" />

        {/* Eye & Face Expressions */}
        {emotion === 'cool' && (
          <g id="face-cool">
            {/* Cool Sunglasses */}
            <rect x="36" y="42" width="12" height="7" rx="2" fill="url(#shadesGrad)" />
            <rect x="52" y="42" width="12" height="7" rx="2" fill="url(#shadesGrad)" />
            <line x1="48" y1="45" x2="52" y2="45" stroke="#fff" strokeWidth="2" />
            {/* Smile */}
            <path d="M 43 54 Q 50 59 57 54" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        )}

        {emotion === 'happy' && (
          <g id="face-happy">
            {/* Curved Happy Eyes */}
            <path d="M 37 46 Q 41 42 45 46" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            <path d="M 55 46 Q 59 42 63 46" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            {/* Laughing mouth */}
            <path d="M 44 52 Q 50 58 56 52 Z" fill="#fff" />
          </g>
        )}

        {emotion === 'thinking' && (
          <g id="face-thinking">
            {/* Skeptical / Curios eyes */}
            <circle cx="41" cy="45" r="2.5" fill="#fff" />
            <circle cx="59" cy="44" r="2.5" fill="#fff" />
            <line x1="37" y1="41" x2="45" y2="43" stroke="#fff" strokeWidth="1.5" />
            <line x1="55" y1="40" x2="63" y2="40" stroke="#fff" strokeWidth="1.5" />
            {/* Slight mouth skew */}
            <path d="M 45 54 Q 50 52 55 55" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        )}

        {emotion === 'celebrating' && (
          <g id="face-celebrating">
            {/* Star-like neon eyes */}
            <path d="M 41 40 L 41 48 M 37 44 L 45 44" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            <path d="M 59 40 L 59 48 M 55 44 L 63 44" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            {/* Joyful open mouth */}
            <ellipse cx="50" cy="54" rx="5" ry="3" fill="#fff" />
            <circle cx="48" cy="42" r="1" fill="#22c55e" />
            <circle cx="61" cy="42" r="1" fill="#22c55e" />
          </g>
        )}

        {emotion === 'sad' && (
          <g id="face-sad">
            {/* Down-curved sad eyes */}
            <path d="M 37 44 Q 41 48 45 44" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            <path d="M 55 44 Q 59 48 63 44" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            {/* Sad mouth */}
            <path d="M 45 55 Q 50 51 55 55" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          </g>
        )}

        {/* DJ Headphones wrapping around vinyl */}
        <path d="M 12 50 A 38 38 0 0 1 88 50" fill="none" stroke="#a855f7" strokeWidth="4.5" strokeLinecap="round" />
        {/* Left ear cup */}
        <rect x="5" y="42" width="10" height="16" rx="4" fill="#ec4899" stroke="#fff" strokeWidth="1" />
        <rect x="8" y="45" width="4" height="10" rx="1" fill="#111827" />
        {/* Right ear cup */}
        <rect x="85" y="42" width="10" height="16" rx="4" fill="#06b6d4" stroke="#fff" strokeWidth="1" />
        <rect x="88" y="45" width="4" height="10" rx="1" fill="#111827" />
      </svg>
    </div>
  );
};

export default function App() {
  // Navigation & States
  const [lang, setLang] = useState<AppLanguage>('ru');
  const [screen, setScreen] = useState<AppScreen>('language');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  // Character feedback states
  const [djSpeech, setDjSpeech] = useState<string>('Hola, amigos! Погнали изучать испанский род! 🎧');
  const [djEmotion, setDjEmotion] = useState<'cool' | 'happy' | 'thinking' | 'celebrating' | 'sad'>('cool');

  // Screen 3: Word Cards state
  const [activeCardIdx, setActiveCardIdx] = useState(0);
  const [cardFlipped, setCardFlipped] = useState(false);

  // Screen 4: "El o La?" Game state
  const [elLaIndex, setElLaIndex] = useState(0);
  const [elLaWords, setElLaWords] = useState<SpanishWord[]>([]);
  const [elLaSelected, setElLaSelected] = useState<'el' | 'la' | null>(null);
  const [elLaAnswered, setElLaAnswered] = useState(false);
  const [elLaIsCorrect, setElLaIsCorrect] = useState(false);

  // Screen 5: "DJ Sort" Game state
  const [sortList, setSortList] = useState<SpanishWord[]>([]);
  const [sortIndex, setSortIndex] = useState(0);
  const [sortFeedback, setSortFeedback] = useState<{ isCorrect: boolean; show: boolean; msg: string | null }>({
    isCorrect: false,
    show: false,
    msg: null,
  });
  const [sortedCount, setSortedCount] = useState(0);

  // Screen 6: "Instrument Beat" Sequencer state
  const [sequencerStep, setSequencerStep] = useState(0);
  const [sequencerActive, setSequencerActive] = useState(false);
  // Row track grid (8 steps per instrument)
  const [seqMatrix, setSeqMatrix] = useState<{ [key: string]: boolean[] }>({
    kick: [true, false, false, false, true, false, false, false],
    snare: [false, false, true, false, false, false, true, false],
    hihat: [false, true, false, true, false, true, false, true],
    bass: [true, false, false, true, false, true, false, false],
    synth: [false, true, false, false, true, false, false, true],
    guitar: [false, false, false, false, false, false, false, false],
    scratch: [false, false, false, false, false, false, false, false],
  });

  // Screen 7: "DJ Mix Challenge" state
  const [challengeQuestions, setChallengeQuestions] = useState<QuizQuestion[]>([]);
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [challengeSelectedOption, setChallengeSelectedOption] = useState<string | null>(null);
  const [challengeAnswered, setChallengeAnswered] = useState(false);
  const [challengeCorrect, setChallengeCorrect] = useState(false);
  const [challengeCorrectCount, setChallengeCorrectCount] = useState(0);

  // Load words & setup games
  useEffect(() => {
    // Shuffle words for games
    setElLaWords([...SPANISH_WORDS].sort(() => Math.random() - 0.5));
    setSortList([...SPANISH_WORDS].sort(() => Math.random() - 0.5));
    setChallengeQuestions(generateQuizQuestions());
  }, []);

  // Sync sequencer matrix with AudioEngine loopChannels
  useEffect(() => {
    Object.keys(seqMatrix).forEach((channel) => {
      // If any step in a track is true, let sequencer play that track on their active steps
      const isChannelActive = seqMatrix[channel].some(step => step);
      djsynth.setLoopChannel(channel, isChannelActive);
    });
  }, [seqMatrix]);

  // Audio Sequencer Step Trigger Update
  useEffect(() => {
    if (sequencerActive) {
      djsynth.startSequencer((step) => {
        setSequencerStep(step);
      });
    } else {
      djsynth.stopSequencer();
    }
    return () => {
      djsynth.stopSequencer();
    };
  }, [sequencerActive]);

  const handleMuteToggle = () => {
    const muteState = djsynth.toggleMute();
    setIsMuted(muteState);
  };

  // Helper to trigger feedback from DJ character
  const triggerPraise = () => {
    const praise = DJ_PRAISES[Math.floor(Math.random() * DJ_PRAISES.length)];
    setDjEmotion('celebrating');
    if (lang === 'hy') {
      setDjSpeech(`${praise.es} ${praise.hy} 🌟`);
    } else {
      setDjSpeech(`${praise.es} ${praise.ru} 🌟`);
    }
  };

  const triggerSad = (msg: string) => {
    setDjEmotion('sad');
    setDjSpeech(msg);
  };

  // Sound play wrappers
  const playWordSound = (wordObj: SpanishWord) => {
    djsynth.playScratch();
    // Play different synthesized tones based on whether it is masculine or feminine
    if (wordObj.article === 'el') {
      djsynth.playSynth(329.63, 0.35, 'sawtooth'); // E4 Cool
    } else {
      djsynth.playSynth(440.0, 0.35, 'triangle'); // A4 Sweet
    }
  };

  // Navigation handlers
  const goToScreen = (newScreen: AppScreen) => {
    setScreen(newScreen);
    setCardFlipped(false);
    setElLaSelected(null);
    setElLaAnswered(false);
    setSortFeedback({ isCorrect: false, show: false, msg: null });
    setChallengeSelectedOption(null);
    setChallengeAnswered(false);

    // Context speech bubble updates
    if (newScreen === 'rules') {
      setDjEmotion('thinking');
      setDjSpeech(lang === 'hy' ? 'Կանոնը շատ պարզ է՝ EL = արական, LA = իգական: 🎚️' : 'Правило очень простое: EL = мужской род, LA = женский род! 🎚️');
    } else if (newScreen === 'cards') {
      setDjEmotion('cool');
      setDjSpeech(lang === 'hy' ? 'Լսիր վինիլային բառաքարտերը: 🎵' : 'Прослушай виниловые карточки слов! 🎵');
    } else if (newScreen === 'game-el-la') {
      setDjEmotion('happy');
      setDjSpeech(lang === 'hy' ? 'Ժամանակն է ստուգելու քո լսողությունը: Ընտրի՛ր EL թե LA:' : 'Время проверить твой слух! Выбирай EL или LA!');
    } else if (newScreen === 'game-dj-sort') {
      setDjEmotion('cool');
      setDjSpeech(lang === 'hy' ? 'Տեղափոխիր սկավառակները ճիշտ բարձրախոսների մեջ:' : 'Сортируй пластинки по колонкам EL и LA!');
    } else if (newScreen === 'game-instrument-beat') {
      setDjEmotion('celebrating');
      setDjSpeech(lang === 'hy' ? 'Դու հրաշալի ես: Ստեղծիր քո սեփական DJ ռիթմը այստեղ!' : 'Отличная работа! Создай свой фирменный бит на этом пульте!');
      setSequencerActive(true);
    } else if (newScreen === 'game-mix-challenge') {
      setDjEmotion('cool');
      setDjSpeech(lang === 'hy' ? 'DJ MIX CHALLENGE! 10 հարց՝ լիարժեք թրեք հավաքելու համար:' : 'DJ MIX CHALLENGE! 10 вопросов, чтобы собрать полный трек!');
    }
  };

  // Screen 1: Choose Language
  const selectLanguage = (selected: AppLanguage) => {
    setLang(selected);
    djsynth.playSuccess();
    if (selected === 'hy') {
      setDjSpeech('Ողջո՜ւյն, սիրելի՛ DJ: Պատրա՞ստ ես սովորել իսպաներենի սեռերը: 🎧');
    } else {
      setDjSpeech('Привет, будущий DJ! Готов освоить испанский род существительных? 🎧');
    }
    setScreen('rules');
  };

  // Screen 4: "El o La?" multiple choice logic
  const handleElLaSelect = (choice: 'el' | 'la') => {
    if (elLaAnswered) return;
    setElLaSelected(choice);
    const activeWord = elLaWords[elLaIndex];
    const correct = activeWord.article === choice;
    setElLaAnswered(true);
    setElLaIsCorrect(correct);

    if (correct) {
      djsynth.playSuccess();
      setScore(s => s + 15);
      setStreak(st => st + 1);
      triggerPraise();
    } else {
      djsynth.playFail();
      setStreak(0);
      const suffixExplanation = activeWord.isException
        ? (lang === 'hy' ? UI_TEXTS.hy.explanationExc : UI_TEXTS.ru.explanationExc)
        : (activeWord.word.endsWith('o')
          ? (lang === 'hy' ? `«-o»-ով ${UI_TEXTS.hy.explanationO}` : `на -o, поэтому ${UI_TEXTS.ru.explanationO}`)
          : (lang === 'hy' ? `«-a»-ով ${UI_TEXTS.hy.explanationA}` : `на -a, поэтому ${UI_TEXTS.ru.explanationA}`));
      
      triggerSad(lang === 'hy' 
        ? `Գրեթե ճիշտ է: ${activeWord.article} ${activeWord.word} - սա ${suffixExplanation}`
        : `Почти верно! ${activeWord.article} ${activeWord.word} - ${suffixExplanation}`
      );
    }
  };

  const nextElLaWord = () => {
    setElLaSelected(null);
    setElLaAnswered(false);
    if (elLaIndex < elLaWords.length - 1) {
      setElLaIndex(elLaIndex + 1);
      setDjEmotion('thinking');
    } else {
      // Go to DJ Sort next
      goToScreen('game-dj-sort');
    }
  };

  // Screen 5: DJ Sort logic
  const handleSortChoice = (choice: 'el' | 'la') => {
    const activeWord = sortList[sortIndex];
    if (!activeWord) return;

    const correct = activeWord.article === choice;
    if (correct) {
      djsynth.playSuccess();
      setScore(s => s + 20);
      setStreak(st => st + 1);
      setSortedCount(c => c + 1);
      
      // Flash glowing wave on correct column
      if (choice === 'el') {
        djsynth.playKick();
      } else {
        djsynth.playHihat();
      }

      setSortFeedback({
        isCorrect: true,
        show: true,
        msg: lang === 'hy' ? `Շատ լավ է։ ${activeWord.article} ${activeWord.word}!` : `Супер! ${activeWord.article} ${activeWord.word}!`,
      });
      triggerPraise();

      setTimeout(() => {
        setSortFeedback(f => ({ ...f, show: false }));
        if (sortIndex < sortList.length - 1) {
          setSortIndex(sortIndex + 1);
        } else {
          goToScreen('game-instrument-beat');
        }
      }, 1500);
    } else {
      djsynth.playFail();
      setStreak(0);
      const expl = activeWord.isException
        ? (lang === 'hy' ? UI_TEXTS.hy.explanationExc : UI_TEXTS.ru.explanationExc)
        : (activeWord.word.endsWith('o') ? (lang === 'hy' ? UI_TEXTS.hy.explanationO : UI_TEXTS.ru.explanationO) : (lang === 'hy' ? UI_TEXTS.hy.explanationA : UI_TEXTS.ru.explanationA));
      
      setSortFeedback({
        isCorrect: false,
        show: true,
        msg: lang === 'hy' 
          ? `Ո՛չ, ${activeWord.word}-ը ${expl}`
          : `Ой! Слово ${activeWord.word} ${expl}`,
      });
      triggerSad(lang === 'hy' ? `Փորձիր նորից 🎧` : `Попробуй ещё раз! 🎧`);

      setTimeout(() => {
        setSortFeedback(f => ({ ...f, show: false }));
      }, 2500);
    }
  };

  // Screen 6: Interactive Step Sequencer toggler
  const toggleSeqStep = (instrument: string, stepIdx: number) => {
    djsynth.playScratch();
    const updated = { ...seqMatrix };
    updated[instrument][stepIdx] = !updated[instrument][stepIdx];
    setSeqMatrix(updated);
    
    // Play a preview of the instrument
    if (updated[instrument][stepIdx]) {
      if (instrument === 'kick') djsynth.playKick();
      if (instrument === 'snare') djsynth.playSnare();
      if (instrument === 'hihat') djsynth.playHihat();
      if (instrument === 'bass') djsynth.playBass();
      if (instrument === 'synth') djsynth.playSynth(440, 0.2, 'sawtooth');
      if (instrument === 'guitar') djsynth.playGuitar();
      if (instrument === 'scratch') djsynth.playScratch();
    }
  };

  // Screen 7: DJ Mix Challenge logic
  const handleChallengeAnswer = (option: string) => {
    if (challengeAnswered) return;
    setChallengeSelectedOption(option);
    setChallengeAnswered(true);

    const q = challengeQuestions[challengeIdx];
    const correct = q.correctAnswer === option;
    setChallengeCorrect(correct);

    if (correct) {
      djsynth.playSuccess();
      setChallengeCorrectCount(c => c + 1);
      setScore(s => s + 30);
      setStreak(st => st + 1);
      triggerPraise();

      // Dynamically activate a sound channel in the mix sequencer based on progress!
      const channels = ['kick', 'snare', 'hihat', 'bass', 'synth', 'guitar', 'scratch'];
      const channelToUnlock = channels[challengeCorrectCount % channels.length];
      djsynth.setLoopChannel(channelToUnlock, true);
    } else {
      djsynth.playFail();
      setStreak(0);
      triggerSad(lang === 'hy'
        ? `Սխալ է: Ճիշտ տարբերակն է՝ ${q.correctAnswer}`
        : `Увы! Правильный ответ: ${q.correctAnswer}`
      );
    }
  };

  const nextChallengeQuestion = () => {
    setChallengeSelectedOption(null);
    setChallengeAnswered(false);
    if (challengeIdx < 9) {
      setChallengeIdx(challengeIdx + 1);
    } else {
      // Go to final results
      goToScreen('results');
    }
  };

  const resetAllGames = () => {
    setScore(0);
    setStreak(0);
    setElLaIndex(0);
    setSortIndex(0);
    setSortedCount(0);
    setChallengeIdx(0);
    setChallengeCorrectCount(0);
    setElLaWords([...SPANISH_WORDS].sort(() => Math.random() - 0.5));
    setSortList([...SPANISH_WORDS].sort(() => Math.random() - 0.5));
    setChallengeQuestions(generateQuizQuestions());
    setSeqMatrix({
      kick: [true, false, false, false, true, false, false, false],
      snare: [false, false, true, false, false, false, true, false],
      hihat: [false, true, false, true, false, true, false, true],
      bass: [true, false, false, true, false, true, false, false],
      synth: [false, true, false, false, true, false, false, true],
      guitar: [false, false, false, false, false, false, false, false],
      scratch: [false, false, false, false, false, false, false, false],
    });
    setSequencerActive(false);
    goToScreen('language');
  };

  // Compute final ranks and stars
  const getDJRank = () => {
    const finalScore = challengeCorrectCount;
    if (finalScore <= 3) return { rank: UI_TEXTS[lang].rankBeginner, stars: 1, color: 'text-amber-500' };
    if (finalScore <= 7) return { rank: UI_TEXTS[lang].rankAmateur, stars: 3, color: 'text-cyan-400' };
    return { rank: UI_TEXTS[lang].rankSuper, stars: 5, color: 'text-pink-500' };
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none" id="app-root-container">
      {/* Top DJ Header with neon lighting controls */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur px-6 py-4 flex items-center justify-between relative z-20" id="top-bar-header">
        <div className="flex items-center gap-3" id="branding-group">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-pink-500 to-cyan-400 text-slate-950 animate-pulse-slow shadow-lg shadow-cyan-500/20" id="header-logo-icon">
            <Headphones className="w-6 h-6" id="icon-top-headphones" />
          </div>
          <div>
            <h1 className="font-sans font-black tracking-wider text-xl bg-gradient-to-r from-pink-500 via-purple-400 to-cyan-400 bg-clip-text text-transparent" id="header-main-title">
              {UI_TEXTS[lang].appTitle}
            </h1>
            <p className="text-[10px] uppercase font-mono tracking-widest text-slate-400" id="header-subtitle">
              {UI_TEXTS[lang].appSub}
            </p>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-4" id="header-controls">
          {/* Audio Visualizer Waves */}
          <div className="hidden sm:flex items-center gap-0.5 h-6 w-16" id="wave-visualizer">
            <span className={`w-1 bg-pink-500 rounded-full h-2 ${sequencerActive ? 'animate-bounce' : ''}`} style={{ animationDelay: '0.1s' }} />
            <span className={`w-1 bg-purple-500 rounded-full h-5 ${sequencerActive ? 'animate-bounce' : ''}`} style={{ animationDelay: '0.3s' }} />
            <span className={`w-1 bg-cyan-400 rounded-full h-3 ${sequencerActive ? 'animate-bounce' : ''}`} style={{ animationDelay: '0.5s' }} />
            <span className={`w-1 bg-pink-400 rounded-full h-4 ${sequencerActive ? 'animate-bounce' : ''}`} style={{ animationDelay: '0.2s' }} />
            <span className={`w-1 bg-cyan-500 rounded-full h-1 ${sequencerActive ? 'animate-bounce' : ''}`} style={{ animationDelay: '0.4s' }} />
          </div>

          {/* Points / Combo badges */}
          {screen !== 'language' && (
            <div className="flex items-center gap-3 font-mono" id="score-badges-group">
              <div className="bg-slate-800 border border-slate-700 px-3 py-1 rounded-full text-xs flex items-center gap-1.5" id="badge-score">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-spin" id="icon-sparkle" />
                <span className="text-slate-400">{UI_TEXTS[lang].score}:</span>
                <span className="font-bold text-yellow-400 text-sm">{score}</span>
              </div>
              {streak > 1 && (
                <div className="bg-pink-950/40 border border-pink-800/60 px-2.5 py-1 rounded-full text-[10px] font-bold text-pink-400 flex items-center gap-1 animate-pulse" id="badge-streak">
                  🔥 {streak} {UI_TEXTS[lang].streak}!
                </div>
              )}
            </div>
          )}

          {/* Sound Toggle */}
          <button
            onClick={handleMuteToggle}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-all shadow-md active:scale-95"
            title="Toggle Sound Effects"
            id="btn-mute"
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-rose-500" id="icon-mute" /> : <Volume2 className="w-5 h-5 text-emerald-400" id="icon-unmute" />}
          </button>
        </div>
      </header>

      {/* Main content grid (featuring DJ avatar in the side panel or centered based on layout) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 md:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10" id="main-content-layout">
        
        {/* DJ Character Assistant Panel (Cols 3 on desktop, full-width on mobile) */}
        {screen !== 'language' && (
          <div className="lg:col-span-3 flex flex-col items-center justify-start bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 shadow-2xl relative overflow-hidden" id="dj-assistant-panel">
            {/* Ambient Background Lights */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500" />
            <div className="absolute -top-12 -left-12 w-32 h-32 rounded-full bg-pink-500/10 blur-2xl" />
            <div className="absolute -bottom-12 -right-12 w-32 h-32 rounded-full bg-cyan-500/10 blur-2xl" />

            {/* Mascot Visualizer */}
            <div className="mb-4 mt-2" id="dj-mascot-wrapper">
              <DJVinyl emotion={djEmotion} dancing={sequencerActive} />
            </div>

            {/* DJ Name Label */}
            <div className="bg-slate-800/80 border border-slate-700 px-3 py-1 rounded-full font-mono text-[10px] font-black tracking-widest text-cyan-400 uppercase mb-4 shadow" id="label-dj-name">
              ⚡ DJ ElLa 🎛️
            </div>

            {/* Speach bubble */}
            <div className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 relative shadow-inner text-slate-300 text-sm leading-relaxed" id="dj-speech-bubble">
              {/* Pointer */}
              <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-4 h-4 bg-slate-950 border-l border-b border-slate-800 rotate-45 hidden lg:block" />
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-950 border-t border-l border-slate-800 rotate-45 lg:hidden" />
              
              <div className="flex gap-2" id="speech-bubble-body">
                <span className="text-lg">📢</span>
                <p className="font-medium text-slate-200" id="text-speech-bubble">
                  {djSpeech}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Primary Interactive Module Stage (Cols 9 on desktop, full-width on mobile) */}
        <section className={`${screen === 'language' ? 'lg:col-span-12' : 'lg:col-span-9'} bg-slate-900/60 border border-slate-800/80 rounded-3xl shadow-2xl overflow-hidden relative flex flex-col min-h-[500px]`} id="primary-stage-section">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500" />

          {/* SCREEN 1: Language selection */}
          {screen === 'language' && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-16 text-center" id="screen-language-select">
              {/* Spinning Logo Disc */}
              <div className="mb-8 relative" id="spinning-logo-wrapper">
                <div className="absolute inset-0 bg-gradient-to-tr from-pink-500 to-cyan-400 rounded-full opacity-30 blur-2xl animate-pulse" />
                <DJVinyl emotion="cool" dancing={true} />
              </div>

              <h2 className="font-sans font-black text-3xl md:text-5xl tracking-tight mb-2 text-white uppercase" id="welcome-title">
                {UI_TEXTS.ru.appTitle}
              </h2>
              <p className="text-slate-400 text-base md:text-lg max-w-lg mb-10 leading-relaxed font-sans" id="welcome-sub">
                {UI_TEXTS.ru.appSub}
              </p>

              <div className="bg-slate-950/80 border border-slate-850 p-6 md:p-8 rounded-2xl max-w-md w-full shadow-inner" id="lang-select-box">
                <p className="text-sm font-mono tracking-widest text-pink-400 uppercase mb-6" id="label-choose-lang">
                  {UI_TEXTS.ru.chooseLang}
                </p>

                <div className="flex flex-col gap-4" id="btn-language-options">
                  <button
                    onClick={() => selectLanguage('hy')}
                    className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-lg tracking-wide shadow-md hover:shadow-pink-500/20 active:scale-[0.98] transition-all flex items-center justify-between"
                    id="btn-lang-hy"
                  >
                    <span>Հայերեն → Español</span>
                    <Globe className="w-5 h-5 text-pink-200" id="icon-lang-hy" />
                  </button>

                  <button
                    onClick={() => selectLanguage('ru')}
                    className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold text-lg tracking-wide shadow-md hover:shadow-cyan-500/20 active:scale-[0.98] transition-all flex items-center justify-between"
                    id="btn-lang-ru"
                  >
                    <span>Русский → Español</span>
                    <Globe className="w-5 h-5 text-cyan-200" id="icon-lang-ru" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 2: Rules Explanation */}
          {screen === 'rules' && (
            <div className="flex-1 flex flex-col justify-between p-6 md:p-10" id="screen-rules-explanation">
              <div id="rules-header">
                <div className="flex items-center gap-3 mb-4" id="rules-title-group">
                  <span className="text-3xl">🎚️</span>
                  <h2 className="text-2xl md:text-3xl font-black text-white" id="rules-title">
                    {UI_TEXTS[lang].ruleTitle}
                  </h2>
                </div>
                <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6" id="rules-intro">
                  {UI_TEXTS[lang].ruleIntro}
                </p>

                {/* Main Grammar Pillars Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6" id="rules-pillars-grid">
                  {/* Masculino Card */}
                  <div className="bg-slate-950/60 border border-slate-800 hover:border-cyan-500/40 p-5 rounded-2xl transition-all" id="rule-card-masculino">
                    <div className="flex items-center gap-2 text-cyan-400 font-bold text-lg mb-3" id="rule-m-head">
                      <span className="px-2 py-0.5 rounded bg-cyan-950 text-xs border border-cyan-800">EL</span>
                      <span>{UI_TEXTS[lang].ruleMasculino}</span>
                    </div>
                    <p className="text-slate-300 text-sm mb-4 font-medium" id="rule-m-desc">
                      {UI_TEXTS[lang].ruleEndingO}
                    </p>
                    <div className="space-y-2" id="rule-m-examples">
                      <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg text-xs" id="ex-m1">
                        <strong className="text-cyan-400 font-bold">el libro</strong>
                        <span className="text-slate-500">—</span>
                        <span className="text-slate-400">{lang === 'hy' ? 'գիրք' : 'книга'}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg text-xs" id="ex-m2">
                        <strong className="text-cyan-400 font-bold">el gato</strong>
                        <span className="text-slate-500">—</span>
                        <span className="text-slate-400">{lang === 'hy' ? 'կատու' : 'кот'}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg text-xs" id="ex-m3">
                        <strong className="text-cyan-400 font-bold">el piano</strong>
                        <span className="text-slate-500">—</span>
                        <span className="text-slate-400">{lang === 'hy' ? 'դաշնամուր' : 'пианино'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Femenino Card */}
                  <div className="bg-slate-950/60 border border-slate-800 hover:border-pink-500/40 p-5 rounded-2xl transition-all" id="rule-card-femenino">
                    <div className="flex items-center gap-2 text-pink-400 font-bold text-lg mb-3" id="rule-f-head">
                      <span className="px-2 py-0.5 rounded bg-pink-950 text-xs border border-pink-800">LA</span>
                      <span>{UI_TEXTS[lang].ruleFemenino}</span>
                    </div>
                    <p className="text-slate-300 text-sm mb-4 font-medium" id="rule-f-desc">
                      {UI_TEXTS[lang].ruleEndingA}
                    </p>
                    <div className="space-y-2" id="rule-f-examples">
                      <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg text-xs" id="ex-f1">
                        <strong className="text-pink-400 font-bold">la casa</strong>
                        <span className="text-slate-500">—</span>
                        <span className="text-slate-400">{lang === 'hy' ? 'տուն' : 'дом'}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg text-xs" id="ex-f2">
                        <strong className="text-pink-400 font-bold">la mesa</strong>
                        <span className="text-slate-500">—</span>
                        <span className="text-slate-400">{lang === 'hy' ? 'սեղան' : 'стол'}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg text-xs" id="ex-f3">
                        <strong className="text-pink-400 font-bold">la guitarra</strong>
                        <span className="text-slate-500">—</span>
                        <span className="text-slate-400">{lang === 'hy' ? 'կիթառ' : 'гитара'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Exceptions Area */}
                <div className="bg-slate-950/80 border border-amber-500/20 rounded-2xl p-4 shadow-inner" id="exceptions-area">
                  <h4 className="text-amber-400 font-bold text-sm mb-3 flex items-center gap-1.5" id="exceptions-title">
                    <span>⚠️</span>
                    <span>{UI_TEXTS[lang].ruleExceptions}</span>
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs" id="exceptions-grid">
                    <div className="bg-slate-900/80 border border-slate-800 p-2 rounded-lg flex flex-col" id="exc1">
                      <span className="font-bold text-cyan-400">el problema</span>
                      <span className="text-[10px] text-slate-500">{lang === 'hy' ? 'խնդիր' : 'проблема'}</span>
                    </div>
                    <div className="bg-slate-900/80 border border-slate-800 p-2 rounded-lg flex flex-col" id="exc2">
                      <span className="font-bold text-cyan-400">el mapa</span>
                      <span className="text-[10px] text-slate-500">{lang === 'hy' ? 'քարտեզ' : 'карта'}</span>
                    </div>
                    <div className="bg-slate-900/80 border border-slate-800 p-2 rounded-lg flex flex-col" id="exc3">
                      <span className="font-bold text-cyan-400">el día</span>
                      <span className="text-[10px] text-slate-500">{lang === 'hy' ? 'օր' : 'день'}</span>
                    </div>
                    <div className="bg-slate-900/80 border border-slate-800 p-2 rounded-lg flex flex-col" id="exc4">
                      <span className="font-bold text-pink-400">la mano</span>
                      <span className="text-[10px] text-slate-500">{lang === 'hy' ? 'ձեռք' : 'рука'}</span>
                    </div>
                    <div className="bg-slate-900/80 border border-slate-800 p-2 rounded-lg flex flex-col" id="exc5">
                      <span className="font-bold text-pink-400">la foto</span>
                      <span className="text-[10px] text-slate-500">{lang === 'hy' ? 'լուսանկար' : 'фото'}</span>
                    </div>
                    <div className="bg-slate-900/80 border border-slate-800 p-2 rounded-lg flex flex-col" id="exc6">
                      <span className="font-bold text-pink-400">la moto</span>
                      <span className="text-[10px] text-slate-500">{lang === 'hy' ? 'մոտոցիկլ' : 'мотоцикл'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Footer */}
              <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between" id="rules-nav-footer">
                <button
                  onClick={() => goToScreen('language')}
                  className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition flex items-center gap-2 text-sm"
                  id="btn-rules-back"
                >
                  <ArrowLeft className="w-4 h-4" id="icon-rules-back" />
                  <span>{UI_TEXTS[lang].back}</span>
                </button>

                <button
                  onClick={() => goToScreen('cards')}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-cyan-500 text-slate-950 font-bold hover:brightness-110 active:scale-[0.98] transition shadow-lg shadow-cyan-500/20 flex items-center gap-2 text-sm"
                  id="btn-rules-next"
                >
                  <span>{UI_TEXTS[lang].next}</span>
                  <ArrowRight className="w-4 h-4" id="icon-rules-next" />
                </button>
              </div>
            </div>
          )}

          {/* SCREEN 3: Vinyl Word Cards */}
          {screen === 'cards' && (
            <div className="flex-1 flex flex-col justify-between p-6 md:p-10" id="screen-word-cards">
              <div id="cards-header-block">
                <h2 className="text-2xl font-black text-white flex items-center gap-2 mb-2" id="cards-title">
                  <span>🎵</span> {UI_TEXTS[lang].cardsTitle}
                </h2>
                <p className="text-slate-400 text-xs md:text-sm mb-6" id="cards-subtitle">
                  {UI_TEXTS[lang].cardsSubtitle}
                </p>

                {/* Central Card Display */}
                <div className="flex flex-col items-center justify-center py-6" id="card-display-view">
                  <div
                    onClick={() => {
                      setCardFlipped(!cardFlipped);
                      playWordSound(SPANISH_WORDS[activeCardIdx]);
                    }}
                    className={`relative w-64 h-64 cursor-pointer transition-all duration-500 [transform-style:preserve-3d] ${cardFlipped ? '[transform:rotateY(180deg)]' : ''}`}
                    id="flip-card-body"
                  >
                    {/* Front Face of Vinyl Cover */}
                    <div className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-slate-700 flex flex-col items-center justify-between p-6 [backface-visibility:hidden] shadow-2xl shadow-cyan-500/10" id="card-front-face">
                      {/* Gender Badge */}
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest font-mono ${SPANISH_WORDS[activeCardIdx].article === 'el' ? 'bg-cyan-950 text-cyan-400 border border-cyan-800' : 'bg-pink-950 text-pink-400 border border-pink-800'}`} id="card-gender-badge">
                        {SPANISH_WORDS[activeCardIdx].gender.toUpperCase()}
                      </span>

                      {/* Giant Central Graphic Icon */}
                      <div className={`p-5 rounded-full ${SPANISH_WORDS[activeCardIdx].article === 'el' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-pink-500/10 text-pink-400'}`} id="card-icon-container">
                        <IconRenderer name={SPANISH_WORDS[activeCardIdx].icon} className="w-16 h-16" />
                      </div>

                      {/* Spanish Word */}
                      <div className="text-center" id="card-text-container">
                        <p className={`text-4xl font-black ${SPANISH_WORDS[activeCardIdx].article === 'el' ? 'text-cyan-400' : 'text-pink-400'}`} id="card-spanish-word">
                          <span className="text-2xl font-normal text-slate-400 italic mr-1">{SPANISH_WORDS[activeCardIdx].article}</span>
                          {SPANISH_WORDS[activeCardIdx].word}
                        </p>
                        {SPANISH_WORDS[activeCardIdx].isException && (
                          <span className="text-[10px] font-mono font-bold uppercase text-amber-500 px-2 py-0.5 rounded bg-amber-950/40 border border-amber-800" id="card-exception-tag">
                            Exception ⚡
                          </span>
                        )}
                      </div>

                      {/* Flip Prompt */}
                      <span className="text-[9px] font-mono uppercase text-slate-500 tracking-wider" id="card-flip-prompt">
                        {lang === 'hy' ? 'Սեղմիր՝ թարգմանությունը տեսնելու համար 🔄' : 'Нажми, чтобы перевернуть 🔄'}
                      </span>
                    </div>

                    {/* Back Face of Vinyl Cover (Translation & Grammar) */}
                    <div className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border-2 border-purple-500/40 flex flex-col items-center justify-between p-6 [transform:rotateY(180deg)] [backface-visibility:hidden] shadow-2xl" id="card-back-face">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-widest font-mono bg-purple-950 text-purple-300 border border-purple-800" id="back-badge">
                        {lang === 'hy' ? 'ԹԱՐԳՄԱՆՈՒԹՅՈՒՆ' : 'ПЕРЕВОД'}
                      </span>

                      {/* Meanings */}
                      <div className="text-center" id="back-word-meanings">
                        <p className="text-slate-400 text-xs font-mono uppercase tracking-widest mb-1" id="back-original-word">
                          {SPANISH_WORDS[activeCardIdx].article} {SPANISH_WORDS[activeCardIdx].word}
                        </p>
                        <p className="text-4xl font-extrabold text-white" id="back-translation-word">
                          {lang === 'hy' ? SPANISH_WORDS[activeCardIdx].translationHy : SPANISH_WORDS[activeCardIdx].translationRu}
                        </p>
                      </div>

                      {/* Grammar Tip */}
                      <div className="w-full bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 text-center leading-relaxed" id="back-grammar-tips">
                        <strong className="text-purple-300">Tip:</strong>{' '}
                        {SPANISH_WORDS[activeCardIdx].isException ? (
                          <span>{lang === 'hy' ? UI_TEXTS.hy.explanationExc : UI_TEXTS.ru.explanationExc}</span>
                        ) : SPANISH_WORDS[activeCardIdx].word.endsWith('o') ? (
                          <span>{lang === 'hy' ? `«-o» ${UI_TEXTS.hy.explanationO}` : `Заканчивается на -o, ${UI_TEXTS.ru.explanationO}`}</span>
                        ) : (
                          <span>{lang === 'hy' ? `«-a» ${UI_TEXTS.hy.explanationA}` : `Заканчивается на -a, ${UI_TEXTS.ru.explanationA}`}</span>
                        )}
                      </div>

                      {/* Flip Prompt Back */}
                      <span className="text-[9px] font-mono uppercase text-slate-500 tracking-wider" id="back-flip-prompt">
                        {lang === 'hy' ? 'Սեղմիր նորից 🔄' : 'Нажми снова 🔄'}
                      </span>
                    </div>
                  </div>

                  {/* Dot step index indicators */}
                  <div className="flex gap-1.5 mt-6 max-w-full overflow-x-auto px-4 py-1.5 scrollbar-none" id="cards-pager-dots">
                    {SPANISH_WORDS.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          djsynth.playScratch();
                          setActiveCardIdx(i);
                          setCardFlipped(false);
                        }}
                        className={`w-2.5 h-2.5 rounded-full transition-all flex-shrink-0 ${i === activeCardIdx ? 'bg-cyan-400 scale-125' : 'bg-slate-700 hover:bg-slate-600'}`}
                        id={`pager-dot-${i}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Navigation Footer */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between" id="cards-nav-footer">
                <button
                  onClick={() => goToScreen('rules')}
                  className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition flex items-center gap-2 text-sm"
                  id="btn-cards-back"
                >
                  <ArrowLeft className="w-4 h-4" id="icon-cards-back" />
                  <span>{UI_TEXTS[lang].back}</span>
                </button>

                {/* Next button */}
                <div className="flex items-center gap-3" id="cards-nav-action-group">
                  <span className="text-xs text-slate-500 font-mono" id="cards-count-indicator">
                    {activeCardIdx + 1} / {SPANISH_WORDS.length}
                  </span>
                  
                  {activeCardIdx < SPANISH_WORDS.length - 1 ? (
                    <button
                      onClick={() => {
                        djsynth.playScratch();
                        setActiveCardIdx(activeCardIdx + 1);
                        setCardFlipped(false);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition flex items-center gap-1.5 text-sm"
                      id="btn-cards-inner-next"
                    >
                      <span>{UI_TEXTS[lang].next}</span>
                      <ArrowRight className="w-4 h-4" id="icon-cards-inner-next" />
                    </button>
                  ) : (
                    <button
                      onClick={() => goToScreen('game-el-la')}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-cyan-500 text-slate-950 font-black hover:brightness-110 active:scale-[0.98] transition shadow-lg shadow-cyan-500/20 flex items-center gap-2 text-sm"
                      id="btn-cards-finish-step"
                    >
                      <span>{lang === 'hy' ? 'Սկսել Խաղը 🎮' : 'Начать игру 🎮'}</span>
                      <ArrowRight className="w-4 h-4" id="icon-cards-finish" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 4: Game "El o La?" */}
          {screen === 'game-el-la' && (
            <div className="flex-1 flex flex-col justify-between p-6 md:p-10" id="screen-game-el-la">
              <div id="game1-content">
                <div className="flex justify-between items-center mb-4" id="game1-header">
                  <div>
                    <h2 className="text-2xl font-black text-white flex items-center gap-2" id="game1-title">
                      <span>🎧</span> {UI_TEXTS[lang].game1Title}
                    </h2>
                    <p className="text-slate-400 text-xs md:text-sm" id="game1-subtitle">
                      {UI_TEXTS[lang].game1Subtitle}
                    </p>
                  </div>
                  <span className="font-mono text-xs bg-slate-800 px-3 py-1 rounded-full text-slate-400" id="game1-progress-label">
                    {elLaIndex + 1} / {elLaWords.length}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden mb-8" id="game1-progress-bar">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-pink-500 transition-all duration-300"
                    style={{ width: `${((elLaIndex + 1) / elLaWords.length) * 100}%` }}
                    id="game1-progress-inner"
                  />
                </div>

                {/* Active Question Box */}
                {elLaWords.length > 0 && (
                  <div className="flex flex-col items-center justify-center bg-slate-950/60 border border-slate-850 p-8 rounded-2xl shadow-inner text-center" id="game1-question-card">
                    {/* Floating Word Card */}
                    <div className="mb-6" id="game1-graphic-disc">
                      <div className="w-20 h-20 rounded-full bg-slate-900 border-4 border-dashed border-slate-700 flex items-center justify-center animate-spin" style={{ animationDuration: '8s' }} id="spinning-word-disc">
                        <IconRenderer name={elLaWords[elLaIndex].icon} className="w-10 h-10 text-pink-400" />
                      </div>
                    </div>

                    <p className="text-slate-400 text-sm font-mono uppercase tracking-widest mb-1" id="game1-translation-prompt">
                      {lang === 'hy' ? 'Ի՞նչ հոդ է պահանջվում սրանից առաջ՝' : 'Какой артикль перед словом:'}
                    </p>
                    
                    {/* Big Word Display with Blanks */}
                    <p className="text-4xl md:text-5xl font-black mb-2 text-white" id="game1-main-prompt-word">
                      <span className="text-cyan-400 underline decoration-cyan-400/50 mr-3">___</span>
                      {elLaWords[elLaIndex].word}
                    </p>

                    <p className="text-slate-500 text-sm italic mb-8" id="game1-word-meaning">
                      ({lang === 'hy' ? elLaWords[elLaIndex].translationHy : elLaWords[elLaIndex].translationRu})
                    </p>

                    {/* Choice Pads (Styled like DJ Mixer Button Pads) */}
                    <div className="grid grid-cols-2 gap-6 w-full max-w-md" id="game1-choice-buttons">
                      {/* Option EL */}
                      <button
                        onClick={() => handleElLaSelect('el')}
                        disabled={elLaAnswered}
                        className={`py-5 px-6 rounded-2xl font-black text-2xl border-2 transition-all duration-200 active:scale-95 shadow-lg flex flex-col items-center justify-center gap-1 ${
                          elLaSelected === 'el'
                            ? (elLaIsCorrect ? 'bg-cyan-500 border-white text-slate-950 shadow-cyan-500/30' : 'bg-rose-600 border-slate-300 text-white')
                            : (elLaAnswered && elLaWords[elLaIndex].article === 'el'
                              ? 'bg-cyan-950 border-cyan-400 text-cyan-400 animate-pulse'
                              : 'bg-slate-900 border-slate-800 hover:border-cyan-500/50 text-cyan-400 hover:bg-slate-850')
                        }`}
                        id="btn-choice-el"
                      >
                        <span className="text-3xl" id="pad-label-el">el</span>
                        <span className="text-[10px] font-mono tracking-widest uppercase opacity-70" id="pad-sub-el">MASCULINO</span>
                      </button>

                      {/* Option LA */}
                      <button
                        onClick={() => handleElLaSelect('la')}
                        disabled={elLaAnswered}
                        className={`py-5 px-6 rounded-2xl font-black text-2xl border-2 transition-all duration-200 active:scale-95 shadow-lg flex flex-col items-center justify-center gap-1 ${
                          elLaSelected === 'la'
                            ? (elLaIsCorrect ? 'bg-pink-500 border-white text-slate-950 shadow-pink-500/30' : 'bg-rose-600 border-slate-300 text-white')
                            : (elLaAnswered && elLaWords[elLaIndex].article === 'la'
                              ? 'bg-pink-950 border-pink-400 text-pink-400 animate-pulse'
                              : 'bg-slate-900 border-slate-800 hover:border-pink-500/50 text-pink-400 hover:bg-slate-850')
                        }`}
                        id="btn-choice-la"
                      >
                        <span className="text-3xl" id="pad-label-la">la</span>
                        <span className="text-[10px] font-mono tracking-widest uppercase opacity-70" id="pad-sub-la">FEMENINO</span>
                      </button>
                    </div>

                    {/* Response explanation popup inside screen */}
                    {elLaAnswered && (
                      <div className={`mt-6 p-4 rounded-xl border w-full max-w-md text-xs md:text-sm text-left ${elLaIsCorrect ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-rose-950/40 border-rose-500/40 text-rose-300'}`} id="game1-feedback-popup">
                        <div className="flex items-center gap-2 mb-1.5" id="game1-feedback-status">
                          {elLaIsCorrect ? <CheckCircle className="w-5 h-5 text-emerald-400" id="icon-correct" /> : <XCircle className="w-5 h-5 text-rose-400" id="icon-incorrect" />}
                          <span className="font-bold">{elLaIsCorrect ? UI_TEXTS[lang].correct : UI_TEXTS[lang].incorrect}</span>
                        </div>
                        <p id="game1-feedback-msg">
                          <strong className="capitalize">{elLaWords[elLaIndex].article} {elLaWords[elLaIndex].word}</strong> —{' '}
                          {elLaWords[elLaIndex].isException ? (
                            <span>{lang === 'hy' ? UI_TEXTS.hy.explanationExc : UI_TEXTS.ru.explanationExc}</span>
                          ) : elLaWords[elLaIndex].word.endsWith('o') ? (
                            <span>{lang === 'hy' ? `«-o»-ով ${UI_TEXTS.hy.explanationO}` : `на -o, поэтому ${UI_TEXTS.ru.explanationO}`}</span>
                          ) : (
                            <span>{lang === 'hy' ? `«-a»-ով ${UI_TEXTS.hy.explanationA}` : `на -a, поэтому ${UI_TEXTS.ru.explanationA}`}</span>
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Navigation Footer */}
              <div className="pt-6 border-t border-slate-800 flex items-center justify-between" id="game1-nav-footer">
                <button
                  onClick={() => goToScreen('cards')}
                  className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition flex items-center gap-2 text-sm"
                  id="btn-game1-back"
                >
                  <ArrowLeft className="w-4 h-4" id="icon-game1-back" />
                  <span>{UI_TEXTS[lang].back}</span>
                </button>

                {elLaAnswered && (
                  <button
                    onClick={nextElLaWord}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-cyan-500 text-slate-950 font-bold hover:brightness-110 active:scale-[0.98] transition shadow-lg shadow-cyan-500/20 flex items-center gap-2 text-sm animate-pulse"
                    id="btn-game1-continue"
                  >
                    <span>{UI_TEXTS[lang].continue}</span>
                    <ArrowRight className="w-4 h-4" id="icon-game1-continue" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* SCREEN 5: Game "DJ Sort" */}
          {screen === 'game-dj-sort' && (
            <div className="flex-1 flex flex-col justify-between p-6 md:p-10" id="screen-game-dj-sort">
              <div id="game2-content">
                <div className="flex justify-between items-center mb-4" id="game2-header">
                  <div>
                    <h2 className="text-2xl font-black text-white flex items-center gap-2" id="game2-title">
                      <span>🎚️</span> {UI_TEXTS[lang].game2Title}
                    </h2>
                    <p className="text-slate-400 text-xs md:text-sm" id="game2-subtitle">
                      {UI_TEXTS[lang].game2Subtitle}
                    </p>
                  </div>
                  <span className="font-mono text-xs bg-slate-800 px-3 py-1 rounded-full text-slate-400" id="game2-progress-label">
                    {sortIndex + 1} / {sortList.length}
                  </span>
                </div>

                {/* Speaker columns sorting stage */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center py-6" id="game2-sorter-grid">
                  
                  {/* LEFT SPEAKER (EL) */}
                  <div
                    onClick={() => handleSortChoice('el')}
                    className="md:col-span-3 bg-gradient-to-b from-slate-950 to-slate-900 border-2 border-slate-800 hover:border-cyan-500/60 p-5 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all active:scale-98 shadow-xl shadow-cyan-500/5 group"
                    id="speaker-column-el"
                  >
                    {/* Glowing Woofer circles */}
                    <div className="w-24 h-24 rounded-full bg-slate-900 border-4 border-cyan-500/30 group-hover:border-cyan-400/80 flex items-center justify-center relative mb-4 shadow-inner" id="woofer-outer-el">
                      <div className="w-14 h-14 rounded-full bg-cyan-500/10 group-hover:bg-cyan-500/20 flex items-center justify-center animate-pulse" id="woofer-mid-el">
                        <div className="w-6 h-6 rounded-full bg-cyan-400 group-hover:scale-110 transition-transform" id="woofer-inner-el" />
                      </div>
                    </div>
                    <span className="text-2xl font-black text-cyan-400" id="speaker-lbl-el">EL</span>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500" id="speaker-sub-el">Masculino</span>
                  </div>

                  {/* CENTER WORD VINYL */}
                  <div className="md:col-span-6 flex flex-col items-center justify-center py-4 bg-slate-950/40 rounded-2xl p-6 border border-slate-850 relative" id="sorting-center-station">
                    {sortIndex < sortList.length && (
                      <div className="text-center w-full" id="sorting-interactive-zone">
                        {/* Interactive Vinyl Card */}
                        <div className="mb-6 relative flex justify-center" id="sorting-disc-shield">
                          <div className="w-36 h-36 rounded-full bg-slate-900 border-8 border-slate-800 flex items-center justify-center shadow-2xl relative" id="sorting-disc-body">
                            {/* Groove details */}
                            <circle cx="50" cy="50" r="20" fill="none" stroke="#2a2a2a" strokeWidth="1" className="absolute inset-0 m-auto" />
                            <IconRenderer name={sortList[sortIndex].icon} className="w-14 h-14 text-pink-400" />
                          </div>
                        </div>

                        {/* Word Details */}
                        <p className="text-3xl font-black text-white mb-1" id="sorting-target-word">
                          {sortList[sortIndex].word}
                        </p>
                        <p className="text-slate-500 text-xs font-mono uppercase tracking-widest mb-6" id="sorting-target-translation">
                          ({lang === 'hy' ? sortList[sortIndex].translationHy : sortList[sortIndex].translationRu})
                        </p>

                        {/* Fast Trigger Pad Clickers */}
                        <div className="flex justify-center gap-4 w-full" id="sorting-clicker-shortcuts">
                          <button
                            onClick={() => handleSortChoice('el')}
                            className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-800 text-cyan-400 text-sm font-bold flex items-center justify-center gap-1.5 transition active:scale-95 shadow"
                            id="btn-sort-el-trigger"
                          >
                            <span>← {UI_TEXTS[lang].colEl}</span>
                          </button>
                          <button
                            onClick={() => handleSortChoice('la')}
                            className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-pink-800 text-pink-400 text-sm font-bold flex items-center justify-center gap-1.5 transition active:scale-95 shadow"
                            id="btn-sort-la-trigger"
                          >
                            <span>{UI_TEXTS[lang].colLa} →</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Temporary feedback banner on this screen */}
                    {sortFeedback.show && (
                      <div className={`absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center p-6 text-center rounded-2xl z-20 border transition-all duration-300 ${sortFeedback.isCorrect ? 'border-emerald-500/50 text-emerald-300' : 'border-rose-500/50 text-rose-300'}`} id="sort-feedback-banner">
                        <span className="text-4xl mb-3">{sortFeedback.isCorrect ? '🎉' : '❌'}</span>
                        <p className="text-lg font-black mb-1">{sortFeedback.isCorrect ? UI_TEXTS[lang].correct : UI_TEXTS[lang].incorrect}</p>
                        <p className="text-sm max-w-xs">{sortFeedback.msg}</p>
                      </div>
                    )}
                  </div>

                  {/* RIGHT SPEAKER (LA) */}
                  <div
                    onClick={() => handleSortChoice('la')}
                    className="md:col-span-3 bg-gradient-to-b from-slate-950 to-slate-900 border-2 border-slate-800 hover:border-pink-500/60 p-5 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all active:scale-98 shadow-xl shadow-pink-500/5 group"
                    id="speaker-column-la"
                  >
                    {/* Glowing Woofer circles */}
                    <div className="w-24 h-24 rounded-full bg-slate-900 border-4 border-pink-500/30 group-hover:border-pink-400/80 flex items-center justify-center relative mb-4 shadow-inner" id="woofer-outer-la">
                      <div className="w-14 h-14 rounded-full bg-pink-500/10 group-hover:bg-pink-500/20 flex items-center justify-center animate-pulse" id="woofer-mid-la">
                        <div className="w-6 h-6 rounded-full bg-pink-400 group-hover:scale-110 transition-transform" id="woofer-inner-la" />
                      </div>
                    </div>
                    <span className="text-2xl font-black text-pink-400" id="speaker-lbl-la">LA</span>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500" id="speaker-sub-la">Femenino</span>
                  </div>

                </div>
              </div>

              {/* Navigation Footer */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between" id="game2-nav-footer">
                <button
                  onClick={() => goToScreen('game-el-la')}
                  className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition flex items-center gap-2 text-sm"
                  id="btn-game2-back"
                >
                  <ArrowLeft className="w-4 h-4" id="icon-game2-back" />
                  <span>{UI_TEXTS[lang].back}</span>
                </button>

                <div className="flex items-center gap-3" id="game2-right-footer-group">
                  <span className="text-xs text-slate-500 font-mono" id="game2-score-lbl">
                    {lang === 'hy' ? 'Դասավորված է՝' : 'Рассортировано:'} <strong className="text-white">{sortedCount}</strong>
                  </span>
                  <button
                    onClick={() => goToScreen('game-instrument-beat')}
                    className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition flex items-center gap-1.5 text-sm"
                    id="btn-game2-skip"
                  >
                    <span>{lang === 'hy' ? 'Բիթ Սեմփլեր' : 'Бит Сэмплер'}</span>
                    <ArrowRight className="w-4 h-4" id="icon-game2-skip" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 6: Instrument Beat / Drum Sampler Pad */}
          {screen === 'game-instrument-beat' && (
            <div className="flex-1 flex flex-col justify-between p-6 md:p-10" id="screen-game-sampler">
              <div id="sampler-stage-content">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6" id="sampler-header">
                  <div>
                    <h2 className="text-2xl font-black text-white flex items-center gap-2" id="sampler-title">
                      <span>🎹</span> {UI_TEXTS[lang].game3Title}
                    </h2>
                    <p className="text-slate-400 text-xs md:text-sm" id="sampler-subtitle">
                      {UI_TEXTS[lang].game3Subtitle}
                    </p>
                  </div>

                  {/* Play Sequencer Loop Button */}
                  <button
                    onClick={() => {
                      djsynth.playScratch();
                      setSequencerActive(!sequencerActive);
                    }}
                    className={`px-5 py-3 rounded-xl font-bold flex items-center gap-2 transition active:scale-95 shadow-lg ${
                      sequencerActive
                        ? 'bg-rose-500 text-white shadow-rose-500/20'
                        : 'bg-emerald-400 text-slate-950 shadow-emerald-400/20 hover:brightness-110'
                    }`}
                    id="btn-toggle-sequencer"
                  >
                    {sequencerActive ? <Square className="w-5 h-5 fill-current" id="icon-seq-stop" /> : <Play className="w-5 h-5 fill-current" id="icon-seq-start" />}
                    <span>{sequencerActive ? (lang === 'hy' ? 'ԿԱՆԳՆԵՑՆԵԼ 🎵' : 'СТОП 🎵') : (lang === 'hy' ? 'ՆՎԱԳԵԼ ԲԻԹԸ' : 'ИГРАТЬ БИТ')}</span>
                  </button>
                </div>

                {/* 8-Step Sequencer Drum Grid */}
                <div className="bg-slate-950/80 border border-slate-850 rounded-2xl p-5 md:p-6 mb-6 shadow-inner" id="sampler-sequencer-grid">
                  
                  {/* Step Sequencer Header markers */}
                  <div className="grid grid-cols-12 gap-2 mb-3 items-center font-mono text-[10px] text-slate-500 text-center" id="sequencer-headers">
                    <div className="col-span-4 text-left font-black tracking-widest text-slate-400" id="seq-lbl-inst">INSTRUMENT</div>
                    {[0, 1, 2, 3, 4, 5, 6, 7].map((num) => (
                      <div
                        key={num}
                        className={`col-span-1 py-1 rounded transition-colors ${num === sequencerStep && sequencerActive ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-900'}`}
                        id={`step-marker-${num}`}
                      >
                        {num + 1}
                      </div>
                    ))}
                  </div>

                  {/* Instrument channels rows */}
                  <div className="space-y-3" id="sequencer-channel-rows">
                    {[
                      { key: 'kick', label: '🥁 Kick Bass', color: 'border-cyan-500 text-cyan-400 bg-cyan-950/20' },
                      { key: 'snare', label: '👏 Snare clap', color: 'border-pink-500 text-pink-400 bg-pink-950/20' },
                      { key: 'hihat', label: '✨ Hi-Hat sharp', color: 'border-purple-500 text-purple-400 bg-purple-950/20' },
                      { key: 'synth', label: '🎹 Synth melody', color: 'border-yellow-500 text-yellow-400 bg-yellow-950/20' },
                      { key: 'bass', label: '🎸 Low Bass Sub', color: 'border-emerald-500 text-emerald-400 bg-emerald-950/20' },
                      { key: 'scratch', label: '🎚️ DJ Scratching', color: 'border-orange-500 text-orange-400 bg-orange-950/20' },
                    ].map((inst) => (
                      <div key={inst.key} className="grid grid-cols-12 gap-2 items-center" id={`row-${inst.key}`}>
                        
                        {/* Drum pad label */}
                        <button
                          onClick={() => {
                            if (inst.key === 'kick') djsynth.playKick();
                            if (inst.key === 'snare') djsynth.playSnare();
                            if (inst.key === 'hihat') djsynth.playHihat();
                            if (inst.key === 'synth') djsynth.playSynth(523.25, 0.2, 'triangle');
                            if (inst.key === 'bass') djsynth.playBass();
                            if (inst.key === 'scratch') djsynth.playScratch();
                          }}
                          className={`col-span-4 py-2.5 px-3 rounded-xl border font-bold text-xs text-left truncate active:scale-95 transition-all shadow hover:brightness-115 ${inst.color}`}
                          id={`btn-pad-${inst.key}`}
                        >
                          {inst.label}
                        </button>

                        {/* 8 step pads */}
                        {[0, 1, 2, 3, 4, 5, 6, 7].map((stepIdx) => {
                          const isActive = seqMatrix[inst.key][stepIdx];
                          return (
                            <button
                              key={stepIdx}
                              onClick={() => toggleSeqStep(inst.key, stepIdx)}
                              className={`col-span-1 h-10 rounded-lg transition-all border active:scale-90 ${
                                isActive
                                  ? (inst.key === 'kick' ? 'bg-cyan-500 border-white shadow-lg shadow-cyan-500/20' :
                                     inst.key === 'snare' ? 'bg-pink-500 border-white shadow-lg shadow-pink-500/20' :
                                     inst.key === 'hihat' ? 'bg-purple-500 border-white shadow-lg shadow-purple-500/20' :
                                     inst.key === 'synth' ? 'bg-yellow-500 border-white shadow-lg shadow-yellow-500/20' :
                                     inst.key === 'bass' ? 'bg-emerald-500 border-white shadow-lg shadow-emerald-500/20' :
                                     'bg-orange-500 border-white shadow-lg shadow-orange-500/20')
                                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                              } ${sequencerStep === stepIdx && sequencerActive ? 'ring-2 ring-white/50 ring-offset-2 ring-offset-slate-950' : ''}`}
                              id={`seq-${inst.key}-step-${stepIdx}`}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Navigation Footer */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between" id="sampler-nav-footer">
                <button
                  onClick={() => {
                    setSequencerActive(false);
                    goToScreen('game-dj-sort');
                  }}
                  className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition flex items-center gap-2 text-sm"
                  id="btn-sampler-back"
                >
                  <ArrowLeft className="w-4 h-4" id="icon-sampler-back" />
                  <span>{UI_TEXTS[lang].back}</span>
                </button>

                <button
                  onClick={() => {
                    setSequencerActive(false);
                    goToScreen('game-mix-challenge');
                  }}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-cyan-500 text-slate-950 font-black hover:brightness-110 active:scale-[0.98] transition shadow-lg shadow-cyan-500/20 flex items-center gap-2 text-sm animate-pulse"
                  id="btn-sampler-next"
                >
                  <span>{lang === 'hy' ? 'DJ MIX CHALLENGE ⚡' : 'ВЫЗОВ DJ MIX ⚡'}</span>
                  <ArrowRight className="w-4 h-4" id="icon-sampler-next" />
                </button>
              </div>
            </div>
          )}

          {/* SCREEN 7: DJ Mix Challenge */}
          {screen === 'game-mix-challenge' && (
            <div className="flex-1 flex flex-col justify-between p-6 md:p-10" id="screen-game-mix-challenge">
              <div id="challenge-content-grid">
                <div className="flex justify-between items-center mb-4" id="challenge-header">
                  <div>
                    <h2 className="text-2xl font-black text-white flex items-center gap-2" id="challenge-title">
                      <span>⚡</span> {UI_TEXTS[lang].game4Title}
                    </h2>
                    <p className="text-slate-400 text-xs md:text-sm" id="challenge-subtitle">
                      {UI_TEXTS[lang].game4Subtitle}
                    </p>
                  </div>
                  <span className="font-mono text-xs bg-slate-800 px-3 py-1 rounded-full text-slate-300 font-bold" id="challenge-progress">
                    {challengeIdx + 1} / 10
                  </span>
                </div>

                {/* Question progress bar */}
                <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden mb-8" id="challenge-progress-bar">
                  <div
                    className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 transition-all duration-300"
                    style={{ width: `${((challengeIdx + 1) / 10) * 100}%` }}
                    id="challenge-progress-bar-inner"
                  />
                </div>

                {/* Challenge Card Container */}
                {challengeQuestions.length > 0 && challengeIdx < challengeQuestions.length && (
                  <div className="bg-slate-950/60 border border-slate-850 p-6 md:p-8 rounded-2xl shadow-inner flex flex-col items-center" id="challenge-question-card">
                    {/* Glowing turntable deck */}
                    <div className="mb-6 relative" id="challenge-deck-shield">
                      <div className="absolute inset-0 bg-pink-500/10 rounded-full blur-xl animate-pulse" />
                      <div className="w-16 h-16 rounded-full bg-slate-900 border-2 border-slate-800 flex items-center justify-center relative shadow-md" id="challenge-deck">
                        <IconRenderer name={challengeQuestions[challengeIdx].wordObj.icon} className="w-8 h-8 text-cyan-400" />
                      </div>
                    </div>

                    <p className="text-slate-400 text-xs font-mono uppercase tracking-widest mb-3" id="challenge-prompt-hint">
                      {lang === 'hy' ? 'ՀԱՐՑ՝' : 'ВОПРОС:'}
                    </p>

                    <h3 className="text-xl md:text-2xl font-bold text-white text-center mb-8 px-4" id="challenge-prompt-text">
                      {lang === 'hy' ? challengeQuestions[challengeIdx].promptHy : challengeQuestions[challengeIdx].promptRu}
                    </h3>

                    {/* Choices Options Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg mb-6" id="challenge-options-grid">
                      {challengeQuestions[challengeIdx].options.map((option, idx) => {
                        const isSelected = challengeSelectedOption === option;
                        const isCorrectOption = challengeQuestions[challengeIdx].correctAnswer === option;
                        
                        let optionStyle = 'bg-slate-900 border-slate-800 text-slate-200 hover:border-purple-500/50 hover:bg-slate-850';
                        if (challengeAnswered) {
                          if (isCorrectOption) {
                            optionStyle = 'bg-emerald-950 border-emerald-400 text-emerald-300 font-bold';
                          } else if (isSelected) {
                            optionStyle = 'bg-rose-950 border-rose-500 text-rose-300 font-bold';
                          } else {
                            optionStyle = 'bg-slate-900/40 border-slate-900 text-slate-600 opacity-50';
                          }
                        }

                        return (
                          <button
                            key={idx}
                            onClick={() => handleChallengeAnswer(option)}
                            disabled={challengeAnswered}
                            className={`py-4 px-6 rounded-xl border text-base font-bold transition duration-200 active:scale-[0.98] text-center shadow-md ${optionStyle}`}
                            id={`challenge-option-${idx}`}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>

                    {/* Quick result feedback note */}
                    {challengeAnswered && (
                      <div className={`w-full max-w-lg p-4 rounded-xl border text-xs md:text-sm ${challengeCorrect ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-rose-950/40 border-rose-500/40 text-rose-300'}`} id="challenge-mini-feedback">
                        <div className="flex items-center gap-2 mb-1" id="challenge-feedback-header">
                          <span className="text-base">{challengeCorrect ? '🎉' : '❌'}</span>
                          <span className="font-bold">{challengeCorrect ? UI_TEXTS[lang].correct : UI_TEXTS[lang].incorrect}</span>
                        </div>
                        <p id="challenge-feedback-body">
                          {lang === 'hy' ? 'Բառն է՝' : 'Слово:'}{' '}
                          <strong className="capitalize text-white">
                            {challengeQuestions[challengeIdx].wordObj.article} {challengeQuestions[challengeIdx].wordObj.word}
                          </strong>{' '}
                          ({lang === 'hy' ? challengeQuestions[challengeIdx].wordObj.translationHy : challengeQuestions[challengeIdx].wordObj.translationRu}).
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Navigation Footer */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between" id="challenge-nav-footer">
                <button
                  onClick={() => goToScreen('game-instrument-beat')}
                  className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition flex items-center gap-2 text-sm"
                  id="btn-challenge-back"
                >
                  <ArrowLeft className="w-4 h-4" id="icon-challenge-back" />
                  <span>{UI_TEXTS[lang].back}</span>
                </button>

                {challengeAnswered && (
                  <button
                    onClick={nextChallengeQuestion}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-cyan-500 text-slate-950 font-black hover:brightness-110 active:scale-[0.98] transition shadow-lg shadow-cyan-500/20 flex items-center gap-2 text-sm animate-pulse"
                    id="btn-challenge-continue"
                  >
                    <span>{challengeIdx < 9 ? UI_TEXTS[lang].continue : (lang === 'hy' ? 'Տեսնել Արդյունքը' : 'Показать результат')}</span>
                    <ArrowRight className="w-4 h-4" id="icon-challenge-continue" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* SCREEN 8: Final results summary */}
          {screen === 'results' && (
            <div className="flex-1 flex flex-col justify-between p-6 md:p-10 text-center items-center" id="screen-results">
              <div className="max-w-xl w-full flex-1 flex flex-col justify-center items-center py-6" id="results-card">
                {/* Floating Award Medallion */}
                <div className="mb-6 relative" id="results-award-wrapper">
                  <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500 to-pink-500 rounded-full opacity-30 blur-2xl animate-pulse" />
                  <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-yellow-400 via-amber-500 to-pink-500 text-slate-950 flex items-center justify-center shadow-xl shadow-yellow-500/20" id="results-badge">
                    <Award className="w-12 h-12" id="icon-results-award" />
                  </div>
                </div>

                <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-2" id="results-title">
                  {lang === 'hy' ? 'ՇՆՈՐՀԱՎՈՐԱՆՔՆԵՐ 🎉' : 'ПОЗДРАВЛЯЕМ 🎉'}
                </h2>
                
                <p className="text-slate-400 text-sm mb-6" id="results-subtitle">
                  {lang === 'hy' ? 'Դու հաջողությամբ ավարտեցիր իսպաներենի սեռերի դասը։' : 'Ты успешно завершил музыкальный урок испанского рода!'}
                </p>

                {/* Score & Stars Block */}
                <div className="bg-slate-950/80 border border-slate-850 rounded-2xl p-6 w-full shadow-inner mb-8 space-y-4" id="results-stats-panel">
                  {/* Rating Stars Group */}
                  <div className="flex justify-center gap-2" id="results-stars-group">
                    {[1, 2, 3, 4, 5].map((starNum) => {
                      const finalRank = getDJRank();
                      const starActive = starNum <= finalRank.stars;
                      return (
                        <Sparkle
                          key={starNum}
                          className={`w-8 h-8 ${starActive ? 'text-yellow-400 fill-current animate-bounce' : 'text-slate-700'}`}
                          style={{ animationDelay: `${starNum * 0.1}s` }}
                          id={`star-${starNum}`}
                        />
                      );
                    })}
                  </div>

                  {/* DJ Rank display */}
                  <div id="results-rank-box">
                    <p className="text-slate-500 text-[10px] font-mono tracking-widest uppercase mb-1" id="results-rank-lbl">
                      {UI_TEXTS[lang].congratsTitle}
                    </p>
                    <h3 className={`text-2xl font-black ${getDJRank().color}`} id="results-rank-title">
                      {getDJRank().rank}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-900 text-center" id="results-metrics-grid">
                    <div id="metric-score">
                      <span className="text-[10px] text-slate-500 font-mono block uppercase">{UI_TEXTS[lang].score}</span>
                      <strong className="text-2xl font-extrabold text-white">{score}</strong>
                    </div>
                    <div id="metric-answers">
                      <span className="text-[10px] text-slate-500 font-mono block uppercase">
                        {lang === 'hy' ? 'Ճիշտ պատասխաններ' : 'Точность'}
                      </span>
                      <strong className="text-2xl font-extrabold text-emerald-400">{challengeCorrectCount} / 10</strong>
                    </div>
                  </div>
                </div>

                {/* Feedback comment */}
                <p className="text-slate-300 text-sm max-w-sm italic mb-10" id="results-perfect-comment">
                  {challengeCorrectCount >= 8 ? UI_TEXTS[lang].perfect : ''}
                </p>

                {/* Replay controller action pads */}
                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center" id="results-actions">
                  <button
                    onClick={resetAllGames}
                    className="flex-1 py-4 px-6 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-sm tracking-wider shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
                    id="btn-results-replay"
                  >
                    <RotateCcw className="w-4 h-4" id="icon-results-replay" />
                    <span>{UI_TEXTS[lang].playAgain}</span>
                  </button>

                  <button
                    onClick={() => {
                      djsynth.playScratch();
                      setScreen('language');
                    }}
                    className="flex-1 py-4 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm tracking-wider border border-slate-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                    id="btn-results-switch-lang"
                  >
                    <Globe className="w-4 h-4" id="icon-results-switch-lang" />
                    <span>{UI_TEXTS[lang].switchLang}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </section>

      </main>

      {/* Decorative visual footer (mixing desk knobs & subtle glow rail) */}
      <footer className="mt-auto border-t border-slate-800 bg-slate-950 px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-500 relative z-20" id="app-footer-bar">
        <div className="flex items-center gap-4 mb-2 sm:mb-0" id="footer-knobs-group">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" /> VOL: 80%</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" /> EQ HIGH: MID</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500" /> FX: REVERB</span>
        </div>
        <p id="footer-credits">
          {lang === 'hy' 
            ? '© Իսպաներենի DJ Սեռերի Ուսուցիչ - Պատրաստված է սիրով' 
            : '© DJ Испанский Род Существительных - Создано с любовью'}
        </p>
      </footer>
    </div>
  );
}
