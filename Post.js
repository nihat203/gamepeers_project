import React, { useEffect, useState } from 'react'
import { db } from './firebase';
import './Post.css'
import { serverTimestamp } from "firebase/firestore";
import ReactDOM from 'react-dom';


function Post( { postId, user, username, caption, imageUrl, fl } ) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState([]);

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
      .collection("posts")
      .doc(postId)
      .collection("comments")
      .orderBy('timestamp','desc')
      .onSnapshot((snapshot) => {
        setComments(snapshot.docs.map((doc) => doc.data()));
      });
    }

    return () => {
      unsubscribe();
    };

  }, [postId]);


  const postComment = (event) => {
    event.preventDefault();
    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: serverTimestamp()
    });
    setComment('');
  }

  const unfollow = (event) => {
    event.preventDefault();
    db.collection('follow').doc('following').collection(user.displayName).doc(username).delete()
    db.collection('follow').doc('followers').collection(username).doc(user.displayName).delete()
  }
  const follow = (event) => {
    event.preventDefault();
    db.collection('follow').doc('following').collection(user.displayName).doc(username).set({timestamp:serverTimestamp()})
    db.collection('follow').doc('followers').collection(username).doc(user.displayName).set({timestamp:serverTimestamp()})
  }

  const hide = (event) => {
    event.preventDefault();
    event.target.style.display = 'none';
  }

  const errr = (event) => {
    event.preventDefault();
    const elm = <video onError={(event) => event.target.style.display = 'none'} controls className="post__image" muted 
    src={imageUrl} type="video/mp4">
   </video>
    ReactDOM.render(elm, document.getElementById('video'));
  }


  const [pfp, setPFP] = useState('');

  useEffect(() => {
  db.collection("userpfp").doc(username).get().then((snapshot) => {
    setPFP(snapshot.data().photourl);
  })

  
}, []); 


  
  return (
    <div className="post">
        
        <div className="post__header">

        <img className="pfp" src={pfp}/>
        
        
        &nbsp;
        <h3>{username}</h3>


        &nbsp;&nbsp;
        
        
        {fl === 1 ? (
        <button
          className="button-6"
          type='submit'
          onClick={follow}>
            Follow
          </button>)
          : (
            fl === 2 ? (<div></div>):(
          <button
          className="button-6"
          type='submit'
          onClick={unfollow}>
            Unfollow
          </button>)
          )}
        
          
        </div>
        
       
        <div id="video"></div>

        <img onError={(event) => [hide(event), errr(event)]} className="post__image" src={imageUrl}/>
        

        
        <h4 className="post__text"><strong>{username}: </strong>{caption}</h4>
        <h5 className='post__text'><strong>Comments:</strong></h5>
        <div className='post__comments'>
        {
          comments.map((comment) => (
            <p>
              <b>{comment.username}:</b> {comment.text}
            </p>
          ))
        }
        </div>

{user &&(
        <form className='post__commentBox'>
          <input
          className='post__input'
          type='text'
          placeholder='Add a comment...'
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          />
          <button
          disabled={!comment}
          className="post__button"
          type='submit'
          onClick={postComment}
          >
            Post
          </button>
        </form>
    )}
    </div>
  )
}

export default Post