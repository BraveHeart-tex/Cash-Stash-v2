"use client";
import { HTMLMotionProps, motion } from "framer-motion";
import { HTMLAttributes } from "react";

const MotionDiv = ({
  children,
  ...props
}: HTMLMotionProps<"div"> & HTMLAttributes<HTMLDivElement>) => {
  return <motion.div {...props}>{children}</motion.div>;
};
export default MotionDiv;
