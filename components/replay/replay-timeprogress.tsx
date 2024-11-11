import { Progress } from '../ui/progress';

interface ReplayTimeProgressProps {
  value: number;
  onChange: (value: number) => void;
}

export default function ReplayTimeProgress({
  value,
  onChange,
}: ReplayTimeProgressProps) {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    onChange(Math.min(Math.max(percentage, 0), 100));
  };

  return (
    <div className='w-full relative' onClick={handleClick}>
      <Progress
        className='w-full bg-gray-200 h-1 cursor-pointer'
        value={value}
      />
    </div>
  );
}
