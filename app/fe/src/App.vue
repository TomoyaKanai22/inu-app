<script setup lang="ts">
import { ref } from 'vue'

// 画面の入力欄と連動する変数
const dogName = ref('')
const breedResult = ref('')
const errorMessage = ref('')
const isSearched = ref(false)

// 検索ボタンを押したときに動く関数
const searchDog = async () => {
  // 初期化
  breedResult.value = ''
  errorMessage.value = ''
  isSearched.value = false

  if (!dogName.value.trim()) {
    errorMessage.value = '犬の名前を入力してください。'
    return
  }

  try {
    // Azure FunctionsのAPIを呼び出す
    const response = await fetch(`http://localhost:7071/api/getDog?name=${encodeURIComponent(dogName.value)}`)
    
    if (!response.ok) {
      throw new Error('APIの呼び出しに失敗しました。')
    }

    const data = await response.json()

    isSearched.value = true
    if (data.success) {
      breedResult.value = data.breed
    } else {
      breedResult.value = '見つかりませんでした'
    }
  } catch (error) {
    errorMessage.value = 'バックエンドAPIとの通信に失敗しました。Functionsが起動しているか確認してください。'
    console.error(error)
  }
}
</script>

<template>
  <div class="container">
    <div class="title-area">
      <span class="emoji">🐕</span>
      <h1>犬種判定システム</h1>
      <span class="app-code">inu-app</span>
    </div>
    <p class="subtitle">データベースから犬の情報を検索します</p>

    <div class="search-box">
      <input 
        v-model="dogName" 
        type="text" 
        placeholder="犬の名前を入力（例: ポチ、ウメ、タロウ）"
        @keyup.enter="searchDog"
      />
      <button @click="searchDog">検索</button>
    </div>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

    <div v-if="isSearched" class="result-box">
      <h3>検索結果</h3>
      <p class="result-text">
        <span>{{ dogName }}</span> の犬種は... 
        <strong :class="{ 'found': breedResult !== '見つかりませんでした' }">{{ breedResult }}</strong> です！
      </p>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  text-align: center;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  color: #333;
}

.title-area {
  display: flex;
  flex-direction: column; /* 縦並びにする */
  align-items: center;
  gap: 5px;
  margin-bottom: 5px;
}

.emoji {
  font-size: 40px;
}

h1 {
  color: #2c3e50;
  margin: 0;
  font-size: 28px;
  line-height: 1.2;
}

.app-code {
  font-size: 18px;
  color: #7f8c8d;
  font-weight: bold;
}

.subtitle {
  color: #7f8c8d;
  margin-bottom: 30px;
}

.search-box {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 20px;
}

input {
  width: 60%;
  padding: 12px;
  font-size: 16px;
  border: 2px solid #bdc3c7;
  border-radius: 6px;
  outline: none;
  transition: border-color 0.3s;
}

input:focus {
  border-color: #3498db;
}

button {
  padding: 12px 24px;
  font-size: 16px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #2980b9;
}

.error {
  color: #e74c3c;
  font-weight: bold;
}

.result-box {
  margin-top: 30px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.result-text {
  font-size: 18px;
}

.result-text span {
  font-weight: bold;
  color: #2c3e50;
}

strong {
  color: #e74c3c;
}

strong.found {
  color: #27ae60;
  font-size: 22px;
}
</style>