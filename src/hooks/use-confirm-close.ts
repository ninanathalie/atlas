"use client";

import { useState, useCallback, useRef } from "react";

export function useConfirmClose(onClose: () => void) {
 const [showConfirm, setShowConfirm] = useState(false);
 const dirtyRef = useRef(false);

 const markDirty = useCallback(() => {
  dirtyRef.current = true;
 }, []);

 const resetDirty = useCallback(() => {
  dirtyRef.current = false;
 }, []);

 const confirmClose = useCallback(() => {
  if (dirtyRef.current) {
   setShowConfirm(true);
  } else {
   onClose();
  }
 }, [onClose]);

 const cancelClose = useCallback(() => {
  setShowConfirm(false);
 }, []);

 const forceClose = useCallback(() => {
  dirtyRef.current = false;
  setShowConfirm(false);
  onClose();
 }, [onClose]);

 return { markDirty, resetDirty, confirmClose, showConfirm, cancelClose, forceClose };
}
