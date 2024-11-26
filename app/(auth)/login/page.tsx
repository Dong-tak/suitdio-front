// app/(auth)/login/page.tsx
'use client';

import { useState } from 'react';
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
import { Github, Instagram, ThumbsUp, Youtube } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Next.js 라우터 사용
import { LoginData } from './action'; // 수정된 onLogIn 함수 임포트

// import { useTranslations } from 'next-intl';
import { DataFetchInClient } from '@/api/postdata-client';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // 오류 메시지 상태 추가
  // const t = useTranslations('author');

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('loginId', email);
    formData.append('password', password);

    const loginData: LoginData = {
      loginId: formData.get('loginId') as string,
      password: formData.get('password') as string,
    };

    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_POST_API_URL}/auth/login/`;
      const bodyData = {
        loginId: loginData.loginId,
        password: loginData.password,
      };
      const data = await DataFetchInClient({ apiUrl, bodyData });
      if (data) {
        const { id } = data.user;
        console.log('로그인 성공', id);
        router.push(`/${data.workspace.id}/home`);
      } else if (data.error) {
        setError('로그인 실패: ' + data.error);
      }
    } catch (err) {
      const errorMessage = (err as Error).message; // 명시적 형변환
      setError('로그인 실패: ' + errorMessage); // 오류 메시지 설정
      console.error('Login failed', errorMessage);
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
    <div>
      <Card className='max-h-[540px] max-w-[400px] grow items-center justify-center space-y-[16px] border-none bg-background shadow-none sm:w-auto sm:min-w-[343px]'>
        <CardHeader className='p-0'>
          <CardTitle className='h-auto w-full text-center'>로그인</CardTitle>
          <CardDescription className='text-center'>
            이메일을 입력하여 로그인하세요
          </CardDescription>
        </CardHeader>
        <CardContent className='h-auto w-full space-y-4 p-0'>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-[6px]'>
              <Label htmlFor='text' className='h-10'>
                이메일
              </Label>
              <Input
                name='text'
                type='text'
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id='text'
                placeholder='이메일'
              />
            </div>
            <div className='space-y-[6px]'>
              <Label htmlFor='password' className='h-10'>
                비밀번호
              </Label>
              <Input
                name='password'
                type='password'
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id='password'
                placeholder='비밀번호'
              />
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}{' '}
            {/* 오류 메시지 표시 */}
            <Button size={'long'} type='submit'>
              로그인
            </Button>
          </form>
        </CardContent>

        <CardContent className='h-auto w-full space-y-2 p-0'>
          <Button
            variant={'background'}
            size={'long'}
            className='gap-2'
            onClick={handleGoogleLogin}
          >
            <Youtube className='h-4 w-4' />
            구글로 로그인
          </Button>
        </CardContent>
        <CardContent className='flex h-auto w-full items-center justify-center py-6'>
          <div>계정이 없으신가요?&nbsp;&nbsp;</div>
          <Link
            href={'/signup'}
            className='flex underline underline-offset-2 hover:scale-105 hover:opacity-60'
          >
            회원가입
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
