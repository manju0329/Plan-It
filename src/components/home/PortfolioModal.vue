<script setup>
import { onMounted } from "vue";
import noImage from "@/assets/img/noImage.jpg";

// props를 정의할 때 객체로 전달해야 합니다.
const props = defineProps(["content"]);

onMounted(() => {
  console.log(props);
});
</script>

<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-container">
            <img
              src="../../assets/img/close-icon.svg"
              alt="Close modal"
              @click="$emit('close-modal')"
              style="width: 30px; height: 30px"
            />
            <div class="row justify-content-center">
              <div class="col-lg-8">
                <div class="modal-body">
                  <!-- Project details-->
                  <h2 class="text-uppercase" style="text-align: center">
                    {{ props.content.title }}
                  </h2>
                  <p class="item-intro text-muted" style="text-align: center">
                    {{ props.content.addr1 }}
                  </p>
                  <img
                    class="img-fluid d-block mx-auto mb-3"
                    :src="props.content.firstimage || noImage"
                    alt="..."
                  />
                  <p>
                    {{ props.content.overview }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {};
</script>

<style>
.modal-mask {
  position: fixed;
  z-index: 9998;
  padding-top: 5%;
  padding-bottom: 5%;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
  color: #555555;
}

.modal-container {
  height: 100%;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-dialog {
  overflow-y: scroll;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

/*
* The following styles are auto-applied to elements with
* transition="modal" when their visibility is toggled
* by Vue.js.
*
* You can easily play with the modal transition by editing
* these styles.
*/

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
