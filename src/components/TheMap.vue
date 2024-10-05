<script setup lang="ts">
	import L from "leaflet";
	import type { Coord, Place } from "@/lib/types";
	import { ref, onMounted, watch, defineEmits } from "vue";
	import TheSidebar from "@/components/TheSidebar.vue";

	const ICON_OPTIONS: L.IconOptions = {
		iconUrl: "pin.svg",
		iconSize: [36, 46],
		iconAnchor: [18, 46],
	};

	const mapElement = ref<HTMLDivElement | null>(null);
	const mapInstance = ref<L.Map | null>(null);
	const markerGroup = ref<L.LayerGroup>(L.layerGroup());
	const selectedPlace = ref<Place | null>(null); // Для хранения выбранного места
	const isSidebarOpen = ref(false); // Управление состоянием боковой панели

	const props = withDefaults(
		defineProps<{
			center: Coord;
			places: Place[];
			zoom?: number;
		}>(),
		{
			zoom: 10,
		},
	);

	const emit = defineEmits(["map-click"]);

	onMounted(() => {
		mapInstance.value = createMap();
	});

	function createMap() {
		const map = L.map(mapElement.value as HTMLElement, {
			preferCanvas: true,
		});
		L.tileLayer("http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
			subdomains: ["mt0", "mt1", "mt2", "mt3"],
		}).addTo(map);

		markerGroup.value.addTo(map);
		addMarkers();
		map.setView(props.center, props.zoom);

		// Добавляем обработчик клика по карте
		map.on("click", (e: L.LeafletMouseEvent) => {
			emit("map-click", { lat: e.latlng.lat, lng: e.latlng.lng });
		});

		return map;
	}

	function addMarkers() {
		markerGroup.value.clearLayers();

		props.places.forEach((place: Place) => {
			const pinIcon: L.Marker = L.marker(place.location, {
				icon: L.icon(ICON_OPTIONS),
			});

			// Добавляем всплывающее окно с краткой информацией
			pinIcon.bindPopup(`<b>${place.name}</b>`);

			// Добавляем обработчик события на маркер
			pinIcon.on("click", () => {
				selectedPlace.value = place; // Устанавливаем выбранное место
				isSidebarOpen.value = true; // Открываем боковую панель
			});

			pinIcon.addTo(markerGroup.value as L.LayerGroup);
		});
	}

	watch(
		() => props.places,
		() => {
			addMarkers();
		},
	);

	// Функция закрытия панели
	function closeSidebar() {
		isSidebarOpen.value = false;
	}
</script>

<template>
	<div class="map" ref="mapElement"></div>

	<!-- Компонент боковой панели -->
	<TheSidebar
		:selectedPlace="selectedPlace"
		:isOpen="isSidebarOpen"
		@close="closeSidebar"
	/>
</template>

<style scoped lang="scss">
	.map {
		height: 100%;
	}
</style>
