import React, { useState } from 'react';
import {
  Users,
  Search,
  Send,
  MessageSquare,
  Shield,
  Circle,
  Clock,
  Sparkles,
  Smile,
  Paperclip,
  CheckCheck,
} from 'lucide-react';
import { CommunityChannel, CommunityMember, ChatMessage } from '../../types';

interface Props {
  channels: CommunityChannel[];
  members: CommunityMember[];
  chatMessages: Record<string, ChatMessage[]>;
  onSendMessage: (channelId: string, text: string) => void;
  searchQuery: string;
}

export const CommunityView: React.FC<Props> = ({
  channels,
  members,
  chatMessages,
  onSendMessage,
  searchQuery,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'groups' | 'direct'>('all');
  const [selectedChannelId, setSelectedChannelId] = useState<string>('c-hackathon');
  const [inputMessage, setInputMessage] = useState('');
  const [localSearch, setLocalSearch] = useState('');

  const activeChannel = channels.find((c) => c.id === selectedChannelId) || channels[0];
  const messages = chatMessages[selectedChannelId] || [];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    onSendMessage(selectedChannelId, inputMessage.trim());
    setInputMessage('');
  };

  const filteredChannels = channels.filter((ch) => {
    const query = (localSearch || searchQuery).toLowerCase();
    const matchesSearch = ch.name.toLowerCase().includes(query);
    if (activeTab === 'groups') return matchesSearch && ch.type === 'group';
    if (activeTab === 'direct') return matchesSearch && ch.type === 'direct';
    return matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <span>Telegram-Style Community Hub</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Connect with peers, hackathon squadmates, mentors, and recruiters in real-time.
          </p>
        </div>

        {/* Member Avatars Row (Sonu, Sagar, Harsh, Didi from sketch) */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 hidden sm:inline">Active Squad:</span>
          <div className="flex -space-x-2 overflow-hidden">
            {members.slice(0, 4).map((m) => (
              <img
                key={m.id}
                src={m.avatar}
                alt={m.name}
                title={`${m.name} (${m.status})`}
                className="w-8 h-8 rounded-full ring-2 ring-white object-cover"
              />
            ))}
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            4 Online
          </span>
        </div>
      </div>

      {/* Main Telegram Chat Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 h-[640px]">
        {/* Left Channels/Chats List (4 cols) */}
        <div className="md:col-span-4 border-r border-slate-200 flex flex-col h-full bg-slate-50/50">
          {/* Search bar inside community */}
          <div className="p-3 border-b border-slate-200 bg-white">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-100 border border-slate-200/80 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Filter Tabs: All, Groups, Direct */}
            <div className="flex items-center gap-1 mt-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition-all ${
                  activeTab === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab('groups')}
                className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition-all ${
                  activeTab === 'groups'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Groups
              </button>
              <button
                onClick={() => setActiveTab('direct')}
                className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition-all ${
                  activeTab === 'direct'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Direct
              </button>
            </div>
          </div>

          {/* List of chats */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredChannels.map((channel) => {
              const isSelected = selectedChannelId === channel.id;
              return (
                <button
                  key={channel.id}
                  onClick={() => setSelectedChannelId(channel.id)}
                  className={`w-full p-3 flex items-start gap-3 transition-colors text-left ${
                    isSelected ? 'bg-indigo-50/80 border-r-2 border-indigo-600' : 'hover:bg-slate-100/70'
                  }`}
                >
                  <div className="relative shrink-0">
                    {channel.type === 'group' ? (
                      <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
                        {channel.avatar}
                      </div>
                    ) : (
                      <img
                        src={channel.avatar}
                        alt={channel.name}
                        className="w-11 h-11 rounded-full object-cover ring-1 ring-slate-200"
                      />
                    )}
                    {channel.type === 'direct' && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-bold truncate ${
                          isSelected ? 'text-indigo-950' : 'text-slate-900'
                        }`}
                      >
                        {channel.name}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 shrink-0">
                        {channel.lastMessageTime}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {channel.lastMessage}
                    </p>

                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[9px] text-slate-400">
                        {channel.type === 'group' ? `${channel.membersCount} members` : 'Direct message'}
                      </span>
                      {channel.unreadCount > 0 && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-indigo-600 text-white">
                          {channel.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Bottom Tabs matching blueprint sketch (Group icon, People icon, Chat icon) */}
          <div className="p-2 border-t border-slate-200 bg-white flex items-center justify-around text-slate-500">
            <button
              onClick={() => setActiveTab('groups')}
              className="p-1.5 rounded-lg hover:bg-slate-100 hover:text-indigo-600"
              title="Groups"
            >
              <Users className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveTab('direct')}
              className="p-1.5 rounded-lg hover:bg-slate-100 hover:text-indigo-600"
              title="Members"
            >
              <Shield className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className="p-1.5 rounded-lg hover:bg-slate-100 hover:text-indigo-600 text-indigo-600"
              title="All Messages"
            >
              <MessageSquare className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right Active Chat Feed (8 cols) */}
        <div className="md:col-span-8 flex flex-col h-full bg-white">
          {/* Chat Room Header */}
          <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-white shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="relative">
                {activeChannel.type === 'group' ? (
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-base">
                    {activeChannel.avatar}
                  </div>
                ) : (
                  <img
                    src={activeChannel.avatar}
                    alt={activeChannel.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                )}
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">{activeChannel.name}</h4>
                <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                  <span>
                    {activeChannel.type === 'group'
                      ? `${activeChannel.onlineCount || 4} members online`
                      : 'Online now'}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
                End-to-End Encrypted
              </span>
            </div>
          </div>

          {/* Message History */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/30">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!msg.isUser && (
                  <img
                    src={
                      msg.avatar ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80'
                    }
                    alt={msg.senderName}
                    className="w-7 h-7 rounded-full object-cover shrink-0 mt-1"
                  />
                )}

                <div className={`max-w-[78%] space-y-1 ${msg.isUser ? 'items-end' : 'items-start'}`}>
                  {!msg.isUser && (
                    <span className="text-[11px] font-bold text-slate-700 px-1">
                      {msg.senderName}
                    </span>
                  )}

                  <div
                    className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.isUser
                        ? 'bg-indigo-600 text-white rounded-tr-xs shadow-xs'
                        : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs shadow-2xs'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <div
                      className={`flex items-center justify-end gap-1 mt-1 text-[9px] ${
                        msg.isUser ? 'text-indigo-200' : 'text-slate-400'
                      }`}
                    >
                      <span>{msg.timestamp}</span>
                      {msg.isUser && <CheckCheck className="w-3 h-3 text-indigo-300" />}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Message Input */}
          <form onSubmit={handleSend} className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
            <button
              type="button"
              className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
              title="Attach File"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`Message ${activeChannel.name}...`}
              className="flex-1 px-4 py-2 text-xs rounded-xl bg-slate-100 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-800"
            />

            <button
              type="button"
              className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
              title="Emoji"
            >
              <Smile className="w-4 h-4" />
            </button>

            <button
              type="submit"
              className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
