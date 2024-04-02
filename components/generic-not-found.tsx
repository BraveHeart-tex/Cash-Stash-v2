"use client";
import { motion } from "framer-motion";

const GenericNotFound = ({
  renderTitle,
  renderMessage,
}: {
  // eslint-disable-next-line no-unused-vars
  renderTitle: (props: { className: string }) => React.ReactNode;
  // eslint-disable-next-line no-unused-vars
  renderMessage: (props: { className: string }) => React.ReactNode;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 1 }}
      transition={{ duration: 0.5, type: "just" }}
      className="lg:text-left p-4"
    >
      {renderTitle({
        className:
          "inline-block text-2xl lg:text-3xl font-semibold text-primary",
      })}
      {renderMessage({
        className: "mt-3 text-foreground",
      })}
    </motion.div>
  );
};

export default GenericNotFound;
