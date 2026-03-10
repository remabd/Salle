import wrap from 'svelte-spa-router/wrap';

import Login from './containers/Login.svelte';
import NotFound from './containers/NotFound.svelte';
import DashBoard from './containers/Dashboard.svelte';
import Salle from './containers/Salle.svelte';
import Profile from './containers/Profile.svelte';

import AuthGuard from './guards/auth.guard';

export const routes = {
    '/': Login,

    '/dashboard': wrap({
        component: DashBoard,
        conditions: [new AuthGuard().isAdmin],
    }),
    '/profile': wrap({
        component: Profile,
        conditions: [new AuthGuard().isConnected],
    }),
    '/salle': wrap({
        component: Salle,
        conditions: [new AuthGuard().isConnected],
    }),

    '*': NotFound,
};
