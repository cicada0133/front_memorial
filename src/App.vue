<script setup lang="ts">
	import { nextTick, ref, computed } from "vue";

	// Импортируем все необходимые компоненты и типы
	import BaseField from "@/components/BaseField.vue";
	import TheCatalog from "@/components/TheCatalog.vue";
	import TheMap from "@/components/TheMap.vue";
	import RightSidebar from "@/components/RightSidebar.vue";
	import AddPlaceSidebar from "@/components/AddPlaceSidebar.vue";

	import type { Place, Coord } from "@/lib/types";
	import {
		TRANSITION_TIMEOUT,
		THRESHOLD,
		LOW_GADGET_HEIGHT,
	} from "@/lib/constants";
	import { useAppStore } from "@/stores";
	import { wait } from "@/lib/utils";

	const MIN_PANEL_HEIGHT = 80; // Высота панели в покое

	const panelElement = ref<HTMLDivElement | null>(null);
	const panelHeight = ref(MIN_PANEL_HEIGHT);
	const diff = ref(0);
	const animating = ref(false);
	const dragging = ref(false);
	const overlayed = ref(false);
	const startCoord = ref(0);
	const query = ref("");
	const renewPlaces = ref(false);
	const filteredPlaces = ref<Place[]>([]);
	const dragTargetElement = ref<HTMLElement | null>(null);

	const isRightSidebarOpen = ref(false); // Состояние для правой панели
	const isAddPlaceSidebarOpen = ref(false); // Состояние для панели добавления объекта
	const isSelectingLocation = ref(false); // Новый режим выбора точки
	const selectedCoords = ref<Coord | null>(null);

	const appStore = useAppStore();
	appStore.get();

	const places = computed(() => {
		if (filteredPlaces.value.length) {
			return filteredPlaces.value;
		}
		return appStore.state.places;
	});

	// Общая функция для закрытия всех панелей
	function closeAllSidebars() {
		isRightSidebarOpen.value = false;
		isAddPlaceSidebarOpen.value = false;
	}

	// Функция для открытия/закрытия правой панели
	function toggleRightSidebar() {
		if (isRightSidebarOpen.value) {
			isRightSidebarOpen.value = false;
		} else {
			closeAllSidebars();
			nextTick(() => {
				isRightSidebarOpen.value = true;
			});
		}
	}

	// Функция для начала выбора точки на карте
	function startSelectingLocation() {
		closeAllSidebars();
		isSelectingLocation.value = true; // Включаем режим выбора точки
	}

	// Обработка клика по карте для выбора точки
	function handleMapClick(coords: Coord) {
		if (isSelectingLocation.value) {
			selectedCoords.value = coords; // Сохраняем координаты выбранной точки
			isSelectingLocation.value = false; // Выключаем режим выбора точки
			openAddPlaceSidebar(); // Открываем панель добавления объекта
		}
	}

	// Открытие панели добавления объекта
	function openAddPlaceSidebar() {
		isAddPlaceSidebarOpen.value = true;
	}

	// Закрытие панели добавления объекта
	function closeAddPlaceSidebar() {
		isAddPlaceSidebarOpen.value = false;
	}

	// Остальные функции остаются прежними...
	async function setHeightSmoothly(value: number) {
		animating.value = true;
		panelHeight.value = value;
		await wait(TRANSITION_TIMEOUT);
		startCoord.value = panelHeight.value;
		animating.value = false;
	}

	async function makePanelHigh() {
		overlayed.value = true;
		await setHeightSmoothly(document.body.clientHeight - MIN_PANEL_HEIGHT);
	}

	async function makePanelMedium() {
		overlayed.value = false;
		await setHeightSmoothly(
			(document.body.clientHeight - MIN_PANEL_HEIGHT) / 2,
		);
	}

	async function makePanelLow() {
		overlayed.value = false;
		await setHeightSmoothly(MIN_PANEL_HEIGHT);
	}

	async function onDragStart(event: Event | Touch, y: number) {
		dragTargetElement.value = event.target as HTMLElement;
		diff.value = document.body.clientHeight - y - panelHeight.value;
		startCoord.value = panelHeight.value;
		dragging.value = true;
	}

	function onDrag(y: number) {
		if (!dragging.value) {
			return;
		}
		if (y < THRESHOLD || y > document.body.clientHeight - THRESHOLD) {
			return onDragEnd();
		}

		const value = document.body.clientHeight - y - diff.value;
		overlayed.value = value > (document.body.clientHeight * 3) / 5;
		panelHeight.value = value;
	}

	function onDragEnd() {
		dragging.value = false;

		if (
			panelHeight.value === MIN_PANEL_HEIGHT &&
			dragTargetElement.value?.tagName.toLowerCase() === "input"
		) {
			return makePanelHigh();
		}

		const delta = startCoord.value - panelHeight.value;
		if (!delta) {
			return;
		}

		if (document.body.clientHeight < LOW_GADGET_HEIGHT) {
			return delta > 0 ? makePanelLow() : makePanelHigh();
		}

		const lowMultiplier = delta > 0 ? 2 : 1;
		if (panelHeight.value < (document.body.clientHeight * lowMultiplier) / 5) {
			return makePanelLow();
		}

		const highMultiplier = delta > 0 ? 4 : 2.5;
		if (panelHeight.value > (document.body.clientHeight * highMultiplier) / 5) {
			return makePanelHigh();
		}

		return makePanelMedium();
	}

	async function onSearch() {
		filteredPlaces.value = [];
		await appStore.search(query.value);
		renewPlaces.value = true;
	}
</script>

<template>
	<div
		class="app"
		v-if="appStore.state.center"
		@touchmove.prevent="onDrag($event.changedTouches[0].clientY)"
		@mousemove.prevent="onDrag($event.clientY)"
	>
		<!-- Оверлей для затемнения фона -->
		<div class="menu-overlay" v-if="isRightSidebarOpen"></div>

		<!-- Верхняя полупрозрачная панель -->
		<header class="top-bar">
			<div class="top-bar__content">
				<div class="top-bar__left">
					<h1>Название сервиса</h1>
				</div>

				<!-- Кнопка открытия правой панели -->
				<div class="top-bar__right">
					<button @click="toggleRightSidebar">
						<img src="@/assets/imgs/Hamburger_icon.svg.png" alt="Меню" />
					</button>
				</div>
			</div>
		</header>

		<!-- Карта -->
		<TheMap
			class="app__map"
			:center="appStore.state.center"
			:places="places"
			@map-click="handleMapClick"
		/>

		<!-- Правая панель -->
		<RightSidebar :isOpen="isRightSidebarOpen" @close="toggleRightSidebar">
			<h2>Меню</h2>
			<ul>
				<li>Главная</li>
				<li>Личный кабинет</li>
				<li>Объекты</li>
				<li>Опубликованные объекты</li>
				<li>События</li>
				<li>Разное</li>
			</ul>
		</RightSidebar>

		<!-- Кнопка "Добавить объект" -->
		<div class="add-object-container">
			<button class="add-object-button" @click="startSelectingLocation">
				Добавить объект
			</button>
		</div>

		<!-- Панель добавления объекта -->
		<AddPlaceSidebar
			:isOpen="isAddPlaceSidebarOpen"
			:coords="selectedCoords"
			@close="closeAddPlaceSidebar"
		/>

		<!-- Нижняя панель -->
		<div
			class="app__panel"
			:class="{
				'app__panel--animated': animating,
				'app__panel--dragging': dragging,
				'app__panel--overlayed': overlayed,
			}"
			ref="panelElement"
			@touchstart="
				onDragStart($event.changedTouches[0], $event.changedTouches[0].clientY)
			"
			@touchend="onDragEnd"
			@mousedown="onDragStart($event, $event.clientY)"
			@mouseup="onDragEnd"
			:style="`height: ${panelHeight}px`"
		>
			<span class="app__overlay" @click="makePanelLow"></span>
			<span class="app__top-saver"></span>

			<BaseField
				class="app__search"
				v-model="query"
				@update:model-value="onSearch"
				type="search"
				placeholder="Поиск мест, скидок, карт поблизости"
			/>

			<TheCatalog
				:places="appStore.state.places"
				:renew="renewPlaces"
				@places:filter="filteredPlaces = $event"
				@scroll:top="makePanelLow"
				@scroll:bottom="makePanelHigh"
				@update:resetRenew="renewPlaces = false"
			/>
		</div>
	</div>
</template>

<style scoped lang="scss">
	.app {
		display: grid;
		grid-template-rows: 1fr auto;
		height: 100vh;
		overflow: hidden;
	}

	/* Оверлей для затемнения фона */
	.menu-overlay {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 900; /* Ниже правой панели */
		width: 100%;
		height: 100vh;
		background-color: rgba(0, 0, 0, 0.5); /* Полупрозрачное затемнение */
	}

	/* Верхняя панель */
	.top-bar {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 1000;
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		padding: 10px 15px;
		background-color: rgba(255, 255, 255, 0.4); /* Полупрозрачный фон */
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* Тень для глубины */
	}

	/* Контент верхней панели */
	.top-bar__content {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 97%;
	}

	/* Логотип или название */
	.top-bar__left h1 {
		margin: 0;
		font-weight: bold;
		font-size: 20px;
	}

	/* Кнопка меню */
	.top-bar__right button {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 20;
		background: transparent;
		border: none;
		cursor: pointer;
	}

	.top-bar__right img {
		width: 24px;
		height: 24px;
	}

	/* Кнопка "Добавить объект" */
	.add-object-container {
		position: fixed;
		bottom: 20px;
		left: 50%;
		z-index: 1000;
		transform: translateX(-50%);
	}

	.add-object-button {
		padding: 15px 30px;
		font-size: 18px;
		color: white;
		background-color: #d32f2f;
		border: none;
		border-radius: 5px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
		cursor: pointer;
		transition: background-color 0.3s ease;
	}

	.add-object-button:hover {
		background-color: #c62828;
	}

	/* Нижняя панель и карта */
	.app__overlay {
		position: absolute;
		right: 0;
		bottom: 100%;
		left: 0;
		height: 100vh;
		background-color: rgba(0, 0, 0, 0.5);
		visibility: hidden;
		opacity: 0;
		transition: 0.3s ease-in-out;
	}

	.app__top-saver {
		position: absolute;
		right: 0;
		bottom: 100%;
		left: 0;
		height: 20px;
	}

	.app__panel {
		position: relative;
		z-index: 400;
		box-sizing: border-box;
		padding-top: 20px;
		box-shadow: 0 -8px 16px 0 rgba(45, 52, 64, 0.12);

		&::before,
		&::after {
			content: "";
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
		}

		&::before {
			top: 8px;
			width: 60px;
			height: 4px;
			background-color: #bbbbbb;
			border-radius: 2px;
		}

		&::after {
			top: 0;
			width: 80px;
			height: 20px;
			cursor: grab;
		}

		&--dragging {
			cursor: grabbing;

			&::after {
				cursor: inherit;
			}
		}

		&--overlayed {
			.app__overlay {
				visibility: visible;
				opacity: 1;
			}
		}

		&--animated {
			transition: height 0.3s ease-in-out;
		}
	}

	.app__search {
		margin: 0 15px;
	}
</style>
