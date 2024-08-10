"use client";
import { type HTMLMotionProps, motion } from "framer-motion";
import type { HTMLAttributes } from "react";

const MotionDiv = ({
  children,
  ...props
}: HTMLMotionProps<"div"> & HTMLAttributes<HTMLDivElement>) => {
  return <motion.div {...props}>{children}</motion.div>;
};
export default MotionDiv;
