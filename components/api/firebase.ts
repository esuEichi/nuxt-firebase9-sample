// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { serverTimestamp, getFirestore, collection, query, where, onSnapshot, getDocs, doc, DocumentData, getDoc, setDoc, addDoc, CollectionReference, collectionGroup, limit, orderBy} from 'firebase/firestore'
import "firebase/analytics";
import "firebase/firestore";
import "firebase/remote-config";
import "firebase/database";
import "firebase/auth";
import imageCompression from "browser-image-compression";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export default class Firebase {
  private static instance: Firebase
  firebase: any;
  analytics: any;
  storage: any;
  db: any;
  ref: any;
  private constructor() {
    const firebaseConfig = {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
      measurementId: process.env.FIREBASE_MEASUREMENT_ID
    };
    if(!this.firebase){
      this.firebase = initializeApp(firebaseConfig);
      this.db = getFirestore();
      this.storage = getStorage(this.firebase);
    }
  }
  static getInstance() {
    if(this.instance === undefined) {
      this.instance = new Firebase();
    }
    return this.instance;
  }

  async get(): Promise<any> {
    let res: DocumentData[] = [];
    const ref = await getDocs(collection(this.db, "info"));
    ref.forEach((doc) => {
      res.push(doc.data());
    });
    return res;
  }
  async findBy(docId: string): Promise<any> {
    const ref = await getDoc(doc(this.db, "info", docId));
    if(ref.exists()){
      return ref.data();
    }
    return null;
  }

  public post(text: string): void {
    this.ref.add({body: text});
  }

  async uploadSSImage(imgUrl: string, docId: string, file: any){
    //Firebase storageに画像ファイルを送信。
    const path = await Promise.all([docId]);
    const storageRef = ref(this.storage, `spellslingerdecks/${path}.jpg`);
    //Firebaseにデータを適切に送るために必要なコード
    const options = {
      maxSizeMB: 0.3, // 最大ファイルサイズ
      maxWidthOrHeight: 800 // 最大画像幅もしくは高さ
    };
    try {
      // 圧縮画像の生成
      const compressedFile = await imageCompression(file, options);
      uploadBytes(storageRef, compressedFile).then((snapshot) => {

      });

    } catch (error) {
      throw error;
    }
  }

  // ゲーム内でデッキレシピを取得した際に取得されるデータをパースして送信する
  async postSpellslingerDeck(deckName: string, pastedString: string, comment: string, imgUrl: string) {
    const lines = pastedString.split("\n");
    let result: any = {};
    result["cards"] = {};
    let count: number = 0;
    let index: number = 1;
    lines.forEach((line)=>{
      if(line.indexOf("## カード：") != -1){
        const name = line.split(", ")[1];
        const num = line.split(", ")[0].split("： ")[1];
        count += parseInt(num);
        result["cards"][name] = {num: num, sort: index++};
      } else if (line.indexOf("## 土地： ") != -1){
        result["land"] = line.replace("## 土地： ", "");
      } else if (line.indexOf("## スペルスリンガー： ") != -1) {
        result["spellslinger"] = line.replace("## スペルスリンガー： ", "");
      } else if (line.indexOf("## プレイヤー： ") != -1) {
        result["player"] = line.replace("## プレイヤー： ", "");
      } else {
        if(line.length > 4)
        result["code"] = line
      }
    });
    if(( count !== 30) || !(result["land"]) || !(result["spellslinger"])) {
      return;
    }
    result["rawData"] = pastedString;
    result["comment"] = comment;
    result["deckName"] = deckName;

    result["createdAt"] = serverTimestamp();
    result["countOfGood"] = 0;
    result["countOfReported"] = 0;
    result["countOfViewed"] = 0;
    result["countOfCopied"] = 0
    if(imgUrl.length > 0) {
      // 複数画像必要になったとき用
      result["imgCount"] = 1;
    } else {
      result["imgCount"] = 0;
    }

    const ref = collection(this.db, "spellslingersDecks")
    const res = await addDoc(ref, result);
    return res.id;
  }
  async findSpellslingerDecksById(docId: string){
    let q: any;
    q = collection(this.db, "spellslingersDecks");
    const ref = await getDocs(q);
    let res: Map<string, any > = new Map();
    ref.forEach((doc) => {
      res.set(doc.id, doc.data());
    });
    return res;
  }
  async getSpellslingerDecks(spellslinger: string) {
    let res: Map<string, any > = new Map();
    let q: any;
    if(spellslinger && spellslinger.length > 0){
      q = query(collection(this.db, "spellslingersDecks"), where("spellslinger", "==", spellslinger), orderBy("createdAt", "desc"), limit(50))
    } else {
      q = query(collection(this.db, "spellslingersDecks"), orderBy("createdAt", "desc"), limit(50));
    }
    const ref = await getDocs(q);
    ref.forEach((doc) => {
      res.set(doc.id, doc.data());
    });
    return res;
  }
  getSSDeckImagePath(filename: string): string {
    // Create a reference from a Google Cloud Storage URI
    const gsReference = ref(this.storage, `gs://spellslingerDecks/${filename}`)
    getDownloadURL(gsReference).then((url) => {
      return url;
    });
    return "";
  }
}
