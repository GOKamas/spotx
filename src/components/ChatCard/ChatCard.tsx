'use client';
import { useState, useEffect, useRef } from 'react';
import Pusher from 'pusher-js';
import EmojiPicker from 'emoji-picker-react';
import styles from './ChatCard.module.css';

interface Message {
  nickname: string;
  text: string;
  time: string;
  avatar: string;
}

export default function ChatCard() {
  const [nickname, setNickname] = useState<string>('');
  const [userAvatar, setUserAvatar] = useState<string>('🎧'); // Default avatar
  const [isEntered, setIsEntered] = useState<boolean>(false);
  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  // ΚΑΘΑΡΙΣΜΟΣ: Το chat ξεκινάει πλέον άδειο χωρίς ghost μηνύματα
  const [messages, setMessages] = useState<Message[]>([]);

  // Το ref στοχεύει το scrollable container των μηνυμάτων
  const messageContainerRef = useRef<HTMLDivElement>(null);

  // 1. Σύνδεση στο Pusher ΜΟΛΙΣ μπει ο χρήστης στο chat
  useEffect(() => {
    if (!isEntered) return;

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe('spotx-stream');
    channel.bind('new-message', (data: Message) => {
      // Αποφεύγουμε τα διπλά μηνύματα για τον ίδιο τον αποστολέα αν έρθει από το broadcast
      setMessages((prev) => {
        if (prev.length > 0 && prev[prev.length - 1].text === data.text && prev[prev.length - 1].nickname === data.nickname) {
          return prev;
        }
        return [...prev, data];
      });
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [isEntered]);

  // Αυτόματο scroll ΜΟΝΟ μέσα στο container
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleEnterChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (nickname.trim()) {
      setIsEntered(true);
    }
  };

  // 2. Αποστολή Μηνύματος (Push στο API)
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: Message = {
      nickname: nickname,
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: userAvatar
    };

    // Optimistic update: Το εμφανίζουμε αμέσως στον εαυτό μας
    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
    setShowEmojiPicker(false);

    try {
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: newMsg.text,
          username: newMsg.nickname,
          avatar: newMsg.avatar
        }),
      });
    } catch (err) {
      console.error('Failed to broadcast message:', err);
    }
  };

  const onEmojiClick = (emojiData: any) => {
    setInputText((prev) => prev + emojiData.emoji);
  };

  // ΟΘΟΝΗ Α: ΕΙΣΟΔΟΣ ΜΕ NICKNAME & AVATAR SELECTION
  if (!isEntered) {
    return (
      <div className={styles.loginWrapper}>
        <span className={styles.categoryTag}>LIVE CHATROOM</span>
        <h3 className={styles.title}>Enter the Chat</h3>
        <form onSubmit={handleEnterChat} className={styles.loginForm}>
          <input 
            type="text" 
            placeholder="Choose your nickname..." 
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            maxLength={15}
            className={styles.nickInput}
          />
          
          <div className={styles.avatarSection}>
            <label className={styles.avatarLabel}>CHOOSE AVATAR:</label>
            <div className={styles.avatarGrid}>
              {['🎧', '🔥', '🛹', '🎤', '🕶️', '⚡', '👑', '👽'].map((emoji) => (
                <button 
                  key={emoji} 
                  type="button"
                  className={`${styles.avatarBtn} ${userAvatar === emoji ? styles.avatarActive : ''}`}
                  onClick={() => setUserAvatar(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className={styles.enterBtn} disabled={!nickname.trim()}>
            START CHATTING →
          </button>
        </form>
      </div>
    );
  }

  // ΟΘΟΝΗ Β: ΤΟ ΚΥΡΙΩΣ CHAT (ΚΑΘΑΡΙΣΜΕΝΟ)
  return (
    <div className={styles.chatSplitWrapper}>
      
      {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: ONLINE USERS (ΜΟΝΟ Ο LIVE ΧΡΗΣΤΗΣ) */}
      <div className={styles.sidebarUsers}>
        <div className={styles.sidebarHeader}>
          <span className={styles.onlineDot} /> LIVE NOW
        </div>
        <div className={styles.usersList}>
          {/* Εσύ */}
          <div className={styles.userRowActive}>
            <span className={styles.userAvatarEmoji}>{userAvatar}</span>
            <span className={styles.userNameText}>{nickname} (YOU)</span>
          </div>
          
          {/* ΚΑΘΑΡΙΣΜΟΣ: Οι hardcoded χρήστες αφαιρέθηκαν από εδώ */}
        </div>
      </div>

      {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: ΤΟ BOX ΜΕ ΤΑ ΜΗΝΥΜΑΤΑ */}
      <div className={styles.mainChatBox}>
        <div className={styles.chatHeader}>
          <span className={styles.categoryTag}>🟢 ONLINE CHAT</span>
          <span className={styles.userBadge}>as: {nickname}</span>
        </div>

        {/* ΠΕΡΙΟΧΗ ΜΗΝΥΜΑΤΩΝ */}
        <div className={styles.messageContainer} ref={messageContainerRef}>
          {messages.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', opacity: 0.5, fontSize: '14px' }}>
              No messages yet. Say hi! 👋
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className={`${styles.messageRow} ${msg.nickname === nickname ? styles.myMessage : ''}`}>
                <span className={styles.msgAvatarIcon}>{msg.avatar || '🎧'}</span>
                <div className={styles.msgMainBody}>
                  <span className={styles.msgNick}>{msg.nickname}</span>
                  <div className={styles.msgBubble}>
                    <p className={styles.msgText}>{msg.text}</p>
                    <span className={styles.msgTime}>{msg.time}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* INPUT AREA + REAL EMOJI PICKER */}
        <form onSubmit={handleSendMessage} className={styles.inputArea}>
          <div className={styles.inputFlexContainer}>
            <button 
              type="button" 
              className={styles.emojiBtn}
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              😀
            </button>
            <input 
              type="text" 
              placeholder="Type a message..." 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className={styles.messageInput}
            />
            <button type="submit" className={styles.sendBtn}>SEND</button>
          </div>

          {showEmojiPicker && (
            <div className={styles.pickerPopup}>
              <EmojiPicker 
                onEmojiClick={onEmojiClick} 
                width="100%" 
                height="240px"
                searchDisabled
                skinTonesDisabled
              />
            </div>
          )}
        </form>
      </div>

    </div>
  );
}