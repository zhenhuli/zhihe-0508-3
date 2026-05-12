import React, { useState, useEffect } from 'react';
import { emojiCategories } from './emojiData';
import './App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [copiedEmoji, setCopiedEmoji] = useState(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('emojiFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('emojiFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const copyEmoji = async (emoji) => {
    try {
      await navigator.clipboard.writeText(emoji);
      setCopiedEmoji(emoji);
      setTimeout(() => setCopiedEmoji(null), 1500);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  const toggleFavorite = (emojiItem) => {
    const isFavorited = favorites.some(f => f.emoji === emojiItem.emoji);
    if (isFavorited) {
      setFavorites(favorites.filter(f => f.emoji !== emojiItem.emoji));
    } else {
      setFavorites([...favorites, emojiItem]);
    }
  };

  const isFavorited = (emoji) => {
    return favorites.some(f => f.emoji === emoji);
  };

  const getFilteredEmojis = () => {
    let allEmojis = [];
    
    if (showFavoritesOnly) {
      allEmojis = favorites;
    } else if (selectedCategory === 'all') {
      emojiCategories.forEach(cat => {
        allEmojis = [...allEmojis, ...cat.emojis];
      });
    } else {
      const category = emojiCategories.find(cat => cat.id === selectedCategory);
      if (category) {
        allEmojis = category.emojis;
      }
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      allEmojis = allEmojis.filter(item => {
        const nameMatch = item.name.toLowerCase().includes(term);
        const keywordMatch = item.keywords?.some(k => k.toLowerCase().includes(term));
        const codeMatch = item.codes?.some(c => c.toLowerCase().includes(term));
        const aliasMatch = item.aliases?.some(a => a.toLowerCase().includes(term));
        return nameMatch || keywordMatch || codeMatch || aliasMatch;
      });
    }

    return allEmojis;
  };

  return (
    <div className="app">
      <header className="header">
        <h1>😀 Emoji 收藏工具</h1>
        <p>快速搜索、复制和收藏你喜欢的表情符号</p>
      </header>

      <div className="search-bar">
        <input
          type="text"
          placeholder="🔍 搜索表情..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="category-tabs">
        <button
          className={`tab ${showFavoritesOnly ? 'active' : ''}`}
          onClick={() => {
            setShowFavoritesOnly(true);
            setSelectedCategory('all');
          }}
        >
          ⭐ 收藏 ({favorites.length})
        </button>
        <button
          className={`tab ${!showFavoritesOnly && selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => {
            setShowFavoritesOnly(false);
            setSelectedCategory('all');
          }}
        >
          📁 全部 ({emojiCategories.reduce((sum, cat) => sum + cat.emojis.length, 0)})
        </button>
        {emojiCategories.map(cat => (
          <button
            key={cat.id}
            className={`tab ${!showFavoritesOnly && selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => {
              setShowFavoritesOnly(false);
              setSelectedCategory(cat.id);
            }}
          >
            {cat.name} ({cat.emojis.length})
          </button>
        ))}
      </div>

      <div className="emoji-grid">
        {getFilteredEmojis().map((item, index) => (
          <div
            key={`${item.emoji}-${index}`}
            className={`emoji-card ${copiedEmoji === item.emoji ? 'copied' : ''}`}
            onClick={() => copyEmoji(item.emoji)}
          >
            <span className="emoji">{item.emoji}</span>
            <span className="emoji-name">{item.name}</span>
            {item.codes && item.codes.length > 0 && (
              <div className="emoji-codes">
                {item.codes.slice(0, 2).map((code, i) => (
                  <span key={i} className="code-tag">{code}</span>
                ))}
              </div>
            )}
            {item.aliases && item.aliases.length > 0 && (
              <div className="emoji-aliases">
                {item.aliases.slice(0, 2).map((alias, i) => (
                  <span key={i} className="alias-tag">{alias}</span>
                ))}
              </div>
            )}
            <button
              className={`favorite-btn ${isFavorited(item.emoji) ? 'favorited' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(item);
              }}
            >
              {isFavorited(item.emoji) ? '❤️' : '🤍'}
            </button>
            {copiedEmoji === item.emoji && (
              <span className="copied-tooltip">已复制!</span>
            )}
          </div>
        ))}
      </div>

      {getFilteredEmojis().length === 0 && (
        <div className="empty-state">
          <p>😢 没有找到相关表情</p>
        </div>
      )}

      <footer className="footer">
        <p>💡 点击表情即可复制 | 点击爱心收藏表情</p>
      </footer>
    </div>
  );
}

export default App;
