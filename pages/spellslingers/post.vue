<template>
  <div>
    <div class="title">デッキ投稿ページ</div>
    <div v-if="state">
      <div>
        <b-input required type="text" v-model="state.deckName" placeholder="デッキ名" max="24"></b-input>
      </div>
      <div class="form-area">
        <b-textarea required rows="5" v-model="state.comment" maxlength="400" placeholder="立ち回りやキープ基準など(最大400文字)"/>
      </div>
      <div v-if="!(state.clipboard.length > 0)"  class="form-area">
        <b-textarea required v-model="state.clipboard" placeholder="ゲーム内でデッキをエクスポートし、そのまま貼り付けてください"/>
      </div>
      <div v-else>
        <div style="white-space:pre-wrap;">{{state.clipboard}}</div>
        <b-button @click="deleteClipboard">デッキを貼り直す</b-button>
      </div>
      <div class="form-area">
        <div>デッキのカードやマナカーブが分かる画像を1枚貼れます(500kb以下に圧縮します)</div>
        <input type="file" @change="selectedImage"/>
        <img v-if="state.imgUrl" :src="state.imgUrl" />
      </div >
      <div v-if="!state.isPosting" class="postButton">
        <b-button variant="primary" block @click="onPost">投稿する</b-button>
      </div>
      <div v-else class="postButton">
        <b-button disabled block @click="onPost">投稿中です...</b-button>
      </div>
      <div class="backButton">
        <b-button variant="outline-primary" block href="/spellslingers/decks">一覧に戻る</b-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Firebase from '~/components/api/firebase'
import { reactive, Ref, toRefs, onMounted, computed, useRoute, defineComponent} from "@nuxtjs/composition-api";
import 'bulma/css/bulma.css';

type State = {
  deckName: string;
  clipboard: string;
  comment: string;
  imgUrl: string;
  file: any;
  isPosting: boolean;
}
type Setup = {
  state: State,
  onPost: () => void,
  deleteClipboard: () => void,
  selectedImage: (props: any) => void,
}
const firebase = Firebase.getInstance();
const setup = (): Setup => {
  const state =  reactive<State>({
    deckName: "",
    clipboard: "",
    comment: "",
    imgUrl: "",
    file: "",
    isPosting: false,
  });
  const onPost = async () => {
    if(!(state.deckName.length > 0 ) && !(state.clipboard.length > 0 )){
      return;
    }

    state.isPosting = true;
    const docId = await firebase.postSpellslingerDeck(state.deckName, state.clipboard, state.comment, state.imgUrl);

    if(docId === undefined){
      alert("投稿に失敗しました");
      return
    }
    if(state.imgUrl.length > 0){
      firebase.uploadSSImage(state.imgUrl, docId, state.file);
    }
    await new Promise((resolve) => setTimeout(resolve, 6000));
    window.location.href = "/spellslingers/decks";
  }
  const deleteClipboard = () => {
    state.clipboard = "";
  }
  const selectedImage = (props: any) => {
    //画像ファイルのURLを取得。
    //アップロードしたい画像の情報を取得。
    state.file = props.target.files[0];
    //画像ファイルのURLを取得。
    state.imgUrl = URL.createObjectURL(state.file);
  }

  return {
    state,
    onPost,
    deleteClipboard,
    selectedImage,
  };
}
export default defineComponent({
  setup,
});
</script>
<style scoped>
.title {
  font-size: 24px;
  padding-top: 8px;
}
 .form-area{
  padding-top: 8px;
 }
 .postButton {
  text-align: center;
  padding-top: 32px;
 }
 .backButton {
  text-align: center;
  padding-top: 32px;

 }
</style>
