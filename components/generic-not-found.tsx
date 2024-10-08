"use client";
import { motion } from "framer-motion";
import type React from "react";

const GenericNotFound = ({
  renderTitle,
  renderMessage,
}: {
  renderTitle: (props: { className: string }) => React.ReactNode;
  renderMessage: (props: { className: string }) => React.ReactNode;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 1 }}
      transition={{ duration: 0.5, type: "just" }}
      className="pt-4 text-center"
    >
      {renderTitle({
        className:
          "inline-block text-2xl lg:text-3xl font-semibold text-primary scroll-m-20 tracking-tight",
      })}
      {renderMessage({
        className: "mt-3 text-muted-foreground",
      })}
    </motion.div>
  );
};

export default GenericNotFound;
