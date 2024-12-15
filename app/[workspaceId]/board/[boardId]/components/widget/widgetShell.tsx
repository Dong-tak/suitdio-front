import React, { use, useEffect, useState } from 'react';
import {
  AllWidgetTypes,
  EdgePosition,
  NODE_WIDGET_TYPES,
  NodeWidgetType,
  ShellWidgetProps,
  SectionWidget,
  isSection,
  Arrow,
} from '@/types/type';
import WidgetText from './widgetText';
import WidgetBoard from './widgetBoard';
import WidgetSection from './widgetSection';
import { useDispatch, useSelector } from 'react-redux';

import {
  addSelectedWidget,
  addWidgetFrom,
  addWidgetTo,
  deleteSelectedWidget,
  deleteWidget,
  setEditModeWidgets,
  setIsReduced,
  setSelectedWidget,
  updateWidget,
} from '@/redux/features/whiteboardSlice';
import {
  snap,
  snapHeight,
  snapWidgetPosition,
  snapWidgetResize,
} from '@/app/[workspaceId]/board/[boardId]/utils/snapping';
import { RootState } from '@/redux/store';
import { ChevronDown, Ellipsis, Info } from 'lucide-react';
import SvgIcon from '@/utils/svgIcon';
import {
  arrowModeSvg,
  chevronDownSvg8px,
  circleSvg,
  downWrapArrow,
  pauseSvg,
  recordSvg,
  sixBoltSvg,
  wideFrameSvg8px,
} from '@/utils/svgBag';
import {
  isCompletelyContained,
  updateSectionAndMembers,
  updateSectionResize,
  limitMovementInSection,
} from '../../utils/sectionHelpers';
import {
  addArrow,
  addLinkWidgets,
  deleteLinkWidget,
  setArrows,
  setIsArrowMode,
  setSelectedArrows,
  updateArrow,
} from '@/redux/features/arrowSlice';
import WidgetImage from './widgetImage';
import WidgetPdf from './widgetPdf';
import WidgetUrl from './widgetUrl';

import { calculateArrowPoints } from '../arrow/drawArrow';
import { getTsid } from 'tsid-ts';
import WidgetCenter from './widgetCenter';
import { useDebounceDispatch } from '../../hooks/use-debounce';
import { Button } from '@/components/ui/button';
import WidgetPopup from '../popup/popup';
interface WidgetShellProps {
  widget: ShellWidgetProps<AllWidgetTypes>;
  scale: number;
  offset: { x: number; y: number };
  draggable: boolean;
  editable: boolean;
  resizeable: boolean;
  headerBar: boolean;
  footerBar: boolean;
  fill?: string;
  memberIds?: string[];
  onEditModeChange?: (isEditMode: boolean) => void;
  onPopupOpenChange?: (isPopupOpen: boolean) => void;
}

//resize 핸들 스타일 함수
const getHandleStyle = (position: string): React.CSSProperties => {
  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    backgroundColor: 'transparent',
  };

  switch (position) {
    // 모서리 핸들
    case 'nw':
      return {
        ...baseStyle,
        top: '-8px',
        left: '-8px',
        width: '16px',
        height: '16px',
        cursor: 'nw-resize',
      };
    case 'ne':
      return {
        ...baseStyle,
        top: '-8px',
        right: '-8px',
        width: '16px',
        height: '16px',
        cursor: 'ne-resize',
      };
    case 'sw':
      return {
        ...baseStyle,
        bottom: '-8px',
        left: '-8px',
        width: '16px',
        height: '16px',
        cursor: 'sw-resize',
      };
    case 'se':
      return {
        ...baseStyle,
        bottom: '-8px',
        right: '-8px',
        width: '16px',
        height: '16px',
        cursor: 'se-resize',
      };
    // 면 핸들
    case 'n':
      return {
        ...baseStyle,
        top: '-4px',
        left: '16px', // 모서리 핸들을 피해서 시작
        right: '16px', // 모서리 핸들을 피해서 끝
        height: '8px',
        cursor: 'n-resize',
      };
    case 's':
      return {
        ...baseStyle,
        bottom: '-4px',
        left: '16px',
        right: '16px',
        height: '8px',
        cursor: 's-resize',
      };
    case 'w':
      return {
        ...baseStyle,
        left: '-4px',
        top: '16px',
        bottom: '16px',
        width: '8px',
        cursor: 'w-resize',
      };
    case 'e':
      return {
        ...baseStyle,
        right: '-4px',
        top: '16px',
        bottom: '16px',
        width: '8px',
        cursor: 'e-resize',
      };
    default:
      return baseStyle;
  }
};

export default function WidgetShell({
  widget,
  scale,
  offset,
  draggable,
  editable,
  resizeable,
  headerBar,
  footerBar,
  fill,
  memberIds,
  onEditModeChange,
  onPopupOpenChange,
}: WidgetShellProps) {
  const dispatch = useDispatch();
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isNodeWidget, setIsNodeWidget] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [hoveredEdge, setHoveredEdge] = useState<EdgePosition>(null);
  const [isArrowNodeHovered, setIsArrowNodeHovered] = useState(false);
  const [isReduced, setIsReduced] = useState(false);
  const widgets = useSelector((state: RootState) => state.whiteboard.widgets);
  const [snappedHeight, setSnappedHeight] = useState(widget.height || 132);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const isArrowMode = useSelector(
    (state: RootState) => state.arrow.isArrowMode
  );
  const editModeWidgets = useSelector(
    (state: RootState) => state.whiteboard.editModeWidgets
  );
  const selectedWidget = useSelector(
    (state: RootState) => state.whiteboard.selectedWidget
  );
  const linkWidgets = useSelector(
    (state: RootState) => state.arrow.linkWidgets
  );
  const arrows = useSelector((state: RootState) => state.arrow.arrows);

  const [visualPosition, setVisualPosition] = useState({
    x: widget.x,
    y: widget.y,
    width: widget.width,
    height: widget.height,
  });

  const spacePressed = useSelector(
    (state: RootState) => state.whiteboard.spacePressed
  );

  const { debouncedUpdateWidget } = useDebounceDispatch();

  useEffect(() => {
    setVisualPosition({
      x: widget.x,
      y: widget.y,
      width: widget.width,
      height: widget.height,
    });
  }, [widget.x, widget.y, widget.width, widget.height]);

  useEffect(() => {
    setIsSelected(selectedWidget?.includes(widget.id) ?? false);
    if (selectedWidget !== null && selectedWidget !== editModeWidgets) {
      dispatch(setEditModeWidgets(null));
    }
  }, [selectedWidget]);

  useEffect(() => {
    setIsEditMode(editModeWidgets === widget.id);
  }, [editModeWidgets]);

  useEffect(() => {
    onEditModeChange?.(isEditMode);
  }, [isEditMode]);

  useEffect(() => {
    onPopupOpenChange?.(isPopupOpen);
  }, [isPopupOpen]);

  useEffect(() => {
    if (isSelected) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isSelected]);

  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing]);

  useEffect(() => {
    setIsNodeWidget(isNodeWidgetType(widget.innerWidget.type));
  }, [widget.innerWidget.type]);

  useEffect(() => {
    handleHeightChange(widget.height);
  }, [isReduced]);

  useEffect(() => {
    if (isArrowMode && linkWidgets.length === 2) {
      addArrowWidget();
    }
  }, [linkWidgets]);

  const addArrowWidget = () => {
    if (linkWidgets.length === 2) {
      const [fromWidget, toWidget] = linkWidgets;

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

      // 중복이 제거된 화살표 배열이 기존과 다르다면 업데이트
      if (uniqueArrows.length !== arrows.length) {
        console.log('중복 화살표가 제거됨:', uniqueArrows);
        dispatch(setArrows(uniqueArrows)); // setArrows 액션이 필요합니다
      }
      console.log('Updated arrows:', arrows);
    }
  }, [arrows]);

  useEffect(() => {
    updateArrowPos();
  }, [widget.x, widget.y, widget.width, widget.height]);

  const updateArrowPos = () => {
    // 현재 위젯과 관련된 모든 화살표 찾기
    const relatedArrows = arrows.filter(
      (arrow) => arrow.fromId === widget.id || arrow.toId === widget.id
    );

    relatedArrows.forEach((arrow) => {
      // 현재 위젯이 시작점인지 끝점인지에 따라 다른 위젯 찾기
      const otherWidgetId =
        arrow.fromId === widget.id ? arrow.toId : arrow.fromId;
      const otherWidget = widgets.find((w) => w.id === otherWidgetId);

      if (otherWidget) {
        // 화살표 포인트 계산 시 올바른 순서로 위젯 전달
        const newPoints = calculateArrowPoints(
          arrow.fromId === widget.id ? widget : otherWidget,
          arrow.fromId === widget.id ? otherWidget : widget
        );
        console.log(arrows);

        dispatch(
          updateArrow({
            id: arrow.id,
            fromId: arrow.fromId,
            toId: arrow.toId,
            points: newPoints.points,
            arrowTipX: newPoints.arrowTipX,
            arrowTipY: newPoints.arrowTipY,
          })
        );
      }
    });
  };

  const handleHeightChange = (height: number) => {
    if (height !== widget.height) {
      // header 높이 52px 추가
      if (headerBar) {
        height = height + 52;
      }
      if (footerBar) {
        height = height + 52;
      }
      const snappedHeight = snapHeight(height);
      setSnappedHeight(snappedHeight);
      console.log(snappedHeight);
      debouncedUpdateWidget({
        ...widget,
        height: snappedHeight,
      });
      // dispatch(
      //   updateWidget({
      //     ...widget,
      //     height: snappedHeight,
      //   })
      // );
    }
  };

  const handleTextChange = (text: string) => {
    if (widget.innerWidget.type === 'text') {
      debouncedUpdateWidget({
        ...widget,
        innerWidget: { ...widget.innerWidget, text },
      });
    }
  };

  // arrow 노드 스타일 함수 수정
  const setArrowNodeStyle = (position: string): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      width: hoveredEdge === position ? '10px' : '6px', // hover 시 크기 증가
      height: hoveredEdge === position ? '10px' : '6px',
      backgroundColor: '#FFB300',
      outline:
        hoveredEdge === position
          ? 'none'
          : `${
              isEditMode
                ? '2px solid black'
                : isSelected
                ? '2px solid #BBDEFB'
                : '#e0e0e0'
            }`,
      borderRadius: '50%',
      display: hoveredEdge === position ? 'block' : 'none',
      cursor: 'pointer',
      zIndex: 10, // resize 핸들보다 위에 표시
      transition: 'all 0.2s ease',
    };

    const positions = {
      n: {
        top: hoveredEdge === 'n' ? '-6px' : '-4px',
        left: '50%',
        transform: 'translateX(-50%)',
      },
      s: {
        bottom: hoveredEdge === 's' ? '-6px' : '-4px',
        left: '50%',
        transform: 'translateX(-50%)',
      },
      w: {
        left: hoveredEdge === 'w' ? '-6px' : '-4px',
        top: '50%',
        transform: 'translateY(-50%)',
      },
      e: {
        right: hoveredEdge === 'e' ? '-6px' : '-4px',
        top: '50%',
        transform: 'translateY(-50%)',
      },
    };

    return {
      ...baseStyle,
      ...(positions[position as keyof typeof positions] || {}),
    };
  };

  // arrow node hover 핸들러
  const handleArrowNodeHover = (
    position: EdgePosition,
    isHovering: boolean,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setIsArrowNodeHovered(isHovering);
    if (isHovering) {
      setHoveredEdge(position);
    }
    if (!isHovering) {
      setHoveredEdge(null);
    }
  };

  const renderInnerWidget = () => {
    switch (widget.innerWidget.type) {
      case 'text':
        return (
          <WidgetText
            {...widget.innerWidget}
            height={widget.innerWidget.height}
            editable={editable ? isEditMode : false}
            autoFocus={isEditMode}
            onHeightChange={handleHeightChange}
            onTextChange={handleTextChange}
          />
        );
      case 'section':
        const sectionWidget = {
          ...widget,
          type: 'shell' as const,
          innerWidget: {
            ...widget.innerWidget,
            type: 'section' as const,
            fill: widget.innerWidget.fill || 'rgba(200, 200, 200, 0.2)',
            memberIds: (widget.innerWidget as SectionWidget).memberIds || [],
          },
        } satisfies ShellWidgetProps<SectionWidget>;

        return (
          <WidgetSection
            widget={sectionWidget}
            isSelected={isSelected}
            onSelect={() => dispatch(addSelectedWidget(widget.id))}
            onChange={(newAttrs) => {
              debouncedUpdateWidget({
                ...widget,
                ...newAttrs,
              });
            }}
            shapes={widgets}
            updateShapes={(newShapes) => {
              newShapes.forEach((shape) => {
                debouncedUpdateWidget(shape);
              });
            }}
            scale={scale}
            offset={offset}
          />
        );

      case 'boardLink':
        return (
          <div className='flex flex-col h-full'>
            {headerBar && (
              <h2 className='text-xl font-semibold text-center'>
                {widget.innerWidget.titleBlock}
              </h2>
            )}

            <div className='flex-grow p-4'>
              <WidgetBoard
                {...widget.innerWidget}
                editable={false}
                autoFocus={false}
                onHeightChange={handleHeightChange}
                fontSize={16}
              />
            </div>
          </div>
        );
      case 'image':
        return (
          <WidgetImage
            {...widget.innerWidget}
            width={widget.width}
            onHeightChange={handleHeightChange}
            isReduced={isReduced}
          />
        );
      case 'pdf':
        return (
          <WidgetPdf
            {...widget.innerWidget}
            width={widget.width}
            onHeightChange={handleHeightChange}
            isReduced={isReduced}
          />
        );
      case 'url':
        return (
          <WidgetUrl
            {...widget.innerWidget}
            width={widget.width}
            height={widget.height}
            onHeightChange={handleHeightChange}
            isReduced={isReduced}
          />
        );
      case 'center':
        return (
          <div className='flex flex-col h-full'>
            {headerBar && (
              <h2 className='text-xl font-semibold text-start px-4'>
                {widget.innerWidget.titleBlock}
              </h2>
            )}
            <div className='flex-grow flex-col'>
              <WidgetCenter
                {...widget.innerWidget}
                height={widget.height}
                editable={widget.editable && widget.innerWidget.editable}
                autoFocus={false}
                onHeightChange={handleHeightChange}
                fontSize={16}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // 드래그 핸들러
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isEditMode && draggable && !isArrowNodeHovered) {
      e.preventDefault();
      e.stopPropagation();

      if (
        e.target instanceof HTMLElement &&
        e.target.classList.contains('resize-handle') &&
        resizeable
      ) {
        setIsResizing(true);
        setResizeDirection(e.target.classList[1]); // nw, ne, sw, se
      } else {
        setIsDragging(true);
      }
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging && !isResizing) return;
    e.preventDefault();
    e.stopPropagation();

    if (isDragging) {
      const { x: snappedX, y: snappedY } = snapWidgetPosition(
        e.clientX - dragStart.x + widget.x * scale,
        e.clientY - dragStart.y + widget.y * scale,
        scale
      );

      const dx = snappedX / scale - widget.x;
      const dy = snappedY / scale - widget.y;

      // 시각적 위치 즉시 업데이트
      setVisualPosition({
        ...visualPosition,
        x: snappedX / scale,
        y: snappedY / scale,
      });

      if (Array.isArray(selectedWidget) && selectedWidget.includes(widget.id)) {
        // Shift 키가 눌려있지 않으면 기존 선택 해제
        selectedWidget.forEach((id) => {
          const targetWidget = widgets.find((w) => w.id === id);
          if (targetWidget) {
            debouncedUpdateWidget({
              ...targetWidget,
              x: targetWidget.x + dx,
              y: targetWidget.y + dy,
            });
          }
        });
      }

      if (isSection(widget.innerWidget)) {
        // 섹션 이동 시 멤버들도 함께 이동
        const updatedShapes = updateSectionAndMembers(widget, dx, dy, widgets);
        updatedShapes.forEach((shape) => {
          debouncedUpdateWidget(shape);
        });
      } // 객체를 드래그하는 경우
      else {
        const newX = snappedX / scale;
        const newY = snappedY / scale;

        // 현재 객체의 포함 관계를 즉시 업데이트
        widgets.forEach((otherWidget) => {
          if (
            isSection(otherWidget.innerWidget) &&
            otherWidget.id !== widget.id
          ) {
            const isCurrentlyMember =
              otherWidget.innerWidget.memberIds.includes(widget.id);
            const isNowContained = isCompletelyContained(
              { ...widget, x: newX, y: newY },
              otherWidget
            );

            if (isNowContained && !isCurrentlyMember) {
              // 객체가 섹션 내부에 있고, 현재 멤버가 아니라면 추가
              debouncedUpdateWidget({
                ...otherWidget,
                innerWidget: {
                  ...otherWidget.innerWidget,
                  memberIds: [...otherWidget.innerWidget.memberIds, widget.id],
                },
              });
            } else if (!isNowContained && isCurrentlyMember) {
              // 객체가 섹션 내부에 없고, 현재 멤버라면 제거
              debouncedUpdateWidget({
                ...otherWidget,
                innerWidget: {
                  ...otherWidget.innerWidget,
                  memberIds: otherWidget.innerWidget.memberIds.filter(
                    (id: string) => id !== widget.id
                  ),
                },
              });
            }
          }
        });

        // 객체 위치 업데이트
        debouncedUpdateWidget({
          ...widget,
          x: newX,
          y: newY,
        });
      }
    } else if (isResizing) {
      // 기존 크기 조절 로직 유지
      // 섹션 크기 조절 시 멤버들의 위치와 크기 조절은 sectionHelpers.ts 에서 처리
      if (isSection(widget.innerWidget)) {
        const newPositions = snapWidgetResize(
          resizeDirection!,
          dragStart,
          { x: e.clientX, y: e.clientY },
          widget,
          scale,
          isNodeWidget ? 8 : 0
        );

        // 시각적 위치 즉시 업데이트 추가
        setVisualPosition({
          x: newPositions.x,
          y: newPositions.y,
          width: newPositions.width,
          height: newPositions.height,
        });

        const updatedShapes = updateSectionResize(
          widget,
          newPositions.width,
          newPositions.height,
          newPositions.x,
          newPositions.y,
          widgets
        );

        updatedShapes.forEach((shape) => {
          debouncedUpdateWidget(shape);
        });
      } else {
        // 일반 위젯의 크기 조절
        const newPositions = snapWidgetResize(
          resizeDirection!,
          dragStart,
          { x: e.clientX, y: e.clientY },
          widget,
          scale,
          isNodeWidget ? 8 : 0
        );

        // 시각적 위치 즉시 업데이트 추가
        setVisualPosition({
          x: newPositions.x,
          y: newPositions.y,
          width: newPositions.width,
          height: newPositions.height,
        });

        debouncedUpdateWidget({
          ...widget,
          ...newPositions,
        });
      }
    }

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeDirection(null);
  };

  // 더블클릭 핸들러 추가
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (
      widget.innerWidget.type === 'text' ||
      widget.innerWidget.type === 'url' ||
      widget.innerWidget.type === 'pdf'
    ) {
      dispatch(setEditModeWidgets(widget.id));
      dispatch(setSelectedWidget(null));
    }
  };

  // 키보드 삭제 이벤트
  const handleKeyDown = (e: KeyboardEvent) => {
    if (isEditMode) return;
    if (isSelected && (e.key === 'Delete' || e.key === 'Backspace'))
      if (widget.innerWidget.type !== 'center') {
        //중앙 위젯 예외 처리
        dispatch(deleteWidget(widget.id));
      }
  };

  // 타입 가드 헬퍼 함수
  const isNodeWidgetType = (type: string): type is NodeWidgetType => {
    return NODE_WIDGET_TYPES.includes(type as NodeWidgetType);
  };

  // 호버 이벤트 핸들러
  const handleEdgeHover = (position: EdgePosition) => {
    setHoveredEdge(position);
  };

  const handleWidgetClick = (e: React.MouseEvent) => {
    console.log('widgetFrom:', widget.from, 'widgetTo:', widget.to);
    if (isArrowMode) {
      dispatch(addLinkWidgets(widget));
    }
    if (selectedWidget && selectedWidget.includes(widget.id)) {
      if (e.shiftKey) {
        dispatch(deleteSelectedWidget(widget.id));
      } else {
        dispatch(setSelectedWidget([widget.id]));
        dispatch(setSelectedArrows([]));
      }
    } else if (!isEditMode) {
      if (e.shiftKey) {
        dispatch(addSelectedWidget(widget.id));
      } else {
        dispatch(setSelectedWidget([widget.id]));
        dispatch(setSelectedArrows([]));
      }
    }
  };

  // 축소 버튼 클릭 핸들러
  const handleReduceButtonClick = () => {
    console.log('reduce button clicked');
    const newIsReduced = !isReduced;
    setIsReduced(newIsReduced);
    console.log(isReduced);
    if (newIsReduced) {
      debouncedUpdateWidget({
        ...widget,
        innerWidget: {
          ...widget.innerWidget,
          resizeable: false,
          editable: false,
          headerBar: false,
        },
        height: 132,
      });
    } else {
      debouncedUpdateWidget({
        ...widget,
        innerWidget: {
          ...widget.innerWidget,
          headerBar: true,
          resizeable: true,
          editable: true,
        },
        height: snappedHeight,
      });
    }
  };

  // 팝업 버튼 클릭 핸들러 추가
  const handlePopupButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPopupOpen(true);
  };

  return (
    <>
      {/* 축소 버튼 툴바 */}
      {isReduced && (
        <div
          className={` h-[40px] flex w-fit border ${
            isSelected ? 'block' : 'hidden'
          }`}
          style={{
            position: 'absolute',
            left: `${(widget.x + offset.x + 4) * scale}px`,
            top: `${(widget.y + offset.y - 40) * scale}px`, // 위젯 위에 배치
            transform: `scale(${scale})`,
            transformOrigin: '0 0',
            zIndex: 999,
          }}
        >
          <div className='flex items-center'>
            <Button
              size='icon'
              className=' rounded-none p-2 bg-white'
              onClick={handleReduceButtonClick}
            >
              <SvgIcon
                fill='none'
                width={8}
                height={9}
                className='flex items-center justify-center'
              >
                {chevronDownSvg8px}
              </SvgIcon>
            </Button>
            <Button
              size='icon'
              className=' rounded-none p-2 bg-white'
              onClick={handlePopupButtonClick}
            >
              <SvgIcon
                fill='none'
                width={8}
                height={9}
                className='flex items-center justify-center'
              >
                {wideFrameSvg8px}
              </SvgIcon>
            </Button>
          </div>
          <div className='flex items-center'>
            <Button size='icon' className=' rounded-none p-2 bg-white'>
              <SvgIcon
                fill='none'
                width={8}
                height={9}
                className='flex items-center justify-center text-black'
              >
                {arrowModeSvg}
              </SvgIcon>
            </Button>
            <Button size='icon' className=' rounded-none p-2 bg-white'>
              <Info className='text-black' />
            </Button>
            <Button size='icon' className=' rounded-none p-2 bg-white'>
              <Ellipsis className='text-black' />
            </Button>
          </div>
        </div>
      )}
      <div
        className={`widget-shell ${spacePressed ? 'space-active' : ''} group`}
        style={{
          position: 'absolute',
          zIndex: widget.innerWidget.type === 'section' ? 1 : 2,
          padding: '4px',
          margin: isNodeWidget ? `${4 * scale}px` : '0',
          left: `${(visualPosition.x + offset.x) * scale}px`, // offset을 더한 후 scale 적용
          top: `${(visualPosition.y + offset.y) * scale}px`, // offset을 더한 후 scale 적용
          width: `${visualPosition.width}px`,
          height: `${visualPosition.height}px`,
          transform: `scale(${scale})`,
          transformOrigin: '0 0',
          backgroundColor:
            widget.innerWidget.type === 'section'
              ? 'rgba(200, 200, 200, 0.2)'
              : 'white',
          opacity: widget.innerWidget.type === 'section' ? 0.8 : 1,
          border: `2px solid ${
            isEditMode
              ? 'black'
              : isSelected
              ? '#FFB300'
              : isArrowMode
              ? '#F1F5F9'
              : '#e0e0e0'
          }`,
          outline: `${
            isEditMode
              ? '2px solid black'
              : isSelected
              ? '2px solid #FFB300' //amber-500
              : 'none'
          }`,
          outlineOffset: '0px', // 음수 값을 주면 안쪽으로 들어갑니다
          borderRadius: '4px',
          transition: 'height 0.3s ease-in-out', // 높이 ���경 애니메이션 추가
        }}
        onClick={handleWidgetClick}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
      >
        {headerBar && (
          <div className='transition-opacity duration-200 hover:bg-gray-100 header-bar opacity-0 group-hover:opacity-100'>
            <div className='flex items-center'>
              <Button
                size='icon'
                className=' rounded-none p-2 bg-white'
                onClick={handleReduceButtonClick}
              >
                <SvgIcon
                  fill='none'
                  width={8}
                  height={9}
                  className='flex items-center justify-center'
                >
                  {chevronDownSvg8px}
                </SvgIcon>
              </Button>
              <Button
                id='popupbutton'
                size='icon'
                className=' rounded-none p-2 bg-white'
                onClick={handlePopupButtonClick}
              >
                <SvgIcon
                  fill='none'
                  width={8}
                  height={9}
                  className='flex items-center justify-center'
                >
                  {wideFrameSvg8px}
                </SvgIcon>
              </Button>
            </div>
            <div className='flex items-center'>
              <Button size='icon' className=' rounded-none p-2 bg-white'>
                <SvgIcon
                  fill='none'
                  width={8}
                  height={9}
                  className='flex items-center justify-center text-black'
                >
                  {arrowModeSvg}
                </SvgIcon>
              </Button>
              <Button size='icon' className=' rounded-none p-2 bg-white'>
                <Info className='text-black' />
              </Button>
              <Button size='icon' className=' rounded-none p-2 bg-white'>
                <Ellipsis className='text-black' />
              </Button>
            </div>
          </div>
        )}
        <div
          className={`h-full w-full overflow-hidden ${
            isEditMode ? 'edit-mode-container' : ''
          }`}
        >
          {renderInnerWidget()}
        </div>
        {footerBar && (
          <div className='footer-bar'>
            <div className='flex items-center justify-between space-x-1  h-full pl-4'>
              <div className='text-[12px] text-muted-foreground'>v 3.26</div>
              <div className='w-[2px] h-[2px] bg-muted-foreground rounded-full' />
              <div className='text-[12px] text-muted-foreground'>24.08.17</div>
              <div className='w-[2px] h-[2px] bg-muted-foreground rounded-full' />
              <div className='text-[12px] text-muted-foreground'>08:28</div>
            </div>
            <div className='flex items-center'>
              <Button size='icon' className=' rounded-none p-2 bg-white'>
                <SvgIcon
                  fill='none'
                  width={8}
                  height={9}
                  className='flex items-center justify-center text-black'
                >
                  {sixBoltSvg}
                </SvgIcon>
              </Button>
              <Button size='icon' className=' rounded-none p-2 bg-white'>
                <SvgIcon
                  fill='none'
                  width={8}
                  height={9}
                  className='flex items-center justify-center text-black'
                >
                  {pauseSvg}
                </SvgIcon>
              </Button>
              <Button size='icon' className=' rounded-none p-2 bg-white'>
                <SvgIcon
                  fill='none'
                  width={8}
                  height={9}
                  className='flex items-center justify-center text-black'
                >
                  {recordSvg}
                </SvgIcon>
              </Button>
            </div>
          </div>
        )}
        {/* {isSelected && (
        
      )} */}
        <>
          {resizeable && (
            <>
              <div className='resize-handle nw' style={getHandleStyle('nw')} />
              <div className='resize-handle ne' style={getHandleStyle('ne')} />
              <div className='resize-handle sw' style={getHandleStyle('sw')} />
              <div className='resize-handle se' style={getHandleStyle('se')} />
            </>
          )}
          <div
            className='resize-handle n'
            style={getHandleStyle('n')}
            onMouseEnter={() => handleEdgeHover('n')}
            onMouseLeave={() => handleEdgeHover(null)}
          />
          <div
            className='resize-handle s'
            style={getHandleStyle('s')}
            onMouseEnter={() => handleEdgeHover('s')}
            onMouseLeave={() => handleEdgeHover(null)}
          />
          <div
            className='resize-handle w'
            style={getHandleStyle('w')}
            onMouseEnter={() => handleEdgeHover('w')}
            onMouseLeave={() => handleEdgeHover(null)}
          />
          <div
            className='resize-handle e'
            style={getHandleStyle('e')}
            onMouseEnter={() => handleEdgeHover('e')}
            onMouseLeave={() => handleEdgeHover(null)}
          />
        </>
        <div className='arrow-node-container'>
          <div
            className='arrow-node n'
            style={setArrowNodeStyle('n')}
            onMouseEnter={(e) => handleArrowNodeHover('n', true, e)}
            onMouseLeave={(e) => handleArrowNodeHover('n', false, e)}
          />
          <div
            className='arrow-node s'
            style={setArrowNodeStyle('s')}
            onMouseEnter={(e) => handleArrowNodeHover('s', true, e)}
            onMouseLeave={(e) => handleArrowNodeHover('s', false, e)}
          />
          <div
            className='arrow-node w'
            style={setArrowNodeStyle('w')}
            onMouseEnter={(e) => handleArrowNodeHover('w', true, e)}
            onMouseLeave={(e) => handleArrowNodeHover('w', false, e)}
          />
          <div
            className='arrow-node e'
            style={setArrowNodeStyle('e')}
            onMouseEnter={(e) => handleArrowNodeHover('e', true, e)}
            onMouseLeave={(e) => handleArrowNodeHover('e', false, e)}
          />
        </div>
      </div>
      <WidgetPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        initialWidgetId={widget.id}
      />
    </>
  );
}
