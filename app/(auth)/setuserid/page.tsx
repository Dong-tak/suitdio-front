'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, ChevronsUpDown } from 'lucide-react';

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

import React, { useEffect, useReducer, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { completeUserProfile } from './action'; // action.ts 파일에서 가져오기
import { Suspense } from 'react';
import { PASSWORD_MIN_LENGTH } from '@/constant/const';

interface FormState {
  fieldErrors: {
    username: string[];
    email: string[];
    password: string[];
    confirm_password: string[];
  };
  // 다른 상태 속성들...
}

const initialState: FormState = {
  fieldErrors: {
    username: [],
    email: [],
    password: [],
    confirm_password: [],
  },
  // 다른 초기 상태 값들...
};

type Action = {
  type: 'SET_FIELD_ERRORS';
  payload: { field: string; errors: string[] };
};
// 다른 액션 타입들...

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
    // 다른 액션 처리...
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

function SetUserIdContent() {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [job, setJob] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [isMarketed, setIsMarketed] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') as string;

  useEffect(() => {
    if (isAllChecked) {
      setIsTermsChecked(true);
      setIsMarketed(true);
    }
  }, [isAllChecked]);

  useEffect(() => {
    console.log('searchParams', searchParams);
    console.log('token', token);
    console.log('username', username);
  }, [token, username]);

  useEffect(() => {
    if (isTermsChecked && isMarketed) {
      setIsAllChecked(true);
    } else {
      setIsAllChecked(false);
    }
  }, [isTermsChecked, isMarketed]);

  const handleCompleteProfile = async () => {
    console.log('handleCompleteProfile');
    // if (password !== confirmPassword) {
    //   dispatch({
    //     type: "SET_FIELD_ERRORS",
    //     payload: {
    //       field: "confirm_password",
    //       errors: ["Passwords do not match"],
    //     },
    //   });
    //   return;
    // }

    console.log(password, value, isMarketed, token);

    const result = await completeUserProfile(
      router,
      password,
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
        <div className='space-y-[6px]'>
          <Label htmlFor='password'>비밀번호</Label>
          <Input
            name='password'
            type='password'
            placeholder='password'
            required
            minLength={PASSWORD_MIN_LENGTH}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            // errors={state?.fieldErrors.password}
          />
        </div>
        <div className='space-y-[6px]'>
          <Label htmlFor='confirm_password'>비밀번호 확인</Label>
          <Input
            name='confirm_password'
            type='password'
            placeholder='Confirm password'
            required
            minLength={PASSWORD_MIN_LENGTH}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            // errors={state?.fieldErrors.confirm_password}
          />
        </div>
        <div className='flex flex-col space-y-[6px]'>
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

export default function SetUserId() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SetUserIdContent />
    </Suspense>
  );
}
