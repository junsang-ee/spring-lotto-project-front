<script setup>
function closeModal() {
    emit("close");
}

defineProps({
    isShow: Boolean
});

const emit = defineEmits(
    ['close']
);

</script>

<template>
    <div >
        <div v-if="isShow" class="modal">
            <div class="modal-container">
                <div class="model-content">
                    <label>
                        <p>안녕하세요 준상 로또입니다.</p>
                    </label>
                </div>
                <footer class="modal-footer">
                    <slot name="footer-submit">
                        <!-- <button class="modal-button" @click="$emit('enterInput', confirmButton)"> 확인 </button> -->
                    </slot>
                    <slot name="footer-close">
                        <!-- <button class="modal-button" @click=closeModal()> 닫기 </button> -->
                    </slot>
                    <div>
                        <span class="close" @click="closeModal">확인</span>
                    </div>
                </footer>
            </div>
        </div>
    </div>
    <div>
        <button class="test">1</button>
    </div>
    <!-- <div>
    <div v-if="isShow" class="modal-mask">
      <div class="modal-container">
        <div>
          <slot>main title text</slot>
          <label>
            <input type="text" class="input-text" v-model="confirmButton"/>
          </label>
        </div>

        <footer class="modal-footer">
          <slot name="footer-submit">
            <button class="modal-button" @click="$emit('enterInput', confirmButton)"> 확인 </button>
          </slot>
          <slot name="footer-close">
            <button class="modal-button" @click=closeModal()> 닫기 </button>
          </slot>
        </footer>
      </div>
    </div>
  </div>     -->
</template>

<style scope>
.modal {
  inset: 0;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-container {
  position: relative;
  display: flex;
  align-items: center;
  background-color: #fefefe;
  margin: 10% auto;
  padding: 15px;
  border: 1px solid #888;
  width: 30%;
  height: 30%;
  border-radius: 7px;
}

.close {
  color: black;
  font-size: 15px;
  font-weight: bold;
  text-align: center;
}

.close:hover,
.close:focus {
  /* color: rgb(19, 18, 18); */
  text-decoration: none;
  cursor: pointer;
}

.modal-footer {
    position: absolute;
    bottom: 0;
    text-align: center;
}

/* .input-text {
  margin: 10px 0 0 0;
}

.modal-mask {
  position: fixed;
  inset: 0;
  background: rgb(0,0,0,.6);
  display: grid;
  place-items: center;
}

.modal-container {
  background: white;
  padding: 1rem;
  width: 80vw;
  max-width: 500px;
  border-radius: 7px;
}

.modal-footer {
  border-top: 1px solid #ddd;
  margin-top: 1rem;
  padding-top: 0.5rem;
  font-size: .8rem;
}

.modal-footer button {
  background: #ddd;
  padding: .25rem .75rem;
  border-radius: 20px;
}

.modal-footer button:hover {
  background: #c8c8c8;
}

.modal-button {
  margin: 0 0 0 10px;
} */
.test {
    border-radius: 100%;
    border: 2px;
    font-size: 20px;
    font-weight: 600;
}
</style>