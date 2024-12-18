import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { debounce } from 'lodash';
import { ShellWidgetProps, AllWidgetTypes } from '@/types/type';
import { updateWidget } from '@/redux/features/whiteboardSlice';

export const useDebounceDispatch = () => {
  const dispatch = useDispatch();

  const debouncedUpdateWidget = useCallback(
    debounce((widget: ShellWidgetProps<AllWidgetTypes>) => {
      dispatch(updateWidget(widget));
    }, 200), // 300ms 딜레이
    [dispatch]
  );

  return { debouncedUpdateWidget };
};
