import { motion } from 'framer-motion';
import { useState } from 'react';
import { FiMail, FiArrowLeft, FiArrowRight } from 'react-icons/fi';

const ForgotPassword = ({ onResetPassword, onBackToLogin, theme, error, isLoading }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      return;
    }
    onResetPassword(email);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`p-8 rounded-2xl shadow-lg max-w-md w-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
    >
      <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
        Reset Password
      </h2>
      
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3 mb-4 rounded-lg ${theme === 'dark' ? 'bg-red-900/50 text-red-200' : 'bg-red-100 text-red-600'}`}
        >
          {error}
        </motion.div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className={`flex items-center p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
          <FiMail className={`mr-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full bg-transparent focus:outline-none ${theme === 'dark' ? 'text-white placeholder-gray-400' : 'text-gray-800 placeholder-gray-500'}`}
            required
          />
        </div>
        
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium flex items-center justify-center ${isLoading ? 'opacity-70' : ''}`}
        >
          {isLoading ? 'Sending...' : 'Reset Password'} <FiArrowRight className="ml-2" />
        </motion.button>
      </form>
      
      <div className="mt-4 text-center">
        <button 
          onClick={onBackToLogin}
          className={`text-sm flex items-center justify-center mx-auto ${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'}`}
        >
          <FiArrowLeft className="mr-1" /> Back to Login
        </button>
      </div>
    </motion.div>
  );
};

export default ForgotPassword;