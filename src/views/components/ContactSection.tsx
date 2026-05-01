import { MapPin, Phone, Clock, Instagram, Facebook } from 'lucide-react';
import { Theme } from '../../models/types';
import { SectionHeader } from './SectionHeader';

export const ContactSection = ({ theme }: { theme: Theme }) => {
  return (
    <section id="contact" className={`py-16 md:py-24 ${theme === 'day' ? 'bg-white' : 'bg-stone-900'}`}>
      <div className="max-w-4xl mx-auto px-6">
          <SectionHeader title="VISIT THE 057" subtitle="GET IN TOUCH" theme={theme} />
          
          <div className="grid md:grid-cols-3 gap-10 mt-16">
              <div className="flex flex-col items-center text-center gap-4">
                <div className={`p-5 rounded-2xl shadow-sm ${theme === 'day' ? 'bg-stone-50 text-amber-700' : 'bg-stone-800 text-amber-400'}`}>
                  <MapPin size={32} />
                </div>
                <div>
                  <h4 className={`text-lg font-bold mb-2 ${theme === 'day' ? 'text-stone-900' : 'text-white'}`}>Location</h4>
                  <p className={`text-xs md:text-sm leading-relaxed ${theme === 'day' ? 'text-stone-500' : 'text-stone-400'}`}>
                    368 Stateway, Doorn<br/>Welkom, 9459
                  </p>
                  <a 
                    href="https://www.google.com/maps/dir/?api=1&destination=057+Caf%C3%A9+Grill+and+Lounge,+368+Stateway,+Doorn,+Welkom,+9459" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block text-amber-600 font-bold text-[10px] mt-3 underline hover:text-amber-700 transition-colors"
                  >
                    Get Directions
                  </a>
                </div>
              </div>

              <div className="flex flex-col items-center text-center gap-4">
                <div className={`p-5 rounded-2xl shadow-sm ${theme === 'day' ? 'bg-stone-50 text-amber-700' : 'bg-stone-800 text-amber-400'}`}>
                  <Phone size={32} />
                </div>
                <div>
                  <h4 className={`text-lg font-bold mb-2 ${theme === 'day' ? 'text-stone-900' : 'text-white'}`}>Direct Call</h4>
                  <a href="tel:+27722230708" className={`block text-base font-bold hover:text-amber-600 transition-colors ${theme === 'day' ? 'text-stone-900' : 'text-white'}`}>+27 72 223 0708</a>
                  <a href="mailto:bookings@057cafe.co.za" className={`block text-[10px] mt-1 hover:text-amber-600 transition-colors ${theme === 'day' ? 'text-stone-400' : 'text-stone-500'}`}>bookings@057cafe.co.za</a>
                </div>
              </div>

              <div className="flex flex-col items-center text-center gap-4">
                <div className={`p-5 rounded-2xl shadow-sm ${theme === 'day' ? 'bg-stone-50 text-amber-700' : 'bg-stone-800 text-amber-400'}`}>
                  <Clock size={32} />
                </div>
                <div>
                  <h4 className={`text-lg font-bold mb-2 ${theme === 'day' ? 'text-stone-900' : 'text-white'}`}>Trading Hours</h4>
                  <div className={`text-[10px] space-y-1 ${theme === 'day' ? 'text-stone-500' : 'text-stone-400'}`}>
                    <p><span className="font-bold">Mon-Thu:</span> 10:00 - 22:00</p>
                    <p><span className="font-bold">Fri-Sat:</span> 10:00 - 02:00</p>
                    <p><span className="font-bold">Sun:</span> 11:00 - 20:00</p>
                  </div>
                </div>
              </div>
          </div>

          <div className={`mt-16 w-full h-[300px] md:h-[400px] rounded-[2rem] overflow-hidden shadow-sm ${theme === 'day' ? 'bg-stone-100' : 'bg-stone-800 opacity-80'}`}>
            <iframe 
              src="https://maps.google.com/maps?q=057%20Caf%C3%A9%20Grill%20and%20Lounge,%20368%20Stateway,%20Doorn,%20Welkom,%209459&t=&z=15&ie=UTF8&iwloc=&output=embed" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={false} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          <div className={`mt-20 p-6 md:p-10 rounded-[3rem] text-center ${theme === 'day' ? 'bg-stone-50' : 'bg-stone-950'}`}>
             <h4 className={`text-xl md:text-2xl font-black mb-4 ${theme === 'day' ? 'text-stone-900' : 'text-white'}`}>Connect with the Culture</h4>
             <p className={`text-xs md:text-sm mb-8 ${theme === 'day' ? 'text-stone-600' : 'text-stone-400'}`}>Follow us on social media for daily specials and event announcements.</p>
             <div className="flex justify-center gap-6">
                <Instagram size={28} className="text-amber-600 hover:scale-110 transition-transform cursor-pointer" />
                <a 
                  href="https://www.facebook.com/p/057Caf%C3%A8-61564211750260/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:scale-110 transition-transform cursor-pointer"
                >
                  <Facebook size={28} className="text-amber-600" />
                </a>
             </div>
          </div>
      </div>
    </section>
  );
};
