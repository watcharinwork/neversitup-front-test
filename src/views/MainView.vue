<template>
	<div class="w-full relative">
		<div class="flex flex-col gap-4 p-4 z-1 min-h-screen">
			<div
				class="relative border cursor-pointer border-indigo-600 min-h-32 rounded-md p-4 hover:bg-gray-50 hover:ring-1 hover:ring-indigo-700"
				v-for="(card, idx) of cards"
			>
				<button
					class="absolute z-10 top-1 right-1 border rounded-full bg-white w-6 h-6 transition-colors text-red-500 hover:text-red-700 duration-100 hover:ring-1 hover:ring-red-400"
					@click="
						() => {
							data = card;
							openDialog(confirmRemoveCard);
						}
					"
				>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mx-auto" viewBox="0 0 20 20" fill="currentColor">
						<path
							fill-rule="evenodd"
							d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
							clip-rule="evenodd"
						/>
					</svg>
				</button>
				<div class="" :key="`${randID()}_${idx}`" @click="openTodoCard(card._id)">
					<header class="text-2xl font-semibold pr-8">
						{{ card.title }}
					</header>
					<pre class="mt-8 whitespace-pre-wrap">{{ card.description }}</pre>
					<div class="text-right text-gray-400 mt-4">Last update : {{ formatDate(card.updatedAt) }}</div>
				</div>
			</div>

			<div v-if="(!cards || cards.length <= 0) && !loading" class="text-gray-500 w-full text-center my-auto">
				TODO IS EMPTY!<br />
				<span class="text-sm">Press 'Create' for add new todo card. </span>
			</div>

			<div v-if="loading" class="text-gray-500 w-full my-auto flex">
				<svg class="animate-spin h-12 w-12 text-black mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" v-if="loading">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
					<path
						class="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					></path>
				</svg>
			</div>
		</div>
	</div>

	<div class="fixed flex bottom-8 right-0 left-0 gap-4" v-if="!loading">
		<router-link
			to="/login"
			class="w-min z-10 whitespace-nowrap ml-auto px-4 py-2 border rounded-md hover:bg-gray-100 transition-colors duration-100 bg-white shadow flex gap-1 items-center"
		>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
				/>
			</svg>
			Logout
		</router-link>

		<button
			class="w-min z-10 whitespace-nowrap mr-auto px-4 py-2 border rounded-md hover:bg-blue-700 text-white transition-colors duration-100 bg-blue-500 shadow flex gap-1 items-center"
			@click="dlgNewTodo()"
		>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
			Create
		</button>
	</div>

	<modal ref="addTodoRef">
		<div class="min-w-128 space-y-2">
			<div class="grid space-y-1 mx-auto w-full">
				<label>Title <span class="text-red-600">*</span></label>
				<input
					type="text"
					class="border rounded-md p-2 focus-visible:outline-blue-400"
					placeholder="title"
					v-model="data.title"
					@input="
						() => {
							errorField['title'] = null;
						}
					"
				/>
				<div v-if="errorField['title']" class="ml-1 text-sm text-red-600">
					{{ errorField["title"] }}
				</div>
			</div>

			<div class="grid space-y-1 mx-auto w-full">
				<label>Description <span class="text-red-600">*</span></label>
				<textarea
					rows="6"
					class="border rounded-md p-2 focus-visible:outline-blue-400"
					placeholder="description"
					v-model="data.description"
					@input="
						() => {
							errorField['description'] = null;
						}
					"
				/>
				<div v-if="errorField['description']" class="ml-1 text-sm text-red-600">
					{{ errorField["description"] }}
				</div>
			</div>

			<!-- ACTION -->
			<div class="flex w-full gap-2">
				<button class="ml-auto border px-4 py-2 rounded-md bg-white text-black hover:bg-gray-300 transition-colors" @click="closeDlg(addTodoRef)">
					Close
				</button>
				<button
					class="mr-auto border px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-700 transition-colors flex items-center"
					:class="{ 'bg-blue-500/50': loading }"
					@click="
						(e) => {
							if (data._id) {
								return updateTodoCard();
							} else return addTodo();
						}
					"
				>
					<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" v-if="loading">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
						<path
							class="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path>
					</svg>
					<span v-if="data._id"> Update </span>
					<span v-else> ADD</span>
				</button>
			</div>
		</div>
	</modal>

	<modal ref="confirmRemoveCard">
		<div class="min-w-128">
			<header class="text-2xl mb-2 font-semibold pr-8">Confirm!</header>
			<p>Are you want to delete {{ data.title }}?</p>
			<!-- ACTION -->
			<div class="flex w-full gap-2 mt-8">
				<button
					class="ml-auto border px-4 py-2 rounded-md bg-white text-black hover:bg-gray-300 transition-colors"
					@click="closeDlg(confirmRemoveCard)"
				>
					Close
				</button>
				<button
					class="mr-auto flex border px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-700 transition-colors"
					@click="onRemoveTodo"
					:class="{ 'bg-red-500/50': loading }"
				>
					<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" v-if="loading">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
						<path
							class="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path>
					</svg>
					Remove
				</button>
			</div>
		</div>
	</modal>

	<modal ref="errorCard" :show-close="false">
		<div class="min-w-128">
			<header class="text-red-600 text-2xl mb-2 font-semibold pr-8">{{ errorDlg.title }}</header>
			<p>{{ errorDlg.msg }}</p>
			<!-- ACTION -->
			<div class="flex w-full gap-2 mt-8">
				<button class="ml-auto border px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-700 transition-colors" @click="errorDlg.handleClick">
					Close
				</button>
			</div>
		</div>
	</modal>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import modal from "../components/modal.vue";
import http from "../utils/fetch";

interface CardDetail {
	_id: string;
	title: string;
	description: string;
	user_id: string;
	createdAt: string;
	updatedAt: string;
}

const addTodoRef = ref();
const confirmRemoveCard = ref();
const errorCard = ref();
const cards = ref(Array<CardDetail>());

const loading = ref(false);
const errorDlg = reactive({
	title: "",
	isShow: false,
	msg: "",
	handleClick: () => {
		closeDlg(errorCard.value);
	},
});

const DEFAULT_CARD = {
	_id: "",
	title: "",
	description: "",
	user_id: "",
	createdAt: "",
	updatedAt: "",
};

const data = ref(DEFAULT_CARD);

function randID() {
	return Math.random().toString(36).substring(2, 9);
}

const URL_TODOS = "/todos";

const errorField = ref(Object());

function openDialog(dialogRef: any) {
	dialogRef.show();
}

function validateTodo(): boolean {
	let isValid = true;
	errorField.value = {};

	if (data.value.title.trim().length <= 0) {
		isValid = false;
		errorField.value["title"] = "Title is required";
	}

	if (data.value.description.trim().length <= 0) {
		isValid = false;
		errorField.value["description"] = "Description is required";
	}

	return isValid;
}

function closeDlg(dialogRef: any) {
	data.value = DEFAULT_CARD;
	dialogRef.close();
}

function formatDate(date: string) {
	const d = new Date(date);
	return d.toLocaleString();
}

function dlgNewTodo() {
	data.value = JSON.parse(JSON.stringify(DEFAULT_CARD));
	openDialog(addTodoRef.value);
}

function openTodoCard(_id: string) {
	if (loading.value) return;

	loading.value = true;

	http
		.callFetch(URL_TODOS + `/${_id}`, "GET")
		.then((res: any) => {
			if (res) {
				let result = res as CardDetail;
				data.value = result;
				openDialog(addTodoRef.value);
			}
		})
		.catch((error: any) => {
			errorDlg.title = "Open todo card failed";
			try {
				errorDlg.msg = JSON.stringify(error).split('"')[1];
			} catch {
				errorDlg.msg = JSON.stringify(error);
			}
			errorDlg.isShow = true;
		})
		.then(() => {
			loading.value = false;
		});
}

function updateTodoCard() {
	if (loading.value) return;

	if (!validateTodo()) {
		alert("Please fill all required fields");
		return;
	}

	loading.value = true;

	http
		.callFetch(URL_TODOS + `/${data.value._id}`, "PUT", data.value)
		.then((res: any) => {
			if (res) {
				loading.value = false;
				closeDlg(addTodoRef.value);
				reload();
			}
		})
		.catch((error: any) => {
			errorDlg.title = "Open todo card failed";
			try {
				errorDlg.msg = JSON.stringify(error).split('"')[1];
			} catch {
				errorDlg.msg = JSON.stringify(error);
			}
			errorDlg.isShow = true;
		})
		.then(() => {
			loading.value = false;
		});
}

function onRemoveTodo() {
	if (loading.value) return;

	loading.value = true;

	http
		.callFetch(URL_TODOS + `/${data.value._id}`, "DELETE")
		.then(() => {
			loading.value = false;
			closeDlg(confirmRemoveCard.value);
			reload();
		})
		.catch((error: any) => {
			errorDlg.title = "Remove todo card failed";
			try {
				errorDlg.msg = JSON.stringify(error).split('"')[1];
			} catch {
				errorDlg.msg = JSON.stringify(error);
			}
			errorDlg.isShow = true;
		})
		.then(() => {
			loading.value = false;
		});
}

function addTodo() {
	if (loading.value) return;

	if (!validateTodo()) {
		alert("Please fill all required fields");
		return;
	}

	let dataPost = {
		title: data.value.title,
		description: data.value.description,
	};

	loading.value = true;

	http
		.callFetch(URL_TODOS, "POST", dataPost)
		.then((res: any) => {
			if (res) {
				loading.value = false;
				closeDlg(addTodoRef.value);
				reload();
			}
		})
		.catch((error: any) => {
			errorDlg.title = "Add todo card failed";
			try {
				errorDlg.msg = JSON.stringify(error).split('"')[1];
			} catch {
				errorDlg.msg = JSON.stringify(error);
			}
			errorDlg.isShow = true;
		})
		.then(() => {
			loading.value = false;
		});
}

function reload() {
	if (loading.value) return;

	loading.value = true;

	cards.value = [];
	http
		.callFetch(URL_TODOS + `/`, "GET")
		.then((res: any) => {
			if (res) {
				cards.value = res;
			}
			loading.value = false;
		})
		.catch((error: any) => {
			if (error == "Please Login first!") {
				location.assign("/login");
			} else {
				errorDlg.title = "Get todo card list failed.";
				try {
					errorDlg.msg = JSON.stringify(error).split('"')[1];
				} catch {
					errorDlg.msg = JSON.stringify(error);
				}
				errorDlg.isShow = true;
				errorDlg.handleClick = () => {};
			}
		});
}

// onMounted
reload();

watch(
	() => errorDlg.isShow,
	(newVal) => {
		if (newVal) {
			errorDlg.isShow = false;
			openDialog(errorCard.value);
		}
	},
	{ deep: true }
);
</script>
