import React, { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";

type ClientOnlyPortalProps = {
  children: React.ReactNode;
  selector: string;
};

export default function ClientOnlyPortal({ children, selector }: ClientOnlyPortalProps) {
  const ref = useRef<Element | null>();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    ref.current = document.querySelector(selector);
    setMounted(true);
  }, [selector]);

  //   TODO: investigate the following TS error
  //   @ts-ignore
  return mounted ? createPortal(children, ref.current) : null;
}
