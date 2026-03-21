import { writable } from 'svelte/store';

export const authStore = writable({
    isConnected: false,
    isAdmin: false,
});
