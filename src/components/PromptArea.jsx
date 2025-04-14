import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiImage, FiSend, FiFileText, FiPaperclip } from 'react-icons/fi';

const PromptArea = ({ onSendMessage, onImageUpload, onPdfUpload, fileInputRef, isTyping, theme }) => {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showFileMenu, setShowFileMenu] = useState(false);
  const textareaRef = useRef(null);
  const fileMenuRef = useRef(null);

  // Handle clicks outside the file menu to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (fileMenuRef.current && !fileMenuRef.current.contains(event.target)) {
        setShowFileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() || !isTyping) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [message]);

  return (
    <motion.form 
      onSubmit={handleSubmit}
      className={`p-4 border-t flex justify-center h-30 items-center ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-end gap-2 text-gray-100 w-full max-w-4xl">
        <div className="relative" ref={fileMenuRef}>
          <motion.button 
            type="button" 
            onClick={() => setShowFileMenu(!showFileMenu)}
            className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-100 hover:bg-gray-200'} transition-colors`}
            disabled={isTyping}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiPaperclip className="w-5 h-5" />
          </motion.button>
          
          <AnimatePresence>
            {showFileMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className={`absolute bottom-12 left-0 p-2 rounded-lg shadow-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} z-10`}
              >
                <div className="flex flex-col gap-2">
                  <motion.button
                    type="button"
                    onClick={() => {
                      fileInputRef.current.accept = "image/*";
                      fileInputRef.current.onchange = onImageUpload;
                      fileInputRef.current.click();
                      setShowFileMenu(false);
                    }}
                    className={`flex items-center gap-2 p-2 rounded-md ${theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FiImage className="w-5 h-5" />
                    <span>Upload Image</span>
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => {
                      fileInputRef.current.accept = "application/pdf";
                      fileInputRef.current.onchange = onPdfUpload;
                      fileInputRef.current.click();
                      setShowFileMenu(false);
                    }}
                    className={`flex items-center gap-2 p-2 rounded-md ${theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FiFileText className="w-5 h-5" />
                    <span>Upload PDF</span>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="flex-1 relative">
          <motion.div
            className={`absolute -top-2 left-4 px-2 text-xs ${theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'} transition-all duration-200 ${
              isFocused || message ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
          >
            Type your message...
          </motion.div>
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={isFocused ? '' : 'Type your message...'}
            className={`w-full min-h-[70px] max-h-[150px] ${theme === 'dark' ? 'bg-gray-700 text-gray-200 placeholder-gray-400' : 'bg-gray-100 text-gray-800 placeholder-gray-500'} rounded-2xl p-3 pr-12 resize-none focus:outline-none focus:ring-2 ${theme === 'dark' ? 'focus:ring-purple-500' : 'focus:ring-blue-500'} transition-all duration-200`}
            rows={1}
            disabled={isTyping}
          />
        </div>
        
        <motion.button 
          type="submit" 
          className={`p-3 rounded-full ${message.trim() ? (theme === 'dark' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-500 hover:bg-blue-600') : (theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200')} text-white transition-colors relative overflow-hidden`}
          disabled={isTyping || (!message.trim())}
          whileHover={message.trim() ? { scale: 1.05 } : {}}
          whileTap={message.trim() ? { scale: 0.95 } : {}}
        >
          <FiSend className="w-5 h-5" />
        </motion.button>
      </div>
      
      <input 
        type="file" 
        ref={fileInputRef}
        className="hidden"
        disabled={isTyping}
      />
    </motion.form>
  );
};

export default PromptArea;