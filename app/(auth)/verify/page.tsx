'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { verifyEmail } from './action';
import { registerUser } from '../signup/action';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';

interface FormState {
  fieldErrors?: {
    code?: string;
  };
}

export default function Verify() {
  const [state, setState] = useState<FormState>({ fieldErrors: {} });
  const [isVerified, setIsVerified] = useState(false);
  const { register, watch } = useForm();
  const router = useRouter();
  const code = watch('verifyCode');
  const userEmail = useSelector((state: RootState) => state.register.register);

  const handleVerifyEmail = useCallback(
    async (code: string) => {
      const result = await verifyEmail(code);
      if (result.success) {
        setIsVerified(true);
        router.push('/setuserid');
      } else {
        setState({ fieldErrors: { code: result.message } });
      }
    },
    [router]
  );

  const onSubmitRegister = async (data: string) => {
    try {
      const result = await registerUser(data);
      if (result.message) {
        // 회원가입 성공 시 인증 페이지로 이동
        alert('인증번호 재전송 완료');
      } else {
        alert('회원가입 실패: ' + result.error);
      }
    } catch (err) {
      const errorMessage = (err as Error).message; // 명시적 형변환
      alert('회원가입 실패: ' + errorMessage);
    }
  };

  const handleMileQueClick = () => {
    if (code && code.length === 6) {
      handleVerifyEmail(code);
    } else {
      setState({ fieldErrors: { code: 'Invalid code length' } });
    }
  };

  useEffect(() => {
    if (code && code.length === 6) {
      handleVerifyEmail(code);
    }
  }, [code, handleVerifyEmail]);

  return (
    <Card className='max-h-[540px] max-w-[400px] grow items-center justify-center space-y-[16px] border-none bg-background shadow-none sm:w-auto sm:min-w-[343px]'>
      <CardHeader className='p-0'>
        <CardTitle>이메일을 확인해보세요</CardTitle>
        {/* <Link href="">
          <CardDescription className="underline underline-offset-1">
            인증번호를 입력하세요!
          </CardDescription>
        </Link> */}
      </CardHeader>
      <CardContent className='space-y-4 p-0'>
        <div className='space-y-[6px]'>
          <div className='flex items-end justify-between'>
            <Label htmlFor='verifyCode'>이메일이 오지 않았다면?</Label>
            {/* <div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="underline underline-offset-2">
                      혹시 인증메일이 오지 않았나요?
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>다시 보내세요!</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div> */}
          </div>
          {/* <div className="flex gap-2">
            <Input
              id="verifyCode"
              {...register("verifyCode")}
              // errors={
              //   state.fieldErrors?.code ? [state.fieldErrors.code] : undefined
              // }
            />
            <Button
              variant={"default"}
              size={"icon"}
              className={`h-10 w-10 flex-shrink-0 ${isVerified ? "opacity-100" : "opacity-50"}`}
            >
              <Check className="h-4 w-4" />
            </Button>
          </div> */}
        </div>
        <Button size={'long'} onClick={() => onSubmitRegister(userEmail)}>
          인증번호 재전송하기
        </Button>
      </CardContent>
    </Card>
  );
}
