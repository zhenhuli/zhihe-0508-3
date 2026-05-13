<script>
  import { favorites } from '../stores/favorites.js';
  
  export let gift;
  
  let isFavorite = false;
  
  const unsubscribe = favorites.subscribe(value => {
    isFavorite = value.includes(gift.id);
  });
  
  function toggleFavorite() {
    favorites.toggle(gift.id);
  }
</script>

<div class="gift-card">
  <div class="image-container">
    <img src="{gift.image}" alt="{gift.name}" />
    <button class="favorite-btn" class:active={isFavorite} on:click={toggleFavorite}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
    </button>
  </div>
  <div class="content">
    <h3 class="name">{gift.name}</h3>
    <p class="description">{gift.description}</p>
    <div class="tags">
      {#each gift.tags as tag}
        <span class="tag">{tag}</span>
      {/each}
    </div>
    <div class="price">¥{gift.price}</div>
  </div>
</div>

<style>
  .gift-card {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    transition: transform 0.3s, box-shadow 0.3s;
  }
  
  .gift-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }
  
  .image-container {
    position: relative;
    height: 200px;
    overflow: hidden;
  }
  
  .image-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .favorite-btn {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: none;
    background: rgba(255, 255, 255, 0.9);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;
    color: #ccc;
  }
  
  .favorite-btn:hover {
    background: white;
    transform: scale(1.1);
  }
  
  .favorite-btn.active {
    color: #ff6b6b;
  }
  
  .favorite-btn svg {
    width: 22px;
    height: 22px;
  }
  
  .favorite-btn.active svg {
    fill: #ff6b6b;
  }
  
  .content {
    padding: 20px;
  }
  
  .name {
    margin: 0 0 10px 0;
    font-size: 18px;
    font-weight: 600;
    color: #333;
  }
  
  .description {
    margin: 0 0 12px 0;
    font-size: 14px;
    color: #666;
    line-height: 1.5;
  }
  
  .tags {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
    flex-wrap: wrap;
  }
  
  .tag {
    padding: 4px 12px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 20px;
    font-size: 12px;
  }
  
  .price {
    font-size: 24px;
    font-weight: 700;
    color: #ff6b6b;
  }
</style>
