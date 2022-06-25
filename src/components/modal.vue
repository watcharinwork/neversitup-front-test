<template>
	<transition
		enter-active-class="transition-opacity duration-300 ease-in-out"
		enter-from-class="opacity-0"
		enter-to-class="opacity-100"
		leave-active-class="transition-opacity duration-300 ease-in-out"
		leave-from-class="opacity-100"
		leave-to-class="opacity-0"
		appear
	>
		<div v-if="isShow" class="fixed top-0 left-0 w-full h-screen bg-gray-200/75 flex z-30">
			<div class="relative border rounded-md m-auto min-w-64 min-h-32 bg-white p-4">
				<button
					v-if="showClose"
					class="absolute -top-3 -right-3 border rounded-full bg-white w-6 h-6 transition-colors text-red-500 hover:text-red-700 duration-100"
					@click="close"
				>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mx-auto" viewBox="0 0 20 20" fill="currentColor">
						<path
							fill-rule="evenodd"
							d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
							clip-rule="evenodd"
						/>
					</svg>
				</button>
				<slot></slot>
			</div>
		</div>
	</transition>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const props = defineProps({
	showClose: {
		type: Boolean,
		default: true,
	},
});

const isShow = ref(false);

function show() {
	isShow.value = true;
}

function close() {
	isShow.value = false;
}

defineExpose({
	show,
	close,
});
</script>
