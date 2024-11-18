'use client'; // Ensure this runs in the client-side environment

import { DataFetchInClient } from '@/api/postdata-client';

export async function registerUser(email: string) {
  const apiUrl = `${process.env.NEXT_PUBLIC_POST_API_URL}/user/register/`;
  const bodyData = { email };
  const data = await DataFetchInClient({ apiUrl, bodyData });
  return data;
  // try {
  //   const response = await fetch(
  //     `${process.env.NEXT_PUBLIC_POST_API_URL}/user/register/`,
  //     {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         // "X-CSRFToken": csrfToken, // Include the CSRF token in the headers
  //       },
  //       body: JSON.stringify({ email }),
  //       credentials: "include", // Important: ensures cookies (including session cookie) are sent with the request
  //     },
  //   );

  //   if (response.ok) {
  //     console.log(response);
  //     return { success: true, message: "Verification code sent" };
  //   } else {
  //     const data = await response.json();
  //     return {
  //       success: false,
  //       error: data.error,
  //       message: "Verification code not sent",
  //     };
  //   }
  // } catch (error) {
  //   console.error(error);
  //   return { success: false, error: "An error occurred" };
  // }
}
