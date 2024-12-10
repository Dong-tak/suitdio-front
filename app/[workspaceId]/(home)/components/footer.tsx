export default function Footer() {
  return (
    <div className='flex items-center justify-between gap-4 fixed bottom-[32px]'>
      {[
        'Price',
        'Blog',
        'Report',
        'Team',
        'Recruit',
        'Terms of Service',
        'Privacy Policy',
        'Business Info',
      ].map((text) => (
        <div
          key={text}
          className="text-slate-400 text-sm font-normal font-['Pretendard'] leading-tight"
        >
          {text}
        </div>
      ))}
      <div className='flex items-center justify-center gap-2'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='16'
          height='16'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          className='text-slate-400'
        >
          <circle cx='12' cy='12' r='10'></circle>
          <line x1='2' y1='12' x2='22' y2='12'></line>
          <path d='M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z'></path>
        </svg>
        <select className="text-slate-400 text-sm font-normal font-['Pretendard'] leading-tight bg-transparent border-none cursor-pointer outline-none">
          <option value='ko'>한국어</option>
          <option value='en'>English</option>
          <option value='jp'>日本語</option>
          <option value='cn'>中文</option>
        </select>
      </div>
    </div>
  );
}
