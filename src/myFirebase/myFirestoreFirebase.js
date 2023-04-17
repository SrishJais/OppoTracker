import myApp from "./appFirebaseConfig";
import React, { createContext, useContext } from "react";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
} from "firebase/firestore";
//database reference
const dbref = getFirestore(myApp);

//context Api
const firestoreContext = createContext();
//export it
//custom hook for using firestoreContext
export const useFirestore = () => {
  return useContext(firestoreContext);
};
//export
export const FirestoreProvider = (props) => {
  // add a new obj
  const addNew = (colectionName, newobj) => {
    return addDoc(collection(dbref, colectionName), newobj);
  };
  //update/edit an obj
  const update = (colectionName, newobj, id) => {
    // existing obj (It is guaranteed that existing obj with given id, always exist)
    const existingdoc = doc(dbref, colectionName, id);
    return updateDoc(existingdoc, newobj);
  };
  //detete
  const remove = (colectionName, id) => {
    // existing obj (It is guaranteed that existing obj with given id, always exist)
    const existingdoc = doc(dbref, colectionName, id);
    return deleteDoc(existingdoc);
  };

  //get all docs
  const fetchDocs = (colectionName) => {
    return getDocs(collection(dbref, colectionName));
  };
  //1.fetch documents by current user id(using query)
  //2.fetch one doc only of current user id(using query) whwn docid is not known
  const fetchDocsByQuery = (colectionName, field, value) => {
    const q = query(
      collection(dbref, colectionName),
      where(field, "==", value)
    );
    return getDocs(q);
  };
  //get individual one book by document id ,not by user id
  const fetchDoc = (colectionName, id) => {
    const docRef = doc(dbref, colectionName, id);
    return getDoc(docRef);
  };

  //___________code for fetching all docs without any query___________________________
  // const oppSnapshot = await fetchDocs("Opportunities");
  // //result is array of objects
  // let result = oppSnapshot.docs.map((docRef) => {
  //   //docRef is snapshot of 1 doc
  //   // docRef.id is id of each obj(docRef)
  //   const id = docRef.id;
  //   //docRef.data is each obj in array of obj
  //   if (docRef.data().status === "pending...") pendCnt += 1;//access property of array of objects
  //   else applyCnt += 1;
  //  return { ...docRef.data(), id };
  // });

  const value = {
    addNew,
    update,
    remove,
    // deteteDocs,
    fetchDocs,
    fetchDocsByQuery,
    fetchDoc,
  };
  return (
    <firestoreContext.Provider value={value}>
      {props.children}
    </firestoreContext.Provider>
  );
};
