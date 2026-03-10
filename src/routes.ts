import Login from './containers/Login.svelte';
import NotFound from './containers/NotFound.svelte';
import DashBoard from './containers/Dashboard.svelte';
import Salle from './containers/Salle.svelte';
import Profile from './containers/Profile.svelte';

export const routes = {
    '/': Login,

    '/dashboard': DashBoard,
    '/profile': Profile,
    '/salle': Salle,

    '*': NotFound,
};
