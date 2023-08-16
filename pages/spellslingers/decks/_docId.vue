<template>
  <div>
    <div v-if="state.isLoaded">
      <div class="title">{{state.data.deckName}}</div>
      <div>
        <b-img v-if="state.data.imgCount > 0" fluid :src="`https://firebasestorage.googleapis.com/v0/b/mtgadecks.appspot.com/o/spellslingerdecks%2F${state.docId}.jpg?alt=media`" />
      </div>
      <div style="white-space:pre-wrap;">{{state.data.rawData}}</div>
      <copy-button
        :text="state.data.code"
        :buttonText="`デッキコードをコピー`"
        :alertText="`デッキコードをクリップボードにコピーしました\n${state.data.code}`"
      />
      <div class="title">立ち回りなど</div>
      <div style="white-space:pre-wrap;">{{state.data.comment}}</div>
    </div>
    <div class="backButtons">
      <div class="backButtons-list">
        <b-button block variant="primary" href="/spellslingers/decks">一覧に戻る</b-button>
      </div>
      <div class="backButtons-list-focused">
        <b-button block variant="outline-primary" :href="`/spellslingers/decks?spellslinger=${state.data.spellslinger}`">{{state.data.spellslinger}} の他のデッキを見る</b-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Firebase from '~/components/api/firebase'
import { defineComponent, reactive, Ref, toRefs, onMounted, computed, useRoute} from "@nuxtjs/composition-api";
import CopyButton from '~/components/CopyButton.vue'

type State = {
  data: any,
  docId: string,
  isLoaded: boolean,
};

const setup = (): any => {
  const route = useRoute()
  const firebase = Firebase.getInstance();
  const state = reactive<State>({
    data: "",
    docId: route.value.params.docId,
    isLoaded: false,
  })
  const getData = async() => {
    state.data = (await firebase.findSpellslingerDecksById(route.value.params.docId)).get(state.docId);
    state.isLoaded = true;
  };
  getData();
  return {state, getData};
}

export default defineComponent({
  setup,
});

</script>
<style scoped>
.title {
  font-size: 24px;
  padding: 8px 0;
}
.backButtons {
  padding-top: 8px;
  text-align: center;
}
.backButtons-list{
  padding-top: 8px;
}

.backButtons-list-focused{
  padding-top: 8px;
}

</style>
