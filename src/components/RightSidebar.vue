<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  isOpen: Boolean,
});

const emit = defineEmits(["close"]);

// Определяем классы для панели на основе состояния props.isOpen
const sidebarClass = computed(() => ({
  sidebar: true,
  "sidebar--open": props.isOpen,
}));

// Функция для обработки клика по кнопке "Войти"
function handleLogin() {
  console.log("Войти кнопка нажата");
  // Здесь можно добавить логику для открытия формы авторизации
}
</script>

<template>
  <div :class="sidebarClass">
    <button class="sidebar__close" @click="emit('close')">×</button>
    <div class="sidebar__content">
      <h2>Меню</h2>
      <ul>
        <li>Главная</li>
        <li>Личный кабинет</li>
        <li>Объекты</li>
        <li>Опубликованные объекты</li>
        <li>События</li>
        <li>Разное</li>
      </ul>
      <button class="login-button" @click="handleLogin">Войти</button> <!-- Добавляем кнопку "Войти" -->
    </div>
  </div>
</template>

<style scoped lang="scss">
.sidebar {
  position: fixed;
  top: 0;
  right: -300px; /* Изначально панель скрыта справа */
  width: 300px;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8); /* Полупрозрачный белый фон */
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  transition: right 0.3s ease;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  overflow-y: auto;

  &--open {
    right: 0; /* Когда открыта, панель выдвигается */
  }

  .sidebar__close {
    align-self: flex-end;
    background: transparent;
    border: none;
    font-size: 24px;
    cursor: pointer;
    padding: 10px;
    margin-right: 10px;
    margin-top: 10px;
  }

  .sidebar__content {
    padding: 20px;
    flex-grow: 1;
  }

  .login-button {
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.3s ease;
  }

  .login-button:hover {
    background-color: #0056b3;
  }

  @media (max-width: 768px) {
    width: 100%;
    right: -100%; /* Для маленьких экранов панель скрыта за пределами */
    &--open {
      right: 0; /* Выдвигается на полный экран */
    }
  }
}
</style>
