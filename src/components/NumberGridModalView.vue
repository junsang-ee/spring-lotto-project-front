<script setup>
import {computed, ref} from "vue";

const exceptList = ref([]);
const needsList = ref([]);
const numbers = computed(() => 
    Array.from({ length: 45 }, (_, index) => index + 1)
);

const closeModal = () => {
    emit("close");
}

const checkedNumber = (number, isNeeds) => {
  if (isNeeds) {
    if (exceptList.value.includes(number)) {
      exceptList.value.splice(exceptList.value.indexOf(number), 1);
    }
    if (!needsList.value.includes(number)) {
      needsList.value.push(number);
    }
  } else {
    if (needsList.value.includes(number)) {
      needsList.value.splice(needsList.value.indexOf(number), 1);
    }
    if (!exceptList.value.includes(number)) {
      exceptList.value.push(number);
    }
  }
};

defineProps({
    isShow: Boolean,
    isNeeds: Boolean
});

const emit = defineEmits(
    ['close']
);

</script>

<template>
<div v-if="isShow" class="modal">
  <div class="modal-content">
    <div class="number-grid">
      <button v-for="number in numbers" :key="number" 
        @click="checkedNumber(number, isNeeds)"
        :class="{'checkbox': true, 'checked-except': exceptList.includes(number), 'checked-needs': needsList.includes(number) }"
      >
        {{ number }}
      </button>
    </div>
    <span class="close" @click="closeModal">&times;</span>
  </div>
</div>
</template>

<style scope>

.modal {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

.number-grid {
  display: grid;
  grid-template-columns: repeat(10, 2fr);
  gap: 5px;
  flex-wrap: wrap;
}

.number-grid button {
  border-radius: 100%;
  border: 1px solid #ccc;
  font-size: 20px;
  font-weight: 600;
  margin: 5px;
  padding: 10px;
  cursor: pointer;
}

.checked-except {
  background-color: #dc3545;
  color: #fff;
}

.checked-needs {
  background-color: #37e17e;
  color: #fff;
}
</style>