import React, { useEffect, useState } from 'react'
import { db } from './firebase';
import './Post.css'
import { serverTimestamp } from "firebase/firestore";


function Post( { postId, user, username, caption, imageUrl } ) {
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


  return (
    <div className="post">
        
        <div className="post__header">

        <h3>{username}</h3>
        </div>
        
       
        
        <img onError={(event) => event.target.style.display = 'none'} className="post__image" src={imageUrl}/>
        
        <video onError={(event) => event.target.style.display = 'none'} controls className="post__image" muted 
         src={imageUrl} type="video/mp4">
        </video>

        
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