import {
  TEAM_TABS_DATA,
  TEAM_TABS_TITLE,
  TEAM_TWOIMAGE_DATA,
  TEAM_TWOIMAGE_TITLE,
} from '@/constant/randing-team-const';
import CarouselWithTitle from '../../components/carouselWithTitle';
import { LandingTabWithTitle } from '../../components/tabs';
import TwoImage from '../../components/twoImage';

export default function InfoCollection() {
  return (
    <div className='flex flex-col gap-40'>
      {/* Home Section1 */}
      <LandingTabWithTitle data={TEAM_TABS_DATA} head={TEAM_TABS_TITLE} />
      {/* Home Section2 */}
      <TwoImage data={TEAM_TWOIMAGE_DATA} head={TEAM_TWOIMAGE_TITLE} />
    </div>
  );
}
