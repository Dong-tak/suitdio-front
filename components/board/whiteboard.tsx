'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
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
import { RootState } from '@/lib/redux/store';
import {
  addWidget,
  setSelectedWidget,
  setEditModeWidgets,
  addSelectedWidget,
} from '@/lib/redux/features/whiteboardSlice';
import {
  ShellWidgetProps,
  AllWidgetTypes,
  AllWidgetType,
  TextWidget,
  SectionWidget,
  IframeEmbedWidget,
  SelectArea,
} from '@/lib/type';
import '@blocknote/core/fonts/inter.css';
import '@blocknote/mantine/style.css';
import WidgetShell from '../widget/widgetShell';
import SvgIcon from '@/lib/utils/svgIcon';
import { sectionSvg } from '@/lib/utils/svgBag';
import { HiOutlineSparkles } from 'react-icons/hi2';
import { Separator } from '../ui/separator';
import { createTextNode } from '@/lib/utils/textNodeCreator';
import BrainstormInput from '../widget/widgetBrainstorm';
import CreateBoardDialog from '../ui/creatboard';
import FocusControlBar from '../ui/FocusControlBar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Label } from '../ui/label';
import { Input } from '../ui/input';

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
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [tool, setTool] = useState<'select' | AllWidgetType>('select');
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [spacePressed, setSpacePressed] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
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
  const selectedWidgets = useSelector(
    (state: RootState) => state.whiteboard.selectedWidget
  );
  const [url, setUrl] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

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

  // 입력 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContentTitle(e.target.value);
  };

  // 스페이스바 누르면 드래그 모드, 떼면 드래그 모드 종료
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !spacePressed) {
        setSpacePressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setSpacePressed(false);
        setIsPanning(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [spacePressed]);

  //20px을 기준으로 그리드 그리기
  const drawGrid = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      ctx.save();

      // 줌 레벨에 따른 그리드 간격과 점 크기 조정
      if (scale < 0.3) {
        baseSpacing = 60;
        basePointSize = 4;
      } else {
        baseSpacing = 48;
      }

      ctx.strokeStyle = '#DBDBDB';
      ctx.lineWidth = basePointSize;

      // 화면에 보이는 영역의 좌표 계산
      const canvas = canvasRef.current;
      if (!canvas) return;

      const visibleStartX = -offset.x;
      const visibleEndX = canvas.width / scale - offset.x;
      const visibleStartY = -offset.y;
      const visibleEndY = canvas.height / scale - offset.y;

      // 그리드 시작점을 간격에 맞춰 조정
      const startX = Math.floor(visibleStartX / baseSpacing) * baseSpacing;
      const startY = Math.floor(visibleStartY / baseSpacing) * baseSpacing;

      // 화면에 보이는 영역만 그리드 그리기
      for (let x = startX; x < visibleEndX; x += baseSpacing) {
        for (let y = startY; y < visibleEndY; y += baseSpacing) {
          ctx.beginPath();
          ctx.arc(x, y, basePointSize * 0.25, 0, 2 * Math.PI);
          ctx.stroke();
        }
      }
      ctx.restore();
    },
    [offset, scale]
  );

  //브라우저 줌 이벤트 방지
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const preventDefault = (e: WheelEvent) => {
      e.preventDefault();
    };

    container.addEventListener('wheel', preventDefault, { passive: false });

    return () => {
      container.removeEventListener('wheel', preventDefault);
    };
  }, []);

  // window 좌표 기준의 마우스 위치 기준으로 줌인, 줌아웃 구현
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (isZooming) {
        setMousePosition({ x: e.clientX, y: e.clientY });
      }
    };

    const handleGlobalWheel = (e: WheelEvent) => {
      if (e.metaKey || e.ctrlKey) {
        e.preventDefault();

        // 줌 시작 시 상태 설정
        if (!isZooming) {
          setIsZooming(true);
          setMousePosition({ x: e.clientX, y: e.clientY });
        }

        const delta = e.deltaY;
        const zoomFactor = Math.exp(-delta * ZOOM_SPEED);
        const newScale = Math.min(Math.max(scale * zoomFactor, 0.1), 5);

        if (mousePosition) {
          const rect = containerRef.current?.getBoundingClientRect();
          if (!rect) return;

          // Screen 좌표���서 컨테이너의 상대적 위치 계산
          const pointX = (mousePosition.x - rect.left) / scale;
          const pointY = (mousePosition.y - rect.top) / scale;

          // 새로운 오프셋 계산
          const newOffset = {
            x: offset.x + (pointX * (scale - newScale)) / newScale,
            y: offset.y + (pointY * (scale - newScale)) / newScale,
          };

          setScale(newScale);
          setOffset(newOffset);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Meta' || e.key === 'Control') {
        setIsZooming(false);
        setMousePosition(null);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('wheel', handleGlobalWheel, { passive: false });
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('wheel', handleGlobalWheel);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [scale, offset, isZooming, mousePosition]);

  //scale, offset 변경 시 그리드 그리기
  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(scale, scale);
    ctx.translate(offset.x, offset.y);

    drawGrid(ctx);

    // 섹션 드래프트 그리기
    if (sectionDraft) {
      ctx.fillStyle = 'rgba(200, 200, 200, 0.2)';
      ctx.strokeStyle = '#00A3FF';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.rect(
        sectionDraft.x,
        sectionDraft.y,
        sectionDraft.width,
        sectionDraft.height
      );
      ctx.fill();
      ctx.stroke();
    }

    // 선택 영역 그리기
    if (selectArea) {
      ctx.strokeStyle = '#2196F3';
      ctx.fillStyle = 'rgba(33, 150, 243, 0.1)';
      ctx.lineWidth = 1 / scale;
      ctx.beginPath();
      ctx.rect(
        selectArea.startX,
        selectArea.startY,
        selectArea.width,
        selectArea.height
      );
      ctx.fill();
      ctx.stroke();
    }

    ctx.restore();
  }, [scale, offset, sectionDraft, selectArea]);

  useEffect(() => {
    redraw();
  }, [scale, offset, redraw]);

  // 파일 업로드 처리
  const processFile = (file: File, dataUrl: string) => {
    const centerX = (window.innerWidth / 2 - offset.x * scale) / scale;
    const centerY = (window.innerHeight / 2 - offset.y * scale) / scale;
    let innerWidget: AllWidgetTypes;

    if (file.type.startsWith('image/')) {
      innerWidget = {
        id: Date.now().toString(),
        type: 'image',
        src: dataUrl,
        x: Math.round(centerX / baseSpacing) * baseSpacing,
        y: Math.round(centerY / baseSpacing) * baseSpacing,
        width: 472,
        name: file.name,
        draggable: true,
        editable: true,
        resizeable: true,
        headerBar: true,
        footerBar: false,
      };
    } else if (file.type === 'application/pdf') {
      innerWidget = {
        id: Date.now().toString(),
        type: 'pdf',
        src: dataUrl,
        x: Math.round(centerX / baseSpacing) * baseSpacing,
        y: Math.round(centerY / baseSpacing) * baseSpacing,
        width: 460,
        draggable: true,
        editable: true,
        resizeable: true,
        headerBar: true,
        footerBar: false,
      };
    } else if (
      file.type === 'text/markdown' ||
      file.type === 'text/x-markdown'
    ) {
      innerWidget = {
        id: Date.now().toString(),
        type: 'text',
        src: dataUrl,
        fontSize: FONT_SIZE,
        x: Math.round(centerX / baseSpacing) * baseSpacing,
        y: Math.round(centerY / baseSpacing) * baseSpacing,
        draggable: true,
        editable: true,
        resizeable: true,
        headerBar: true,
        footerBar: false,
      };
    } else {
      console.warn(`지원되지 않는 파일 형식: ${file.type}`);
      return;
    }

    const newWidget: ShellWidgetProps<AllWidgetTypes> = {
      id: Date.now().toString(),
      type: 'shell',
      x: Math.round(centerX / baseSpacing) * baseSpacing,
      y: Math.round(centerY / baseSpacing) * baseSpacing,
      width: 472,
      height: 184,
      resizable: true,
      editable: true,
      draggable: true,
      innerWidget,
    };

    dispatch(addWidget(newWidget));
    dispatch(addSelectedWidget(newWidget.id));
    setTool('select');
  };

  // 파일 업로드 핸들러(drag 파일이 존재할 경우 바로 실행)
  const handleFileUpload = (dragFile?: File) => {
    const handleFile = (file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          processFile(file, event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    };

    if (dragFile) {
      handleFile(dragFile);
      return;
    }

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*, application/pdf, text/markdown';
    fileInput.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.files?.[0]) {
        handleFile(target.files[0]);
      }
    };
    fileInput.click();
  };

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

      // 공통 shell 위젯 생성
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
      // 선택 영역 내의 위젯들 찾기
      const selectedIds = widgets
        .filter((widget) => {
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
      setIsSelecting(false);
      setSelectArea(null);
    }
    // Shift 키가 눌려있으면 기존 선택에 추가

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
      innerWidget: newNode,
    };

    dispatch(addWidget(newWidget));
    // dispatch(setSelectedWidget(newWidget.id));  // 브레인 스톰 모드에서 text 위젯 생성시 선택
  };

  // 저장 클릭 핸들러 수정
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
        height: 300,
        resizable: true,
        editable: true,
        draggable: true,
        innerWidget: {
          id: `board-inner-${widgets.length + 1}`,
          type: 'boardLink',
          titleBlock: contentTitle, // 제목은 contentTitle 사용
          width: 500,
          height: 300,
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

  // 드래그 앤 드롭 이벤트 리스너
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('dragover', handleDragOver);
      container.addEventListener('drop', handleDrop);
    }

    return () => {
      if (container) {
        container.removeEventListener('dragover', handleDragOver);
        container.removeEventListener('drop', handleDrop);
      }
    };
  }, []);

  // 드래그 오버 핸들러
  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // 드롭 핸들러
  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer?.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

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

  // 현재 마우스 위치로 클립보드 붙여넣기
  useEffect(() => {
    if (tool !== 'url') {
      const handlePaste = (e: ClipboardEvent) => {
        e.preventDefault();
        const pastedText = e.clipboardData?.getData('text');

        if (pastedText && mousePosition) {
          const isUrl = /^(http|https):\/\/[^ "]+$/.test(pastedText);
          if (isUrl) {
            addUrlWidgets(mousePosition, pastedText);
          } else {
            addTextWidgets(mousePosition, pastedText);
          }
        }
      };

      const handleMouseMove = (e: MouseEvent) => {
        setMousePosition({ x: e.clientX, y: e.clientY });
      };

      document.addEventListener('paste', handlePaste);
      document.addEventListener('mousemove', handleMouseMove);

      return () => {
        document.removeEventListener('paste', handlePaste);
        document.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, [widgets, mousePosition]);

  // 현재 마우스 위치로 텍스트 위젯 추가
  const addTextWidgets = (mousePos: { x: number; y: number }, text: string) => {
    const x = (mousePos.x - offset.x * scale) / scale;
    const y = (mousePos.y - offset.y * scale) / scale;

    const innerWidget: TextWidget = {
      id: Date.now().toString(),
      type: 'text',
      mkText: text,
      fontSize: FONT_SIZE,
      draggable: true,
      editable: true,
      resizeable: true,
      headerBar: true,
      footerBar: false,
    };
    const newWidget: ShellWidgetProps<AllWidgetTypes> = {
      id: Date.now().toString(),
      type: 'shell',
      width: 472,
      height: 184,
      x,
      y,
      resizable: true,
      editable: true,
      draggable: true,
      innerWidget,
    };
    dispatch(addWidget(newWidget));
  };

  // 현재 마우스 위치로 URL 위젯 추가
  const addUrlWidgets = (mousePos: { x: number; y: number }, text: string) => {
    const x = (mousePos.x - offset.x * scale) / scale;
    const y = (mousePos.y - offset.y * scale) / scale;

    const innerWidget: IframeEmbedWidget = {
      id: Date.now().toString(),
      type: 'url',
      src: text,
      draggable: true,
      editable: true,
      resizeable: true,
      headerBar: true,
      footerBar: false,
    };
    const newWidget: ShellWidgetProps<AllWidgetTypes> = {
      id: Date.now().toString(),
      type: 'shell',
      width: 472,
      height: 712, // URL 위젯 기본 높이
      x,
      y,
      resizable: true,
      editable: true,
      draggable: true,
      innerWidget,
    };
    dispatch(addWidget(newWidget));
  };

  return (
    <div className='flex flex-col h-screen'>
      {/* 툴바 */}
      <div className='left-1/2 fixed bottom-8 border -translate-x-1/2 border-muted rounded-lg p-1 bg-white z-50 shadow-md h-11'>
        <div className='flex space-x-2 items-center'>
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
            onClick={() => setTool('arrow')}
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
          <Button
            variant={tool === 'boardLink' ? 'toolSelect' : 'white'}
            size='icon'
            onClick={() => {
              setTool('boardLink');
              handleAddBoard();
            }}
          >
            <Disc2 className='h-4 w-4' />
            <span className='sr-only'>Text tool</span>
          </Button>
          <Separator orientation='vertical' className='h-6' />
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
            onClick={() => setTool('aiSearch')}
          >
            <HiOutlineSparkles className='h-4 w-4' />
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
          <WidgetShell
            key={widget.id}
            widget={widget}
            scale={scale}
            offset={offset}
            draggable={widget.innerWidget.draggable}
            editable={widget.innerWidget.editable}
            resizeable={widget.innerWidget.resizeable}
            headerBar={widget.innerWidget.headerBar}
            footerBar={widget.innerWidget.footerBar}
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
      </div>
    </div>
  );
}
