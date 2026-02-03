import React, { useState, useRef, useEffect } from 'react';
import './ChatBot.css';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hi!! I'm Sheff, Datasoc's Assistant, here to help 🫡" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showGreeting, setShowGreeting] = useState(true);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
            console.log(`[Sheff Debug] Fetching from: ${API_URL}/api/chat`);
            const response = await fetch(`${API_URL}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: input,
                    history: messages.slice(-5) // Send last 5 messages for context
                }),
            });

            const data = await response.json();
            if (data.success) {
                setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please check the console for details.' }]);
            }
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: 'Unable to connect to the assistant.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
            {/* Chat Window */}
            <div className="chat-window">
                <div className="chat-header">
                    <div className="header-info">
                        <svg viewBox="0 0 24 24" width="24" height="24" className="bot-icon">
                            <path fill="currentColor" d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2m9 7h-2V7c0-1.1-.9-2-2-2h-3V2h-4v3H7c-1.1 0-2 .9-2 2v2H3c-1.1 0-2 .9-2 2v5c0 1.1.9 2 2 2h2v3c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-3h2c1.1 0 2-.9 2-2v-5c0-1.1-.9-2-2-2M9 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1m6 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1m-1 4H10v-2h4v2z" />
                        </svg>
                        <div className="header-text">
                            <h3>Sheff</h3>
                            <span className="powered-by">Powered by IBM's Granite 3.0</span>
                        </div>
                    </div>
                    <button className="close-btn" onClick={() => setIsOpen(false)}>&times;</button>
                </div>

                <div className="chat-messages">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.role}`}>
                            <div className="message-content">{msg.content}</div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="message assistant loading">
                            <div className="typing-indicator">
                                <span></span><span></span><span></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <form className="chat-input" onSubmit={handleSend}>
                    <input
                        type="text"
                        placeholder="Ask me anything..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={isLoading}
                    />
                    <button type="submit" disabled={isLoading || !input.trim()}>
                        <svg viewBox="0 0 24 24" width="24" height="24">
                            <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                        </svg>
                    </button>
                </form>
            </div>

            {/* Welcome Bubble - Curved & Bold */}
            {showGreeting && !isOpen && (
                <div className="welcome-curved-container" onClick={() => {
                    setIsOpen(true);
                    setShowGreeting(false);
                }}>
                    <svg viewBox="0 0 150 150" className="welcome-curve-svg">
                        <path id="curvePath" d="M 60,115 A 55,55 0 0 1 115,60" fill="transparent" />
                        <text className="curved-text">
                            <textPath href="#curvePath" startOffset="50%" textAnchor="middle">
                                Hi!, I'm Sheff 👋
                            </textPath>
                        </text>
                    </svg>
                </div>
            )}

            {/* Toggle Button */}
            <button className="chat-toggle" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Chat">
                <div className="toggle-icon">
                    {isOpen ? (
                        <svg viewBox="0 0 24 24" width="30" height="30">
                            <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                        </svg>
                    ) : (
                        <svg viewBox="0 0 24 24" width="30" height="30">
                            <path fill="currentColor" d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2m9 7h-2V7c0-1.1-.9-2-2-2h-3V2h-4v3H7c-1.1 0-2 .9-2 2v2H3c-1.1 0-2 .9-2 2v5c0 1.1.9 2 2 2h2v3c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-3h2c1.1 0 2-.9 2-2v-5c0-1.1-.9-2-2-2M9 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1m6 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1m-1 4H10v-2h4v2z" />
                        </svg>
                    )}
                </div>
            </button>
        </div>
    );
};

export default ChatBot;
