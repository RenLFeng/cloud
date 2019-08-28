<template>

    <div>
        <p>{{ oldmsg.text }}</p>
        <router-link to="/navedit">Go to Edit</router-link>
    </div>
    
</template>

<script>

    import { mapState, mapActions } from 'vuex'

    export default {
        name: "NavOther",
        computed:{

        },
    }
</script>

<style scoped>

</style>