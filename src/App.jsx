import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatContainer from './components/ChatContainer';
import PromptArea from './components/PromptArea';
import ThemeToggle from './components/ThemeToggle';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import ProfileButton from './components/ProfileButton';
import { 
  auth, 
  db,
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  doc,
  setDoc,
  getDoc
} from './firebase';

function App() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: 'Hello! How can I help you today?',
      image: null,
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [authView, setAuthView] = useState('login'); // 'login', 'signup', or 'chat'
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState('');
  const fileInputRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Theme effect
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Check for existing auth session on initial load
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Verify the user document exists
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          
          if (userDoc.exists()) {
            setUser({
              id: firebaseUser.uid,
              name: userDoc.data().name,
              email: firebaseUser.email
            });
            setAuthView('chat');
          } else {
            // User document doesn't exist - sign them out
            console.error("User document not found");
            await signOut(auth);
            setAuthView('login');
            setAuthError('Please login to continue');
          }
        } catch (error) {
          console.error("Error:", error);
          await signOut(auth);
          setAuthView('login');
          setAuthError('Authentication error. Please login again.');
        }
      } else {
        // No user is signed in - ensure we're on login page
        setUser(null);
        if (authView !== 'login' && authView !== 'signup') {
          setAuthView('login');
        }
      }
    });
  
    return () => unsubscribe();
  }, [authView]);

  const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDp55KSZvX0mtNdd1WGqz9lCXZSUzqVAOk";

  const handleLogin = async (email, password) => {
    setAuthError('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
      if (userDoc.exists()) {
        setUser({
          id: firebaseUser.uid,
          name: userDoc.data().name,
          email: firebaseUser.email
        });
        setAuthView('chat');
      }
    } catch (error) {
      console.error("Login error:", error);
      setAuthError(error.message || 'Login failed. Please try again.');
    }
  };

  const handleSignup = async (name, email, password) => {
    setAuthError('');
    try {
      setIsTyping(true); // Show loading state
      
      // 1. Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // 2. Store additional user data in Firestore
      await setDoc(doc(db, "users", firebaseUser.uid), {
        name: name,
        email: email,
        createdAt: new Date()
      });
  
      // 3. Immediately sign out the user after creation
      await signOut(auth);
      
      // 4. Show success message and switch to login view
      setAuthError('Account created successfully! Please login.');
      setAuthView('login');
      
    } catch (error) {
      console.error("Signup error:", error);
      setAuthError(error.message || 'Signup failed. Please try again.');
      
      // If there's an error, make sure to sign out any partial authentication
      if (auth.currentUser) {
        await signOut(auth);
      }
    } finally {
      setIsTyping(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setAuthView('login');
    } catch (error) {
      console.error("Logout error:", error);
      setAuthError('Logout failed. Please try again.');
    }
  };

  const handleSendMessage = async (text, imageData = null) => {
    if (!text.trim() && !imageData) return;

    // Add user message with animation
    const newUserMessage = {
      id: Date.now(),
      sender: 'user',
      text: text,
      image: imageData,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newUserMessage]);

    // Add loading indicator with typing animation
    setIsTyping(true);
    const loadingMessageId = Date.now() + 1;
    setMessages(prev => [...prev, {
      id: loadingMessageId,
      sender: 'ai',
      text: '',
      isLoading: true,
      timestamp: new Date(),
    }]);

    try {
      const requestData = {
        contents: [{
          parts: [
            { text: text },
            ...(imageData ? [{ inline_data: { mime_type: imageData.mimeType, data: imageData.base64 } }] : [])
          ]
        }]
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      const apiResponse = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();

      // Update with animation
      setMessages(prev => prev.map(msg => 
        msg.id === loadingMessageId 
          ? { ...msg, text: apiResponse, isLoading: false } 
          : msg
      ));
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => prev.map(msg => 
        msg.id === loadingMessageId 
          ? { ...msg, text: 'Sorry, I encountered an error. Please try again.', isLoading: false } 
          : msg
      ));
    } finally {
      setIsTyping(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64string = e.target.result.split(",")[1];
      handleSendMessage('Analyze this image:', {
        mimeType: file.type,
        base64: base64string
      });
    };
    reader.readAsDataURL(file);
  };

  // Add this new function to handle PDF uploads
const handlePdfUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Check if file is PDF
  if (file.type !== 'application/pdf') {
    setAuthError('Please upload a PDF file');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const base64string = e.target.result.split(",")[1];
    handleSendMessage('Analyze this PDF:', {
      mimeType: file.type,
      base64: base64string,
      fileName: file.name
    });
  };
  reader.readAsDataURL(file);
};


  return (
    <div className={`flex flex-col h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {authView === 'chat' ? (
        <>
          <header className={`flex justify-between items-center p-4 shadow-md transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
            <h1 className="text-2xl text-center font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              DtxKzy
            </h1>
            <div className="flex items-center gap-4">
              <ProfileButton user={user} onLogout={handleLogout} theme={theme} />
            </div>
          </header>
          
          <ChatContainer 
            messages={messages} 
            isTyping={isTyping} 
            theme={theme}
            ref={chatContainerRef}
          />
          
          <PromptArea 
  onSendMessage={handleSendMessage} 
  onImageUpload={handleImageUpload}
  onPdfUpload={handlePdfUpload}  // Add this new prop
  fileInputRef={fileInputRef}
  isTyping={isTyping}
  theme={theme}
/>
        </>
      ) : (
        <div className="flex items-center justify-center h-full p-4">
          {authView === 'login' ? (
  <Login 
    onLogin={handleLogin} 
    onSwitchToSignup={() => {
      setAuthView('signup');
      setAuthError('');
    }} 
    theme={theme}
    error={authError}
    isLoading={isTyping}
  />
) : (
  <Signup 
    onSignup={handleSignup} 
    onSwitchToLogin={() => {
      setAuthView('login');
      setAuthError('');
    }} 
    theme={theme}
    error={authError}
    isLoading={isTyping}
  />
)}
        </div>
      )}
    </div>
  );
}

export default App;