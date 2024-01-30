<template>
    <div>{{ boardId }}</div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const boardId = route.params.boardId;

</script>

<style scope>

</style>