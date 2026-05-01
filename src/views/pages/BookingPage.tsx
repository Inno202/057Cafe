import { useState } from 'react';
import { motion } from 'motion/react';
import { X, Clock, Calendar, ChevronDown } from 'lucide-react';
import { Theme } from '../../models/types';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const BookingPage = ({ theme, toggleTheme, navigateToHome }: { theme: Theme, toggleTheme: () => void, navigateToHome: () => void }) => {
  const [bookingType, setBookingType] = useState<'private_event' | 'weekend_table'>('private_event');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className={`min-h-screen transition-colors duration-700 font-sans ${theme === 'day' ? 'bg-stone-50' : 'bg-stone-950'}`}>
      <Navbar theme={theme} toggleTheme={toggleTheme} onHomeClick={navigateToHome} isBookingPage={true} />
      <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center"
        >
          <button 
            onClick={navigateToHome}
            className={`mb-12 flex items-center gap-2 font-bold uppercase tracking-widest text-xs transition-colors ${theme === 'day' ? 'text-stone-400 hover:text-amber-600' : 'text-stone-600 hover:text-amber-400'}`}
          >
            <X size={16} /> Back to Home
          </button>

          <div className={`w-full max-w-4xl p-1.5 md:p-2 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl ${theme === 'day' ? 'bg-stone-200' : 'bg-stone-800'}`}>
             <div className={`rounded-3xl md:rounded-[2.3rem] p-5 sm:p-8 md:p-16 h-full ${theme === 'day' ? 'bg-white' : 'bg-stone-950'}`}>
                <div className="text-center mb-8">
                   <span className="text-amber-600 font-bold uppercase tracking-[0.4em] text-[10px] md:text-xs">Reservations</span>
                   <h2 className={`text-2xl md:text-4xl lg:text-4xl font-black mt-3 mb-4 tracking-tighter leading-tight ${theme === 'day' ? 'text-stone-900' : 'text-white'}`}>
                      BOOK THE <span className="text-amber-500">LIFESTYLE.</span>
                   </h2>
                   <p className={`text-sm md:text-base italic ${theme === 'day' ? 'text-stone-500' : 'text-stone-400'}`}>
                      "From intimate dinners to grand celebrations, we set the stage for your memories."
                   </p>
                </div>
                
                <div className={`flex flex-row p-1 sm:p-1.5 rounded-full mb-8 sm:mb-10 w-full max-w-xl mx-auto ${theme === 'day' ? 'bg-stone-100' : 'bg-stone-900'}`}>
                  <button 
                    onClick={(e) => { e.preventDefault(); setBookingType('private_event'); }}
                    className={`flex-1 py-3 px-2 sm:py-3.5 sm:px-4 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider sm:tracking-widest transition-all ${bookingType === 'private_event' ? (theme === 'day' ? 'bg-white shadow-md text-amber-600' : 'bg-stone-800 shadow-md text-amber-500') : (theme === 'day' ? 'text-stone-500 hover:text-stone-700' : 'text-stone-400 hover:text-stone-200')}`}
                  >
                    Private Event
                  </button>
                  <button 
                    onClick={(e) => { e.preventDefault(); setBookingType('weekend_table'); }}
                    className={`flex-1 py-3 px-2 sm:py-3.5 sm:px-4 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider sm:tracking-widest transition-all ${bookingType === 'weekend_table' ? (theme === 'day' ? 'bg-white shadow-md text-amber-600' : 'bg-stone-800 shadow-md text-amber-500') : (theme === 'day' ? 'text-stone-500 hover:text-stone-700' : 'text-stone-400 hover:text-stone-200')}`}
                  >
                    Weekend Table
                  </button>
                </div>

                <form className="space-y-6 md:space-y-8" onSubmit={handleSubmit}>
                  {isSubmitted ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-8 md:p-12 text-center flex flex-col items-center justify-center min-h-[300px]"
                    >
                      <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-6">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      </div>
                      <h3 className={`text-2xl font-black mb-4 ${theme === 'day' ? 'text-stone-900' : 'text-white'}`}>Request Received!</h3>
                      <p className={`text-sm md:text-base mb-8 max-w-md ${theme === 'day' ? 'text-stone-600' : 'text-stone-400'}`}>
                        Thank you for considering 057 Cafè. Our team will review your request and get back to you shortly to confirm your booking.
                      </p>
                      <button 
                        type="button" 
                        onClick={() => setIsSubmitted(false)}
                        className={`font-bold uppercase tracking-widest text-xs underline ${theme === 'day' ? 'text-amber-700' : 'text-amber-500'}`}
                      >
                        Submit another request
                      </button>
                    </motion.div>
                  ) : (
                    <>
                      <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                     <div className="space-y-2">
                        <label className={`text-[10px] font-black uppercase tracking-widest ${theme === 'day' ? 'text-stone-400' : 'text-stone-500'}`}>Full Name</label>
                        <input type="text" className={`w-full p-3 md:p-4 rounded-xl border focus:outline-none focus:ring-2 transition-all text-sm md:text-base ${theme === 'day' ? 'bg-stone-50 border-stone-100 focus:ring-amber-500 text-stone-900' : 'bg-stone-900 border-stone-800 focus:ring-amber-500 text-white'}`} placeholder="John Doe" />
                     </div>
                     <div className="space-y-2">
                        <label className={`text-[10px] font-black uppercase tracking-widest ${theme === 'day' ? 'text-stone-400' : 'text-stone-500'}`}>Phone Number</label>
                        <input type="tel" className={`w-full p-3 md:p-4 rounded-xl border focus:outline-none focus:ring-2 transition-all text-sm md:text-base ${theme === 'day' ? 'bg-stone-50 border-stone-100 focus:ring-amber-500 text-stone-900' : 'bg-stone-900 border-stone-800 focus:ring-amber-500 text-white'}`} placeholder="072 223 0708" />
                     </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4 md:gap-6">
                     <div className="space-y-2">
                        <label className={`text-[10px] font-black uppercase tracking-widest ${theme === 'day' ? 'text-stone-400' : 'text-stone-500'}`}>Event Date</label>
                        <div className="relative">
                          <input 
                            type="date" 
                            min={today}
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className={`w-full p-3 md:p-4 pl-10 md:pl-12 rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all text-sm md:text-base appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer ${
                              theme === 'day' 
                                ? `${selectedDate ? 'bg-amber-50 border-amber-300 text-amber-700 font-bold shadow-sm' : 'bg-stone-50 border-stone-100 text-stone-900'}` 
                                : `${selectedDate ? 'bg-amber-900/20 border-amber-800/50 text-amber-400 font-bold shadow-sm' : 'bg-stone-900 border-stone-800 text-white'}`
                            }`} 
                          />
                          <Calendar size={18} className={`absolute left-3 md:left-4 top-1/2 -translate-y-1/2 pointer-events-none ${selectedDate ? 'text-amber-500' : (theme === 'day' ? 'text-stone-400' : 'text-stone-500')}`} />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className={`text-[10px] font-black uppercase tracking-widest ${theme === 'day' ? 'text-stone-400' : 'text-stone-500'}`}>Arrival Time</label>
                        <div className="relative">
                          <input 
                            type="time" 
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                            className={`w-full p-3 md:p-4 pl-10 md:pl-12 rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all text-sm md:text-base appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer ${
                              theme === 'day' 
                                ? `${selectedTime ? 'bg-amber-50 border-amber-300 text-amber-700 font-bold shadow-sm' : 'bg-stone-50 border-stone-100 text-stone-900'}` 
                                : `${selectedTime ? 'bg-amber-900/20 border-amber-800/50 text-amber-400 font-bold shadow-sm' : 'bg-stone-900 border-stone-800 text-white'}`
                            }`} 
                          />
                          <Clock size={18} className={`absolute left-3 md:left-4 top-1/2 -translate-y-1/2 pointer-events-none ${selectedTime ? 'text-amber-500' : (theme === 'day' ? 'text-stone-400' : 'text-stone-500')}`} />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className={`text-[10px] font-black uppercase tracking-widest ${theme === 'day' ? 'text-stone-400' : 'text-stone-500'}`}>Guest Count</label>
                        <div className="relative">
                          <select className={`w-full p-3 md:p-4 rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all text-sm md:text-base appearance-none ${theme === 'day' ? 'bg-stone-50 border-stone-100 text-stone-900' : 'bg-stone-900 border-stone-800 text-white'}`}>
                             <option>2 People</option>
                             <option>4 People</option>
                             <option>6-10 People</option>
                             {bookingType === 'private_event' && (
                               <option>Private Venue Hire (20+)</option>
                             )}
                          </select>
                          <ChevronDown size={18} className={`absolute right-3 md:right-4 top-1/2 -translate-y-1/2 pointer-events-none ${theme === 'day' ? 'text-stone-400' : 'text-stone-500'}`} />
                        </div>
                     </div>
                  </div>

                  {bookingType === 'private_event' ? (
                    <div className="space-y-2">
                       <label className={`text-[10px] font-black uppercase tracking-widest ${theme === 'day' ? 'text-stone-400' : 'text-stone-500'}`}>Occasion Details</label>
                       <textarea rows={4} className={`w-full p-3 md:p-4 rounded-xl border focus:outline-none focus:ring-2 transition-all text-sm md:text-base focus:ring-amber-500 ${theme === 'day' ? 'bg-stone-50 border-stone-100 text-stone-900' : 'bg-stone-900 border-stone-800 text-white'}`} placeholder="Briefly describe your event (e.g. Birthday Celebration)"></textarea>
                    </div>
                  ) : (
                    <div className="space-y-2">
                       <label className={`text-[10px] font-black uppercase tracking-widest ${theme === 'day' ? 'text-stone-400' : 'text-stone-500'}`}>Select Event</label>
                       <div className="relative">
                         <select className={`w-full p-3 md:p-4 rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all text-sm md:text-base appearance-none ${theme === 'day' ? 'bg-stone-50 border-stone-100 text-stone-900' : 'bg-stone-900 border-stone-800 text-white'}`}>
                            <option value="">Select a weekend event...</option>
                            <option value="thursday">Cocktail Thursday</option>
                            <option value="mimosa">Mimosa Weekend (Fri-Sun)</option>
                            <option value="sunday">Authentic Sundays</option>
                         </select>
                         <ChevronDown size={18} className={`absolute right-3 md:right-4 top-1/2 -translate-y-1/2 pointer-events-none ${theme === 'day' ? 'text-stone-400' : 'text-stone-500'}`} />
                       </div>
                    </div>
                  )}

                  <div className={`p-4 md:p-6 rounded-2xl flex items-start gap-3 md:gap-4 ${theme === 'day' ? 'bg-amber-50 border border-amber-100' : 'bg-stone-900 border border-stone-800'}`}>
                    <Clock className="text-amber-600 shrink-0" size={18} />
                    <p className={`text-xs leading-relaxed ${theme === 'day' ? 'text-amber-900' : 'text-stone-400'}`}>
                      {bookingType === 'private_event' 
                        ? <span><strong>Note:</strong> Venue hire and large bookings require a 48-hour lead time. Our team will contact you within 24 hours to confirm availability and discuss catering options.</span>
                        : <span><strong>Note:</strong> Table reservations for weekend events are held for a maximum of 30 minutes past the booked time. Early arrival is recommended.</span>}
                    </p>
                  </div>

                  <button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white py-4 md:py-6 rounded-2xl md:rounded-3xl font-black uppercase tracking-[0.2em] md:tracking-[0.3em] shadow-xl transition-all transform active:scale-95 text-sm sm:text-base md:text-xl">
                     {bookingType === 'private_event' ? 'Request Reservation' : 'Book Table'}
                  </button>
                    </>
                  )}
                </form>
             </div>
          </div>
        </motion.div>
      </div>
      <Footer theme={theme} />
    </div>
  );
};
