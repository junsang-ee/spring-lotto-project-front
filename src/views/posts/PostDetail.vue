<template>
  <div>test</div>
</template>

<script setup>

import { onMounted, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const postId = route.params.postId;
const boardName = route.query.boardName;
</script>

<style scoped>

</style>