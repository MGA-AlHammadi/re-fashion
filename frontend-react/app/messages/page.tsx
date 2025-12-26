"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchMessages, sendMessage, fetchProfile } from "../services/api";

export default function MessagesPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [showNewChat, setShowNewChat] = useState(false);
  const [recipientId, setRecipientId] = useState("");
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  function showToast(message: string, type: 'success' | 'error' = 'success') {
    setToast({ show: true, message, type });
  }

  async function load() {
    setLoading(true);
    try {
      const [data, prof] = await Promise.all([fetchMessages(), fetchProfile()]);
      setMessages(data);
      setProfile(prof);
      setError(null);
    } catch (e: any) {
      if (e?.message === "NO_TOKEN") { router.push('/login'); return; }
      setError(e.message || String(e));
    } finally { setLoading(false); }
  }

  async function send() {
    if (!newMessage.trim()) return;
    const targetId = selectedConversation || Number(recipientId);
    if (!targetId) {
      showToast('Bitte wähle einen Empfänger', 'error');
      return;
    }
    
    try {
      await sendMessage(targetId, newMessage);
      setNewMessage("");
      setShowNewChat(false);
      showToast('✉️ Nachricht gesendet!', 'success');
      load();
    } catch (e: any) {
      if (e?.message === "NO_TOKEN") { router.push('/login'); return; }
      showToast('Fehler beim Senden: ' + (e.message || String(e)), 'error');
    }
  }

  // Gruppiere Nachrichten nach Konversationspartnern
  const conversations = messages.reduce((acc: any, msg: any) => {
    const partnerId = msg.sender?.id === profile?.id ? msg.recipient?.id : msg.sender?.id;
    const partnerName = msg.sender?.id === profile?.id ? (msg.recipient?.name || msg.recipient?.email) : (msg.sender?.name || msg.sender?.email);
    
    if (!acc[partnerId]) {
      acc[partnerId] = {
        partnerId,
        partnerName,
        messages: []
      };
    }
    acc[partnerId].messages.push(msg);
    return acc;
  }, {});

  const conversationList = Object.values(conversations).sort((a: any, b: any) => {
    const lastA = a.messages[a.messages.length - 1]?.createdAt || 0;
    const lastB = b.messages[b.messages.length - 1]?.createdAt || 0;
    return new Date(lastB).getTime() - new Date(lastA).getTime();
  });

  const currentConversation = selectedConversation ? conversations[selectedConversation] : null;

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Lade Nachrichten...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Fehler</h3>
        <p className="text-red-600 text-center">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8">
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-24 right-8 z-50 animate-slide-in-right">
          <div className={`flex items-center space-x-3 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-sm ${
            toast.type === 'success' 
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
              : 'bg-gradient-to-r from-red-500 to-rose-600 text-white'
          }`}>
            {toast.type === 'success' ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
            <span className="font-semibold">{toast.message}</span>
          </div>
        </div>
      )}

      {/* New Chat Modal */}
      {showNewChat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 transform animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Neue Nachricht</h3>
              <button onClick={() => setShowNewChat(false)} className="text-gray-400 hover:text-gray-600 transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Empfänger User-ID</label>
                <input 
                  type="number"
                  value={recipientId}
                  onChange={(e) => setRecipientId(e.target.value)}
                  placeholder="z.B. 42"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-black"
                />
                <p className="text-xs text-gray-500 mt-1">Gib die User-ID des Empfängers ein</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nachricht</label>
                <textarea 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Schreibe eine Nachricht..."
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none text-black"
                />
              </div>
              <button 
                onClick={send}
                className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Senden
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Nachrichten</h1>
          <p className="text-gray-600 text-lg">Bleib in Kontakt mit anderen Mitgliedern</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]">
          {/* Conversations List */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col">
            <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-600">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Konversationen</h2>
                <button 
                  onClick={() => setShowNewChat(true)}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all backdrop-blur-sm"
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {conversationList.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-200 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <p className="text-gray-600 font-semibold mb-2">Keine Nachrichten</p>
                  <p className="text-sm text-gray-500 mb-4">Starte eine neue Konversation!</p>
                  <button 
                    onClick={() => setShowNewChat(true)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
                  >
                    Neue Nachricht
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {(conversationList as any[]).map((conv: any) => {
                    const lastMessage = conv.messages[conv.messages.length - 1];
                    const isActive = selectedConversation === conv.partnerId;
                    
                    return (
                      <button
                        key={conv.partnerId}
                        onClick={() => setSelectedConversation(conv.partnerId)}
                        className={`w-full p-4 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all ${ isActive ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-500' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-lg">{conv.partnerName?.charAt(0).toUpperCase()}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-semibold text-gray-900 truncate">{conv.partnerName}</p>
                              <span className="text-xs text-gray-500">
                                {new Date(lastMessage.createdAt).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 truncate">{lastMessage.content}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Chat Area - Teil 1*/}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col">
            {!selectedConversation ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-gray-50 to-blue-50">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-200 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-700 mb-2">Wähle eine Konversation</h3>
                <p className="text-gray-500">Oder starte eine neue Nachricht</p>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{currentConversation?.partnerName?.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white">{currentConversation?.partnerName}</h3>
                    <p className="text-blue-100 text-sm">User ID: {currentConversation?.partnerId}</p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-br from-gray-50 to-blue-50">
                  {currentConversation?.messages.map((msg: any) => {
                    const isMe = msg.sender?.id === profile?.id;
                    return (
                      <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] ${
                          isMe 
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                            : 'bg-white text-gray-900 shadow-md'
                        } rounded-2xl px-5 py-3`}>
                          <p className="text-sm leading-relaxed">{msg.content}</p>
                          <p className={`text-xs mt-2 ${isMe ? 'text-blue-100' : 'text-gray-500'}`}>
                            {new Date(msg.createdAt).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Message Input */}
                <div className="p-6 bg-white border-t-2 border-gray-100">
                  <div className="flex items-end space-x-3">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          send();
                        }
                      }}
                      placeholder="Schreibe eine Nachricht..."
                      rows={2}
                      className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none text-black"
                    />
                    <button
                      onClick={send}
                      disabled={!newMessage.trim()}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Drücke Enter zum Senden</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
