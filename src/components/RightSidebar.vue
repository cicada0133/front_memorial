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
			<button class="login-button" @click="handleLogin">Войти</button>
			<!-- Добавляем кнопку "Войти" -->
		</div>
	</div>
</template>

<style scoped lang="scss">
	.sidebar {
		position: fixed;
		top: 0;
		right: -300px; /* Изначально панель скрыта справа */
		z-index: 1000;
		display: flex;
		flex-direction: column;
		width: 300px;
		height: 100%;
		overflow-y: auto;
		background-color: rgba(255, 255, 255, 0.8); /* Полупрозрачный белый фон */
		box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
		transition: right 0.3s ease;

		&--open {
			right: 0; /* Когда открыта, панель выдвигается */
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

		.login-button {
			margin-top: 20px;
			padding: 10px 20px;
			color: white;
			background-color: #007bff;
			border: none;
			border-radius: 4px;
			cursor: pointer;
			transition: background-color 0.3s ease;
		}

		.login-button:hover {
			background-color: #0056b3;
		}

		@media (max-width: 768px) {
			right: -100%; /* Для маленьких экранов панель скрыта за пределами */
			width: 100%;

			&--open {
				right: 0; /* Выдвигается на полный экран */
			}
		}
	}
</style>
