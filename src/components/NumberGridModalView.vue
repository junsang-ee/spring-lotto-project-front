<script setup>
import {computed, ref} from "vue";


const numbers = computed(() => 
    Array.from({ length: 45 }, (_, index) => index + 1)
);

const numberRows = computed(() => 
    Math.ceil(numbers.value.length / 10)
);

const exceptList = ref([]);

const closeModal = () => {
    emit("close");
}


const getNumbersInRow = (row) => {
  const startIndex = row * 10;
  const endIndex = Math.min((row + 1) * 10, numbers.value.length);
  return numbers.value.slice(startIndex, endIndex);
};

const checkedNumber = (number) => {
    exceptList.value.push(number);
    alert("exceptList size :: " + exceptList.value.length);
};

defineProps({
    isShow: Boolean
});

const emit = defineEmits(
    ['close']
);
</script>

<template>
<div v-if="isShow" class="modal">
  <div class="modal-content">
    
    <div class="number-grid">
      <button v-for="number in numbers" :key="number" @click="checkedNumber(number)">
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
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: #997d7d;
  margin: 10% auto;
  padding: 10px;
  border: 1px solid #888;
  width: 45%;
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
  gap: 3px;
}

.number-grid button {
  border-radius: 100%;
  border: 2px;
  font-size: 20px;
  font-weight: 600;
  margin-left: 10px;
}

</style>