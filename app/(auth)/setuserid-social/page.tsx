'use client';
import { Suspense } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Check, Github, Instagram } from 'lucide-react';
import { ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  OurCheckbox,
  OurColorCheckbox,
} from '@/components/custom-shadcn/our-checkbox';
import { useFormState } from 'react-dom';
import React, { useEffect, useReducer, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { completeUserProfile } from './action'; // action.ts 파일에서 가져오기

interface FormState {
  fieldErrors: {
    email: string[];
    job: string[];
  };
}

const initialState: FormState = {
  fieldErrors: {
    email: [],
    job: [],
  },
};

type Action = {
  type: 'SET_FIELD_ERRORS';
  payload: { field: string; errors: string[] };
};

const formReducer = (state: FormState, action: Action): FormState => {
  switch (action.type) {
    case 'SET_FIELD_ERRORS':
      return {
        ...state,
        fieldErrors: {
          ...state.fieldErrors,
          [action.payload.field]: action.payload.errors,
        },
      };
    default:
      return state;
  }
};

const frameworks = [
  {
    value: '브랜드매니저',
    label: '브랜드 매니저',
  },
  {
    value: '디지털마케팅전문가',
    label: '디지털 마케팅 전문가',
  },
  {
    value: '콘텐츠마케터',
    label: '콘텐츠 마케터',
  },
  {
    value: '마케팅기획자',
    label: '마케팅 기획자',
  },
  {
    value: '광고기획자',
    label: '광고기획자(AE)',
  },
  {
    value: '프로모션매니저',
    label: '프로모션 매니저',
  },
  {
    value: 'PR매니저',
    label: 'PR 매니저',
  },
  {
    value: 'CRM전문가',
    label: 'CRM 전문가',
  },
  {
    value: 'SNS마케터',
    label: 'SNS 마케터',
  },
  {
    value: '퍼포먼스마케터',
    label: '퍼포먼스 마케터',
  },
];

export default function SetUserIdSocialWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SetUserIdSocialContent />
    </Suspense>
  );
}

function SetUserIdSocialContent() {
  const [state, dispatch] = useFormState(formReducer, initialState);
  const [job, setJob] = useState('');
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');
  const [username, setUsername] = useState('');
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [isMarketed, setIsMarketed] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (isAllChecked) {
      setIsTermsChecked(true);
      setIsMarketed(true);
    }
  }, [isAllChecked]);

  useEffect(() => {
    if (isTermsChecked && isMarketed) {
      setIsAllChecked(true);
    } else {
      setIsAllChecked(false);
    }
  }, [isTermsChecked, isMarketed]);

  const handleCompleteProfile = async () => {
    console.log('handleCompleteProfile');
    console.log(value, isMarketed, token);

    const result = await completeUserProfile(
      router,
      value,
      isMarketed,
      username,
      token
    );
  };

  return (
    <Card className='max-h-[540px] max-w-[400px] grow items-center justify-center space-y-[16px] border-none bg-background shadow-none sm:w-auto sm:min-w-[343px]'>
      <CardHeader className='p-0'>
        <CardTitle>정보 입력하기</CardTitle>
        <CardDescription>바로 계정을 연결하세요!</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4 p-0'>
        <div className='flex flex-col space-y-[6px]'>
          <div className='space-y-[6px]'>
            <Label htmlFor='username'>사용자 이름</Label>
            <Input
              name='username'
              type='text'
              placeholder='사용자 이름을 입력하세요'
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className='flex flex-col space-y-[6px]'></div>
          <Label htmlFor='job'>직업</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                role='combobox'
                aria-expanded={open}
                className='justify-between text-secondary-foreground'
              >
                {value
                  ? frameworks.find((framework) => framework.value === value)
                      ?.label
                  : '직업을 선택하세요.'}
                <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-[343px] p-0'>
              <Command>
                <CommandInput placeholder='직종을 검색하세요...' />
                <CommandList>
                  <CommandEmpty>검색한 직업이 없습니다.</CommandEmpty>
                  <CommandGroup>
                    {frameworks.map((framework) => (
                      <CommandItem
                        key={framework.value}
                        value={framework.value}
                        onSelect={(currentValue) => {
                          setValue(currentValue === value ? '' : currentValue);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            value === framework.value
                              ? 'opacity-100'
                              : 'opacity-0'
                          )}
                        />
                        {framework.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <div className='space-y-2'>
          <OurColorCheckbox
            checked={isAllChecked}
            onCheckedChange={(checked) => setIsAllChecked(checked)}
            id='allCheck'
          >
            모두 동의하기.
          </OurColorCheckbox>
          <OurCheckbox
            checked={isTermsChecked}
            onCheckedChange={(checked) => setIsTermsChecked(checked)}
            id='terms1'
          >
            (필수)서비스 이용 약관에 동의합니다.
          </OurCheckbox>
          <OurCheckbox
            checked={isMarketed}
            onCheckedChange={(checked) => setIsMarketed(checked)}
            id='terms2'
          >
            (선택) 마케팅 수신에 동의합니다.
          </OurCheckbox>
        </div>
        <Button
          size={'long'}
          onClick={handleCompleteProfile}
          disabled={!isTermsChecked}
        >
          MileQue 시작하기
        </Button>
      </CardContent>
    </Card>
  );
}
