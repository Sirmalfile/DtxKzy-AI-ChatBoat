import Message from './Message';

const ChatContainer = ({ messages, isTyping }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-700">
      {messages.map((message) => (
        <Message 
          key={message.id} 
          sender={message.sender} 
          text={message.text} 
          image={message.image} 
          isLoading={message.isLoading}
        />
      ))}
      {isTyping && (
        <Message 
          sender="ai" 
          text="" 
          isLoading={true}
        />
      )}
    </div>
  );
};

export default ChatContainer;