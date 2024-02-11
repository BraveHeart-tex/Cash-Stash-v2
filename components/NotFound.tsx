"use client";
import { motion } from "framer-motion";

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
      className="lg:text-left h-[500px] p-4"
    >
      {renderTitle({
        className:
          "inline-block text-lg lg:text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70",
      })}
      {renderMessage({
        className: "mt-3",
      })}
    </motion.div>
  );
};

export default GenericNotFound;
