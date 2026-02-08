
import React from 'react';

interface CTAProps {
  title: string;
  subtitle?: string;
  image: string;
  buttonText: string;
}

const CallToActionR2: React.FC<CTAProps> = ({ title, subtitle, image, buttonText }) => {
  return (
    <div className="relative h-[450px] w-full flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-fixed bg-center"
        style={{ backgroundImage: `url("${image}")` }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      <div className="relative container mx-auto px-6 text-center text-white z-10">
        <h2 className="font-serif text-4xl md:text-5xl mb-6 tracking-wide drop-shadow-md">{title}</h2>
        {subtitle && (
           <p className="max-w-xl mx-auto text-sm opacity-80 mb-10 leading-relaxed font-light">{subtitle}</p>
        )}
        <button className="px-10 py-3 border border-white/50 text-white text-[10px] uppercase tracking-[0.3em] hover:bg-white hover:text-hotel-dark transition-all rounded-sm backdrop-blur-sm">
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default CallToActionR2;
