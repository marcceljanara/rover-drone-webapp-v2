import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './ChatBot.css';
import { UilCommentAlt, UilTrashAlt, UilMicrophone } from '@iconscout/react-unicons';

const formatInlineText = (text) =>
  text.split(/(\*\*.*?\*\*)/g).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }

    return part;
  });

const formatMessage = (text) => {
  const lines = String(text || '')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.trim());

  const elements = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (!line) {
      index += 1;
      continue;
    }

    const heading = line.match(/^#{1,6}\s+(.+)/);
    if (heading) {
      elements.push(
        <h4 key={`heading-${index}`} className="message-heading">
          {formatInlineText(heading[1])}
        </h4>
      );
      index += 1;
      continue;
    }

    const bulletItems = [];
    while (index < lines.length) {
      const bullet = lines[index].match(/^[-*]\s+(.+)/);
      if (!bullet) break;
      bulletItems.push(bullet[1]);
      index += 1;
    }

    if (bulletItems.length) {
      elements.push(
        <ul key={`bullet-${index}`} className="message-list">
          {bulletItems.map((item, itemIndex) => (
            <li key={itemIndex}>{formatInlineText(item)}</li>
          ))}
        </ul>
      );
      continue;
    }

    const orderedItems = [];
    while (index < lines.length) {
      const ordered = lines[index].match(/^\d+\.\s+(.+)/);
      if (!ordered) break;
      orderedItems.push(ordered[1]);
      index += 1;
    }

    if (orderedItems.length) {
      elements.push(
        <ol key={`ordered-${index}`} className="message-list">
          {orderedItems.map((item, itemIndex) => (
            <li key={itemIndex}>{formatInlineText(item)}</li>
          ))}
        </ol>
      );
      continue;
    }

    elements.push(<p key={`paragraph-${index}`}>{formatInlineText(line)}</p>);
    index += 1;
  }

  return elements.length ? elements : <p>{formatInlineText(text)}</p>;
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
  const inputRef = useRef(null);
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

      recognition.onerror = () => {
        console.error('Gagal menjalankan pengenalan suara.');
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
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
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
    } catch {
      console.error('Gagal memuat jawaban chatbot.');
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
        <div className="chatbot-title">
          <span className="chatbot-title-icon">
            <UilCommentAlt size="20" />
          </span>
          <div>
            <span>Asisten Perkebunan</span>
            <small>Analisis data sensor dan kondisi lahan</small>
          </div>
        </div>
        <button className="reset-icon" onClick={resetChat} title="Bersihkan Chat">
          <UilTrashAlt size="18" />
        </button>
      </div>

      <div className="chatbot-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message-row ${msg.role}`}>
            <div className="message-avatar">{msg.role === 'user' ? 'U' : 'AI'}</div>
            <div className={`message ${msg.role}`}>{formatMessage(msg.content)}</div>
          </div>
        ))}
        {loading && (
          <div className="message-row assistant">
            <div className="message-avatar">AI</div>
            <div className="message assistant typing">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="chatbot-input">
        <textarea
          ref={inputRef}
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
        <button type="submit" disabled={loading || !input.trim()}>
          Kirim
        </button>
      </form>
    </div>
  );
};

export default ChatBot;
