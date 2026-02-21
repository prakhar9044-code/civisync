import { useState, useEffect, useRef } from 'react';
import { reportsAPI, getSocket } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { timeAgo, getInitials } from '../lib/utils';

export default function ChatBox({ reportId }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!reportId) return;
    reportsAPI.getMessages(reportId).then(res => {
      setMessages(res.data.messages);
      setLoading(false);
    });

    // Join socket room for this report
    const socket = getSocket();
    socket.emit('join_report', reportId);
    socket.on('new_message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socket.off('new_message');
      socket.emit('leave_report', reportId);
    };
  }, [reportId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    try {
      await reportsAPI.sendMessage(reportId, text.trim());
      setText('');
    } catch (_) {}
    setSending(false);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-32 text-slate-400 dark:text-slate-600">
      <div className="w-6 h-6 border-2 border-civic-500/30 border-t-civic-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="flex flex-col h-80">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-slate-400 dark:text-slate-600 text-sm py-8">
            💬 No messages yet. Start the conversation.
          </div>
        )}
        {messages.map(m => {
          const isMine = m.sender?._id === user?._id;
          return (
            <div key={m._id} className={`flex gap-2.5 ${isMine ? 'flex-row-reverse' : ''}`}>
              <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white ${
                m.senderRole === 'authority' || m.senderRole === 'admin'
                  ? 'bg-purple-500' : 'bg-civic-600'
              }`}>
                {getInitials(m.sender?.name || '?')}
              </div>
              <div className={`max-w-xs ${isMine ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  isMine
                    ? 'bg-civic-600 text-white rounded-br-sm'
                    : 'bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-slate-200 rounded-bl-sm'
                }`}>
                  {m.content}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <span>{m.sender?.name?.split(' ')[0]}</span>
                  {(m.senderRole === 'authority' || m.senderRole === 'admin') && (
                    <span className="bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 px-1.5 py-0.5 rounded font-medium">
                      Official
                    </span>
                  )}
                  <span>· {timeAgo(m.createdAt)}</span>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={send} className="p-3 border-t border-slate-100 dark:border-white/10 flex gap-2">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type a message..."
          className="input flex-1 py-2 text-sm"
        />
        <button type="submit" disabled={sending || !text.trim()}
          className="btn-primary px-4 py-2 text-sm">
          {sending ? '...' : '↑ Send'}
        </button>
      </form>
    </div>
  );
}
