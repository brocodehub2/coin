import { motion } from "framer-motion";

export default function Announcement() {
  const announcement = "🎉 Welcome to Coin Game! New games starting every hour. Win big today! 🎮";
  
  return (
    <div className="w-full bg-gradient-to-r from-purple-100 to-indigo-100 py-2 overflow-hidden">
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: "-100%" }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="whitespace-nowrap"
      >
        <span className="text-purple-700 font-medium">{announcement}</span>
      </motion.div>
    </div>
  );
}
