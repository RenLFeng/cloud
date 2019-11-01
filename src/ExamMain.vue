<template>
    <div>
        <div>hhhhhaaaaaaaa!!!!! {{ username }}</div>
        <p>
            <!-- 使用 router-link 组件来导航. -->
            <!-- 通过传入 `to` 属性指定链接. -->
            <!-- <router-link> 默认会被渲染成一个 `<a>` 标签 -->
            <router-link to="/navother">other</router-link>
        </p>
    </div>
    
</template>

<script>
    export default {
        name: "ExamMain"
    }
</script>

<style scoped>

</style>