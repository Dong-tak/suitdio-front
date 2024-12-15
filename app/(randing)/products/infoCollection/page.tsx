import {
  INFO_COLLECTION_TABS_DATA,
  INFO_COLLECTION_TABS_TITLE,
  INFO_COLLECTION_TWOIMAGE_DATA,
  INFO_COLLECTION_TWOIMAGE_TITLE,
  INFO_COLLECTION_CAROUSEL_DATA,
  INFO_COLLECTION_CAROUSEL_TITLE,
} from '@/constant/randing-info-const';
import CarouselWithTitle from '../../components/carouselWithTitle';
import { LandingTabWithTitle } from '../../components/tabs';
import TwoImage from '../../components/twoImage';

export default function InfoCollection() {
  return (
    <div className='flex flex-col gap-40'>
      {/* Home Section1 */}
      <LandingTabWithTitle
        data={INFO_COLLECTION_TABS_DATA}
        head={INFO_COLLECTION_TABS_TITLE}
      />
      {/* Home Section2 */}
      <TwoImage
        data={INFO_COLLECTION_TWOIMAGE_DATA}
        head={INFO_COLLECTION_TWOIMAGE_TITLE}
      />
      {/* Carousel Section */}
      <CarouselWithTitle
        data={INFO_COLLECTION_CAROUSEL_DATA}
        head={INFO_COLLECTION_CAROUSEL_TITLE}
      />
      {/* OneImage Section */}
      {/* <OneImage data={oneImageData} head={h1andh2} /> */}
    </div>
  );
}
