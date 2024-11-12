'use client'; // Ensure this runs in the client-side environment

import { DataFetchInClient } from '@/api/postdata-client';
import { useRouter } from 'next/navigation';

export async function completeUserProfile(
  router: ReturnType<typeof useRouter>,
  job: string,
  isMarketed: boolean,
  username: string,
  token: string | null
) {
  const apiUrl = `${process.env.NEXT_PUBLIC_POST_API_URL}/user/social/signup/`;
  const bodyData = { job, isMarketed, token, username }; // username 추가

  const data = await DataFetchInClient({ apiUrl, bodyData });
  console.log(data);
  router.push(`/home/${data.user.id}`);
  return { success: true, message: 'Profile completed and user logged in' };
}
