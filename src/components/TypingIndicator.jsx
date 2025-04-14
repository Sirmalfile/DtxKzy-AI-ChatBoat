import { motion } from 'framer-motion';

const TypingIndicator = ({ theme }) => {
  const circleVariants = {
    initial: { y: 0 },
    animate: { 
      y: [-5, 0, -5],
      transition: { 
        repeat: Infinity, 
        repeatType: "reverse", 
        duration: 0.8,
        ease: "easeInOut"
      } 
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <motion.div
        variants={circleVariants}
        initial="initial"
        animate="animate"
        className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-gray-400' : 'bg-gray-600'}`}
      />
      <motion.div
        variants={circleVariants}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.2 }}
        className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-gray-400' : 'bg-gray-600'}`}
      />
      <motion.div
        variants={circleVariants}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.4 }}
        className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-gray-400' : 'bg-gray-600'}`}
      />
    </div>
  );
};

export default TypingIndicator;