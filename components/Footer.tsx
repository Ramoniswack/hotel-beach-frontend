import Image from 'next/image';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="relative bg-[#1a1a1a] pt-24 pb-12 overflow-hidden">
      {/* Wave Decorative Divider - Flipped horizontally (slant opposite) */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] transform rotate-360 scale-x-[-1]">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-[calc(100%+1.3px)] h-[60px] fill-white"
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-24">
          {/* Our Address */}
          <div>
            <h4 className="text-white text-[11px] uppercase tracking-[0.3em] font-bold mb-10">OUR ADDRESS</h4>
            <div className="text-white/90 text-sm space-y-2.5 leading-relaxed">
              <p className="font-extrabold text-[15px] tracking-tight">Hoteller Beach Hotel</p>
              <p className="font-medium opacity-90">45 Santorini Station</p>
              <p className="font-medium opacity-90">Thira 150-0042</p>
            </div>
          </div>

          {/* Reservation */}
          <div>
            <h4 className="text-white text-[11px] uppercase tracking-[0.3em] font-bold mb-10">RESERVATION</h4>
            <div className="text-white/90 text-sm space-y-2.5 leading-relaxed font-medium">
              <p>Tel.: +41 (0)54 2344 00</p>
              <p>Fax: +41 (0)54 2344 99</p>
              <p>
                <a href="mailto:revs@hotellerbeach.com" className="text-hotel-gold border-b border-hotel-gold/50 hover:border-hotel-gold transition-colors pb-0.5">
                  revs@hotellerbeach.com
                </a>
              </p>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white text-[11px] uppercase tracking-[0.3em] font-bold mb-10">NEWSLETTER</h4>
            <form className="space-y-6 max-w-[260px]">
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="Your Email" 
                  className="w-full bg-transparent border-b border-white/20 pb-2 text-white text-[13px] outline-none focus:border-hotel-gold transition-colors font-medium placeholder:text-white/40"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-[#5fb2c1] hover:bg-[#4ea1af] text-white text-xs font-bold py-3.5 px-8 rounded-full transition-all duration-300 transform active:scale-95 shadow-lg"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* Awards */}
          <div>
            <h4 className="text-white text-[11px] uppercase tracking-[0.3em] font-bold mb-10">AWARDS</h4>
            <div className="flex items-center space-x-6">
              <Image 
                src="https://hoteller-beach.themegoods.com/wp-content/uploads/2017/08/logo-tripadvisor.png" 
                alt="TripAdvisor" 
                width={56}
                height={56}
                className="h-14 w-auto object-contain brightness-125" 
              />
              <Image 
                src="https://hoteller-beach.themegoods.com/wp-content/uploads/2017/08/logo-asean.png" 
                alt="ASEAN" 
                width={56}
                height={56}
                className="h-14 w-auto object-contain brightness-125" 
              />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/10 flex flex-col lg:flex-row justify-between items-center text-[11px] text-white/40 font-medium tracking-wide">
          <p>© Copyright Hoteller Theme Demo - Theme by ThemeGoods</p>
          <div className="flex items-center space-x-6 mt-6 lg:mt-0">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/rooms" className="hover:text-white transition-colors">Our Rooms</Link>
            <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            <a href="#" className="hover:text-white transition-colors">Terms and Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
