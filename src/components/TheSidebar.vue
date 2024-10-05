<script setup lang="ts">
	import { ref, computed } from "vue";
	import TheCard from "./TheCard.vue";
	import type { Place } from "@/lib/types";

	const props = defineProps<{
		selectedPlace: Place | null;
		isOpen: boolean;
	}>();

	const emit = defineEmits(["close"]);

	const sidebarClass = computed(() => ({
		sidebar: true,
		"sidebar--open": props.isOpen,
	}));
</script>

<template>
	<div :class="['sidebar', { 'sidebar--open': isOpen }]">
		<button class="sidebar__close" @click="emit('close')">×</button>

		<div class="sidebar__content" v-if="props.selectedPlace">
			<!-- Новый блок для изображения -->
			<div class="sidebar__image-container">
				<img
					:src="props.selectedPlace.linkToPhoto"
					alt="Фото объекта"
					class="sidebar__image"
				/>
			</div>

			<TheCard :place="props.selectedPlace" />
		</div>
	</div>
</template>

<style scoped lang="scss">
	.sidebar {
		position: fixed;
		top: 0;
		left: -500px;
		z-index: 1000;
		display: flex;
		flex-direction: column;
		width: 500px;
		height: 100%;
		overflow-y: auto;
		background-color: rgba(255, 255, 255, 0.8); /* Полупрозрачный белый фон */
		box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
		transition: left 0.3s ease;

		&--open {
			left: 0;
		}

		/* Для маленьких экранов (меньше 768px) */
		@media (max-width: 768px) {
			left: -100%; /* Изначально скрыта */
			width: 100%; /* Панель будет занимать всю ширину экрана */
			&--open {
				left: 0; /* Открытая панель на весь экран */
			}
		}
	}

	.sidebar__close {
		align-self: flex-end;
		margin-top: 10px;
		margin-right: 10px;
		padding: 10px;
		font-size: 24px;
		background: transparent;
		border: none;
		cursor: pointer;
	}

	.sidebar__content {
		flex-grow: 1;
		padding: 20px;
	}

	.sidebar__image-container {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 300px; /* Увеличение высоты блока изображения */
		margin-bottom: 20px;
	}

	.sidebar__image {
		max-width: 100%;
		max-height: 100%; /* Устанавливаем максимальную высоту */
		object-fit: cover; /* Масштабируем изображение, сохраняя его пропорции */
		border-radius: 8px;
	}
</style>
