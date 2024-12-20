import {
  AI_COPILOT_TABS_DATA,
  AI_COPILOT_TABS_TITLE,
  AI_COPILOT_TWOIMAGE_DATA,
  AI_COPILOT_TWOIMAGE_TITLE,
  AI_COPILOT_CAROUSEL_DATA,
  AI_COPILOT_CAROUSEL_TITLE,
} from '@/constant/randing-ai-const';
import CarouselWithTitle from '../../components/carouselWithTitle';
import { LandingTabWithTitle } from '../../components/tabs';
import TwoImage from '../../components/twoImage';

export default function AiCopilot() {
  return (
    <div className='flex flex-col gap-40'>
      {/* Home Section1 */}
      <LandingTabWithTitle
        data={AI_COPILOT_TABS_DATA}
        head={AI_COPILOT_TABS_TITLE}
      />
      {/* Home Section2 */}
      <TwoImage
        data={AI_COPILOT_TWOIMAGE_DATA}
        head={AI_COPILOT_TWOIMAGE_TITLE}
      />
      {/* Carousel Section */}
      <CarouselWithTitle
        data={AI_COPILOT_CAROUSEL_DATA}
        head={AI_COPILOT_CAROUSEL_TITLE}
      />
      {/* OneImage Section */}
      {/* <OneImage data={oneImageData} head={h1andh2} /> */}
    </div>
  );
}
