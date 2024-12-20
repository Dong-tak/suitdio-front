import Image from 'next/image';
import { Button } from '@/components/ui/button';
import NavigationMenuCustom from './navigation-menu-custom';
import Link from 'next/link';

export default function Navbar() {
  return (
    <div className='flex fixed top-0 left-0 items-center w-screen px-32 py-2 backdrop-blur-sm z-50'>
      <div className='flex-1'>
        <Link href='/' className='flex items-center gap-2 justify-start'>
          <Image
            src='/images/main/smallLogo.png'
            alt='logo'
            width={32}
            height={32}
          />
          <div className='text-[20px] font-bold'>MileQue</div>
        </Link>
      </div>

      <div className='flex-1 flex justify-center'>
        <NavigationMenuCustom />
      </div>

      <div className='flex-1 flex justify-end'>
        <Link href='/login'>
          <Button variant='outline' size='sm' className='text-[16px]'>
            Login
          </Button>
        </Link>
      </div>
    </div>
  );
}
