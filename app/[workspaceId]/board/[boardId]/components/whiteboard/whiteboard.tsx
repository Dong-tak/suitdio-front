'use client';

import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import {
  Type,
  AppWindowMacIcon,
  MousePointer2,
  MoveRight,
  File,
  Search,
  RefreshCw,
  Shapes,
  Disc2,
  Tornado,
  Boxes,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import {
  addWidget,
  setSelectedWidget,
  setEditModeWidgets,
  addSelectedWidget,
  addWidgetFrom,
  addWidgetTo,
  updateWidget,
  setInitialWidgets,
  redo,
  undo,
  setSpacePressed,
} from '@/redux/features/whiteboardSlice';

import {
  ShellWidgetProps,
  AllWidgetTypes,
  AllWidgetType,
  TextWidget,
  SectionWidget,
  IframeEmbedWidget,
  SelectArea,
  Arrow,
  BoardWidget,
} from '@/types/type';
import '@blocknote/core/fonts/inter.css';
import '@blocknote/mantine/style.css';
import SvgIcon from '@/utils/svgIcon';
import { sectionSvg } from '@/utils/svgBag';
import { HiOutlineSparkles } from 'react-icons/hi2';
import { Separator } from '../../../../../../components/ui/separator';
import { createTextNode } from '@/utils/textNodeCreator';
import BrainstormInput from '../widget/widgetBrainstorm';
import CreateBoardDialog from '../../../../(home)/components/creatBoardDialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../../../../components/ui/popover';
import { Label } from '../../../../../../components/ui/label';
import { Input } from '../../../../../../components/ui/input';
import {
  addArrow,
  deleteArrow,
  deleteFirstLinkWidget,
  deleteLinkWidget,
  setArrows,
  setIsArrowMode,
  setSelectedArrows,
} from '@/redux/features/arrowSlice';
import { calculateArrowPoints, drawArrow } from '../arrow/drawArrow';
import { getTsid } from 'tsid-ts';

import { Spinner } from '../../../../../../components/ui/spinner';
import { Board, fetchBoards } from '@/app/[workspaceId]/record/action';
import { useParams } from 'next/navigation';
import { AIChat } from '../../../../../../components/ui/ai';
import { MemoizedWidgetShell } from '../widget/memoizedWidgetShell';
import { getSelectedWidgetInfo } from '@/utils/mindMapUtils/mindMapNodeFinder';
import { useWhiteboardGrid } from '../../hooks/whiteboard/useWhiteboardGrid';
import { useWhiteboardZoom } from '../../hooks/whiteboard/useWhiteboardZoom';
import { useWhiteboardKeyboard } from '../../hooks/whiteboard/useWhiteboardKeyboard';
import { useWhiteboardCanvas } from '../../hooks/whiteboard/useWhiteboardCanvas';
import { useFileUpload } from '../../hooks/whiteboard/useFileUpload';
import { useClipboard } from '../../hooks/whiteboard/useClipboard';
import { useDragAndDrop } from '../../hooks/whiteboard/useDragDrop';

// 기본 그리드 설정
let baseSpacing = 48; // 기본 간격
let basePointSize = 4; // 기본 점 크기

export const FONT_SIZE = 16;
export const RESIZE_HANDLE_SIZE = 8;
export const ZOOM_SPEED = 0.001; // 줌 속도 조절 상수

export default function Whiteboard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const widgets = useSelector(
    (state: RootState) => state.whiteboard.widgets
  ) as ShellWidgetProps<AllWidgetTypes>[];

  const dispatch = useDispatch();
  // const [scale, setScale] = useState(1);
  // const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [tool, setTool] = useState<'select' | AllWidgetType>('select');
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const spacePressed = useSelector(
    (state: RootState) => state.whiteboard.spacePressed
  );
  // const [isZooming, setIsZooming] = useState(false);
  const [isBrainstormActive, setIsBrainstormActive] = useState(false); // 브레인스톰 상태 추가
  const [contentTitle, setContentTitle] = useState(''); // contentTitle 상태 추가
  const [dialogOpen, setDialogOpen] = useState(false); // 다이얼로그 상태 추가
  const [boardPosition, setBoardPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [isBoardPlacementMode, setIsBoardPlacementMode] = useState(false);
  const [selectArea, setSelectArea] = useState<SelectArea | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [url, setUrl] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const isArrowMode = useSelector(
    (state: RootState) => state.arrow.isArrowMode
  );
  const linkWidgets = useSelector(
    (state: RootState) => state.arrow.linkWidgets
  );
  const arrows = useSelector((state: RootState) => state.arrow.arrows);
  const selectedArrow = useSelector(
    (state: RootState) => state.arrow.selectedArrows
  );

  const [activeShells, setActiveShells] = useState<{
    editModeShells: Set<string>;
    popupOpenShells: Set<string>;
  }>({
    editModeShells: new Set(),
    popupOpenShells: new Set(),
  });

  // 섹션 드래그 상태 추가
  const [sectionDraft, setSectionDraft] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  // Screen 좌표 기준의 마우스 위치를 저장
  const [mousePosition, setMousePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const handleShellEditModeChange = (widgetId: string, isEdit: boolean) => {
    setActiveShells((prev) => {
      const newEditModeShells = new Set(prev.editModeShells);
      if (isEdit) {
        newEditModeShells.add(widgetId);
      } else {
        newEditModeShells.delete(widgetId);
      }
      return {
        ...prev,
        editModeShells: newEditModeShells,
      };
    });
  };

  const handleShellPopupOpenChange = (widgetId: string, isOpen: boolean) => {
    setActiveShells((prev) => {
      const newPopupOpenShells = new Set(prev.popupOpenShells);
      if (isOpen) {
        newPopupOpenShells.add(widgetId);
      } else {
        newPopupOpenShells.delete(widgetId);
      }
      return {
        ...prev,
        popupOpenShells: newPopupOpenShells,
      };
    });
  };

  // 입력 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContentTitle(e.target.value);
  };

  // useWhiteboardZoom 훅 사용
  const { scale, setScale, offset, setOffset, isZooming } = useWhiteboardZoom({
    containerRef,
    ZOOM_SPEED: 0.001,
  });

  const { drawGrid } = useWhiteboardGrid({
    scale,
    offset,
    baseSpacing: 48,
    basePointSize: 4,
  });

  useWhiteboardKeyboard({ setIsPanning, selectedArrow, widgets });

  // Canvas 관련 훅 사용
  const { redraw } = useWhiteboardCanvas({
    canvasRef,
    scale,
    offset,
    arrows,
    selectedArrow,
    sectionDraft,
    selectArea,
    drawGrid,
  });

  const { handleFileUpload } = useFileUpload({
    scale,
    offset,
    baseSpacing,
    FONT_SIZE,
    setTool,
  });

  //마우스를 다운을 트리거로 위젯 생성, 선택, 드래그 모드 설정
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (spacePressed) {
      setIsPanning(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - offset.x * scale) / scale;
    const y = (e.clientY - rect.top - offset.y * scale) / scale;

    if (tool === 'select' || tool === 'brainStorm') {
      if (!e.shiftKey) {
        dispatch(setEditModeWidgets(null));
        setIsSelecting(true);
        setDragStart({ x, y }); // 드래그 시작 위치 저장
        setSelectArea({
          startX: x,
          startY: y,
          width: 0,
          height: 0,
        });
        const clickedArrow = arrows.find((arrow) =>
          isPointNearArrow(x, y, arrow)
        );
        if (clickedArrow) {
          dispatch(setSelectedArrows([clickedArrow]));
          return; // 화살표를 선택했다면 다른 선택 동작 중단
        } else {
          dispatch(setSelectedArrows([]));
        }
      }
      // 보드 생성 모드일 때
    } else if (tool === 'boardLink' && isBoardPlacementMode) {
      const position = {
        x: Math.round(x / baseSpacing) * baseSpacing,
        y: Math.round(y / baseSpacing) * baseSpacing,
      };
      setBoardPosition(position);
      setDialogOpen(true);
      setIsBoardPlacementMode(false);
      setTool('select');
      return;
    } else if (tool === 'section') {
      const startPos = {
        x: Math.round(x / baseSpacing) * baseSpacing,
        y: Math.round(y / baseSpacing) * baseSpacing,
      };
      setDragStart(startPos);
      setSectionDraft({
        x: startPos.x,
        y: startPos.y,
        width: 0,
        height: 0,
      });
    } else if (tool === 'mindmap') {
      console.log('mindmap');
    } else {
      let innerWidget: AllWidgetTypes;
      // tool 타입에 따른 innerWidget 설정
      switch (tool) {
        case 'text':
          innerWidget = {
            id: Date.now().toString(),
            type: 'text',
            text: JSON.stringify([
              {
                type: 'paragraph',
                content: 'New Text',
              },
            ]),
            fontSize: FONT_SIZE,
            // x: Math.round(x / baseSpacing) * baseSpacing,
            // y: Math.round(y / baseSpacing) * baseSpacing,
            draggable: true,
            editable: true,
            resizeable: true,
            headerBar: true,
            footerBar: false,
          };
          break;
        default:
          return;
      }

      // 공통 shell 위 생성
      const newWidget: ShellWidgetProps<AllWidgetTypes> = {
        id: Date.now().toString(),
        type: 'shell',
        x: Math.round(x / baseSpacing) * baseSpacing,
        y: Math.round(y / baseSpacing) * baseSpacing,
        width: 472,
        height: 184,
        resizable: true,
        editable: true,
        draggable: true,
        from: [],
        to: [],
        innerWidget,
      };

      dispatch(addWidget(newWidget));
      dispatch(setSelectedWidget([newWidget.id]));
      setTool('select');
    }
    redraw();
  };

  // 드래그 시 마우스 위치 변경
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (isPanning) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      setOffset((prev) => ({
        x: prev.x + dx / scale,
        y: prev.y + dy / scale,
      }));
      setDragStart({ x: e.clientX, y: e.clientY });
      return;
    } else if (isSelecting && selectArea) {
      const rect = canvas.getBoundingClientRect();
      const currentX = (e.clientX - rect.left - offset.x * scale) / scale;
      const currentY = (e.clientY - rect.top - offset.y * scale) / scale;

      const width = Math.abs(currentX - dragStart.x);
      const height = Math.abs(currentY - dragStart.y);
      const selectX = Math.min(currentX, dragStart.x);
      const selectY = Math.min(currentY, dragStart.y);

      setSelectArea({
        startX: selectX,
        startY: selectY,
        width: width,
        height: height,
      });
      redraw();
    }

    if (tool === 'section' && sectionDraft) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const currentX = (e.clientX - rect.left - offset.x * scale) / scale;
      const currentY = (e.clientY - rect.top - offset.y * scale) / scale;

      const width = Math.abs(currentX - dragStart.x);
      const height = Math.abs(currentY - dragStart.y);
      const sectionX = Math.min(currentX, dragStart.x);
      const sectionY = Math.min(currentY, dragStart.y);

      setSectionDraft({
        x: Math.round(sectionX / baseSpacing) * baseSpacing,
        y: Math.round(sectionY / baseSpacing) * baseSpacing,
        width: Math.round(width / baseSpacing) * baseSpacing,
        height: Math.round(height / baseSpacing) * baseSpacing,
      });
      redraw();
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isSelecting && selectArea) {
      // 선택 영역 내의 위젯들 찾기 (center 타입 제외)
      const selectedIds = widgets
        .filter((widget) => {
          // center 타입인 경우 선택하지 않음
          if (widget.innerWidget.type === 'center') {
            return false;
          }

          const widgetRight = widget.x + widget.width;
          const widgetBottom = widget.y + widget.height;
          const areaRight = selectArea.startX + selectArea.width;
          const areaBottom = selectArea.startY + selectArea.height;

          return (
            widget.x < areaRight &&
            widgetRight > selectArea.startX &&
            widget.y < areaBottom &&
            widgetBottom > selectArea.startY
          );
        })
        .map((widget) => widget.id);
      dispatch(setSelectedWidget(selectedIds));
      // 선택 영역 내의 화살표 찾기
      const selectedArrows = arrows.filter((arrow) => {
        const startX = arrow.points[0];
        const startY = arrow.points[1];
        const endX = arrow.points[8];
        const endY = arrow.points[9];

        // 화살표의 시작점이나 끝점이 선택 영역 내에 있는지 확인
        return (
          (startX >= selectArea.startX &&
            startX <= selectArea.startX + selectArea.width &&
            startY >= selectArea.startY &&
            startY <= selectArea.startY + selectArea.height) ||
          (endX >= selectArea.startX &&
            endX <= selectArea.startX + selectArea.width &&
            endY >= selectArea.startY &&
            endY <= selectArea.startY + selectArea.height)
        );
      });

      if (selectedArrows.length > 0) {
        dispatch(setSelectedArrows(selectedArrows));
      }
      setIsSelecting(false);
      setSelectArea(null);
    }

    if (tool === 'section' && sectionDraft) {
      if (sectionDraft.width > 0 && sectionDraft.height > 0) {
        const innerWidget: SectionWidget = {
          id: Date.now().toString(),
          type: 'section',
          x: sectionDraft.x,
          y: sectionDraft.y,
          width: sectionDraft.width,
          height: sectionDraft.height,
          fill: 'rgba(200, 200, 200, 0.2)',
          memberIds: [],
          draggable: true,
          editable: false,
          resizeable: true,
          headerBar: false,
          footerBar: false,
        };

        const newWidget: ShellWidgetProps<AllWidgetTypes> = {
          id: Date.now().toString(),
          type: 'shell',
          x: sectionDraft.x,
          y: sectionDraft.y,
          width: sectionDraft.width,
          height: sectionDraft.height,
          resizable: true,
          editable: true,
          draggable: true,
          from: [],
          to: [],
          innerWidget,
        };

        dispatch(addWidget(newWidget));
      }
      setSectionDraft(null);
      setTool('select');
    }
    setIsPanning(false);
  };

  // 기존 텍스트 위젯만 필터링하는 함수 추가
  const getTextWidgets = (
    widgets: ShellWidgetProps<AllWidgetTypes>[]
  ): TextWidget[] => {
    return widgets
      .filter(
        (widget): widget is ShellWidgetProps<TextWidget> =>
          widget.innerWidget.type === 'text'
      )
      .map((widget) => widget.innerWidget);
  };

  // handleCreateTextNode 함수 수정
  const handleCreateTextNode = (text: string) => {
    const container = containerRef.current;
    if (!container) return;

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    const textWidgets = getTextWidgets(widgets);

    const newNode = createTextNode(
      text,
      containerWidth,
      containerHeight,
      textWidgets,
      widgets.length,
      scale,
      offset
    );

    // 새로운 위젯을 추가
    const newWidget: ShellWidgetProps<AllWidgetTypes> = {
      id: Date.now().toString(),
      type: 'shell',
      x: newNode.x ?? 0,
      y: newNode.y ?? 0,
      width: 200,
      height: 500,
      resizable: true,
      editable: true,
      draggable: true,
      from: [],
      to: [],
      innerWidget: newNode,
    };

    dispatch(addWidget(newWidget));
    // dispatch(setSelectedWidget(newWidget.id));  // 브레인 스톰 모드에서 text 위젯 생성시 선택
  };

  // 보드 생성 형식 / 저장 클릭 핸들러
  const handleSaveClick = useCallback(
    (e?: React.MouseEvent<HTMLButtonElement>) => {
      e?.preventDefault();

      if (!boardPosition || !contentTitle.trim()) {
        return;
      }

      // 제목과 내용을 분리
      const initialText = JSON.stringify([
        {
          type: 'paragraph',
          content: '', // 내용은 빈 문자열로 초기화
        },
      ]);

      const newBoard: ShellWidgetProps<AllWidgetTypes> = {
        id: `board-${widgets.length + 1}`,
        type: 'shell',
        x: boardPosition.x,
        y: boardPosition.y,
        width: 500,
        height: 500,
        resizable: true,
        editable: true,
        draggable: true,
        from: [],
        to: [],
        innerWidget: {
          id: `board-inner-${widgets.length + 1}`,
          type: 'boardLink',
          titleBlock: contentTitle, // 제목은 contentTitle 사용
          width: 500,
          height: 500,
          x: boardPosition.x,
          y: boardPosition.y,
          draggable: true,
          editable: true,
          resizeable: true,
          headerBar: true,
          footerBar: true,
          text: initialText, // 내용은 빈 텍스트로 초기화
        },
      };

      dispatch(addWidget(newBoard));

      setDialogOpen(false);
      setContentTitle('');
      setBoardPosition(null);
    },
    [boardPosition, contentTitle, widgets, dispatch]
  );

  // 보드 생성 버튼 클릭 핸들러 수정
  const handleAddBoard = useCallback(() => {
    setIsBoardPlacementMode(true); // 보드 배치 모드 활성화
  }, []);

  useDragAndDrop({
    containerRef,
    handleFileUpload,
  });

  // 붙여넣기를 통해 text, URL을 분류하고 추가하는 핸들러
  const handleUrlAdd = () => {
    if (url && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const centerPosition = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };

      // URL 유효성 검사
      const isUrl = /^(http|https):\/\/[^ "]+$/.test(url);
      if (isUrl) {
        addUrlWidgets(centerPosition, url);
        setUrl('https://'); // 입력 필드 초기화
      } else {
        addTextWidgets(centerPosition, url);
      }
      setTool('select');
    }
  };

  const { addTextWidgets, addUrlWidgets } = useClipboard({
    tool,
    activeShells,
    scale,
    offset,
    FONT_SIZE,
    mousePosition,
    setMousePosition,
  });

  const handleArrowMode = () => {
    setTool('arrow');
    dispatch(setIsArrowMode(true));
  };

  useEffect(() => {
    if (!isArrowMode) {
      setTool('select');
    }
  }, [isArrowMode]);

  // 화살표 선택을 위한 함수 추가
  const isPointNearArrow = (x: number, y: number, arrow: Arrow): boolean => {
    const tolerance = 10 / scale; // 클릭 허용 범위

    // 시작점과 끝점 사이의 거리 계산
    const dx = arrow.arrowTipX - arrow.points[0];
    const dy = arrow.arrowTipY - arrow.points[1];
    const length = Math.sqrt(dx * dx + dy * dy);

    // 점과 선 사이의 거리 계산
    const t =
      ((x - arrow.points[0]) * dx + (y - arrow.points[1]) * dy) /
      (length * length);
    const projX = arrow.points[0] + t * dx;
    const projY = arrow.points[1] + t * dy;

    const distance = Math.sqrt(Math.pow(x - projX, 2) + Math.pow(y - projY, 2));

    return distance < tolerance && t >= 0 && t <= 1;
  };

  useEffect(() => {
    if (isArrowMode && linkWidgets.length === 2) {
      addArrowWidget();
    }
  }, [linkWidgets]);

  const addArrowWidget = () => {
    if (linkWidgets.length === 2) {
      const [fromWidget, toWidget] = linkWidgets;
      dispatch(addWidgetFrom({ widgetId: toWidget.id, fromWidget }));
      dispatch(addWidgetTo({ widgetId: fromWidget.id, toWidget }));

      // 화살표 포인트 계산
      const arrowPoints = calculateArrowPoints(fromWidget, toWidget);

      // 새로운 화살표 객체 생성
      const newArrow: Arrow = {
        id: getTsid().toString(),
        fromId: fromWidget.id,
        toId: toWidget.id,
        ...arrowPoints,
      };

      console.log('newArrow:', newArrow);

      // Redux store에 화살표 추가
      dispatch(addArrow(newArrow));

      // linkWidgets 배열에서 처리된 위젯들 제거
      dispatch(deleteLinkWidget());

      dispatch(setIsArrowMode(false));
    }
  };

  // 키보드 이벤트 핸들러 추가

  useEffect(() => {
    if (arrows.length > 0) {
      // 중복 화살표 확인 및 제거
      const uniqueArrows = arrows.reduce((acc, current) => {
        const isDuplicate = acc.some(
          (arrow) =>
            (arrow.fromId === current.fromId && arrow.toId === current.toId) ||
            (arrow.fromId === current.toId && arrow.toId === current.fromId)
        );

        if (!isDuplicate) {
          acc.push(current);
        }

        return acc;
      }, [] as Arrow[]);

      // 복이 제거된 화살표 배열이 기존과 다르다면 업데이트
      if (uniqueArrows.length !== arrows.length) {
        console.log('중복 화살표가 제거됨:', uniqueArrows);
        dispatch(setArrows(uniqueArrows)); // setArrows 액션이 필요합니다
      }
      console.log('Updated arrows:', arrows);
    }
  }, [arrows]);
  // 디버깅을 위한 로그 추가
  // useEffect(() => {
  //   console.log("현재 렌더링될 위젯들:", widgets);
  // }, [widgets]);
  // 보드 리스트를 가져오는 함수
  const [boardList, setBoardList] = useState<Board[]>([]);
  const [isBoardListLoading, setIsBoardListLoading] = useState(false);
  const params = useParams();
  const workspaceId = params.workspaceId as string;

  // fetchBoards 함수 수정
  const fetchBoardList = async () => {
    try {
      setIsBoardListLoading(true);
      const boards = await fetchBoards(workspaceId);
      setBoardList(boards);
    } catch (error) {
      console.error('보드 리스트 로딩 실패:', error);
    } finally {
      setIsBoardListLoading(false);
    }
  };

  // fetchBoardList 함수 아래에 handleBoardSelect 함수 추가
  const handleBoardSelect = (board: Board) => {
    handleAddBoard();
    setBoardPosition(null);
    setContentTitle(board.data.focus);

    const boardUrl = `/${workspaceId}/board/${board.id}/data/`;

    // MouseEvent 타입을 DOM 이벤트로 변경
    const handleNextClick = (e: MouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = (e.clientX - rect.left - offset.x * scale) / scale;
      const y = (e.clientY - rect.top - offset.y * scale) / scale;

      const innerWidget: BoardWidget = {
        id: getTsid().toString(),
        type: 'boardLink',
        titleBlock: board.data.focus,
        text: boardUrl,
        x: Math.round(x / baseSpacing) * baseSpacing,
        y: Math.round(y / baseSpacing) * baseSpacing,
        width: 472,
        height: 300,
        draggable: true,
        editable: true,
        resizeable: true,
        headerBar: true,
        footerBar: false,
      };

      const newWidget: ShellWidgetProps<AllWidgetTypes> = {
        id: getTsid().toString(),
        type: 'shell',
        x: Math.round(x / baseSpacing) * baseSpacing,
        y: Math.round(y / baseSpacing) * baseSpacing,
        width: 472,
        height: 300,
        resizable: true,
        editable: true,
        draggable: true,
        from: [],
        to: [],
        innerWidget,
      };

      dispatch(addWidget(newWidget));
      setTool('select');

      // 이벤트 리스너 제거
      canvasRef.current?.removeEventListener('mousedown', handleNextClick);
    };

    // 다음 클릭을 위한 이벤트 리스너 추가
    canvasRef.current?.addEventListener('mousedown', handleNextClick);
  };

  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  // 마인드맵 시작
  // 선택된 위젯 정보 가져오기
  const state = useSelector((state: RootState) => state);

  useEffect(() => {
    getSelectedWidgetInfo(state);
  }, [state.whiteboard.selectedWidget]); // selectedWidget이 변경될 때마다 실행

  return (
    <div className='flex flex-col h-screen'>
      {/* 툴바 */}
      <div className='left-1/2 fixed bottom-8 border -translate-x-1/2 border-muted rounded-lg px-3 py-2 bg-white z-50 shadow-md h-12 flex items-center'>
        <div className='flex space-x-2 items-center '>
          <Button
            variant={tool === 'select' ? 'toolSelect' : 'white'}
            size='icon'
            onClick={() => setTool('select')}
          >
            <MousePointer2 className='h-4 w-4' />
            <span className='sr-only'>Select tool</span>
          </Button>
          <Separator orientation='vertical' className='h-6' />

          <Button
            variant={tool === 'text' ? 'toolSelect' : 'white'}
            size='icon'
            onClick={() => setTool('text')}
          >
            <Type className='h-4 w-4' />
            <span className='sr-only'>Text tool</span>
          </Button>
          <Button
            variant={tool === 'arrow' ? 'toolSelect' : 'white'}
            size='icon'
            onClick={handleArrowMode}
          >
            <MoveRight className='h-4 w-4' />
            <span className='sr-only'>Text tool</span>
          </Button>
          <Button
            variant={tool === 'section' ? 'toolSelect' : 'white'}
            size='icon'
            onClick={() => setTool('section')}
            className='group'
          >
            <SvgIcon
              fill='none'
              width={16}
              height={16}
              className='flex items-center justify-center'
            >
              {sectionSvg({
                isActive: tool === 'section',
                className: 'group-hover:stroke-teal-500',
              })}
            </SvgIcon>
            <span className='sr-only'>Text tool</span>
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={tool === 'boardLink' ? 'toolSelect' : 'white'}
                size='icon'
                onClick={() => {
                  setTool('boardLink');
                  fetchBoardList();
                }}
              >
                <Disc2 className='h-4 w-4' />
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-80'>
              <div className='space-y-4'>
                <div className='space-y-2'>
                  <h4 className='font-medium leading-none'>Select Board</h4>
                </div>
                {isBoardListLoading ? (
                  <div className='flex justify-center py-4'>
                    <Spinner size={24} />
                  </div>
                ) : (
                  <div className='max-h-[300px] overflow-y-auto space-y-2'>
                    {boardList.map((board: Board) => (
                      <Button
                        key={board.id}
                        variant='ghost'
                        className='w-full justify-start'
                        onClick={() => handleBoardSelect(board)}
                      >
                        <Disc2 className='mr-2 h-4 w-4' />
                        {board.data.focus}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
          <Button
            variant={tool === 'brainStorm' ? 'toolSelect' : 'white'}
            size='icon'
            onClick={() => {
              setTool('brainStorm');
              setIsBrainstormActive((prev) => !prev);
            }}
          >
            <Tornado className='h-4 w-4' />
            <span className='sr-only'>Text tool</span>
          </Button>
          <Button
            variant={tool === 'mindmap' ? 'toolSelect' : 'white'}
            size='icon'
            onClick={() => setTool('mindmap')}
          >
            <Boxes className='h-4 w-4' />
            <span className='sr-only'>Text tool</span>
          </Button>
          <Button
            variant={tool === 'refresh' ? 'toolSelect' : 'white'}
            size='icon'
            onClick={() => setTool('refresh')}
            disabled
          >
            <RefreshCw className='h-4 w-4' />
            <span className='sr-only'>Text tool</span>
          </Button>
          <Separator orientation='vertical' className='h-6' />
          <Button
            variant={tool === 'search' ? 'toolSelect' : 'white'}
            size='icon'
            onClick={() => setTool('search')}
          >
            <Search className='h-4 w-4' />
            <span className='sr-only'>Text tool</span>
          </Button>
          <Button
            variant={tool === 'upload' ? 'toolSelect' : 'white'}
            size='icon'
            onClick={() => handleFileUpload()}
          >
            <File className='h-4 w-4' />
            <span className='sr-only'>Text tool</span>
          </Button>
          {/* <Button
            variant={tool === 'url' ? 'toolSelect' : 'white'}
            size='icon'
            onClick={() => setTool('url')}
          >
            <AppWindowMacIcon className='h-4 w-4' />
            <span className='sr-only'>Text tool</span>
          </Button> */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={tool === 'url' ? 'toolSelect' : 'white'}
                size='icon'
                onClick={() => setTool('url')}
              >
                <AppWindowMacIcon className='h-4 w-4' />
                <span className='sr-only'>Text tool</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-120 bg-white'>
              <div className='grid gap-4'>
                <div className='space-y-2'>
                  <h4 className='font-medium leading-none'>Input URL</h4>
                  <p className='text-sm text-muted-foreground'>
                    You can input the URL of the page you want to embed.
                  </p>
                </div>
                <div className='grid gap-2'>
                  <div className='grid grid-cols-3 items-center gap-4'>
                    <Label htmlFor='url'>URL</Label>
                    <Input
                      id='url'
                      defaultValue='https://'
                      className='col-span-2 h-8'
                      onChange={(e) => setUrl(e.target.value)}
                    />
                  </div>
                  <Button
                    variant='outline'
                    size='icon'
                    className='w-full'
                    onClick={handleUrlAdd}
                  >
                    <Plus className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Button
            variant={tool === 'template' ? 'toolSelect' : 'white'}
            size='icon'
            onClick={() => setTool('template')}
          >
            <Shapes className='h-4 w-4' />
            <span className='sr-only'>Text tool</span>
          </Button>
          <Separator orientation='vertical' className='h-6' />
          <Button
            variant={tool === 'aiSearch' ? 'toolSelect' : 'white'}
            size='icon'
            onClick={() => setIsAIChatOpen(!isAIChatOpen)}
          >
            <HiOutlineSparkles className='h-4 w-4' />
            <span className='sr-only'>AI Assistant</span>
          </Button>
        </div>
      </div>
      <div className='left-1/2 fixed top-6 border -translate-x-1/2 border-muted rounded-lg px-3 py-2 bg-white z-50 shadow-md h-12 flex items-center space-x-2'>
        <div className='flex space-x-2 items-center'>
          <Button
            variant={tool === 'select' ? 'toolSelect' : 'white'}
            size='icon'
            onClick={() => setTool('select')}
          >
            <MousePointer2 className='h-4 w-4' />
            <span className='sr-only'>Select tool</span>
          </Button>
          <Button
            variant={tool === 'text' ? 'toolSelect' : 'white'}
            size='icon'
            onClick={() => setTool('text')}
          >
            <Type className='h-4 w-4' />
            <span className='sr-only'>Text tool</span>
          </Button>
          <Button
            variant={tool === 'arrow' ? 'toolSelect' : 'white'}
            size='icon'
            onClick={() => setTool('arrow')}
          >
            <MoveRight className='h-4 w-4' />
            <span className='sr-only'>Text tool</span>
          </Button>
        </div>
        <Separator orientation='vertical' className='h-6' />
        <div className='p-2 font-bold text-sm flex-1 min-w-0'>
          <h1 className='truncate'>How to survive in flood of technology</h1>
        </div>
        <Separator orientation='vertical' className='h-6' />
        <div className='flex space-x-2 items-center'>
          <Button
            variant={tool === 'select' ? 'toolSelect' : 'white'}
            size='icon'
            onClick={() => setTool('select')}
          >
            <MousePointer2 className='h-4 w-4' />
            <span className='sr-only'>Select tool</span>
          </Button>
          <Button
            variant={tool === 'text' ? 'toolSelect' : 'white'}
            size='icon'
            onClick={() => setTool('text')}
          >
            <Type className='h-4 w-4' />
            <span className='sr-only'>Text tool</span>
          </Button>
          <Button
            variant={tool === 'arrow' ? 'toolSelect' : 'white'}
            size='icon'
            onClick={() => setTool('arrow')}
          >
            <MoveRight className='h-4 w-4' />
            <span className='sr-only'>Text tool</span>
          </Button>
        </div>
      </div>
      <div ref={containerRef} className='flex-grow overflow-hidden relative'>
        <canvas
          ref={canvasRef}
          width={window.innerWidth}
          height={window.innerHeight}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className={`${spacePressed ? 'cursor-grab' : 'cursor-crosshair'} ${
            isPanning ? 'cursor-grabbing' : ''
          }`}
        />
        {/* WidgetShell 컴포넌트들을 렌더링 */}
        {widgets.map((widget) => (
          <MemoizedWidgetShell
            key={widget.id}
            widget={widget}
            scale={scale}
            offset={offset}
            draggable={widget.innerWidget.draggable}
            editable={widget.innerWidget.editable}
            resizeable={widget.innerWidget.resizeable}
            headerBar={widget.innerWidget.headerBar}
            footerBar={widget.innerWidget.footerBar}
            onEditModeChange={(isEdit) =>
              handleShellEditModeChange(widget.id, isEdit)
            }
            onPopupOpenChange={(isOpen) =>
              handleShellPopupOpenChange(widget.id, isOpen)
            }
          />
        ))}
        <CreateBoardDialog
          contentTitle={contentTitle}
          handleInputChange={handleInputChange}
          handleSaveClick={handleSaveClick}
          className='custom-dialog-class'
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
        <BrainstormInput
          onCreateNode={handleCreateTextNode}
          isActive={isBrainstormActive}
          setIsActive={setIsBrainstormActive}
          setTool={setTool}
        />
        <AIChat isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />
      </div>
    </div>
  );
}
