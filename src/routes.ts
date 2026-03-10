import Login from './containers/Login.svelte';
import NotFound from './containers/NotFound.svelte';

export const routes = {
    '/': Login,

    // Wrapping the Author component
    // '/author/:first/:last?': wrap({
    //     asyncComponent: () => import('./routes/Author.svelte')
    // }),

    // Wrapping the Book component
    // '/book/*': wrap({
    //     asyncComponent: () => import('./routes/Book.svelte')
    // }),

    // Catch-all route last
    '*': NotFound,
};
