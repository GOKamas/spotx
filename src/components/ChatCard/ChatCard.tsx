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

interface OnlineUser {
  nickname: string;
  avatar: string;
}

export default function ChatCard() {
  const [nickname, setNickname] = useState<string>('');
  const [userAvatar, setUserAvatar] = useState<string>('🎧'); 
  const [isEntered, setIsEntered] = useState<boolean>(false);
  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const [messages, setMessages] = useState<Message[]>([]);
  // Live λίστα χρηστών που θα γεμίζει dynamic
  const [activeUsers, setActiveUsers] = useState<OnlineUser[]>([]);

  const messageContainerRef = useRef<HTMLDivElement>(null);

  // 1. Σύνδεση στο Pusher & Listeners
  useEffect(() => {
    if (!isEntered) return;

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe('spotx-stream');

    // Listener για νέα μηνύματα
    channel.bind('new-message', (data: Message) => {
      setMessages((prev) => {
        // Απόλυτο φίλτρο για να μην μπαίνουν διπλά μηνύματα
        if (prev.length > 0 && 
            prev[prev.length - 1].text === data.text && 
            prev[prev.length - 1].nickname === data.nickname) {
          return prev;
        }
        return [...prev, data];
      });
    });

    // Listener για όταν μπαίνει νέος χρήστης
    channel.bind('user-joined', (data: OnlineUser) => {
      setActiveUsers((prev) => {
        // Αν υπάρχει ήδη στη λίστα, μην τον ξαναβάζεις
        if (prev.some(u => u.nickname === data.nickname)) return prev;
        return [...prev, data];
      });
    });

    // Μόλις συνδεθούμε, στέλνουμε σήμα στο API ότι μπήκαμε
    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'join', nickname, avatar: userAvatar }),
    }).catch(err => console.error(err));

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [isEntered, nickname, userAvatar]);

  // Αυτόματο scroll στα μηνύματα
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

  // 2. Αποστολή Μηνύματος (ΜΟΝΟ στο API - Το Pusher το εμφανίζει)
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const msgPayload = {
      type: 'message', // Διαχωρίζουμε το message από το join
      text: inputText,
      username: nickname,
      avatar: userAvatar
    };

    setInputText('');
    setShowEmojiPicker(false);

    try {
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msgPayload),
      });
    } catch (err) {
      console.error('Failed to broadcast message:', err);
    }
  };

  const onEmojiClick = (emojiData: any) => {
    setInputText((prev) => prev + emojiData.emoji);
  };

  // ΟΘΟΝΗ Α: LOGIN
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

  // ΟΘΟΝΗ Β: ΚΥΡΙΩΣ CHAT
  return (
    <div className={styles.chatSplitWrapper}>
      
      {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: LIVE USERS */}
      <div className={styles.sidebarUsers}>
        <div className={styles.sidebarHeader}>
          <span className={styles.onlineDot} /> LIVE NOW
        </div>
        <div className={styles.usersList}>
          {/* Εσύ πάντα πρώτος */}
          <div className={styles.userRowActive}>
            <span className={styles.userAvatarEmoji}>{userAvatar}</span>
            <span className={styles.userNameText}>{nickname} (YOU)</span>
          </div>
          
          {/* Οι υπόλοιποι live χρήστες που συνδέονται */}
          {activeUsers.map((user, idx) => {
            if (user.nickname === nickname) return null; // Μην δείχνεις διπλό τον εαυτό σου
            return (
              <div key={idx} className={styles.userRow}>
                <span className={styles.userAvatarEmoji}>{user.avatar}</span>
                <span className={styles.userNameText}>{user.nickname}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: MESSAGES BOX */}
      <div className={styles.mainChatBox}>
        <div className={styles.chatHeader}>
          <span className={styles.categoryTag}>🟢 ONLINE CHAT</span>
          <span className={styles.userBadge}>as: {nickname}</span>
        </div>

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