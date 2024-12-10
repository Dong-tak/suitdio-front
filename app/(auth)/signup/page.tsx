'use client';

import { useState } from 'react';
import { useForm, FieldValues } from 'react-hook-form';
import { useRouter } from 'next/navigation';
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
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Github, Instagram, Youtube } from 'lucide-react';
import { registerUser } from './action';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { setRegister } from '@/redux/features/registerSlice';

interface FormState {
  fieldErrors?: {
    email?: string;
  };
}

export default function Signup() {
  const [state, setState] = useState<FormState>({ fieldErrors: {} });
  const [isLoading, setIsLoading] = useState(false); // isLoading 상태 변수 추가
  const { register, handleSubmit } = useForm();
  const userEmail = useSelector((state: RootState) => state.register.register);
  const [error, setError] = useState(''); // 오류 메시지 상태 추가
  const router = useRouter();
  const dispatch = useDispatch();

  const onSubmitRegister = async (data: FieldValues) => {
    dispatch(setRegister(data.email as string));
    setIsLoading(true);
    try {
      const result = await registerUser(data.email as string);
      if (result.message) {
        // 회원가입 성공 시 인증 페이지로 이동
        router.push('/verify');
      } else {
        setError('회원가입 실패: ' + result.error);
      }
    } catch (err) {
      const errorMessage = (err as Error).message; // 명시적 형변환
      setError('회원가입 실패: ' + errorMessage); // 오류 메시지 설정
      console.error('회원가입 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const clientId =
      '811190929116-coovi0jk19fi5qdak82l4r16rsaerail.apps.googleusercontent.com';
    let redirectUri = `https://suitdio.com/auth/google/callback/`;
    if (
      process.env.NEXT_PUBLIC_POST_API_URL == 'http://localhost:8000/v1' ||
      process.env.NEXT_PUBLIC_POST_API_URL == 'http://127.0.0.1:8000/v1'
    ) {
      redirectUri = `http://localhost:3000/auth/google/callback/`;
    } else if (
      process.env.NEXT_PUBLIC_POST_API_URL == 'https://test.suitdio.com/v1'
    ) {
      redirectUri = `https://test.suitdio.com/auth/google/callback/`;
    } else {
      redirectUri = `https://suitdio.com/auth/google/callback/`;
    }
    const scope = 'https://www.googleapis.com/auth/userinfo.email';
    const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scope}`;

    window.location.href = oauthUrl;
  };

  return (
    <Card className='max-h-[540px] max-w-[400px] grow items-center justify-center space-y-[16px] border-none bg-background shadow-none sm:w-auto sm:min-w-[343px]'>
      <CardHeader className='p-0'>
        <CardTitle className='text-center'>
          회원가입{isLoading && <span> 로딩 중...</span>}
        </CardTitle>
        <CardDescription className='text-center'>
          바로 계정을 연결하세요!
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4 p-0'>
        <form
          className='space-y-[6px]'
          onSubmit={handleSubmit(onSubmitRegister)}
        >
          <div className='space-y-[6px]'>
            <Label htmlFor='register-email' className='h-10'>
              이메일
            </Label>
            <Input
              type='email'
              required
              // errors={
              //   state.fieldErrors?.email ? [state.fieldErrors.email] : undefined
              // }
              id='register-email'
              placeholder='name@example.com'
              {...register('email')}
            />
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}{' '}
          {/* 오류 메시지 표시 */}
          <Button size={'long'} type='submit' disabled={isLoading}>
            이메일로 회원가입
          </Button>
        </form>
      </CardContent>
      <CardContent className='flex items-center p-0'>
        <Separator />
        <div className='w-full text-center text-muted-foreground body-normal-body-01'>
          OR Login WITH
        </div>
        <Separator />
      </CardContent>
      <CardContent className='space-y-2 p-0'>
        {/* <Button variant={"background"} size={"long"} className="gap-2">
          <Github className="h-4 w-4" />
          Github
        </Button>
        <Button variant={"background"} size={"long"} className="gap-2">
          <Instagram className="h-4 w-4" />
          Instagram
        </Button> */}
        <Button
          variant={'background'}
          size={'long'}
          className='gap-2'
          onClick={handleGoogleLogin}
        >
          <Youtube className='h-4 w-4' />
          Google
        </Button>
      </CardContent>
    </Card>
  );
}
