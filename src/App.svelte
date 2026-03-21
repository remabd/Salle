<script lang="ts">
    import Router from 'svelte-spa-router';
    import { routes } from './routes';

    import Header from './containers/Header.svelte';
    import Footer from './containers/Footer.svelte';
</script>

<Header />
<main>
    <Router {routes} />
</main>
<Footer />

<style>
    main {
        width: 80%;
    }
</style>
