import Navbar from '@/app/(randing)/components/Navbar';
import Image from 'next/image';
import { FaGithub, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { RiInstagramFill } from 'react-icons/ri';
import { IoMail } from 'react-icons/io5';

export default function RandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='w-full flex flex-col px-48'>
      <Navbar />
      {children}
      <div className='flex flex-col items-start justify-start gap-2 pt-10'>
        <div className='flex items-center gap-2 justify-start '>
          <Image
            src='/images/main/smallLogo.png'
            alt='logo'
            width={32}
            height={32}
          />
          <div className='text-[20px] font-bold text-gray-700'>MileQue</div>
        </div>
        <p className='mx-2'>
          당신의 현명한 선택을 만드는 <br /> 개인지식 관리 인터페이스
        </p>
        <div className='flex items-center justify-between gap-2 mx-1 mb-48'>
          <div className='rounded-full border-2 border-gray-100 hover:bg-gray-100 hover:text-purple-400 p-2'>
            <IoMail className='w-4 h-4' />
          </div>
          <div className='rounded-full border-2 border-gray-100 hover:bg-gray-100 hover:text-purple-400 p-2'>
            <FaLinkedin className='w-4 h-4' />
          </div>
          <div className='rounded-full border-2 border-gray-100 hover:bg-gray-100 hover:text-purple-400 p-2'>
            <FaGithub className='w-4 h-4' />
          </div>
          <div className='rounded-full border-2 border-gray-100 hover:bg-gray-100 hover:text-purple-400 p-2'>
            <RiInstagramFill className='w-4 h-4' />
          </div>
        </div>
      </div>
    </div>
  );
}
