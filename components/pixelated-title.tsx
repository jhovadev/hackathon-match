'use client';

export function PixelatedTitle() {
  const text = 'HACKATHON PARTICIPANTS';
  
  return (
    <div className="relative inline-block">
      <div className="absolute inset-0 pixel-grid-overlay opacity-10" />
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-widest uppercase relative z-10 select-none">
        {text.split('').map((char, i) => (
          <span 
            key={i} 
            className="inline-block transition-all duration-100 hover:scale-110"
            style={{
              textShadow: char !== ' ' ? '3px 3px 0px hsl(var(--muted-foreground) / 0.3)' : 'none',
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </h1>
    </div>
  );
}
