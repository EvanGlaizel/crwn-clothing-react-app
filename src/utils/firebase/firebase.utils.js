import { initializeApp } from 'firebase/app';
import { getAuth, signInWithRedirect, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, } from 'firebase/auth';

import { getFirestore, doc, getDoc, setDoc, collection, writeBatch, query, getDocs } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBEiq0dPUP969Ip4zt14C5N9t8aKCh7jN0",
    authDomain: "crwn-clothing-db-7e4d0.firebaseapp.com",
    projectId: "crwn-clothing-db-7e4d0",
    storageBucket: "crwn-clothing-db-7e4d0.firebasestorage.app",
    messagingSenderId: "605608797823",
    appId: "1:605608797823:web:1b6c59c8d361698644814a",
    measurementId: "G-C45GMR34YJ"
  };
  
  // Initialize Firebase
  const firebaseApp = initializeApp(firebaseConfig);

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: "select_account"
  });

  export const auth = getAuth(firebaseApp)
  export const signInWithGooglePopup = () => signInWithPopup(auth, provider);
  export const signInWithGoogleRedirect = () => signInWithRedirect(auth, provider)

  export const db = getFirestore()

  export const addCollectionAndDocuments = async (collectionKey, objectsToAdd, title) => 
  {
    const collectionRef = collection(db, collectionKey);

    const batch = writeBatch(db);

    objectsToAdd.forEach((object) => 
    {
      const docRef = doc(collectionRef, title.toLowerCase());
      batch.set(docRef, object);
    });

    await batch.commit();
  }

  export const getCategoriesAndDocuments = async () =>
  {
    const collectionRef = collection(db, 'categories');
    const q = query(collectionRef);
    const querySnapshot = await getDocs(q);

    const categoryMap = querySnapshot.docs.reduce((acc, docSnapshot) => 
    {
      const { title, items } = docSnapshot.data();
      acc[title.toLowerCase()] = items;
      return acc;
    }, {})

    return categoryMap;
  }

     
  export const createUserDocumentFromAuth = async (userAuth, additionalInfo={}) => 
  {
    if (!userAuth) return;

    const userDocRef = doc(db, 'users', userAuth.uid);
    const userSnapshot = await getDoc(userDocRef)

    if (!userSnapshot.exists())
    {
      const {displayName, email} = userAuth;
      const createdAt = new Date();

      try
      {
        await setDoc(userDocRef, { displayName, email, createdAt, ...additionalInfo });
      } 
      catch (error)
      {
        console.log('ERROR CREATING USER', error.message);
      }
    }

    return userDocRef
  }

  export const createAuthUserWithEmailAndPassword = async (email, password) => 
  {
    if (!email || !password) return;

    return await createUserWithEmailAndPassword(auth, email, password)
  }

  export const signInAuthUserWithEmailAndPassword = async (email, password) => 
  {
    if (!email || !password) return;

    return await signInWithEmailAndPassword(auth, email, password)
  }
  
  export const signOutUser = async () => await signOut(auth);

  export const onAuthStateChangedListener = (callback) => 
  {
    onAuthStateChanged(auth, callback);
  }