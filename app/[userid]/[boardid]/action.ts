const API_BASE_URL = process.env.NEXT_PUBLIC_POST_API_URL || '';

export async function fetchBoard(boardId: string) {
  const response = await fetch(`${API_BASE_URL}/record/board/${boardId}/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // 필요한 경우 인증 헤더 추가
    },
  });

  if (!response.ok) {
    throw new Error('보드 데이터를 가져오는데 실패했습니다');
  }

  return response.json();
}
