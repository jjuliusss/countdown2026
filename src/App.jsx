import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Music, Upload, Play, Pause, RefreshCw, Calendar as CalendarIcon, Volume2, VolumeX, Heart, Trash2, ShoppingBag, Sparkles, ShoppingCart } from 'lucide-react';

/**
 * UTILS & CONSTANTS
 */

// Ngày Mùng 1 Tết Bính Ngọ 2026 (Dương lịch)
const TET_DATE_2026 = new Date('2026-02-17T00:00:00');

const KEY_MILESTONES = {
  NORMAL: 'normal',
  SHOPPING_JAN: 'shopping_jan', // 17/1
  SPA_JAN: 'spa_jan',           // 21/1
  SHOPPING_TET: 'shopping_tet', // 7/2 (20 Âm - Sắm Tết)
  VALENTINE: 'valentine',       // 14/02
  NEAR_TET: 'near_tet',         // Các ngày cận tết khác
  ONG_TAO: 'ong_tao',           // 23 âm
  GIAO_THUA: 'giao_thua',       // 30 tết
  TET: 'tet',                   // Mùng 1
};

const getDaysRemaining = (currentDate) => {
  const diffTime = TET_DATE_2026 - currentDate;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Hàm tạo số ngẫu nhiên cố định theo ngày
const seedRandom = (date) => {
  if (!date) return 0; // Safety check
  return date.getDate() + date.getMonth() * 31 + date.getFullYear() * 365;
};

// Hàm lấy Style cho ngày hiện tại
const getDailyStyle = (date, theme) => {
  const seed = seedRandom(date);
  
  const bgColors = [
    'from-blue-200 to-blue-400', 
    'from-green-200 to-green-400', 
    'from-yellow-200 to-yellow-400', 
    'from-purple-200 to-purple-400', 
    'from-indigo-200 to-indigo-400', 
    'from-pink-200 to-pink-400', 
    'from-teal-200 to-teal-400', 
    'from-orange-200 to-orange-400'
  ];
  
  const calendarColors = [
    'bg-white', 'bg-yellow-50', 'bg-blue-50', 'bg-green-50', 'bg-pink-50', 'bg-orange-50'
  ];

  // Danh sách ảnh nền Tết chung
  const tetImages = [
      'https://images.unsplash.com/photo-lr3uki9wn3I?w=600&q=80', // Lucky Bamboo
      'https://images.unsplash.com/photo-A9PwZPCsRUY?w=600&q=80', // Red Vase
      'https://images.unsplash.com/photo-YpQlqqEG4T0?w=600&q=80', // Red Box
      'https://images.unsplash.com/photo-ZZ8kHT3XgOw?w=600&q=80', // Family at Archway
      'https://images.unsplash.com/photo-EDsfwwNUYYU?w=600&q=80', // Red Envelope
      'https://images.unsplash.com/photo-7D6ZA7wxHQ8?w=600&q=80', // Couple
      'bg-gradient-to-br from-red-500 to-orange-500', 
      'https://images.unsplash.com/photo-bLOBGp8sCv4?w=600&q=80'  // Kite flying
  ];

  // Ảnh riêng cho ngày 7/2 (Sắm Tết: Giỏ hàng, Hoa mai, Bánh chưng/đồ ăn)
  const shoppingTetImages = [
      'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80', // Shopping/Gift
      'https://images.unsplash.com/photo-1549887534-1541e9326642?w=600&q=80', // Hoa mai (Apricot Blossom)
      'https://images.unsplash.com/photo-1549488352-257a965f9525?w=600&q=80', // Bánh chưng/Food vibe
      'https://images.unsplash.com/photo-1512909006721-3d6018887383?w=600&q=80'  // Festive shopping
  ];

  // Logic chọn style
  if (theme === KEY_MILESTONES.SHOPPING_JAN) {
      // 17/1: Màu vàng nền, icon shopping
      return {
          appBg: 'bg-gradient-to-b from-yellow-200 to-yellow-400',
          calendarBg: 'bg-yellow-300',
          isImage: false,
          imageSrc: null,
          textColor: 'text-yellow-900',
          borderColor: 'border-yellow-600',
          overlayGradient: ''
      };
  } else if (theme === KEY_MILESTONES.SPA_JAN) {
      // 21/1: Màu hồng, icon làm đẹp
      return {
          appBg: 'bg-gradient-to-b from-pink-200 to-purple-300',
          calendarBg: 'bg-pink-200',
          isImage: false,
          imageSrc: null,
          textColor: 'text-pink-800',
          borderColor: 'border-pink-400',
          overlayGradient: ''
      };
  } else if (theme === KEY_MILESTONES.SHOPPING_TET) {
      // 7/2: Màu Vàng Gold, hình giỏ hàng/hoa mai/bánh chưng
      const img = shoppingTetImages[seed % shoppingTetImages.length];
      return {
          appBg: 'bg-gradient-to-b from-yellow-600 to-red-700',
          calendarBg: 'bg-yellow-500', // Gold color
          isImage: true,
          imageSrc: img,
          textColor: 'text-red-900', // Chữ đỏ trên nền vàng gold
          borderColor: 'border-red-700',
          overlayGradient: 'bg-gradient-to-t from-yellow-500/90 via-yellow-400/50 to-transparent'
      };
  } else if (theme === KEY_MILESTONES.VALENTINE) {
      // 14/2: Màu hồng đẹp mắt hơn
      return {
          appBg: 'bg-gradient-to-b from-rose-400 to-pink-600',
          calendarBg: 'bg-gradient-to-br from-pink-200 via-pink-300 to-rose-300', // Gradient nền lịch
          isImage: false, 
          imageSrc: null,
          textColor: 'text-rose-900',
          borderColor: 'border-rose-500',
          overlayGradient: ''
      };
  } else if ([KEY_MILESTONES.NEAR_TET, KEY_MILESTONES.ONG_TAO, KEY_MILESTONES.GIAO_THUA, KEY_MILESTONES.TET].includes(theme)) {
      // TẾT Cổ Truyền
      const selectedTheme = tetImages[seed % tetImages.length];
      const isUrl = selectedTheme.startsWith('http');
      return {
          appBg: 'bg-gradient-to-b from-red-900 to-slate-900',
          calendarBg: 'bg-red-600',
          isImage: isUrl,
          imageSrc: isUrl ? selectedTheme : null,
          textColor: 'text-yellow-300',
          borderColor: 'border-yellow-500',
          overlayGradient: 'bg-gradient-to-t from-red-900/90 via-red-800/60 to-transparent'
      };
  } else {
      // Ngày thường
      return {
          appBg: `bg-gradient-to-b ${bgColors[seed % bgColors.length]}`,
          calendarBg: calendarColors[seed % calendarColors.length],
          isImage: false,
          imageSrc: null,
          textColor: 'text-gray-800',
          borderColor: 'border-blue-600',
          overlayGradient: ''
      };
  }
};

const getLunarDateString = (date) => {
  if (!date) return "";
  const tetTime = TET_DATE_2026.getTime();
  const currentTime = date.getTime();
  const diffDays = Math.ceil((tetTime - currentTime) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "01/01 (Mùng 1)";
  
  if (diffDays > 0) {
      const lunarDay = 30 - diffDays; 
      if (lunarDay < 1) return `${30 + lunarDay}/11 Âm lịch`;
      return `${lunarDay}/12 (Âm lịch)`;
  }
  
  const lunarDay = Math.abs(diffDays) + 1;
  return `${lunarDay < 10 ? '0' + lunarDay : lunarDay}/01 (Tết)`;
};

const getThemeStatus = (date, daysRemaining) => {
  if (!date) return KEY_MILESTONES.NORMAL;
  const month = date.getMonth(); // 0 = Jan, 1 = Feb
  const day = date.getDate();

  // Các mốc mới
  if (month === 0 && day === 17) return KEY_MILESTONES.SHOPPING_JAN;
  if (month === 0 && day === 21) return KEY_MILESTONES.SPA_JAN;
  if (month === 1 && day === 7) return KEY_MILESTONES.SHOPPING_TET;
  if (month === 1 && day === 14) return KEY_MILESTONES.VALENTINE;

  // Các mốc Tết cũ
  if (daysRemaining <= 0) return KEY_MILESTONES.TET;
  if (daysRemaining === 1) return KEY_MILESTONES.GIAO_THUA;
  if (daysRemaining === 7) return KEY_MILESTONES.ONG_TAO; 
  if (daysRemaining <= 11) return KEY_MILESTONES.NEAR_TET; 
  return KEY_MILESTONES.NORMAL;
};

const getDayName = (date) => {
  if (!date) return "";
  const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  return days[date.getDay()];
};

const formatDate = (date) => {
  if (!date) return "";
  return `Ngày ${date.getDate()} tháng ${date.getMonth() + 1}`;
};

/**
 * COMPONENT: FIREWORKS (V2)
 */
const Fireworks = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    let fireworks = [];
    let particles = [];
    let hue = 120;
    let timerTotal = 40; 
    let timerTick = 0;
    
    const random = (min, max) => Math.random() * (max - min) + min;
    const calculateDistance = (p1x, p1y, p2x, p2y) => Math.sqrt(Math.pow(p1x - p2x, 2) + Math.pow(p1y - p2y, 2));

    class Firework {
      constructor(sx, sy, tx, ty) {
        this.x = sx;
        this.y = sy;
        this.sx = sx;
        this.sy = sy;
        this.tx = tx;
        this.ty = ty;
        this.distanceToTarget = calculateDistance(sx, sy, tx, ty);
        this.distanceTraveled = 0;
        this.coordinates = [];
        this.coordinateCount = 3;
        while (this.coordinateCount--) {
          this.coordinates.push([this.x, this.y]);
        }
        this.angle = Math.atan2(ty - sy, tx - sx);
        this.speed = 2;
        this.acceleration = 1.03; 
        this.brightness = random(60, 80);
      }

      update(index) {
        this.coordinates.pop();
        this.coordinates.unshift([this.x, this.y]);

        this.speed *= this.acceleration;
        const vx = Math.cos(this.angle) * this.speed;
        const vy = Math.sin(this.angle) * this.speed;
        
        this.distanceTraveled = calculateDistance(this.sx, this.sy, this.x + vx, this.y + vy);

        if (this.distanceTraveled >= this.distanceToTarget) {
          createParticles(this.tx, this.ty);
          fireworks.splice(index, 1);
        } else {
          this.x += vx;
          this.y += vy;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = `hsl(${hue}, 100%, ${this.brightness}%)`;
        ctx.stroke();
      }
    }

    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.coordinates = [];
        this.coordinateCount = 6; 
        while (this.coordinateCount--) {
          this.coordinates.push([this.x, this.y]);
        }
        
        this.angle = random(0, Math.PI * 2);
        this.speed = random(2, 12); 
        this.friction = 0.93; 
        this.gravity = 0.8; 
        this.hue = random(hue - 50, hue + 50);
        this.brightness = random(50, 80);
        this.alpha = 1;
        this.decay = random(0.005, 0.015); 
        this.flicker = Math.random() > 0.5;
      }

      update(index) {
        this.coordinates.pop();
        this.coordinates.unshift([this.x, this.y]);
        
        this.speed *= this.friction;
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed + this.gravity;
        
        this.alpha -= this.decay;

        if (this.flicker) this.brightness = random(50, 100);

        if (this.alpha <= this.decay) {
          particles.splice(index, 1);
        }
      }

      draw() {
        ctx.beginPath();
        ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`;
        ctx.lineWidth = 1.5; 
        ctx.stroke();
      }
    }

    function createParticles(x, y) {
      let particleCount = 120; 
      while (particleCount--) {
        particles.push(new Particle(x, y));
      }
    }

    const loop = () => {
      requestAnimationFrame(loop);
      hue += 0.2; 

      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'; 
      ctx.fillRect(0, 0, width, height);
      
      ctx.globalCompositeOperation = 'lighter';

      let i = fireworks.length;
      while (i--) {
        fireworks[i].draw();
        fireworks[i].update(i);
      }

      let j = particles.length;
      while (j--) {
        particles[j].draw();
        particles[j].update(j);
      }

      if (timerTick >= timerTotal) {
        fireworks.push(new Firework(width / 2, height, random(width * 0.2, width * 0.8), random(height * 0.1, height * 0.5)));
        timerTick = 0;
      } else {
        timerTick++;
      }
    };

    const handleClick = (e) => {
        fireworks.push(new Firework(width / 2, height, e.clientX, e.clientY));
    };

    canvas.addEventListener('click', handleClick);
    loop();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      width = window.innerWidth;
      height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => {
        window.removeEventListener('resize', handleResize);
        canvas.removeEventListener('click', handleClick);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 cursor-pointer" />;
};

/**
 * COMPONENT: TEARABLE CALENDAR LEAF
 */
const CalendarLeaf = ({ date, daysRemaining, theme, onTear, isTop }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isTorn, setIsTorn] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e) => {
    if (!isTop || isTorn) return;
    setIsDragging(true);
    startPos.current = { x: e.clientX || e.touches[0].clientX, y: e.clientY || e.touches[0].clientY };
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;
    const deltaX = clientX - startPos.current.x;
    const deltaY = clientY - startPos.current.y;
    setPosition({ x: deltaX, y: deltaY });
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const distance = Math.sqrt(position.x ** 2 + position.y ** 2);
    if (distance > 150) {
      setIsTorn(true);
      setTimeout(() => {
        onTear(); 
      }, 300);
    } else {
      setPosition({ x: 0, y: 0 });
    }
  };

  if (!isTop) {
     return (
        <div className={`absolute top-0 left-0 w-full h-full rounded-lg shadow-xl flex flex-col items-center justify-between p-6 transform scale-95 translate-y-2 -z-10 bg-gray-100 border border-gray-200`}>
             <div className="text-gray-300 font-bold text-6xl">...</div>
        </div>
     );
  }

  const style = getDailyStyle(date, theme);

  const getLeafClasses = () => {
    let classes = `${style.calendarBg} ${style.textColor} border-t-8 border-x-4 border-b-4`;
    
    if (theme === KEY_MILESTONES.VALENTINE) classes += ` ${style.borderColor} shadow-2xl shadow-rose-900/30`;
    else if (theme === KEY_MILESTONES.SHOPPING_JAN) classes += ` ${style.borderColor} shadow-2xl shadow-yellow-900/20`;
    else if (theme === KEY_MILESTONES.SPA_JAN) classes += ` ${style.borderColor} shadow-2xl shadow-pink-900/20`;
    else if (theme === KEY_MILESTONES.SHOPPING_TET) classes += ` ${style.borderColor} shadow-[0_20px_50px_rgba(0,0,0,0.4)]`;
    else if ([KEY_MILESTONES.NEAR_TET, KEY_MILESTONES.ONG_TAO, KEY_MILESTONES.GIAO_THUA, KEY_MILESTONES.TET].includes(theme)) {
        classes += ` ${style.borderColor} shadow-[0_20px_50px_rgba(0,0,0,0.5)]`;
    } else {
        classes += " border-blue-600 shadow-2xl";
    }
    
    return classes;
  };

  const getFooterText = () => {
    if (theme === KEY_MILESTONES.VALENTINE) return "Happy Valentine's Day";
    if (theme === KEY_MILESTONES.SHOPPING_JAN) return "Shopping Mặc Tết";
    if (theme === KEY_MILESTONES.SPA_JAN) return "Spa Thư Giãn";
    if (theme === KEY_MILESTONES.SHOPPING_TET) return "Sắm Sửa Quà Tết";
    if (daysRemaining === 0) return "CHÚC MỪNG NĂM MỚI";
    if (daysRemaining === 7) return "ĐƯA ÔNG TÁO VỀ TRỜI";
    if (daysRemaining === 1) return "GIAO THỪA";
    return `Countdown ${daysRemaining} ngày nữa thoaiii`;
  };

  return (
    <div
      className={`absolute top-0 left-0 w-full h-full rounded-lg flex flex-col items-center justify-between p-6 select-none cursor-grab active:cursor-grabbing transition-transform duration-200 overflow-hidden touch-none ${getLeafClasses()} ${isTorn ? 'opacity-0 pointer-events-none transition-all duration-500 ease-out' : ''}`}
      style={{
        transform: isTorn 
            ? `translate(${position.x * 1.5}px, ${position.y * 1.5}px) rotate(${position.x * 0.1}deg)` 
            : `translate(${position.x}px, ${position.y}px) rotate(${position.x * 0.05}deg)`,
        zIndex: 10
      }}
      onMouseDown={handlePointerDown}
      onMouseMove={handlePointerMove}
      onMouseUp={handlePointerUp}
      onMouseLeave={handlePointerUp}
      onTouchStart={handlePointerDown}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerUp}
    >
      {/* Background Image Overlay if needed */}
      {style.isImage && (
        <>
            <div 
                className="absolute inset-0 bg-cover bg-center opacity-30 pointer-events-none mix-blend-multiply" 
                style={{backgroundImage: `url(${style.imageSrc})`}}
            />
            <div className={`absolute inset-0 pointer-events-none ${style.overlayGradient}`} />
        </>
      )}

      {/* Holes for binding */}
      <div className="relative z-10 w-full">
        <div className="absolute -top-4 w-full flex justify-between px-12">
            <div className="w-4 h-4 rounded-full bg-gray-800 opacity-20"></div>
            <div className="w-4 h-4 rounded-full bg-gray-800 opacity-20"></div>
        </div>
      </div>

      <div className="mt-8 text-center relative z-10">
        <p className="text-xl uppercase tracking-widest opacity-80 font-semibold">{formatDate(date)}</p>
        <p className="text-sm font-medium opacity-70">{date.getFullYear()}</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative z-10">
        <h1 className={`text-[8rem] leading-none font-bold drop-shadow-md`}>
          {date.getDate()}
        </h1>
        <h2 className="text-2xl font-bold uppercase mt-2 opacity-90">{getDayName(date)}</h2>
        
        {/* LUNAR DATE ADDITION */}
        <div className="mt-2 px-4 py-1 rounded-full bg-black/20 text-current font-serif text-lg backdrop-blur-sm border border-current/20">
            {getLunarDateString(date)}
        </div>
      </div>

      <div className="w-full text-center border-t border-current border-opacity-30 pt-4 relative z-10">
        <p className="font-serif italic text-lg opacity-90">{getFooterText()}</p>
        
        {/* ICONS FOR MILESTONES */}
        {theme === KEY_MILESTONES.SHOPPING_JAN && (
           <div className="mt-2 text-yellow-800 font-bold text-sm flex items-center justify-center gap-2 animate-bounce">
               <ShoppingBag size={20} /> Đi Shopping
           </div>
        )}
        {theme === KEY_MILESTONES.SPA_JAN && (
           <div className="mt-2 text-pink-600 font-bold text-sm flex items-center justify-center gap-2 animate-pulse">
               <Sparkles size={20} /> Spa & Làm Đẹp
           </div>
        )}
        {theme === KEY_MILESTONES.SHOPPING_TET && (
           <div className="mt-2 text-red-900 font-bold text-sm flex items-center justify-center gap-2 animate-bounce">
               <ShoppingCart size={20} /> Sắm Tết
           </div>
        )}
        {theme === KEY_MILESTONES.ONG_TAO && (
           <div className="mt-2 text-yellow-300 font-bold text-sm flex items-center justify-center gap-2 animate-pulse">
               🐟 Tiễn Ông Táo
           </div>
        )}
        {theme === KEY_MILESTONES.VALENTINE && (
           <div className="mt-2 text-rose-600 font-bold text-sm flex items-center justify-center gap-2 animate-pulse">
               <Heart size={20} fill="currentColor" /> Lễ Tình Nhân
           </div>
        )}
      </div>

      {!isDragging && !isTorn && (
        <div className="absolute bottom-2 right-2 opacity-50 text-xs animate-bounce z-10 font-bold">
          Kéo để xé 
        </div>
      )}
    </div>
  );
};

/**
 * COMPONENT: AUDIO PLAYER
 */
const AudioPlayer = ({ isPlaying, userAudioSrc, defaultAudioSrc }) => {
  const audioRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
        if (isPlaying) {
            audioRef.current.play().catch(e => console.log("Autoplay prevented:", e));
        } else {
            audioRef.current.pause();
        }
    }
  }, [isPlaying]);

  const toggleMute = () => {
    if (audioRef.current) {
        audioRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 bg-white/80 backdrop-blur p-2 rounded-full shadow-lg">
      <audio ref={audioRef} src={userAudioSrc || defaultAudioSrc} loop />
      <button onClick={toggleMute} className="p-2 rounded-full hover:bg-gray-200">
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>
    </div>
  );
};

/**
 * COMPONENT: MAIN APP
 */
export default function TetCountdownApp() {
  const [currentDate, setCurrentDate] = useState(new Date()); 
  const [daysRemaining, setDaysRemaining] = useState(getDaysRemaining(new Date()));
  const [theme, setTheme] = useState(KEY_MILESTONES.NORMAL);
  const [audioSrc, setAudioSrc] = useState("https://res.cloudinary.com/dqgsuqakp/video/upload/v1768275984/TET_c6qbla.mp3"); 
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Derived style for the whole app background
  const dailyStyle = getDailyStyle(currentDate, theme);

  // Tính ngày kế tiếp cho tờ lịch nền
  const nextDay = useMemo(() => {
    const d = new Date(currentDate);
    d.setDate(currentDate.getDate() + 1);
    return d;
  }, [currentDate]);

  // --- NEW: Load saved audio from localStorage on Mount ---
  useEffect(() => {
    try {
      const savedAudio = localStorage.getItem('userTetAudio');
      if (savedAudio) {
        setAudioSrc(savedAudio);
      }
    } catch (error) {
      console.error("Failed to load audio from storage:", error);
    }
  }, []);

  useEffect(() => {
    const days = getDaysRemaining(currentDate);
    setDaysRemaining(days);
    setTheme(getThemeStatus(currentDate, days));
    
    // Auto play music from Feb 14 (3 days before Tet)
    if (days <= 3) {
        setIsPlaying(true);
    }
  }, [currentDate]);

  const handleTear = () => {
    setCurrentDate(nextDay);
  };

  const renderDecorations = () => {
     if (theme === KEY_MILESTONES.NORMAL) return null;
     
     if (theme === KEY_MILESTONES.TET) {
         return <Fireworks />;
     }

     if (theme === KEY_MILESTONES.VALENTINE) {
        return (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 text-pink-500 opacity-40 animate-bounce text-6xl">❤️</div>
                <div className="absolute bottom-20 right-20 text-red-500 opacity-40 animate-pulse text-8xl">❤️</div>
                <div className="absolute top-1/2 left-1/4 text-white opacity-20 text-9xl transform -rotate-12">Love</div>
                
                {[...Array(10)].map((_, i) => (
                    <div key={i} className="absolute text-pink-600 opacity-30 text-4xl animate-pulse" 
                         style={{
                             top: `${Math.random() * 100}%`,
                             left: `${Math.random() * 100}%`,
                             animationDelay: `${Math.random() * 2}s`
                         }}>
                        ♥
                    </div>
                ))}
            </div>
        );
     }

     return (
         <div className="absolute inset-0 overflow-hidden pointer-events-none">
             <div className="absolute top-0 left-0 text-yellow-400 opacity-60 transform -translate-x-1/4 -translate-y-1/4 text-9xl">🌸</div>
             <div className="absolute top-20 right-10 text-pink-300 opacity-60 text-6xl animate-pulse">🌸</div>
             <div className="absolute bottom-0 right-0 text-yellow-400 opacity-60 transform translate-x-1/4 translate-y-1/4 text-[12rem]">🌸</div>
             
             <div className="absolute top-0 left-10 w-1 h-32 bg-yellow-600/50">
                <div className="absolute bottom-0 -left-6 w-12 h-16 bg-red-600 rounded-lg shadow-lg shadow-yellow-500/50 flex items-center justify-center animate-bounce">
                    <span className="text-yellow-400 text-xs font-bold border border-yellow-400 p-1 rounded-full">福</span>
                </div>
             </div>
             <div className="absolute top-0 right-20 w-1 h-24 bg-yellow-600/50">
                <div className="absolute bottom-0 -left-6 w-12 h-16 bg-red-600 rounded-lg shadow-lg shadow-yellow-500/50 flex items-center justify-center animate-bounce" style={{animationDelay: '0.5s'}}>
                    <span className="text-yellow-400 text-xs font-bold border border-yellow-400 p-1 rounded-full">禄</span>
                </div>
             </div>
         </div>
     );
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size limit (3.5MB ~ 3670016 bytes to be safe for localStorage)
      const LIMIT_MB = 3.5; 
      if (file.size > LIMIT_MB * 1024 * 1024) {
          alert(`File quá lớn! Vui lòng chọn file nhỏ hơn ${LIMIT_MB}MB để lưu trữ.`);
          return;
      }

      const reader = new FileReader();
      
      reader.onload = (event) => {
        const base64String = event.target.result;
        setAudioSrc(base64String);
        
        try {
            localStorage.setItem('userTetAudio', base64String);
            alert("Đã tải và lưu nhạc thành công!");
        } catch (error) {
            console.error(error);
            alert("Không thể lưu file (Bộ nhớ trình duyệt đã đầy).");
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const handleResetAudio = () => {
      localStorage.removeItem('userTetAudio');
      setAudioSrc("https://res.cloudinary.com/dqgsuqakp/video/upload/v1768275984/TET_c6qbla.mp3");
      alert("Đã đặt lại nhạc mặc định");
  };

  const timeTravelTo = (milestone) => {
    let target = new Date();
    switch(milestone) {
        case 'NOW': target = new Date(); break;
        case 'SHOPPING': target = new Date('2026-01-17T00:00:00'); break; // 17/1
        case 'SPA': target = new Date('2026-01-21T00:00:00'); break; // 21/1
        case 'SHOP_TET': target = new Date('2026-02-07T00:00:00'); break; // 7/2
        case 'VALENTINE': target = new Date('2026-02-14T00:00:00'); break; // 14/2
        case '23_AM': target = new Date('2026-02-10T00:00:00'); break; 
        case 'TET': target = new Date('2026-02-17T00:00:00'); break; 
    }
    setCurrentDate(target);
    setShowSettings(false);
  };

  return (
    <div className={`relative w-full h-screen overflow-hidden flex flex-col items-center justify-center transition-colors duration-1000 select-none touch-none pt-[env(safe-area-inset-top)] ${dailyStyle.appBg}`}>
      {/* Mobile Styles Injection */}
      <style>{`
        body {
          overscroll-behavior: none;
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          user-select: none;
        }
      `}</style>

      {renderDecorations()}

      {theme !== KEY_MILESTONES.TET && (
        <div className="relative z-10 w-80 h-96 md:w-96 md:h-[30rem] perspective-1000">
           {/* Đã truyền props đầy đủ cho tờ lịch nền để tránh crash */}
           <CalendarLeaf isTop={false} date={nextDay} theme={theme} />
           
           <CalendarLeaf 
              key={currentDate.toISOString()} 
              date={currentDate} 
              daysRemaining={daysRemaining} 
              theme={theme}
              onTear={handleTear}
              isTop={true}
           />
        </div>
      )}

      {theme === KEY_MILESTONES.TET && (
          <div className="absolute top-1/4 z-20 text-center animate-bounce pointer-events-none">
              <h1 className="text-6xl md:text-8xl font-bold text-yellow-400 drop-shadow-[0_5px_5px_rgba(255,0,0,0.8)] stroke-red-800" 
                  style={{ textShadow: '2px 2px 0 #d00, -1px -1px 0 #d00, 1px -1px 0 #d00, -1px 1px 0 #d00, 1px 1px 0 #d00' }}>
                  CHÚC MỪNG<br/>NĂM MỚI
              </h1>
              <p className="text-white text-xl mt-4 font-serif italic">Xuân Bính Ngọ 2026</p>
          </div>
      )}

      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
         {showSettings && (
             <div className="bg-white p-4 rounded-lg shadow-xl mb-2 animate-fade-in w-64">
                 <h3 className="font-bold text-gray-700 mb-2 border-b pb-1">Cài đặt nhạc</h3>
                 <div className="flex gap-2 mb-4">
                     <label className="flex-1 flex items-center gap-2 cursor-pointer bg-blue-100 p-2 rounded hover:bg-blue-200 text-sm">
                         <Upload size={16} />
                         <span>Tải nhạc (max 3.5MB)</span>
                         <input type="file" accept="audio/*" className="hidden" onChange={handleFileUpload} />
                     </label>
                     <button onClick={handleResetAudio} className="p-2 bg-red-100 hover:bg-red-200 rounded text-red-600" title="Xóa nhạc đã lưu">
                        <Trash2 size={16} />
                     </button>
                 </div>

                 <h3 className="font-bold text-gray-700 mb-2 border-b pb-1">Cỗ máy thời gian</h3>
                 <div className="grid grid-cols-2 gap-2 text-xs">
                     <button onClick={() => timeTravelTo('NOW')} className="bg-blue-100 hover:bg-blue-200 p-2 rounded text-blue-800">Hiện tại</button>
                     <button onClick={() => timeTravelTo('SHOPPING')} className="bg-yellow-100 hover:bg-yellow-200 p-2 rounded text-yellow-800">🛍️ 17/1</button>
                     <button onClick={() => timeTravelTo('SPA')} className="bg-pink-100 hover:bg-pink-200 p-2 rounded text-pink-800">✨ 21/1</button>
                     <button onClick={() => timeTravelTo('SHOP_TET')} className="bg-orange-100 hover:bg-orange-200 p-2 rounded text-orange-800">🛒 7/2</button>
                     <button onClick={() => timeTravelTo('VALENTINE')} className="bg-rose-100 hover:bg-rose-200 p-2 rounded text-rose-800">❤️ 14/2</button>
                     <button onClick={() => timeTravelTo('23_AM')} className="bg-yellow-100 hover:bg-yellow-200 p-2 rounded text-yellow-800">23 Âm</button>
                     <button onClick={() => timeTravelTo('TET')} className="bg-red-100 hover:bg-red-200 p-2 rounded text-red-800 col-span-2 font-bold">💥 Mùng 1 Tết</button>
                 </div>
             </div>
         )}
         
         <button 
            onClick={() => setShowSettings(!showSettings)}
            className="bg-white/90 p-3 rounded-full shadow-lg hover:scale-110 transition text-gray-700"
            title="Cài đặt"
         >
            <Music size={24} />
         </button>
      </div>

      <AudioPlayer isPlaying={isPlaying} userAudioSrc={audioSrc} defaultAudioSrc={audioSrc} />

      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 text-white/50 text-xs pointer-events-none">
          {daysRemaining > 0 ? "Xé lịch để đếm ngược" : ""}
      </div>

    </div>
  );
}
