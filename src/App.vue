<template>
	<RouterView />
</template>

<script setup lang="ts">
import { watch } from "vue";
import { onBeforeRouteUpdate, RouterView } from "vue-router";
import router from "./router";

watch(
	() => router.currentRoute.value,
	(newVal) => {
		document.title = `TODO List${String(newVal.meta.title) ? " - " + String(newVal.meta.title) : ""}`;
	},
	{
		deep: true,
	}
);

onBeforeRouteUpdate((to, from, next) => {
	if (to.meta.title) {
		document.title = `TODO List${String(to.meta.title) ? " - " + String(to.meta.title) : ""}`;
	}
	next();
});
</script>
