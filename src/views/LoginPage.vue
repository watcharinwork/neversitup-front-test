<template>
	<div class="grid mt-8 space-y-4">
		<header class="mx-auto text-3xl font-bold">TODO LIST - Login</header>
		<form class="grid space-y-2 w-min mx-auto py-2 px-8" @keyup.enter="login">
			<div class="grid space-y-1 mx-auto">
				<label>Username</label>
				<input
					type="text"
					class="border rounded-md p-2 w-64 focus-visible:outline-blue-400"
					autocomplete="username"
					placeholder="username"
					v-model="data.username"
					@input="
						() => {
							errorField['username'] = null;
						}
					"
				/>
				<div v-if="errorField['username']" class="ml-1 text-sm text-red-600">
					{{ errorField["username"] }}
				</div>
			</div>

			<div class="grid space-y-1 mx-auto">
				<label>Password</label>
				<input
					type="password"
					class="border rounded-md p-2 w-64 focus-visible:outline-blue-400"
					autocomplete="current-password"
					placeholder="password"
					v-model="data.password"
					@input="
						() => {
							errorField['password'] = null;
						}
					"
				/>
				<div v-if="errorField['password']" class="ml-1 text-sm text-red-600">
					{{ errorField["password"] }}
				</div>
			</div>
		</form>
		<div class="mx-auto flex flex-row gap-2">
			<a
				href="https://nevers-todo-register.firebaseapp.com/"
				target="_blank"
				class="border px-4 py-2 rounded-md bg-white text-black hover:bg-gray-300 transition-colors"
				>REGISTER</a
			>
			<button
				class="border flex px-4 py-2 items-center rounded-md bg-blue-500 text-white hover:bg-blue-700 transition-colors"
				@click="login"
				:class="{ 'bg-blue-500/50 hover:bg-blue-500/50': loading }"
			>
				<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" v-if="loading">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
					<path
						class="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					></path>
				</svg>
				LOGIN
			</button>
		</div>
	</div>

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
import http from "../utils/fetch";
import modal from "../components/modal.vue";
import router from "@/router";

const errorCard = ref();

const data = reactive({
	username: "",
	password: "",
});

const loading = ref(false);

const errorDlg = reactive({
	title: "",
	isShow: false,
	msg: "",
	handleClick: () => {
		errorCard.value.close();
	},
});

http.clearToken();

const errorField = ref(Object());

function validateTodo(): boolean {
	let isValid = true;
	errorField.value = {};

	if (data.username.trim().length <= 0) {
		isValid = false;
		errorField.value["username"] = "Username is required";
	}

	if (data.password.trim().length <= 0) {
		isValid = false;
		errorField.value["password"] = "Password is required";
	}

	return isValid;
}

function login() {
	if (loading.value) return;

	if (!validateTodo()) {
		alert("Please fill username and password");
		return;
	}

	loading.value = true;

	http
		.login(data)
		.then(() => {
			setTimeout(() => {
				router.push("/");
			}, 500);
		})
		.catch((error) => {
			errorDlg.title = "Login failed";
			try {
				errorDlg.msg = JSON.stringify(error).split('"')[1];
			} catch {
				errorDlg.msg = JSON.stringify(error);
			}
			errorDlg.isShow = true;
			loading.value = false;
		});
}

watch(
	() => errorDlg.isShow,
	(newVal) => {
		if (newVal) {
			errorDlg.isShow = false;
			errorCard.value.show();
		}
	},
	{ deep: true }
);
</script>
