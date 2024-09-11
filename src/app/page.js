'use client';
import { setDoc, addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { useState } from "react";
import { db } from "./firebaseConfig";

export default function Home() {
  const [topic, setTopic] = useState('');
  const [flashcards, setFlashcards] = useState([]);


  const handleSubmit = async () => {
    //console.log(user.id)
      if (!topic.trim()) {
          alert('Please enter a topic.');
          return;
      }
  
      try {
          const response = await fetch('/api/generate', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ topic }),
          });
  
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          

          const generatedFlashcards = await response.json();
          setFlashcards(generatedFlashcards.flashcards);
          //console.log(generatedFlashcards.flashcards);

          /**
           * UsersId - {user name, flashcard}
           * User name - string
           * flashcard - [{topic, flashcards}]
           */

          const userDocRef = doc(db, 'users', "lawal");
          const userDocSnap = await getDoc(userDocRef);

          if(!userDocSnap.exists()) {
              await setDoc(userDocRef, {
                  username: 'Lawal Alongija'
              })
          }

          const flashcardRef = collection(userDocRef, "flashcard");
          await addDoc(flashcardRef, {
              title: topic,
              flashcards: generatedFlashcards.flashcards 
          })

      } catch (error) {
        console.error('Error generating flashcards:', error);
      }
  };
 
  return (
    <div>
      <div>
        <input onChange={e => setTopic(e.target.value)}></input>
        <button onClick={() => handleSubmit()}>submit</button>
      </div>
    </div>
  );
}
