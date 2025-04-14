import { motion } from 'framer-motion';
import TypingIndicator from './TypingIndicator';
import { useState } from 'react';
import { FiThumbsUp, FiThumbsDown } from 'react-icons/fi';

const Message = ({ sender, text, image, isLoading, theme, isTyping }) => {
  const isAI = sender === 'ai';
  const [reaction, setReaction] = useState(null);
  const [isImageExpanded, setIsImageExpanded] = useState(false);

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: isAI ? -20 : 20 }
  };

  const handleReaction = (type) => {
    setReaction(type === reaction ? null : type);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
      transition={{ duration: 0.3 }}
      className={`flex ${isAI ? 'justify-start' : 'justify-end'} items-start gap-2 mb-4`}
    >
      {isAI && (
        <motion.div 
          className="flex-shrink-0"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <img 
            src="/DtxKzy.png" 
            alt="AI" 
            className={`w-8 h-8 rounded-full object-cover shadow-lg ${isTyping ? 'animate-pulse' : ''}`}
          />
        </motion.div>
      )}
      
      <div className="flex flex-col items-end">
        <motion.div
          className={`rounded-2xl md:max-w-md rounded-1xl p-4 relative overflow-hidden 
            ${isAI 
              ? theme === 'dark' 
                ? 'bg-gray-700 text-gray-100 rounded-tl-none' 
                : 'bg-gray-700 text-gray-100 rounded-tl-none'
              : theme === 'dark'
                ? 'bg-blue-600 text-white '
                : 'bg-gray-900 break-all text-white '
            }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isLoading ? (
            <TypingIndicator theme={theme} />
          ) : (
            <>
              {text && <p className="whitespace-pre-wrap">{text}</p>}
              {image && (
                <motion.div 
                  className="mt-2 cursor-pointer"
                  whileHover={{ scale: 1.03 }}
                  onClick={() => setIsImageExpanded(!isImageExpanded)}
                >
                </motion.div>
              )}
            </>
          )}
        </motion.div>

        {!isLoading && !isAI && (
          <motion.div 
            className="flex gap-2 mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
          </motion.div>
        )}
      </div>
      
      {!isAI && (
        <motion.div 
          className="flex-shrink-0"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
        </motion.div>
      )}
    </motion.div>
  );
};

export default Message;
