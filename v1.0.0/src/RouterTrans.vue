<template>
    <vue-route-transition id="app" :keepAlive="true"></vue-route-transition>
</template>

<script>
    export default {
        name: "RouterTrans"
    }
</script>

<style >
    *{margin: 0;padding: 0;}

    html,body{min-width:320px;max-width:640px;margin-left:auto;margin-right:auto;position: relative;}

    body{background: #f1f1f1;}
</style>