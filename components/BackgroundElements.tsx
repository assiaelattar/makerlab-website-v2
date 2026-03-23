import React from 'react';
import { 
  Settings, Code2, Cpu, Printer, Shapes, Box, 
  Binary, Terminal, Microscope, Wrench, Compass, 
  Database, Hexagon, Component 
} from 'lucide-react';

export const BackgroundElements: React.FC = () => {
  // Array of icon configurations to scatter across the screen
  const elements = [
    { id: 1, Icon: Settings, top: '10%', left: '5%', size: 48, anim: 'animate-drift', delay: '0s', styleClass: 'opacity-20 text-brand-red' },
    { id: 2, Icon: Code2, top: '25%', left: '85%', size: 64, anim: 'animate-[drift-reverse]', delay: '1s', styleClass: 'opacity-20 text-brand-blue' },
    { id: 3, Icon: Cpu, top: '40%', left: '15%', size: 56, anim: 'animate-drift', delay: '2s', styleClass: 'opacity-20 text-black' },
    { id: 4, Icon: Printer, top: '60%', left: '80%', size: 72, anim: 'animate-[drift-reverse]', delay: '0.5s', styleClass: 'opacity-20 text-brand-green' },
    { id: 5, Icon: Shapes, top: '75%', left: '10%', size: 40, anim: 'animate-drift', delay: '3s', styleClass: 'opacity-20 text-brand-orange' },
    { id: 6, Icon: Box, top: '85%', left: '70%', size: 50, anim: 'animate-[drift-reverse]', delay: '1.5s', styleClass: 'opacity-15 text-black' },
    { id: 7, Icon: Binary, top: '15%', left: '40%', size: 60, anim: 'animate-drift', delay: '4s', styleClass: 'opacity-20 text-brand-blue' },
    { id: 8, Icon: Terminal, top: '80%', left: '45%', size: 48, anim: 'animate-[drift-reverse]', delay: '2.5s', styleClass: 'opacity-20 text-brand-red' },
    { id: 9, Icon: Microscope, top: '35%', left: '60%', size: 64, anim: 'animate-drift', delay: '3.5s', styleClass: 'opacity-20 text-brand-green' },
    { id: 10, Icon: Wrench, top: '55%', left: '5%', size: 40, anim: 'animate-[drift-reverse]', delay: '0.8s', styleClass: 'opacity-15 text-black' },
    { id: 11, Icon: Compass, top: '5%', left: '70%', size: 55, anim: 'animate-drift', delay: '2.2s', styleClass: 'opacity-20 text-brand-red' },
    { id: 12, Icon: Database, top: '50%', left: '40%', size: 70, anim: 'animate-[drift-reverse]', delay: '1.2s', styleClass: 'opacity-15 text-black' },
    { id: 13, Icon: Hexagon, top: '90%', left: '25%', size: 65, anim: 'animate-drift', delay: '4.5s', styleClass: 'opacity-20 text-brand-blue' },
    { id: 14, Icon: Component, top: '20%', left: '25%', size: 50, anim: 'animate-[drift-reverse]', delay: '2.8s', styleClass: 'opacity-20 text-brand-orange' },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {elements.map((el) => {
        const Icon = el.Icon;
        return (
          <div 
            key={el.id}
            className={`absolute ${el.anim} ${el.styleClass} mix-blend-multiply`}
            style={{ 
              top: el.top, 
              left: el.left, 
              animationDelay: el.delay,
              // Randomize duration slightly to feel more organic
              animationDuration: el.anim.includes('reverse') ? '45s' : '35s'
            }}
          >
            <Icon size={el.size} strokeWidth={2} />
          </div>
        );
      })}
    </div>
  );
};
