"use client";
import { HTMLMotionProps, motion } from "framer-motion";

interface IAnimatePresenceProps {
  children: React.ReactNode;
  animationProps?: HTMLMotionProps<"div">;
}

const AnimatePresence = ({
  children,
  animationProps,
}: IAnimatePresenceProps) => {
  return <motion.div {...animationProps}>{children}</motion.div>;
};
export default AnimatePresence;
