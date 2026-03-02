import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { getAuth }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { getFirestore }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
apiKey:"PASTE_YOUR_KEY",
authDomain:"PASTE_YOUR_DOMAIN",
projectId:"PASTE_YOUR_PROJECT_ID",
storageBucket:"PASTE",
messagingSenderId:"PASTE",
appId:"PASTE"
};

const app=initializeApp(firebaseConfig);

export const auth=getAuth(app);
export const db=getFirestore(app);
