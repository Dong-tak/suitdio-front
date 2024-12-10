import Footer from './footer';
import Header from './header';
import MainContent from './mainContent';

interface HomeViewProps {
  contentTitle: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSaveClick: (e?: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function HomeView({
  contentTitle,
  handleInputChange,
  handleSaveClick,
}: HomeViewProps) {
  return (
    <div className='w-full flex flex-col items-center min-h-screen relative overflow-hidden'>
      <Header />
      <MainContent
        contentTitle={contentTitle}
        handleInputChange={handleInputChange}
        handleSaveClick={handleSaveClick}
      />
      <Footer />
    </div>
  );
}
