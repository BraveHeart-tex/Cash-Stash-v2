"use client";
import { AnimatePresence, AnimatePresenceProps } from "framer-motion";

type AnimatePresenceClientProps = AnimatePresenceProps & {
  children: React.ReactNode;
};

const AnimatePresenceClient = ({
  children,
  ...animationProps
}: AnimatePresenceClientProps) => {
  return <AnimatePresence {...animationProps}>{children}</AnimatePresence>;
};
export default AnimatePresenceClient;
