"use client";
import { AnimatePresence, type AnimatePresenceProps } from "framer-motion";
import type { PropsWithChildren } from "react";

type AnimatePresenceClientProps = AnimatePresenceProps & PropsWithChildren;

const AnimatePresenceClient = ({
  children,
  ...animationProps
}: AnimatePresenceClientProps) => {
  return <AnimatePresence {...animationProps}>{children}</AnimatePresence>;
};
export default AnimatePresenceClient;
