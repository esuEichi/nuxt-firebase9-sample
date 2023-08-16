<template>
  <b-link>
    <b-button block class="m-1" @click="onClickCopyButton()">{{buttonText}}</b-button>
  </b-link>
</template>
<script setup>
import { defineComponent } from 'vue';
import useClipboard from 'vue-clipboard3'
const props = defineProps({
  text: String,
  buttonText: String,
  alertText: String,
})

const onClickCopyButton = async () => {
  const { toClipboard } = useClipboard();
  await toClipboard(props.text);
  if(props.alertText.length > 0){
    alert(props.alertText);
  }
}

</script>
