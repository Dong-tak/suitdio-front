import { DataFetchInClient } from '@/api/postdata-client';

// Verify Email function
export async function verifyEmail(code: string): Promise<{
  error: string | undefined;
  success: boolean;
  message: string;
}> {
  const apiUrl = `${process.env.NEXT_PUBLIC_POST_API_URL}/user/verify_email/`;
  const bodyData = { code };
  const data = await DataFetchInClient({ apiUrl, bodyData });
  return data;
}
