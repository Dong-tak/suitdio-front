import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FilterMenuProps {
  label: string;
  items: string[];
}

export default function FilterMenu({ label, items }: FilterMenuProps) {
  return (
    <Select>
      <SelectTrigger className='p-2 rounded-lg w-fit border-border text-sm'>
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent className='bg-white'>
        {items.map((item) => (
          <SelectItem key={item} value={item}>
            {item}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
