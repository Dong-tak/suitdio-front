import Image from 'next/image';
import { Button } from '@/components/ui/button';
import NavigationMenuCustom from './navigation-menu-custom';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Navbar() {
  return (
    <div className='flex fixed top-0 left-0 items-center justify-between w-screen px-32 py-2 backdrop-blur-sm z-50'>
      <Link href='/' className='flex items-center gap-2 justify-center'>
        <Image src='/images/smallLogo.png' alt='logo' width={32} height={32} />
        <div className='text-[20px] font-bold'>MileQue</div>
      </Link>
      <NavigationMenuCustom />
      <div>
        <Button variant='outline' size='sm' className='text-[16px]'>
          Login
        </Button>
      </div>
    </div>
  );
}
