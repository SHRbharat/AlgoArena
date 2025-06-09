import { motion } from "framer-motion";

export function Loader() {
  return (
    <div className="flex items-center justify-center h-screen">
      <motion.div
        className="relative w-32 h-32"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      >
        <svg
          className="absolute top-0 left-0 w-full h-full text-primary"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="40" cy="40" r="30" />
        </svg>
        <motion.svg
          className="absolute top-1/4 left-1/4 w-10 h-10 -mt-12 -ml-12 text-primary"
          viewBox="0 0 24 24"
          fill="currentColor"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-bird"
          >
            <path d="M16 7h.01" />
            <path d="M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20" />
            <path d="m20 7 2 .5-2 .5" />
            <path d="M10 18v3" />
            <path d="M14 17.75V21" />
            <path d="M7 18a6 6 0 0 0 3.84-10.61" />
          </svg>
        </motion.svg>
      </motion.div>
    </div>
  );
}
