<script setup>

import {computed, ref, defineEmits, watch} from "vue";

const checkedExcepts = ref([]);
const checkedNeeds = ref([]);
const numbers = computed(() => 
    Array.from({ length: 45 }, (_, index) => index + 1)
);
const emit = defineEmits(["close"]);

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

const resetConditionalList = (resetType) => {
  if (resetType === 1) {
    checkedExcepts.value = [];
  } else if (resetType === 2) {
    checkedNeeds.value = [];
  } else {
    resetType = 0;
  }
  resetType = 0;
}

const props = defineProps({
    isShow: {
      Type: Boolean,
      required: true
    },
    isNeeds: {
      Type: Boolean,
      required: true
    },
    resetNumber : {
      Type: Number,
      required: false
    }
});

watch(() => props.resetNumber, (resetNumber) => {
  resetConditionalList(resetNumber);
})

</script>

<template>
  <v-container v-if="isShow" class="modal-container" fluid>
    <div class="modal-content">
      <v-row>
        <v-col> 🔴 제외 목록 </v-col>
        <v-col> 🟢 포함 목록 </v-col>
      </v-row>
      <div class="number-grid">
        <button v-for="number in numbers" :key="number" 
          @click="checkedNumber(number, isNeeds)"
          :class="{'checkbox': true, 
                  'checked-except': checkedExcepts.includes(number),
                  'checked-needs': checkedNeeds.includes(number) 
                  }">
          {{ number }}
        </button>
      </div>
      <v-row>
        <v-col cols="12">
          <v-btn
            block 
            color="primary" 
            @click="closeModal"
            text="확인"
            style="margin-top: 15px;"
          />
        </v-col>
      </v-row>
    </div>
  </v-container>
</template> 

<style scope>
.close {
  text-align: center;
}
.modal-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5); 
  overflow: auto;
  height: 100vh;
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
  grid-template-columns: repeat(5, 1fr);
  gap: 2px;
  flex-wrap: wrap;
}

.number-grid button {
  border-radius: 100%;
  border: 1px solid #ccc;
  font-size: 20px;
  font-weight: 600;
  margin: 3px;
  padding: 5px;
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