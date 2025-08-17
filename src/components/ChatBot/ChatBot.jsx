import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './ChatBot.css';
import { UilCommentAlt, UilTrashAlt } from '@iconscout/react-unicons';

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

  // ambil chat dari localStorage kalau ada, kalau tidak pakai initialMessage
  const getStoredMessages = () => {
    const saved = localStorage.getItem('chatMessages');
    return saved ? JSON.parse(saved) : initialMessage;
  };

  const [messages, setMessages] = useState(getStoredMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  // simpan ke localStorage setiap kali messages berubah
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

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
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
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
      localStorage.removeItem('chatMessages'); // hapus dari localStorage
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
          placeholder="Ketik pesan..."
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
        <button type="submit" disabled={loading}>
          Kirim
        </button>
      </form>
    </div>
  );
};

export default ChatBot;
