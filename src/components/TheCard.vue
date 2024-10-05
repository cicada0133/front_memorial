<script setup lang="ts">
import { ref } from "vue";
import { type Place } from "@/lib/types";
import { Category } from "@/lib/constants";

defineProps<{
  place: Place;
}>();

// Состояние для управления раскрытием описания
const isDescriptionExpanded = ref(false);

// Функция для смены состояния раскрытия
function toggleDescription() {
  isDescriptionExpanded.value = !isDescriptionExpanded.value;
}
</script>

<template>
	<div class="card">
	  <h2 class="card__title">{{ place.name }}</h2>
	  
	  <b>Описание:</b>
	  <!-- Контейнер для описания с ограничением высоты -->
	  <div :class="['description', { 'description--expanded': isDescriptionExpanded }]">
		{{ place.description }}
	  </div>
  
	  <!-- Кнопка для разворачивания/сворачивания описания с переворачиванием изображения -->
	  <button class="toggle-button" @click="toggleDescription">
		<img src="src/assets/imgs/uk.png" alt="Треугольник" class="arrow-icon" :class="{ 'arrow-icon--expanded': isDescriptionExpanded }" />
	  </button><br />
  
	  <b>Категория:</b> {{ Category[place.category] }}.<br />
	  <b>Координаты:</b> {{ place.location.lat }}, {{ place.location.lng }}.
	</div>
  </template>
  
  <style scoped lang="scss">
  .card {
	box-sizing: border-box;
	padding: 20px;
	background-color: #ffffff;
	border-radius: 4px;
  }
  
  .card__title {
	margin: 0 0 15px;
	font-size: 20px;
	line-height: inherit;
  }
  
  /* Стили для описания */
  .description {
	max-height: 60px; /* Ограничение по высоте */
	overflow: hidden;
	transition: max-height 0.3s ease;
  }
  
  .description--expanded {
	max-height: 500px; /* Полный текст */
  }
  
  /* Центрируем кнопку с изображением */
  .toggle-button {
	background: none;
	border: none;
	cursor: pointer;
	padding: 0;
	display: flex;
	justify-content: center; /* Горизонтальное центрирование */
	width: 100%; /* Чтобы кнопка заняла всю ширину контейнера */
	margin-top: 10px;
  }
  
  /* Изображение стрелки */
  .arrow-icon {
	width: 24px;
	height: 24px;
	transition: transform 0.3s ease; /* Плавный переход */
  }
  
  /* Поворот на 180 градусов при раскрытии описания */
  .arrow-icon--expanded {
	transform: rotate(180deg);
  }
  </style>
  