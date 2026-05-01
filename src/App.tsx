import { useAppController } from './controllers/useAppController';
import { HomePage } from './views/pages/HomePage';
import { BookingPage } from './views/pages/BookingPage';

export default function App() {
  const { theme, view, toggleTheme, navigateToBooking, navigateToHome } = useAppController();

  if (view === 'booking') {
    return (
      <BookingPage 
        theme={theme} 
        toggleTheme={toggleTheme} 
        navigateToHome={navigateToHome} 
      />
    );
  }

  return (
    <HomePage 
      theme={theme} 
      toggleTheme={toggleTheme} 
      navigateToBooking={navigateToBooking} 
    />
  );
}
