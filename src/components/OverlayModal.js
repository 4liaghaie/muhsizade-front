"use client";
import { useEffect, useCallback } from "react";

/**
 * A generic overlay modal that renders children in the center of the screen.
 * It now also renders navigation arrows (if callbacks are provided) and a fixed close button.
 *
 * Props:
 * - isOpen (boolean): Whether the modal is open.
 * - onClose (function): Callback to close the modal.
 * - onPrev (function, optional): Callback for the left (previous) arrow.
 * - onNext (function, optional): Callback for the right (next) arrow.
 * - closeOnEsc (boolean): Whether to close on ESC (default: true).
 * - closeOnOutsideClick (boolean): Whether to close on backdrop click (default: true).
 * - children (ReactNode): Content inside the modal.
 */
export default function OverlayModal({
  isOpen,
  onClose,
  onPrev,
  onNext,
  closeOnEsc = true,
  closeOnOutsideClick = true,
  children,
}) {
  // Handle ESC key to close
  const handleKeyDown = useCallback(
    (e) => {
      if (closeOnEsc && e.key === "Escape") {
        onClose?.();
      }
    },
    [onClose, closeOnEsc]
  );

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    } else {
      window.removeEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const handleOverlayClick = () => {
    if (closeOnOutsideClick) {
      onClose?.();
    }
  };

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-85 z-50"
      onClick={handleOverlayClick}
    >
      <div className="relative" onClick={stopPropagation}>
        {children}
        {/* Render left arrow if onPrev provided */}
        {onPrev && (
          <button
            className="fixed top-1/2 left-[0px] transform -translate-y-1/2 text-white p-2 rounded"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
          >
            <svg
              width="24"
              height="24"
              xmlns="http://www.w3.org/2000/svg"
              fillRule="evenodd"
              clipRule="evenodd"
            >
              <path d="M20 .755l-14.374 11.245 14.374 11.219-.619.781-15.381-12 15.391-12 .609.755z" />
            </svg>
          </button>
        )}
        {/* Render right arrow if onNext provided */}
        {onNext && (
          <button
            className="fixed top-1/2 right-[0px] transform -translate-y-1/2 text-white p-2 rounded"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
          >
            <svg
              width="24"
              height="24"
              xmlns="http://www.w3.org/2000/svg"
              fillRule="evenodd"
              clipRule="evenodd"
            >
              <path d="M4 .755l14.374 11.245-14.374 11.219.619.781 15.381-12-15.391-12-.609.755z" />
            </svg>
          </button>
        )}
      </div>
      {/* Fixed Close Button at the top-right of the screen */}
      <button
        className="fixed text-black p-2 z-50"
        onClick={onClose}
        style={{ top: "20px", right: "20px" }}
      >
        <svg
          width="24"
          height="24"
          xmlns="http://www.w3.org/2000/svg"
          fillRule="evenodd"
          clipRule="evenodd"
        >
          <path d="M12 11.293l10.293-10.293.707.707-10.293 10.293 10.293 10.293-.707.707-10.293-10.293-10.293 10.293-.707-.707 10.293-10.293-10.293-10.293.707-.707 10.293 10.293z" />
        </svg>
      </button>
    </div>
  );
}
