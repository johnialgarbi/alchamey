import { useState, useEffect, useRef, useCallback } from 'react';

export default function useDebouncedInput(
  initialValue: string,
  onChange: (value: string) => void,
  delay: number = 300
) {
  const [inputValue, setInputValue] = useState(initialValue);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevInitialValueRef = useRef(initialValue);
  const onChangeRef = useRef(onChange);

  onChangeRef.current = onChange;

  useEffect(() => {
    if (initialValue === prevInitialValueRef.current) return;
    prevInitialValueRef.current = initialValue;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setInputValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleChange = useCallback(
    (value: string) => {
      setInputValue(value);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
        onChangeRef.current(value);
      }, delay);
    },
    [delay]
  );

  return {
    value: inputValue,
    onChange: handleChange,
  };
}
