"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import type { PixelBlastProps } from "./PixelBlast";

const PixelBlast = dynamic(() => import("./PixelBlast").then(mod => mod.PixelBlast), { ssr: false });

export const AnimatedPixelBackground: React.FunctionComponent<PixelBlastProps> = props => {
  const [motionAllowed, setMotionAllowed] = useState(false);

  useEffect(() => {
    setMotionAllowed(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  if (!motionAllowed) return null;

  return <PixelBlast {...props} />;
};
