import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './ChatBot.css';
import { UilCommentAlt, UilTrashAlt, UilMicrophone } from '@iconscout/react-unicons';

const formatMessage = (text) => {
  const cleanedText = text.replace(/###\s?/g, '').trim();

  return cleanedText.split('\n').map((line, i) => (
    <p
      key={i}
      dangerouslySetInnerHTML={{
        __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
      }}
    />
  ));
};

const ChatBot = () => {
  const initialMessage = [
    {
      role: 'assistant',
      content: 'Halo! Kirimkan data sensor hari ini agar saya bantu analisis ya.',
    },
  ];

  const getStoredMessages = () => {
    const saved = localStorage.getItem('chatMessages');
    return saved ? JSON.parse(saved) : initialMessage;
  };

  const [messages, setMessages] = useState(getStoredMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // state untuk voice input
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // inisialisasi SpeechRecognition sekali
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'id-ID'; // Bahasa Indonesia
      recognition.interimResults = false;
      recognition.continuous = false;

      recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setInput((prev) => (prev ? prev + ' ' + text : text));
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Browser kamu tidak mendukung voice input');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/v1/chats`,
        { messages: newMessages },
        {
          withCredentials: true,
        }
      );

      const assistantReply = {
        role: 'assistant',
        content: res.data.data,
      };

      setMessages([...newMessages, assistantReply]);
    } catch (err) {
      console.error('Gagal memuat jawaban chatbot:', err);
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'Maaf, terjadi kesalahan saat memproses pertanyaan kamu.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const resetChat = () => {
    if (window.confirm('Yakin ingin menghapus semua percakapan?')) {
      setMessages(initialMessage);
      setInput('');
      localStorage.removeItem('chatMessages');
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <UilCommentAlt size="20" />
        <span>Asisten Perkebunan</span>
        <button className="reset-icon" onClick={resetChat} title="Bersihkan Chat">
          <UilTrashAlt size="18" />
        </button>
      </div>

      <div className="chatbot-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            {formatMessage(msg.content)}
          </div>
        ))}
        {loading && <div className="message assistant">Mengetik...</div>}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="chatbot-input">
        <textarea
          placeholder="Ketik pesan atau gunakan mic..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={1}
          onInput={(e) => {
            e.target.style.height = 'auto';
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <button
          type="button"
          className={`mic-btn ${isRecording ? 'recording' : ''}`}
          onClick={handleVoiceInput}
          title="Input suara"
        >
          <UilMicrophone size="20" />
        </button>
        <button type="submit" disabled={loading}>
          Kirim
        </button>
      </form>
    </div>
  );
};

export default ChatBot;
