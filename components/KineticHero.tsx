import React from 'react';
import { Rocket, Cpu, Terminal, Zap } from 'lucide-react';

interface KineticBeltProps {
  images: string[];
  direction?: 'vertical' | 'horizontal';
  reverse?: boolean;
  speed?: string;
  className?: string;
}

const KineticBelt: React.FC<KineticBeltProps> = ({ 
  images, 
  direction = 'vertical', 
  reverse = false, 
  speed = '20s',
  className = ""
}) => {
  if (!images || images.length === 0) return null;
  
  // Multiply images to ensure enough content for the loop
  const displayImages = [...images, ...images];
  
  const animationClass = direction === 'vertical' ? 'animate-marquee-vertical' : 'animate-marquee';
  
  return (
    <div className={`relative overflow-hidden ${direction === 'vertical' ? 'h-full flex-col' : 'w-full flex-row'} flex ${className}`}>
      <div 
        className={`flex ${direction === 'vertical' ? 'flex-col' : 'flex-row'} gap-4 ${animationClass}`}
        style={{ animationDuration: speed, animationDirection: reverse ? 'reverse' : 'normal' }}
      >
        {displayImages.map((img, idx) => (
          <div 
            key={idx} 
            className={`${direction === 'vertical' ? 'w-full h-48' : 'h-full w-64'} shrink-0 border-4 border-black rounded-2xl overflow-hidden shadow-neo-sm`}
          >
            <img src={img} alt="MakerLab" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
      {/* Duplicate for seamless loop if needed - tailwind animation handles translate-100% */}
    </div>
  );
};

interface KineticHeroProps {
  images1?: string[];
  images2?: string[];
  images3?: string[];
}

export const KineticHero: React.FC<KineticHeroProps> = ({ images1 = [], images2 = [], images3 = [] }) => {
  return (
    <div className="relative w-full h-full flex flex-col md:flex-row gap-6 perspective-1000">
      
      {/* ZONE 1: ROBOTICS (Vertical Belt) */}
      <div className="flex-[1] hover:flex-[1.5] transition-all duration-500 ease-in-out group relative h-[400px] md:h-full bg-brand-red border-4 border-black rounded-3xl overflow-hidden shadow-neo-lg hover:shadow-none hover:translate-x-1 hover:translate-y-1">
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="h-full w-full p-4 flex flex-col justify-between relative z-10">
          <div className="flex justify-between items-start">
            <div className="bg-white border-2 border-black p-2 rounded-xl shadow-neo-sm group-hover:rotate-12 transition-transform">
              <Cpu className="text-black" size={24} strokeWidth={3} />
            </div>
            <span className="bg-black text-white text-[10px] font-black uppercase px-2 py-1 rotate-3 group-hover:rotate-0 transition-transform">Robotics</span>
          </div>
          
          <div className="flex-1 my-4 flex justify-center overflow-hidden">
            <KineticBelt images={images1} speed="15s" />
          </div>
          
          <div className="bg-white border-4 border-black p-3 transform -rotate-1 group-hover:rotate-0 transition-transform shadow-neo-sm">
            <h4 className="font-display font-black text-lg leading-none uppercase">Build Real Machines.</h4>
          </div>
        </div>
      </div>

      {/* ZONE 2: CODING (Central Focus) */}
      <div className="flex-[1.2] hover:flex-[1.8] transition-all duration-500 ease-in-out group relative h-[400px] md:h-full bg-brand-blue border-4 border-black rounded-3xl overflow-hidden shadow-neo-lg hover:shadow-none hover:translate-x-1 hover:translate-y-1">
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[linear-gradient(45deg,#000_25%,transparent_25%,transparent_50%,#000_50%,#000_75%,transparent_75%,transparent)] [background-size:24px_24px]"></div>
        
        <div className="h-full w-full p-6 flex flex-col justify-between relative z-10 text-white">
          <div className="flex justify-between items-start">
            <div className="bg-white border-2 border-black p-3 rounded-2xl shadow-neo-sm group-hover:-rotate-12 transition-transform">
              <Terminal className="text-black" size={32} strokeWidth={3} />
            </div>
            <div className="flex flex-col items-end">
              <span className="bg-brand-green border-2 border-black text-white text-xs font-black uppercase px-3 py-1 mb-2 shadow-neo-sm">Active Now</span>
              <span className="text-4xl">👨‍💻</span>
            </div>
          </div>
          
          <div className="flex-1 my-6 flex flex-col justify-center gap-4 overflow-hidden">
            <KineticBelt images={images2} direction="horizontal" speed="12s" className="h-32" />
            <KineticBelt images={images3} direction="horizontal" speed="18s" reverse className="h-32" />
          </div>
          
          <div className="bg-black border-4 border-white p-4 shadow-[4px_4px_0px_0px_white]">
            <h4 className="font-display font-black text-2xl leading-none uppercase italic underline decoration-brand-green underline-offset-4">Code Your World.</h4>
          </div>
        </div>
      </div>

      {/* ZONE 3: CREATIVE (Compact & Dynamic) */}
      <div className="flex-[1] hover:flex-[1.5] transition-all duration-500 ease-in-out group relative h-[400px] md:h-full bg-brand-orange border-4 border-black rounded-3xl overflow-hidden shadow-neo-lg hover:shadow-none hover:translate-x-1 hover:translate-y-1">
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_20px,#000_20px,#000_22px)]"></div>
        
        <div className="h-full w-full p-4 flex flex-col justify-between relative z-10">
          <div className="flex justify-between items-start">
            <div className="bg-white border-2 border-black p-2 rounded-xl shadow-neo-sm group-hover:scale-110 transition-transform">
              <Zap className="text-black" size={24} strokeWidth={3} />
            </div>
            <span className="bg-white border-2 border-black text-black text-[10px] font-black uppercase px-2 py-1 -rotate-6 group-hover:rotate-0 transition-transform">Design</span>
          </div>
          
          <div className="flex-1 my-4 flex flex-col justify-center overflow-hidden">
            <div className="grid grid-cols-2 gap-2">
              {images3.slice(0, 4).map((img, i) => (
                <div key={i} className="aspect-square border-2 border-black rounded-xl overflow-hidden shadow-neo-sm group-hover:scale-105 transition-transform delay-[i*100]ms">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-brand-green border-4 border-black p-3 text-white shadow-neo-sm group-hover:-translate-y-1 transition-transform">
            <h4 className="font-display font-black text-lg leading-none uppercase">Pure Creativity.</h4>
          </div>
        </div>
      </div>

      {/* Floating Interactive Badge (Magnetic Ticket) */}
      <div className="absolute -top-10 -left-6 md:-left-12 bg-white text-black border-4 border-black px-6 py-4 rounded-none transform -rotate-12 shadow-neo-xl hover:shadow-none hover:rotate-0 hover:translate-x-2 transition-all cursor-pointer z-30 hidden md:flex items-center gap-4 animate-float group/ticket">
        <div className="border-r-4 border-dashed border-gray-300 pr-6">
          <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Academy Pass</p>
          <p className="font-display font-black text-3xl leading-none">3H <span className="text-sm">MISSION</span></p>
        </div>
        <div className="flex flex-col items-center">
          <Rocket className="text-brand-red group-hover/ticket:scale-125 transition-transform" />
          <p className="font-black text-xs uppercase mt-1">Join</p>
        </div>
        
        {/* Ticket Notches */}
        <div className="absolute top-1/2 -left-3 w-6 h-6 rounded-full bg-white border-r-4 border-black transform -translate-y-1/2"></div>
        <div className="absolute top-1/2 -right-3 w-6 h-6 rounded-full bg-white border-l-4 border-black transform -translate-y-1/2"></div>
      </div>

    </div>
  );
};
