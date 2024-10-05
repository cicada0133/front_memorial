<script setup lang="ts">
	import { ref, computed } from "vue";

	const props = defineProps<{
		isOpen: boolean;
		coords: { lat: number; lng: number } | null; // добавлены координаты места
	}>();

	const emit = defineEmits(["close", "submit"]);

	// Хранение значений формы
	const placeName = ref("");
	const placeDescription = ref("");
	const placePhoto = ref<File | null>(null);

	// Функция для загрузки файла
	function onFileChange(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			placePhoto.value = target.files[0];
		}
	}

	// Отправка объекта на модерацию
	function submitPlace() {
		if (!placeName.value || !placeDescription.value || !placePhoto.value) {
			alert("Заполните все поля перед отправкой");
			return;
		}

		emit("submit", {
			name: placeName.value,
			description: placeDescription.value,
			photo: placePhoto.value,
			location: props.coords, // передаем координаты
		});

		// Очистка формы после отправки
		placeName.value = "";
		placeDescription.value = "";
		placePhoto.value = null;

		// Закрытие панели
		emit("close");
	}
</script>

<template>
	<div :class="['sidebar', { 'sidebar--open': isOpen }]">
		<button class="sidebar__close" @click="emit('close')">×</button>

		<div class="sidebar__content">
			<h2>Добавить новый объект</h2>

			<!-- Выбранные координаты -->
			<p v-if="coords">
				Координаты выбранного места: {{ coords.lat }}, {{ coords.lng }}
			</p>

			<!-- Поле для ввода названия -->
			<div class="form-group">
				<label for="place-name">Название объекта:</label>
				<input
					id="place-name"
					v-model="placeName"
					type="text"
					placeholder="Введите название объекта"
					required
				/>
			</div>

			<!-- Поле для ввода описания -->
			<div class="form-group">
				<label for="place-description">Описание:</label>
				<textarea
					id="place-description"
					v-model="placeDescription"
					placeholder="Введите описание объекта"
					rows="5"
					required
				></textarea>
			</div>

			<!-- Поле для загрузки фотографии -->
			<div class="form-group">
				<label for="place-photo">Загрузить фотографию:</label>
				<input
					id="place-photo"
					type="file"
					@change="onFileChange"
					accept="image/*"
				/>
			</div>

			<!-- Кнопка для отправки на модерацию -->
			<button class="submit-button" @click="submitPlace">
				Отправить на модерацию
			</button>
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
		background-color: rgba(255, 255, 255, 0.8);
		box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
		transition: left 0.3s ease;

		&--open {
			left: 0;
		}

		@media (max-width: 768px) {
			left: -100%;
			width: 100%;

			&--open {
				left: 0;
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

	.form-group {
		margin-bottom: 20px;

		label {
			display: block;
			margin-bottom: 5px;
			font-weight: bold;
		}

		input,
		textarea {
			box-sizing: border-box;
			width: 100%;
			padding: 8px;
			font-size: 16px;
			border: 1px solid #cccccc;
			border-radius: 4px;
		}
	}

	.submit-button {
		width: 100%;
		padding: 10px;
		font-size: 18px;
		color: #ffffff;
		background-color: #e74c3c;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}

	.submit-button:hover {
		background-color: #c0392b;
	}
</style>
