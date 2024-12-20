import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { setInitialWidgets } from "@/redux/features/whiteboardSlice";
import { setArrows } from "@/redux/features/arrowSlice";
import { fetchBoardDetail } from "@/app/[workspaceId]/board/[boardId]/data/action";

interface UseBoardInitializationResult {
  isDataLoaded: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useBoardInitialization(
  boardId: string
): UseBoardInitializationResult {
  const dispatch = useDispatch();
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const initializeRef = useRef(false);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    if (initializeRef.current) return;
    initializeRef.current = true;

    const initializeBoard = async () => {
      try {
        console.log("보드 데이터 로딩 시작");
        const data = await fetchBoardDetail(boardId);
        console.log("보드 데이터 로딩 완료:", data);

        if (!mounted) return;

        // 위젯 데이터 설정
        dispatch(setInitialWidgets(data.widgets));
        console.log("초기 위젯 설정 완료");

        // 화살표 데이터 설정
        if (data.arrows) {
          dispatch(setArrows(data.arrows));
          console.log("초기 화살표 설정 완료");
        }

        setIsDataLoaded(true);
        setIsLoading(false);
      } catch (err) {
        if (!mounted) return;
        console.error("초기화 중 에러:", err);
        setError(
          err instanceof Error
            ? err.message
            : "보드 데이터를 불러오는데 실패했습니다"
        );
        setIsLoading(false);
      }
    };

    initializeBoard();

    return () => {
      setMounted(false);
    };
  }, [boardId, dispatch, mounted]);

  return { isDataLoaded, isLoading, error };
}
