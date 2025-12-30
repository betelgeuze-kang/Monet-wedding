import React, { useState, useRef, useEffect } from 'react';
import { PenTool, Eye, MapPin, Check, Camera, Copy, MessageSquare, Share2, Palette, Ticket, X, ChevronDown, Move, ZoomIn, Save, Loader2, Image as ImageIcon, Trash2, Download, Upload, Grid, Quote, AlertCircle, ChevronLeft, ChevronRight, Lock, LogOut, BookOpen } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, updateDoc, onSnapshot, getDoc } from 'firebase/firestore';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';

// --- [Global Styles] ---
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Gowun+Batang:wght@400;700&family=Monsieur+La+Doulaise&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&display=swap');
    
    .font-art-kr { font-family: 'Gowun Batang', serif; }
    .font-sign { font-family: 'Monsieur La Doulaise', cursive; }
    .font-art-en { font-family: 'Cormorant Garamond', serif; }

    .bg-garden-mist {
      background-color: #f0fdfa;
      background-image: 
        radial-gradient(circle at 10% 20%, rgba(20, 184, 166, 0.03) 0%, transparent 40%),
        radial-gradient(circle at 90% 80%, rgba(20, 184, 166, 0.03) 0%, transparent 40%),
        url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E");
      background-blend-mode: multiply, normal;
    }

    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    
    .frame-champagne {
      box-shadow: 0 0 0 1px #d6cdb6, 0 0 0 4px #fbfbf9, 0 0 0 5px #c5b89a, 5px 10px 20px rgba(17, 94, 89, 0.15);
      border-radius: 2px;
      transition: all 0.3s ease;
      background-color: #fbfbf9;
    }

    .frame-modal { border: 4px solid #c5b89a; box-shadow: 0 10px 30px rgba(17, 94, 89, 0.2); }
    
    .ticket-edge {
      background-image: radial-gradient(circle at 0 50%, transparent 10px, #fbfbf9 11px), radial-gradient(circle at 100% 50%, transparent 10px, #fbfbf9 11px);
      background-size: 50% 100%;
      background-position: 0 0, 100% 0;
      background-repeat: no-repeat;
    }

    .gallery-container { perspective: 1200px; transform-style: preserve-3d; }
    .slider-thumb::-webkit-slider-thumb { appearance: none; width: 16px; height: 16px; background: #115e59; border: 2px solid #f0fdfa; border-radius: 50%; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }

    .opening-wrapper { position: fixed; inset: 0; z-index: 9999; background-color: white; transition: opacity 1.5s ease-in-out; }
    .opening-wrapper.fade-out { opacity: 0; pointer-events: none; }
    .mystic-mint-bg { background: radial-gradient(circle at 20% 80%, rgba(17, 94, 89, 0.85) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(94, 234, 212, 0.6) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(253, 251, 247, 0.9) 0%, transparent 60%), linear-gradient(135deg, #ccfbf1 0%, #115e59 100%); filter: blur(35px) contrast(1.2) brightness(1.1); background-size: 180% 180%; animation: fluidMove 20s infinite alternate ease-in-out; opacity: 0; transition: opacity 2s ease; }
    .mystic-mint-bg.visible { opacity: 1; }
    @keyframes fluidMove { 0% { background-position: 0% 0%; } 100% { background-position: 100% 100%; } }
    .strong-brush-texture { background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.4 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E"); opacity: 0.4; mix-blend-mode: multiply; }
    .iris-particles { position: absolute; inset: 0; pointer-events: none; }
    .iris-drop { position: absolute; border-radius: 50%; background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), rgba(200,250,240,0.2)); box-shadow: 0 4px 15px rgba(20, 100, 90, 0.1); animation: irisFloat 8s infinite ease-in-out; opacity: 0; transition: opacity 1s ease; }
    .iris-drop.visible { opacity: 0.6; }
    @keyframes irisFloat { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-30px) scale(1.1); } }
    .intro-text-content { opacity: 0; transform: translateY(20px); transition: all 1.5s ease-out; }
    .intro-text-content.visible { opacity: 1; transform: translateY(0); }

    .text-monet-teal { color: #115e59; }
    .text-monet-gold { color: #c5b89a; }
    .btn-fluid { background: linear-gradient(135deg, #134e4a 0%, #0f766e 100%); position: relative; overflow: hidden; }
    .btn-fluid::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(circle at 50% 0%, rgba(255,255,255,0.2), transparent 70%); pointer-events: none; }
  `}</style>
);

// --- [Firebase Config] ---
// TODO: Replace with your own Firebase config object from Firebase Console
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Fallback for environment variables if available
const configToUse = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : firebaseConfig;
const app = initializeApp(configToUse);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app';

// --- [Types & Data] ---
interface AccountInfo { bank: string; accountNumber: string; owner: string; }
interface GuestMessage { id: string; name: string; message: string; date: string; attend: boolean; meal: boolean; }
interface WeddingData {
  password?: string;
  groomName: string; groomEnglish: string;
  brideName: string; brideEnglish: string;
  date: string; time: string;
  venue: string; floor: string;
  mapImage: string;
  greetingTitle: string; greetingBody: string;
  galleryImages: string[];
  groomAccount: AccountInfo; brideAccount: AccountInfo;
  transportInfo: string;
  guestbook: GuestMessage[];
}

const GREETING_TEMPLATES = [
  { id: 0, label: "✨ 직접 입력 (선택 안 함)", content: "" },
  { id: 1, label: "1. 기본형", content: "저희 두 사람, 사랑으로 하나 되어\n새로운 시작을 하려 합니다.\n\n귀한 걸음 하시어 축복해 주시면\n더없는 기쁨으로 간직하겠습니다." },
  { id: 2, label: "2. 계절형 (봄)", content: "따스한 봄날,\n저희 두 사람의 사랑이 결실을 맺습니다.\n\n싱그러운 꽃내음 가득한 날,\n저희의 앞날을 축복해 주세요." },
  { id: 3, label: "3. 계절형 (가을)", content: "높고 푸른 가을 하늘 아래,\n저희 두 사람 부부의 연을 맺습니다.\n\n깊어가는 가을의 정취 속에서\n저희의 시작을 함께해 주세요." },
  { id: 4, label: "4. 감성형 (시적)", content: "서로의 이름을 부르는 것만으로도\n가슴이 벅차오르는 사람을 만났습니다.\n\n저희 두 사람의 아름다운 동행에\n따뜻한 증인이 되어주세요." },
  { id: 5, label: "5. 감성형 (잔잔함)", content: "오랜 시간 서로의 곁을 지켜온 저희가\n이제 평생을 함께할 약속을 하려 합니다.\n\n저희의 소중한 순간을\n함께 빛내주시면 감사하겠습니다." },
  { id: 6, label: "6. 종교형", content: "하나님의 은혜 아래\n저희 두 사람이 믿음의 가정을 이루려 합니다.\n\n기도와 사랑으로 축복해 주시면\n감사하겠습니다." },
  { id: 7, label: "7. 정중형", content: "평소 저희 두 사람을 아껴주신\n어른들과 친지분들을 모시고\n백년가약을 맺고자 합니다.\n\n부디 참석하시어 자리를 빛내주십시오." },
  { id: 8, label: "8. 유쾌형", content: "저희 결혼합니다!\n서로의 부족함을 채워주며\n알콩달콩 재미있게 살겠습니다.\n\n오셔서 저희의 시작을 유쾌하게 축하해 주세요." },
  { id: 9, label: "9. 모네 테마 (예술적)", content: "빛은 매 순간 변하지만,\n그림자는 늘 빛을 따라갑니다.\n\n우리가 서로의 빛과 그림자가 되어\n영원히 함께할 이 순간을\n화폭에 담듯 소중히 간직하려 합니다.\n\n저희의 작은 전시회에 당신을 초대합니다." },
  { id: 10, label: "10. 간결형", content: "저희 두 사람의 새로운 출발을\n알립니다.\n\n귀한 시간 내시어\n축복해 주시면 감사하겠습니다." },
];

const initialData: WeddingData = {
  groomName: '클로드', groomEnglish: 'Claude',
  brideName: '카미유', brideEnglish: 'Camille',
  date: '2025-05-25', time: '12:00',
  venue: '지베르니 정원', floor: '야외 웨딩홀',
  mapImage: '',
  greetingTitle: '빛과 색의 정원에서',
  greetingBody: GREETING_TEMPLATES[9].content,
  galleryImages: [],
  groomAccount: { bank: '예술은행', accountNumber: '1840-11-1400', owner: '클로드 모네' },
  brideAccount: { bank: '사랑은행', accountNumber: '1847-09-0500', owner: '카미유 동시외' },
  transportInfo: '지하철: 3호선 지베르니역 2번 출구 (도보 5분)\n버스: 405번, 150번 미술관 앞 하차',
  guestbook: []
};

// --- [UI Components] ---
const ArtFrame = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`relative p-3 frame-champagne h-full w-full flex flex-col ${className}`}>
    <div className="relative overflow-hidden w-full h-full bg-[#fbfbf9] flex-1">
      {children}
      <div className="absolute inset-0 bg-garden-mist opacity-30 pointer-events-none mix-blend-multiply"></div>
    </div>
  </div>
);

const BrushTitle = ({ en, kr }: { en: string, kr: string }) => (
  <div className="text-center mb-10 relative">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-10 bg-[#ccfbf1]/40 -rotate-2 blur-xl rounded-full -z-10"></div>
    <h3 className="text-3xl font-sign text-[#c5b89a] mb-1 opacity-80">{en}</h3>
    <h2 className={`text-xl font-art-kr font-bold text-monet-teal relative z-10`}>{kr}</h2>
  </div>
);

const LoadingOverlay = ({ text = "화폭을 준비 중입니다..." }: { text?: string }) => (
    <div className="absolute inset-0 z-[100] bg-[#f0fdfa]/90 flex flex-col items-center justify-center backdrop-blur-sm">
        <div className="relative"><Loader2 className="animate-spin text-monet-teal mb-4" size={32} /><div className="absolute top-0 left-0 w-full h-full bg-[#99f6e4] blur-xl opacity-30 animate-pulse"></div></div>
        <p className="font-art-kr text-sm text-monet-teal animate-pulse">{text}</p>
    </div>
);

// --- [Guestbook Modal] ---
const GuestbookModal = ({ messages, onClose, isEditMode, onDelete }: { messages: GuestMessage[], onClose: () => void, isEditMode: boolean, onDelete: (msg: GuestMessage) => void }) => {
    return (
        <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-garden-mist w-full max-w-sm rounded-lg overflow-hidden flex flex-col h-[80vh] shadow-2xl relative border-4 border-[#c5b89a]">
                <div className="p-5 border-b border-[#c5b89a]/30 flex justify-between items-center bg-white/50">
                    <h3 className="font-art-kr font-bold text-monet-teal flex items-center gap-2 text-lg">
                        <BookOpen size={18}/> 소중한 마음들 ({messages.length})
                    </h3>
                    <button onClick={onClose}><X size={24} className="text-[#c5b89a] hover:text-monet-teal"/></button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar bg-[#fbfbf9]">
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-[#c5b89a] opacity-60">
                            <MessageSquare size={40} className="mb-2"/>
                            <p className="font-art-kr text-sm">아직 작성된 방명록이 없습니다.</p>
                            <p className="font-art-kr text-xs">첫 번째 축하 인사를 남겨보세요!</p>
                        </div>
                    ) : (
                        messages.map((msg) => (
                            <div key={msg.id} className="bg-white p-4 rounded-sm border border-[#c5b89a]/20 shadow-sm relative group hover:border-[#c5b89a]/50 transition-all">
                                {isEditMode && (
                                    <button 
                                        onClick={() => { if(confirm('이 메시지를 삭제하시겠습니까?')) onDelete(msg); }}
                                        className="absolute top-2 right-2 text-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                    >
                                        <Trash2 size={14}/>
                                    </button>
                                )}
                                <div className="flex justify-between items-end mb-2 border-b border-dashed border-[#c5b89a]/30 pb-2">
                                    <span className="font-art-kr font-bold text-base text-[#115e59]">{msg.name}</span>
                                    <span className="text-[10px] text-[#c5b89a] font-art-en">{msg.date}</span>
                                </div>
                                <p className="font-art-kr text-sm text-[#134e4a] leading-relaxed whitespace-pre-wrap">
                                    {msg.message}
                                </p>
                                <div className="mt-2 flex gap-2 text-[10px] text-[#c5b89a]">
                                    {msg.attend && <span className="px-2 py-0.5 bg-[#f0fdfa] rounded-full">참석</span>}
                                    {msg.meal && <span className="px-2 py-0.5 bg-[#f0fdfa] rounded-full">식사</span>}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

// --- [Unified Opening Sequence] ---
const OpeningSequence = ({ isLoaded, groom, bride, date }: { isLoaded: boolean, groom: string, bride: string, date: string }) => {
    const [phase, setPhase] = useState(0); 

    useEffect(() => {
        const t1 = setTimeout(() => setPhase(1), 100); 
        return () => clearTimeout(t1);
    }, []);

    useEffect(() => {
        if (isLoaded && phase === 1) {
             const timer = setTimeout(() => setPhase(2), 3000); 
             return () => clearTimeout(timer);
        }
    }, [isLoaded, phase]);

    if (phase === 2) {
        setTimeout(() => setPhase(3), 1500); 
    }

    if (phase === 3) return null;

    return (
        <div className={`opening-wrapper flex flex-col items-center justify-center overflow-hidden ${phase === 2 ? 'fade-out' : ''}`}>
            <div className={`absolute inset-0 mystic-mint-bg scale-110 ${phase >= 1 ? 'visible' : ''}`}></div>
            <div className="absolute inset-0 strong-brush-texture"></div>
            <div className={`iris-particles ${phase >= 1 ? 'visible' : ''}`}>
                <div className="iris-drop" style={{ top: '20%', left: '30%', width: 60, height: 60 }}></div>
                <div className="iris-drop" style={{ top: '60%', left: '70%', width: 40, height: 40, animationDelay: '0.5s' }}></div>
                <div className="iris-drop" style={{ top: '40%', left: '50%', width: 20, height: 20, animationDelay: '1s' }}></div>
            </div>
            <div className={`intro-text-content relative z-10 p-12 max-w-xs w-full text-center ${phase >= 1 ? 'visible' : ''}`}>
                <div className="p-8 border-y border-white/40 bg-white/20 backdrop-blur-md rounded-sm shadow-xl">
                    <p className="font-sign text-7xl text-[#115e59] mb-4 drop-shadow-sm opacity-90 leading-none">Monet</p>
                    <div className="w-px h-12 bg-[#115e59]/50 mx-auto mb-6"></div>
                    <p className="font-art-kr text-2xl text-[#042f2e] font-bold tracking-widest drop-shadow-sm flex items-center justify-center gap-2">
                        {groom} <span className="text-xs font-serif italic text-[#134e4a]">&</span> {bride}
                    </p>
                    <p className="font-art-en text-xs text-[#134e4a] mt-6 tracking-[0.6em] uppercase border-t border-[#134e4a]/20 pt-4 inline-block px-4 font-bold shadow-sm">
                        {date.replaceAll('-', '. ')}
                    </p>
                </div>
            </div>
        </div>
    );
};

// --- [Image Cropper] ---
const ImageCropModal = ({ imageSrc, onClose, onSave }: { imageSrc: string | null, onClose: () => void, onSave: (result: string) => void }) => {
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isProcessing, setIsProcessing] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const lastPos = useRef({ x: 0, y: 0 });

    if (!imageSrc) return null;

    const handlePointerDown = (e: React.PointerEvent) => { isDragging.current = true; lastPos.current = { x: e.clientX, y: e.clientY }; };
    const handlePointerMove = (e: React.PointerEvent) => { if (!isDragging.current) return; const dx = e.clientX - lastPos.current.x; const dy = e.clientY - lastPos.current.y; setPosition(prev => ({ x: prev.x + dx, y: prev.y + dy })); lastPos.current = { x: e.clientX, y: e.clientY }; };
    const handlePointerUp = () => { isDragging.current = false; };

    const handleSave = async () => {
        setIsProcessing(true);
        await new Promise(resolve => setTimeout(resolve, 100));
        if (!imgRef.current) return;
        const canvas = document.createElement('canvas');
        canvas.width = 450; canvas.height = 800; 
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, 450, 800);
        const scaleFactor = 450 / (containerRef.current?.offsetWidth || 1);
        const img = imgRef.current;
        const drawScale = scale * scaleFactor;
        const drawX = (position.x * scaleFactor) + (225) - ((img.width * drawScale) / 2);
        const drawY = (position.y * scaleFactor) + (400) - ((img.height * drawScale) / 2);
        ctx.drawImage(img, drawX, drawY, img.width * drawScale, img.height * drawScale);
        onSave(canvas.toDataURL('image/webp', 0.7));
        setIsProcessing(false);
    };

    return (
        <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-garden-mist w-full max-w-sm rounded-lg overflow-hidden flex flex-col h-[85vh] shadow-2xl relative border-4 border-[#c5b89a]">
                {isProcessing && <LoadingOverlay text="작품을 등록 중입니다..." />}
                <div className="p-4 border-b border-[#c5b89a]/30 flex justify-between items-center bg-white/50"><h3 className="font-art-kr font-bold text-monet-teal flex items-center gap-2 text-sm"><Move size={14}/> 위치 조정 (9:16)</h3><button onClick={onClose}><X size={20} className="text-[#c5b89a] hover:text-red-500"/></button></div>
                <div className="flex-1 bg-[#115e59] relative overflow-hidden flex items-center justify-center touch-none">
                    <div ref={containerRef} className="relative w-[270px] h-[480px] bg-black overflow-hidden shadow-2xl frame-modal cursor-move" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                        <img ref={imgRef} src={imageSrc} className="absolute max-w-none origin-center pointer-events-none select-none" style={{ transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px) scale(${scale})`, left: '50%', top: '50%' }}/>
                        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-40"><div className="border-r border-b border-white/50"></div><div className="border-r border-b border-white/50"></div><div className="border-b border-white/50"></div><div className="border-r border-b border-white/50"></div><div className="border-r border-b border-white/50"></div><div className="border-b border-white/50"></div><div className="border-r border-white/50"></div><div className="border-r border-white/50"></div><div></div></div>
                    </div>
                    <p className="absolute bottom-4 text-[10px] text-white/50 font-art-kr pointer-events-none">드래그하여 위치를 이동하세요</p>
                </div>
                <div className="p-5 bg-[#f0fdfa] border-t border-[#c5b89a]/30 space-y-4">
                    <div className="flex items-center gap-4"><ZoomIn size={18} className="text-monet-teal"/><input type="range" min="0.5" max="3" step="0.1" value={scale} onChange={(e) => setScale(parseFloat(e.target.value))} className="w-full accent-monet-teal h-1.5 bg-gray-300 rounded-lg appearance-none cursor-pointer slider-thumb"/></div>
                    <button onClick={handleSave} className="w-full py-3 btn-fluid text-[#f0fdfa] rounded-sm font-art-kr text-sm tracking-widest hover:opacity-90 transition-opacity shadow-md flex justify-center items-center gap-2"><Palette size={14}/> 작품 완성 (저장)</button>
                </div>
            </div>
        </div>
    );
};

// --- [Fullscreen Image Viewer] ---
const ImageViewer = ({ images, initialIndex, onClose }: { images: string[], initialIndex: number, onClose: () => void }) => {
    const [index, setIndex] = useState(initialIndex);
    const [zoom, setZoom] = useState(1);
    const toggleZoom = () => setZoom(prev => prev === 1 ? 2 : 1);
    const handleNext = (e: React.MouseEvent) => { e.stopPropagation(); setIndex(prev => (prev + 1) % images.length); setZoom(1); };
    const handlePrev = (e: React.MouseEvent) => { e.stopPropagation(); setIndex(prev => (prev - 1 + images.length) % images.length); setZoom(1); };

    return (
        <div className="fixed inset-0 z-[70] bg-black flex items-center justify-center overflow-hidden" onClick={onClose}>
            <div className="absolute top-4 right-4 z-50"><button onClick={onClose}><X size={28} className="text-white/80"/></button></div>
            <div className="w-full h-full flex items-center justify-center transition-transform duration-300 ease-out" style={{ transform: `scale(${zoom})` }} onClick={(e) => { e.stopPropagation(); toggleZoom(); }}>
                <img src={images[index]} className="max-w-full max-h-full object-contain" />
            </div>
            {zoom === 1 && (
                <>
                    <button onClick={handlePrev} className="absolute left-4 p-2 bg-white/10 rounded-full text-white/80 hover:bg-white/20"><ChevronLeft size={24}/></button>
                    <button onClick={handleNext} className="absolute right-4 p-2 bg-white/10 rounded-full text-white/80 hover:bg-white/20"><ChevronRight size={24}/></button>
                    <div className="absolute bottom-8 text-white/50 text-xs font-art-kr">{index + 1} / {images.length}</div>
                </>
            )}
        </div>
    );
};

// --- [Grid View Modal] ---
const GridView = ({ images, onClose, onSelect }: { images: string[], onClose: () => void, onSelect: (idx: number) => void }) => (
    <div className="fixed inset-0 z-[55] bg-garden-mist flex flex-col animate-fade-in-up">
        <div className="p-4 flex justify-between items-center border-b border-[#c5b89a]/30">
            <h3 className="font-art-kr font-bold text-monet-teal">전체 작품 ({images.length})</h3>
            <button onClick={onClose}><X size={24} className="text-[#c5b89a] hover:text-monet-teal"/></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-3 gap-2 align-content-start">
            {images.map((img, idx) => (
                <div key={idx} onClick={() => onSelect(idx)} className="aspect-[9/16] bg-[#fbfbf9] rounded overflow-hidden cursor-pointer border border-[#c5b89a]/50 hover:border-monet-teal relative">
                    <img src={img} className="w-full h-full object-cover" loading="lazy" />
                </div>
            ))}
        </div>
    </div>
);

// --- [Preview Component] ---
const Preview = ({ data, onGuestbookSubmit, isEditMode, onDeleteGuestbook }: { data: WeddingData, onGuestbookSubmit: (msg: GuestMessage) => void, isEditMode: boolean, onDeleteGuestbook: (msg: GuestMessage) => void }) => {
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [showViewer, setShowViewer] = useState(false);
  const [showGuestbook, setShowGuestbook] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const displayImages = data.galleryImages.length > 0 ? data.galleryImages : [null, null, null];
  const nextSlide = () => setActiveIndex((prev) => (prev + 1) % displayImages.length);
  const prevSlide = () => setActiveIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);

  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.targetTouches[0].clientX; };
  const handleTouchMove = (e: React.TouchEvent) => { touchEndX.current = e.targetTouches[0].clientX; };
  const handleTouchEnd = () => { const diff = touchStartX.current - touchEndX.current; if (Math.abs(diff) > 50) { if (diff > 0) nextSlide(); else prevSlide(); } };
  
  const getSlideStyle = (index: number) => {
    const total = displayImages.length;
    let diff = (index - activeIndex + total) % total;
    if (diff > total / 2) diff -= total;
    const absDiff = Math.abs(diff);
    if (absDiff > 1) return { opacity: 0, pointerEvents: 'none' };
    let transform = `translateX(${diff * 75}%) scale(${1 - (absDiff * 0.15)}) rotateY(${diff * -25}deg)`;
    return { zIndex: 10 - absDiff, opacity: 1, transform, filter: absDiff === 0 ? 'none' : 'sepia(0.3) blur(1px)' };
  };

  const handleCopy = (text: string) => { navigator.clipboard.writeText(text); setToastMsg('복사되었습니다.'); setShowToast(true); setTimeout(() => setShowToast(false), 2000); };
  
  const handleNativeShare = async () => {
      const shareData = { title: `${data.groomName} & ${data.brideName}의 결혼식`, text: `저희의 결혼식에 초대합니다.\n${data.date} ${data.time}\n${data.venue}`, url: window.location.href };
      if (navigator.share) { try { await navigator.share(shareData); } catch (err) { console.log('Share canceled'); } } else { handleCopy(window.location.href); }
  };

  const handleNavi = (app: 'tmap' | 'kakao') => { const dest = encodeURIComponent(data.venue); if (app === 'tmap') window.location.href = `tmap://search?name=${dest}`; else window.location.href = `kakaonavi://search?q=${dest}`; };

  const [rsvpName, setRsvpName] = useState('');
  const [rsvpMsg, setRsvpMsg] = useState('');
  const [rsvpAttend, setRsvpAttend] = useState(true);
  const [rsvpMeal, setRsvpMeal] = useState(true);

  const handleRsvp = () => {
      if(!rsvpName || !rsvpMsg) return;
      const newMsg: GuestMessage = {
          id: Date.now().toString(),
          name: rsvpName,
          message: rsvpMsg,
          date: new Date().toISOString().slice(0,10).replaceAll('-', '.'),
          attend: rsvpAttend,
          meal: rsvpMeal
      };
      onGuestbookSubmit(newMsg);
      setRsvpName(''); setRsvpMsg('');
      setToastMsg('방명록에 등록되었습니다.'); setShowToast(true); setTimeout(() => setShowToast(false), 2000);
  };

  const shouldRenderImage = (index: number) => {
      const total = displayImages.length;
      let diff = (index - activeIndex + total) % total;
      if (diff > total / 2) diff -= total;
      return Math.abs(diff) <= 2;
  };

  const dDay = "D-Day"; 

  return (
    <div className="w-full h-full overflow-y-auto no-scrollbar bg-garden-mist relative text-monet-teal">
      {showViewer && data.galleryImages.length > 0 && (<ImageViewer images={data.galleryImages} initialIndex={activeIndex} onClose={() => setShowViewer(false)} />)}
      {showGrid && <GridView images={data.galleryImages} onClose={() => setShowGrid(false)} onSelect={(idx) => { setActiveIndex(idx); setShowGrid(false); setShowViewer(true); }} />}
      {showGuestbook && <GuestbookModal messages={data.guestbook} onClose={() => setShowGuestbook(false)} isEditMode={isEditMode} onDelete={onDeleteGuestbook} />}

      <div className={`fixed bottom-20 left-0 right-0 z-50 flex justify-center transition-all duration-300 ${showToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}><div className="bg-[#115e59]/90 backdrop-blur text-[#f0fdfa] px-6 py-2 rounded-full text-xs font-art-kr shadow-xl flex items-center gap-2"><Check size={12}/> {toastMsg}</div></div>
      {showShareModal && (
        <div className="absolute inset-0 z-50 bg-[#115e59]/40 flex items-center justify-center p-6 backdrop-blur-sm" onClick={() => setShowShareModal(false)}>
            <div className="bg-[#f0fdfa] w-full max-w-sm rounded-lg overflow-hidden shadow-2xl relative border-2 border-[#c5b89a]" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 text-center border-b-2 border-dashed border-[#c5b89a] ticket-edge">
                    <p className="font-sign text-4xl text-monet-teal mb-2">Art Ticket</p>
                    <p className="font-art-kr text-sm text-[#134e4a] mb-6">전시회 초대장</p>
                    <div className="w-1/2 mx-auto bg-gray-200 mb-4 overflow-hidden rounded frame-antique" style={{ aspectRatio: '9/16' }}>{displayImages[0] ? <img src={displayImages[0]} className="w-full h-full object-cover"/> : <div className="w-full h-full bg-gray-300"/>}</div>
                    <h2 className="font-art-kr text-xl font-bold text-monet-teal">{data.groomName} <span className="text-xs font-normal">&</span> {data.brideName}</h2>
                    <p className="font-art-en text-sm mt-2 text-[#134e4a]">{data.date} {data.time}</p>
                </div>
                <div className="bg-[#134e4a] p-4 text-center"><button onClick={() => { handleNativeShare(); setShowShareModal(false); }} className="w-full py-3 bg-[#FAE100] text-[#3b1e1e] font-bold rounded text-sm flex justify-center items-center gap-2"><Share2 size={16}/> 카카오톡 공유하기</button></div>
                <button onClick={() => setShowShareModal(false)} className="absolute top-2 right-2 p-2 text-[#c5b89a] hover:text-red-400"><X size={20}/></button>
            </div>
        </div>
      )}
      
      <section className="relative h-[90vh] flex flex-col items-center justify-center p-6 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-multiply bg-garden-mist"></div>
        <div className="relative z-10 w-full max-w-sm mb-8" style={{ aspectRatio: '16/9' }}>
            <ArtFrame className="rotate-1 shadow-2xl">
                {displayImages[0] ? ( <img src={displayImages[0]} className="w-full h-full object-cover" alt="Main" /> ) : ( <div className="w-full h-full bg-[#E8E8E8] flex flex-col items-center justify-center text-gray-400"> <Palette size={32} strokeWidth={1} className="mb-2"/> <span className="font-art-kr text-sm">Main Photo</span> </div> )}
                <div className="absolute top-2 right-2 btn-fluid text-white px-3 py-1 rounded-full text-[10px] font-serif tracking-widest backdrop-blur-sm z-20">{dDay}</div>
                <div className="absolute bottom-4 right-4 text-right"> <p className="font-sign text-3xl text-white/90 drop-shadow-md">Monet</p> </div>
            </ArtFrame>
        </div>
        <div className="relative z-10 text-center"><p className="font-art-en text-sm tracking-[0.3em] text-[#115e59] mb-2">{data.date.replaceAll('-', '.')}</p><h1 className="font-art-kr text-3xl text-monet-teal leading-relaxed drop-shadow-sm"> {data.groomName} <span className="text-sm align-middle text-[#134e4a] mx-1">그리고</span> {data.brideName} </h1><p className="font-art-kr text-xs text-[#134e4a] mt-4 tracking-widest">{data.venue} {data.floor}</p></div>
      </section>

      <section className="py-20 px-8 relative"><BrushTitle en="Invitation" kr="초대합니다" /><div className="bg-white/40 p-8 shadow-sm backdrop-blur-sm border border-[#c5b89a]/30 relative rounded-sm"><h3 className="text-lg font-art-kr text-center text-monet-teal mb-6 font-bold">{data.greetingTitle}</h3><p className="font-art-kr text-sm text-[#134e4a] leading-9 text-center whitespace-pre-wrap">{data.greetingBody}</p></div></section>
      
      <section className="py-16 overflow-hidden bg-white/20 border-y border-[#c5b89a]/20 relative">
        <BrushTitle en="Gallery" kr="아름다운 순간들" />
        <button onClick={() => setShowGrid(true)} className="absolute top-20 right-6 z-20 bg-[#f0fdfa]/80 p-2 rounded-full shadow-sm text-[#115e59] hover:text-[#0f766e] text-xs flex items-center gap-1 border border-[#c5b89a]/30"><Grid size={14}/> 전체보기</button>
        <div className="gallery-container relative w-full h-[650px] flex justify-center items-center touch-pan-y" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>{displayImages.map((imgSrc, index) => (<div key={index} className="absolute w-[60%] cursor-pointer transition-all duration-700 ease-out" style={{ ...getSlideStyle(index), aspectRatio: '9/16' }} onClick={() => { setActiveIndex(index); setShowViewer(true); }}><ArtFrame>{shouldRenderImage(index) && imgSrc ? ( <img src={imgSrc} className="w-full h-full object-cover" /> ) : ( <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200 text-gray-400 font-art-kr text-xs"> {imgSrc ? 'Loading...' : <><Camera className="mb-2 opacity-50"/> No Image</>} </div> )}</ArtFrame></div>))}</div><p className="text-center font-art-kr text-[10px] text-[#134e4a] mt-2 opacity-60">좌우로 넘겨서 감상하세요 ({activeIndex + 1}/{displayImages.length})</p>
      </section>

      <section className="py-20 px-6 text-center"><BrushTitle en="Location" kr="오시는 길" /><p className="font-art-kr text-lg text-monet-teal font-bold mb-1">{data.venue}</p><p className="font-art-kr text-sm text-[#134e4a] mb-6">{data.floor}</p><div className="p-2 bg-[#fbfbf9] frame-antique mb-8 w-full aspect-video"><div className="w-full h-full bg-[#f0fdfa] flex flex-col items-center justify-center text-[#134e4a] font-art-kr text-xs overflow-hidden">{data.mapImage ? (<img src={data.mapImage} className="w-full h-full object-cover" alt="약도" />) : (<div className="flex flex-col items-center"><MapPin size={24} className="mb-2 opacity-50"/>약도 이미지를 등록해주세요</div>)}</div></div><div className="bg-white/40 p-6 rounded-sm text-left mb-8 border border-[#c5b89a]/30"><h4 className="font-art-kr text-sm font-bold text-monet-teal mb-2 flex items-center gap-2"><div className="w-1 h-1 bg-monet-teal rounded-full"/> 교통 안내</h4><p className="font-art-kr text-xs text-[#134e4a] leading-relaxed whitespace-pre-wrap">{data.transportInfo}</p></div><div className="flex gap-2 justify-center font-art-kr"><button onClick={() => handleNavi('tmap')} className="px-6 py-2 bg-[#f0fdfa] border border-[#c5b89a] text-[#115e59] rounded-sm text-xs hover:bg-white transition-colors">티맵</button><button onClick={() => handleNavi('kakao')} className="px-6 py-2 bg-[#FAE100] border border-[#FAE100] rounded-sm text-xs text-[#3b1e1e] hover:opacity-90">카카오내비</button></div></section>
      
      <section className="py-16 px-6 bg-[#115e59]/5"><BrushTitle en="Heart" kr="마음 전하실 곳" /><div className="space-y-4 max-w-sm mx-auto">{[ { label: "신랑측", info: data.groomAccount }, { label: "신부측", info: data.brideAccount } ].map((side, i) => (<div key={i} className="bg-white p-5 shadow-sm border border-[#c5b89a]/20 relative overflow-hidden group rounded-sm"><div className="absolute top-0 left-0 w-1 h-full bg-[#115e59]/30"></div><div className="flex justify-between items-end mb-2"><span className="font-art-kr text-xs font-bold text-monet-teal">{side.label}</span><button onClick={() => handleCopy(`${side.info.bank} ${side.info.accountNumber}`)} className="font-art-kr text-[10px] flex items-center gap-1 text-[#134e4a] hover:text-monet-teal transition-colors"> <Copy size={10} /> 계좌복사 </button></div><div className="flex justify-between items-center"><div className="font-art-kr"> <span className="text-xs text-[#134e4a]">{side.info.bank}</span> <p className="text-sm text-monet-teal mt-0.5 font-serif">{side.info.accountNumber}</p> </div><span className="font-art-kr text-xs text-[#134e4a]">{side.info.owner}</span></div></div>))}</div></section>
      
      <section className="py-20 px-6 bg-[#115e59] text-[#f0fdfa]">
        <BrushTitle en="Guestbook" kr="방명록 서명" />
        <div className="max-w-xs mx-auto bg-[#fbfbf9] p-1 frame-antique mb-6">
             <div className="border border-[#c5b89a] p-6 flex flex-col gap-4 bg-[#f0fdfa] text-monet-teal">
                 <p className="font-art-kr text-xs text-center text-[#134e4a] mb-2">귀한 발걸음으로 자리를 빛내주세요</p>
                 <input value={rsvpName} onChange={(e) => setRsvpName(e.target.value)} type="text" placeholder="성함" className="w-full border-b border-[#c5b89a] p-2 text-sm font-art-kr focus:outline-none focus:border-monet-teal placeholder-[#134e4a]/50 bg-transparent" />
                 <div className="flex gap-4 text-xs font-art-kr justify-center text-[#134e4a]">
                    <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={rsvpAttend} onChange={() => setRsvpAttend(!rsvpAttend)} /> 참석</label>
                    <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={rsvpMeal} onChange={() => setRsvpMeal(!rsvpMeal)} /> 식사</label>
                 </div>
                 <textarea value={rsvpMsg} onChange={(e) => setRsvpMsg(e.target.value)} placeholder="축하 메시지를 남겨주세요" className="w-full border border-[#c5b89a] p-2 text-sm font-art-kr focus:outline-none resize-none h-20 placeholder-[#134e4a]/50 bg-transparent" />
                 <button onClick={handleRsvp} className="w-full py-3 btn-fluid text-[#f0fdfa] font-art-kr text-xs tracking-widest mt-2 hover:opacity-90 transition-opacity">서명 남기기</button>
             </div>
        </div>
        <div className="text-center">
             <button onClick={() => setShowGuestbook(true)} className="px-6 py-2 border border-[#c5b89a] text-[#f0fdfa] rounded-sm font-art-kr text-xs hover:bg-[#0f766e] transition-colors flex items-center gap-2 mx-auto">
                 <BookOpen size={14}/> 소중한 마음들 보기
             </button>
        </div>
      </section>

      <footer className="py-12 bg-[#042f2e] text-center text-[#ccfbf1] relative"><p className="font-sign text-2xl mb-2 opacity-80">Monet Studio</p><p className="font-art-en text-[10px] tracking-widest opacity-50 uppercase">The Masterpiece Wedding Invitation</p><div className="absolute -top-6 left-1/2 -translate-x-1/2"><button onClick={() => setShowShareModal(true)} className="w-12 h-12 rounded-full bg-[#FAE100] text-[#3b1e1e] flex items-center justify-center shadow-lg border-4 border-[#042f2e] hover:scale-110 transition-transform"><Share2 size={20} /></button></div></footer>
    </div>
  );
};

// --- [Security & Dashboard Components] ---
const AuthScreen = ({ isNew, onUnlock }: { isNew: boolean, onUnlock: (pw: string) => void }) => {
    const [password, setPassword] = useState('');
    return (
        <div className="absolute inset-0 z-[99999] bg-[#f0fdfa] flex flex-col items-center justify-center p-6 text-center">
            <Lock size={48} className="text-monet-teal mb-4 opacity-50"/>
            <h3 className="text-xl font-art-kr font-bold text-monet-teal mb-2">{!isNew ? '관리자 로그인' : '보안 비밀번호 설정'}</h3>
            <p className="text-xs text-gray-500 mb-6">{!isNew ? '편집하려면 비밀번호를 입력하세요.' : '청첩장 수정을 위한 비밀번호(4자리)를 설정하세요.'}</p>
            <input type="password" maxLength={4} placeholder="PIN" className="w-40 text-center text-2xl tracking-[0.5em] p-2 border-b-2 border-monet-teal bg-transparent focus:outline-none mb-6 font-mono text-monet-teal" value={password} onChange={(e) => { setPassword(e.target.value); if(e.target.value.length === 4) onUnlock(e.target.value); }} />
        </div>
    );
};

// --- [Editor Component] ---
const Editor = ({ data, onChange, onImageAdd, onImageDelete, onAccountChange, onMapUpload, onBackupExport, onBackupImport }: any) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const mapInputRef = useRef<HTMLInputElement>(null);
    const importInputRef = useRef<HTMLInputElement>(null);
    const [tempImage, setTempImage] = useState<string | null>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            if (data.galleryImages.length >= 20) { alert("사진은 최대 20장까지만 업로드 가능합니다."); return; }
            const url = URL.createObjectURL(e.target.files[0]);
            setTempImage(url); e.target.value = '';
        }
    };
    const handleMapSelect = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files && e.target.files[0]) { const url = URL.createObjectURL(e.target.files[0]); onMapUpload(url); } };
    const handleImportSelect = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files && e.target.files[0]) { onBackupImport(e.target.files[0]); e.target.value = ''; } };

    return (
        <div className="w-full h-full overflow-y-auto p-6 bg-white no-scrollbar pb-24 font-sans text-gray-800">
            {tempImage && (<ImageCropModal imageSrc={tempImage} onClose={() => setTempImage(null)} onSave={(resultUrl) => { onImageAdd(resultUrl); setTempImage(null); }} />)}
            <div className="flex justify-between items-center mb-6 border-b pb-4"><h2 className="text-xl font-bold flex items-center gap-2"><PenTool size={20} className="text-monet-teal"/> 정보 편집</h2><div className="flex gap-2"><button onClick={onBackupExport} className="p-2 bg-gray-100 rounded text-gray-600 hover:bg-gray-200" title="백업"><Download size={16}/></button><button onClick={() => importInputRef.current?.click()} className="p-2 bg-gray-100 rounded text-gray-600 hover:bg-gray-200" title="복원"><Upload size={16}/></button><input type="file" ref={importInputRef} onChange={handleImportSelect} className="hidden" accept=".json" /></div></div>
            <section className="mb-8">
                <label className="flex items-center justify-between gap-1 text-xs font-bold text-monet-teal uppercase tracking-wider mb-3"><span className="flex items-center gap-1"><Camera size={12}/> 1. Artworks (갤러리)</span><span className="text-[10px] text-gray-400 font-normal">{data.galleryImages.length} / 20</span></label>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">{data.galleryImages.length < 20 && (<button onClick={() => fileInputRef.current?.click()} className="w-20 h-24 flex-shrink-0 border-2 border-dashed border-teal-200 bg-[#f0fdfa] rounded flex flex-col items-center justify-center text-monet-teal hover:bg-teal-100 transition-colors"><Camera size={20} /> <span className="text-[10px] mt-1 font-bold">Add</span></button>)}<input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="image/*" />{data.galleryImages.map((img: string, idx: number) => (<div key={idx} className="w-20 h-24 flex-shrink-0 relative group shadow-sm"><img src={img} className="w-full h-full object-cover rounded border border-gray-200" /><div onClick={() => onImageDelete(idx)} className="absolute inset-0 bg-black/40 flex items-center justify-center text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></div></div>))}</div>
            </section>
            <section className="mb-8 border-t pt-6"><label className="flex items-center gap-1 text-xs font-bold text-monet-teal uppercase tracking-wider mb-3"><Palette size={12}/> 2. 주인공 & 예식일</label><div className="grid grid-cols-2 gap-3 mb-4"><input name="groomName" value={data.groomName} onChange={onChange} placeholder="신랑 (한글)" className="p-2 border rounded text-sm bg-gray-50"/><input name="groomEnglish" value={data.groomEnglish} onChange={onChange} placeholder="신랑 (영문)" className="p-2 border rounded text-sm bg-gray-50"/><input name="brideName" value={data.brideName} onChange={onChange} placeholder="신부 (한글)" className="p-2 border rounded text-sm bg-gray-50"/><input name="brideEnglish" value={data.brideEnglish} onChange={onChange} placeholder="신부 (영문)" className="p-2 border rounded text-sm bg-gray-50"/></div><div className="grid grid-cols-2 gap-3"><input name="date" type="date" value={data.date} onChange={onChange} className="w-full p-2 border rounded text-sm bg-gray-50"/><input name="time" type="time" value={data.time} onChange={onChange} className="w-full p-2 border rounded text-sm bg-gray-50"/></div></section>
            <section className="mb-8 border-t pt-6"><label className="flex items-center gap-1 text-xs font-bold text-monet-teal uppercase tracking-wider mb-3"><MessageSquare size={12}/> 3. 초대 문구</label><div className="relative mb-3"><select className="w-full p-2 border rounded text-sm bg-white appearance-none cursor-pointer focus:border-teal-500 focus:outline-none" onChange={(e) => { const selected = GREETING_TEMPLATES.find(t => t.label === e.target.value); if(selected) { if (selected.id === 0) { onChange({ target: { name: 'greetingBody', value: '' } }); } else { onChange({ target: { name: 'greetingBody', value: selected.content } }); } } }} defaultValue=""><option value="" disabled>✨ 초대 문구 템플릿 선택</option>{GREETING_TEMPLATES.map(t => <option key={t.id} value={t.label}>{t.label}</option>)}</select><ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/></div><input name="greetingTitle" value={data.greetingTitle} onChange={onChange} className="w-full p-2 border rounded text-sm bg-gray-50 mb-2 font-bold" placeholder="제목"/><textarea name="greetingBody" value={data.greetingBody} onChange={onChange} rows={6} className="w-full p-3 border rounded text-sm bg-gray-50 resize-none" /></section>
             <section className="mb-8 border-t pt-6"><label className="flex items-center gap-1 text-xs font-bold text-monet-teal uppercase tracking-wider mb-3"><MapPin size={12}/> 4. 장소 & 교통 (약도)</label><div className="space-y-2 mb-3"><input name="venue" value={data.venue} onChange={onChange} placeholder="예식장 명" className="w-full p-2 border rounded text-sm bg-gray-50"/><input name="floor" value={data.floor} onChange={onChange} placeholder="층 / 홀 상세정보" className="w-full p-2 border rounded text-sm bg-gray-50"/></div><div className="mb-3"><button onClick={() => mapInputRef.current?.click()} className="w-full py-2 border-2 border-dashed border-gray-300 rounded text-xs text-gray-500 hover:border-teal-500 hover:text-teal-600 transition-colors flex justify-center items-center gap-2"><ImageIcon size={14}/> {data.mapImage ? '약도 이미지 변경하기' : '약도 이미지 업로드'}</button><input type="file" ref={mapInputRef} onChange={handleMapSelect} className="hidden" accept="image/*" />{data.mapImage && <div className="mt-2 w-full h-20 bg-gray-100 rounded overflow-hidden border"><img src={data.mapImage} className="w-full h-full object-cover"/></div>}</div><textarea name="transportInfo" value={data.transportInfo} onChange={onChange} rows={3} className="w-full p-3 border rounded text-sm bg-gray-50 resize-none" placeholder="교통 안내"/></section>
            <section className="mb-8 border-t pt-6"><label className="flex items-center gap-1 text-xs font-bold text-monet-teal uppercase tracking-wider mb-3"><Ticket size={12}/> 5. 마음 전하실 곳</label><div className="space-y-4"><div className="p-3 border rounded bg-gray-50"><p className="text-xs font-bold text-gray-500 mb-2">신랑측</p><div className="grid grid-cols-2 gap-2"><input value={data.groomAccount.bank} onChange={(e) => onAccountChange('groom', 'bank', e.target.value)} className="p-2 border rounded text-xs bg-white" placeholder="은행"/><input value={data.groomAccount.owner} onChange={(e) => onAccountChange('groom', 'owner', e.target.value)} className="p-2 border rounded text-xs bg-white" placeholder="예금주"/><input value={data.groomAccount.accountNumber} onChange={(e) => onAccountChange('groom', 'accountNumber', e.target.value)} className="col-span-2 p-2 border rounded text-xs bg-white" placeholder="계좌번호"/></div></div><div className="p-3 border rounded bg-gray-50"><p className="text-xs font-bold text-gray-500 mb-2">신부측</p><div className="grid grid-cols-2 gap-2"><input value={data.brideAccount.bank} onChange={(e) => onAccountChange('bride', 'bank', e.target.value)} className="p-2 border rounded text-xs bg-white" placeholder="은행"/><input value={data.brideAccount.owner} onChange={(e) => onAccountChange('bride', 'owner', e.target.value)} className="p-2 border rounded text-xs bg-white" placeholder="예금주"/><input value={data.brideAccount.accountNumber} onChange={(e) => onAccountChange('bride', 'accountNumber', e.target.value)} className="col-span-2 p-2 border rounded text-xs bg-white" placeholder="계좌번호"/></div></div></div></section>
        </div>
    );
};

// --- [Main App] ---
export default function MonetGalleryGuestbookModal() {
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('preview'); 
  const [data, setData] = useState<WeddingData>(initialData);
  const [isLoaded, setIsLoaded] = useState(false);
  const [docId, setDocId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // 1. Initial Load Logic
  useEffect(() => {
    const init = async () => {
        try {
            await signInAnonymously(auth);
            
            const urlParams = new URLSearchParams(window.location.search);
            const idParam = urlParams.get('id');
            const modeParam = urlParams.get('mode');

            if (idParam) {
                setDocId(idParam);
                const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'weddings', idParam);
                
                const unsubscribe = onSnapshot(docRef, (snap) => {
                    if (snap.exists()) {
                        setData(snap.data() as WeddingData);
                    } else {
                        setErrorMsg("존재하지 않는 청첩장입니다.");
                    }
                });

                if (modeParam === 'edit') {
                    setIsEditMode(true);
                } else {
                    setIsEditMode(false);
                    setActiveTab('preview');
                }
                
                return () => unsubscribe();
            } else {
                setIsEditMode(true);
                setIsAuthenticated(true);
                setActiveTab('editor');
            }
        } catch (e) {
            console.error("Auth/DB Error:", e);
            setErrorMsg("서버 연결 실패");
        } finally {
            setIsLoaded(true);
        }
    };
    init();
  }, []);

  // 2. Auto-Save
  useEffect(() => {
      if (!isLoaded || !isEditMode || !isAuthenticated) return;

      const saveToFirestore = async () => {
          try {
              if (docId) {
                  const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'weddings', docId);
                  await updateDoc(docRef, { ...data });
              } else {
                  if (!data.password || data.password.length < 4) return;
                  const newDocRef = doc(collection(db, 'artifacts', appId, 'public', 'data', 'weddings'));
                  await setDoc(newDocRef, data);
                  setDocId(newDocRef.id);
                  const newUrl = `${window.location.pathname}?id=${newDocRef.id}&mode=edit`;
                  window.history.replaceState({}, '', newUrl);
              }
          } catch (e) { console.error("Save Error:", e); }
      };

      const timeoutId = setTimeout(saveToFirestore, 1000);
      return () => clearTimeout(timeoutId);
  }, [data, isLoaded, isEditMode, isAuthenticated, docId]);

  // Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { const { name, value } = e.target; setData(prev => ({ ...prev, [name]: value })); };
  
  const handleImageAdd = async (base64Url: string) => {
      if (!docId) return;
      const storageRef = ref(storage, `artifacts/${appId}/public/weddings/${docId}/${Date.now()}.webp`);
      try {
          await uploadString(storageRef, base64Url, 'data_url');
          const downloadUrl = await getDownloadURL(storageRef);
          setData(prev => ({...prev, galleryImages: [downloadUrl, ...prev.galleryImages]}));
      } catch (e) { console.error("Upload Error:", e); alert("업로드 실패"); }
  };

  const handleMapUpload = async (base64Url: string) => {
      if (!docId) return;
      const storageRef = ref(storage, `artifacts/${appId}/public/weddings/${docId}/map_${Date.now()}.webp`);
      try {
          await uploadString(storageRef, base64Url, 'data_url');
          const downloadUrl = await getDownloadURL(storageRef);
          setData(prev => ({...prev, mapImage: downloadUrl}));
      } catch (e) { console.error(e); alert("약도 업로드 실패"); }
  };

  const handleImageDelete = (index: number) => setData(prev => ({...prev, galleryImages: prev.galleryImages.filter((_, i) => i !== index)}));
  const handleAccountChange = (type: 'groom' | 'bride', field: string, value: string) => setData(prev => ({ ...prev, [`${type}Account`]: { ...prev[`${type}Account` as keyof WeddingData] as AccountInfo, [field]: value } }));
  
  const handleGuestbookSubmit = async (msg: GuestMessage) => {
      if (!docId) return;
      setData(prev => ({ ...prev, guestbook: [msg, ...prev.guestbook] }));
      
      if (!isEditMode) {
          const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'weddings', docId);
          const snap = await getDoc(docRef);
          if (snap.exists()) {
              const currentData = snap.data() as WeddingData;
              await updateDoc(docRef, { guestbook: [msg, ...currentData.guestbook] });
          }
      }
  };

  const handleDeleteGuestbook = (msgToDelete: GuestMessage) => {
      if (!isEditMode || !isAuthenticated) return;
      setData(prev => ({ ...prev, guestbook: prev.guestbook.filter(msg => msg.id !== msgToDelete.id) }));
  };

  const handleUnlock = (inputPw: string) => {
      if (isEditMode && docId) {
          if (data.password === inputPw) {
              setIsAuthenticated(true);
              setActiveTab('editor');
          } else { alert("비밀번호가 일치하지 않습니다."); }
      } else {
          setData(prev => ({ ...prev, password: inputPw }));
          setIsAuthenticated(true);
      }
  };

  // Mock Backup
  const handleBackupExport = () => { const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data)); const a = document.createElement('a'); a.href = dataStr; a.download = "backup.json"; a.click(); };
  const handleBackupImport = (file: File) => { const reader = new FileReader(); reader.onload = (e) => setData(JSON.parse(e.target?.result as string)); reader.readAsText(file); };

  if (!isLoaded) return <div className="w-full h-screen flex items-center justify-center bg-garden-mist"><div className="ripple-loader"></div></div>;

  return (
    <div className="relative w-full min-h-screen bg-neutral-200 flex flex-col items-center justify-center font-sans">
      <GlobalStyles />
      <OpeningSequence isLoaded={isLoaded} groom={data.groomEnglish} bride={data.brideEnglish} date={data.date} />
      
      {/* Auth Screen */}
      {isEditMode && !isAuthenticated && isLoaded && (
          <div className="fixed inset-0 z-[99999] bg-black/50 flex items-center justify-center">
              <div className="w-full max-w-sm h-[100dvh] bg-white relative shadow-2xl md:h-[850px] md:rounded-[3rem] overflow-hidden">
                  <AuthScreen isNew={!docId} onUnlock={handleUnlock} />
              </div>
          </div>
      )}

      {errorMsg && <div className="fixed top-4 left-0 right-0 z-[100] flex justify-center px-4"><div className="bg-red-500 text-white px-4 py-3 rounded shadow-lg flex items-center gap-2 text-xs font-bold animate-bounce"><AlertCircle size={16}/> {errorMsg}</div></div>}
      
      <div className="w-full max-w-[400px] h-[100dvh] bg-white shadow-2xl relative overflow-hidden flex flex-col md:h-[850px] md:rounded-[3rem] md:border-8 md:border-[#2c3e50]">
        <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#2c3e50] rounded-b-2xl z-50"></div>
        <main className="flex-1 relative w-full h-full overflow-hidden bg-white">
            <div className={`absolute inset-0 transition-transform duration-500 ${activeTab === 'editor' ? 'translate-x-0' : '-translate-x-full'}`}>
                {isAuthenticated ? (
                    <Editor 
                        data={data} 
                        onChange={handleChange} 
                        onImageAdd={handleImageAdd} 
                        onImageDelete={handleImageDelete} 
                        onAccountChange={handleAccountChange} 
                        onMapUpload={handleMapUpload} 
                        onBackupExport={handleBackupExport} 
                        onBackupImport={handleBackupImport} 
                    />
                ) : null}
            </div>
            <div className={`absolute inset-0 transition-transform duration-500 ${activeTab === 'preview' ? 'translate-x-0' : 'translate-x-full'}`}>
                <Preview 
                    data={data} 
                    onGuestbookSubmit={handleGuestbookSubmit} 
                    isEditMode={isEditMode && isAuthenticated}
                    onDeleteGuestbook={handleDeleteGuestbook}
                />
            </div>
        </main>
        
        {isEditMode && isAuthenticated && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex bg-[#2c3e50] p-1.5 rounded-full shadow-xl">
                <button onClick={() => setActiveTab('editor')} className={`flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold transition-all ${activeTab === 'editor' ? 'bg-white text-gray-900' : 'text-gray-400'}`}><PenTool size={14}/>에디터</button>
                <button onClick={() => setActiveTab('preview')} className={`flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold transition-all ${activeTab === 'preview' ? 'bg-white text-gray-900' : 'text-gray-400'}`}><Eye size={14}/>관람하기</button>
            </div>
        )}
      </div>
    </div>
  );
}

