"use client";
import { AnimatePresence, AnimatePresenceProps } from "framer-motion";

interface IAnimatePresenceProps {
  children: React.ReactNode;
}

const AnimatePresenceClient = ({
  children,
  ...animationProps
}: IAnimatePresenceProps & AnimatePresenceProps) => {
  return <AnimatePresence {...animationProps}>{children}</AnimatePresence>;
};
export default AnimatePresenceClient;
