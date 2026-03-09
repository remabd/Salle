<script lang="ts">
    let email = $state('');
    let password = $state('');

    function onSubmit(): void {
    }
</script>

<h1>Connexion</h1>
<form onsubmit={}>
    <label for="email">email</label>
    <input type="email" name="email" id="email" bind:value={email}/>

    <label for="password">password</label>
    <input type="password" name="password" id="password" bind:value={password}/>

    <input type="submit" name="Se connecter"/>
</form>
