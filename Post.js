import React, { useEffect, useState } from 'react'
import { db } from './firebase';
import './Post.css'
import { serverTimestamp } from "firebase/firestore";
import ReactDOM from 'react-dom';
import Modal from "react-modal";
import Userlist from './Userlist'


function Post( { postId, user, username, caption, imageUrl, fl, gg } ) {

  const [inputText, setInputText] = useState("");
  let inputHandler = (e) => {
    var lowerCase = e.target.value.toLowerCase();
    setInputText(lowerCase);
  };

  const [isOpen, setIsOpen] = useState(false);
  function toggleModal() {
    setIsOpen(!isOpen);      }


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

        const ccc = [];

        snapshot.docs.forEach(doc => 
          {
            ccc.push( {
            id: doc.id,
            comment: doc.data()
          })
        })

        setComments(ccc)
    
      });
    }

    return () => {
      unsubscribe();
    };

  }, [postId]);

  const [ulik, setUlik] = useState([]);
  
  useEffect(() => {
    db.collection("posts").doc(postId).collection("likes").onSnapshot(snapshot => {
      const aaa = [];
      snapshot.docs.forEach(doc => 
        {
          aaa.push( doc.id )
      })
      setUlik(aaa);
    })
  }, []); 


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


  const delet = (event) => {
    event.preventDefault();
    db.collection('posts').doc(postId).delete()
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


function deletc(idd)
{
  db.collection('posts').doc(postId).collection('comments').doc(idd).delete()
}


const like = (event) => {
  event.preventDefault();
  db.collection("posts").doc(postId).collection("likes").doc(user.displayName).set({
    timestamp: serverTimestamp()
  });
}

const unlike = (event) => {
  event.preventDefault();
  db.collection("posts").doc(postId).collection("likes").doc(user.displayName).delete()
}



const [userss, setUserss] = useState([]);

  useEffect(() => {

    db.collection("posts").doc(postId).collection("likes").onSnapshot(snapshot => {
      
          const ysers = [];
          snapshot.docs.forEach(doc => 
            {
              ysers.push( doc.id )
          
          setUserss(ysers);
          })  
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
          className="button-r"
          type='submit'
          onClick={unfollow}>
            Unfollow
          </button>)
          )}


          {
          (fl === 2 && gg === 1)? 
          (
            <div>
              <button
                className="button-r"
                type='submit'
                onClick={delet}>
                  Delete
              </button>
            </div>
          ) : 
          (
            <div>

            </div>
          )
          }
        
          
        </div>
        
       
        <div id="video"></div>

        <img onError={(event) => [hide(event), errr(event)]} className="post__image" src={imageUrl}/>
        
        <h4 className="post__text"><strong>{username}: </strong>{caption}</h4>

        {(() => {
                    if(user)
                    {
                      if(ulik.includes(user.displayName))
                      { return (
                        <c>
                        &nbsp;&nbsp;<button className='buttonn' onClick={unlike}>
                          <img src='https://firebasestorage.googleapis.com/v0/b/projecc-af5ce.appspot.com/o/sitedata%2Fa.png?alt=media&token=37e190ee-cd88-4f53-be07-dac0f6b8baac' width={35} height={25}/></button>
                          
                        </c>
                       )}
                       else
                       return (<c>&nbsp;&nbsp;<button className='buttonn' onClick={like}>
                          <img src='https://firebasestorage.googleapis.com/v0/b/projecc-af5ce.appspot.com/o/sitedata%2FYouTube-Red-Like-Button-1.png?alt=media&token=349df9fd-1b29-4a92-840b-c819680ca8d3' width={35} height={25}/></button>
                      
                      </c>
                      )
                      }
                      else{
                        return (<c>&nbsp;&nbsp;&nbsp;&nbsp;</c>)
                      }
          })()}


          <button className='buttonn' onClick={toggleModal}>
            <c><b>{ulik.length}</b> likes</c>

        </button>



                            <Modal
                            isOpen={isOpen}
                            onRequestClose={toggleModal}
                            contentLabel="My dialog"
                            className="mymodal"
                            overlayClassName="myoverlay"
                            closeTimeoutMS={250}> 
                            
                            <div className='search'>
                                          <input type = 'text' className='inputtext' onChange={inputHandler} placeholder='Search'/>
                                          <table>{

                                                userss.map((id) => (
                                                  (() => {
                                                    if(id.toLowerCase().includes(inputText) ){
                                                    return (
                                                
                                                    <tr>{id}</tr>
                                                    
                                                    )
                                                  }
                                                  
                                                  
                                                  else
                                                  
                                                  {
                                                    
                                                    return (<div></div>)
                                                  
                                                  }
                                                  
                                                  })()))} 


                                          </table>
                                          </div>

                            <button className="button-r" onClick={toggleModal}>Close</button>
                            </Modal>




        <h5 className='post__text'><strong>Comments - {comments.length} :</strong></h5>
        <div className='post__comments'>
        {
          comments.map(({id,comment}) => (
            <p>
              {
                user && ((user.displayName === comment.username) || (user.displayName === username)) ? (
                  <button className='buttonn' onClick={() => [deletc(id)]}>
                    <img src="https://firebasestorage.googleapis.com/v0/b/projecc-af5ce.appspot.com/o/sitedata%2FRed-Close-Button-Transparent.png?alt=media&token=e5463082-98d1-4cc6-b2a1-4d4b67304647" width="15" height="15"/>
                    </button>
                ):(
                  <div></div>
                )
              }
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