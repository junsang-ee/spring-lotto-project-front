<script setup>
import {computed, ref, defineEmits} from "vue";

const checkedExcepts = ref([]);
const checkedNeeds = ref([]);
const numbers = computed(() => 
    Array.from({ length: 45 }, (_, index) => index + 1)
);

const emit = defineEmits(
  ["close"]
)

const closeModal = () => {
  emit("close", {checkedExcepts: checkedExcepts.value, checkedNeeds: checkedNeeds.value});
}

const checkedNumber = (number, isNeeds) => {
  if (isNeeds) {
    if (checkedExcepts.value.includes(number)) {
      checkedExcepts.value.splice(checkedExcepts.value.indexOf(number), 1);
    }
    if (checkedNeeds.value.includes(number)) {
      checkedNeeds.value.splice(checkedNeeds.value.indexOf(number), 1);
    } else {
      if (validLotto(isNeeds)) {
        checkedNeeds.value.push(number);
      }
    }
  } else {
    if (checkedNeeds.value.includes(number)) {
      checkedNeeds.value.splice(checkedNeeds.value.indexOf(number), 1);
    }

    if (checkedExcepts.value.includes(number)) {
      checkedExcepts.value.splice(checkedExcepts.value.indexOf(number), 1);
    } else {
      if (validLotto(isNeeds)) {
        checkedExcepts.value.push(number);
      }
    }
  }
};

const validLotto = (isNeeds) => {
  if (isNeeds) {
    if (checkedNeeds.value.length >= 6) {
      alert("경고!!!\n포함할 로또 목록은 6개를 초과할 수 없습니다.");
      return false;
    }
  } else {
    if (checkedExcepts.value.length >= 39) {
      alert("경고!!!\n제외할 로또 목록은 39개를 초과할 수 없습니다.");
      return false;
    }
  }
  return true;
};

defineProps({
    isShow: Boolean,
    isNeeds: Boolean
});

</script>

<template>
<div v-if="isShow" class="modal">
  
  <div class="modal-content">
    <div>제외할 로또 목록 : 
      <span></span>
    </div>
    <div>포함할 로또 목록 : </div>
    <div class="number-grid">
      <button v-for="number in numbers" :key="number" 
        @click="checkedNumber(number, isNeeds)"
        :class="{'checkbox': true, 'checked-except': checkedExcepts.includes(number), 'checked-needs': checkedNeeds.includes(number) }"
      >
        {{ number }}
      </button>
    </div>
    <span class="close" @click="closeModal">확인</span>
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
  color: #1d0808;
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