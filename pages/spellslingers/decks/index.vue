<template>
  <div>
    <b-container fluid class="form">
      <b-row class="justify-content-md-center">
        <b-col cols="8">
          <b-form-select v-model="state.spellslinger">
            <b-select-option value="">
              全スペルスリンガーを表示
            </b-select-option>
            <b-select-option
              v-for="spellslinger in spellslingersList"
              :key="spellslinger"
              :value="spellslinger"
            >
              {{spellslinger}}
            </b-select-option>
          </b-form-select>
        </b-col>
        <b-col cols="4">
          <b-button size="sm" @click="search()">検索</b-button>
        </b-col>
      </b-row>
    </b-container>

    <h1 class="title">投稿されたデッキ一覧</h1>
    <div><a href="/spellslingers/post">投稿はこちら</a></div>
    <div v-if="state.data" class="list">
      <div v-for="[index, data] in Array.from(state.data)" :key="data.code">
        <b-card class="deck" :title="data.deckName" :sub-title="`投稿者: ${data.player}`">
          <div>スペルスリンガー: <a :href="`?spellslinger=${data.spellslinger}`">{{data.spellslinger}}</a></div>
          <img v-if="data.imgCount" style="max-height: 800px " :src="`https://firebasestorage.googleapis.com/v0/b/mtgadecks.appspot.com/o/spellslingerdecks%2F${index}.jpg?alt=media`">
          <copy-button
            :text="data.code"
            :buttonText="`デッキコードをコピー`"
            :alertText="`デッキコードをクリップボードにコピーしました\n${data.code}`"
          />
          <div>
            <nuxt-link :to="`/spellslingers/decks/${index}`">立ち回りやデッキの詳細を確認</nuxt-link>
          </div>
        </b-card>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Firebase from '~/components/api/firebase'
import { defineComponent, reactive, Ref, toRefs, onMounted, computed, useRoute} from "@nuxtjs/composition-api";
import 'bulma/css/bulma.css';
import { spellslingersList } from '~/types/spellslingers'
type State = {
  data: Object;
  spellslinger: string;
}
type Setup = {
  state: State,
  getImagePath: (filename: string) => string,
  search: () => void,
  spellslingersList: string[],
}

const setup = (): Setup =>  {
  const route = useRoute();
  const firebase = Firebase.getInstance();
  const state =  reactive<State>({
    data: {},
    spellslinger: "",
  });
  if(route.value.query.spellslinger != null){
    state.spellslinger = route.value.query.spellslinger as string;
  }
  const getData = async() => {
    if(!state.spellslinger){
      state.data = await firebase.getSpellslingerDecks("");
    }
    if(spellslingersList.includes(state.spellslinger)) {
      state.data = await firebase.getSpellslingerDecks(state.spellslinger);
    } else {
      state.data = await firebase.getSpellslingerDecks("");
    }
  }
  getData();
  const getImagePath = (filename: string): string => {
    return firebase.getSSDeckImagePath(filename);
  }

  const search = (): void => {
    if(state.spellslinger) {
      window.location.href = `?spellslinger=${state.spellslinger}`
    } else {
      window.location.href = `/spellslingers/decks`
    }
  }
  return {
    state,
    getImagePath,
    search,
    spellslingersList,
  }
}
export default defineComponent({
  setup,
});
</script>
<style scoped>
.card {
  padding-top: 8px;
}
.form{
  padding: 8px 0;
}
</style>
