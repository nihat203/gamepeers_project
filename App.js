import React, { useState, useEffect } from 'react';
import './App.css';
import { db,auth } from './firebase';
import ImageUpload from './ImageUpload';
import StoryUpload from './StoryUpload';
import Post from './Post';
import Story from './Story';
import ChangePFP from './ChangePFP';
import Login from './Login';
import "./styles.css";
import "./button-7.css"
import "./pfp.css"
import "./inputtext.css"
import "./inputstyles.css";
import TranslatorWidget from 'react-translate-widget';
import Modal from "react-modal";
import firebase from "firebase/compat/app";
import { serverTimestamp } from "firebase/firestore";
import Userlist from './Userlist'

function App() {
  
  const [posts, setPosts] = useState([]);
  const [noposts, nosetPosts] = useState([]);
  const [gposts, gsetPosts] = useState([]);
  const [myposts, mysetPosts] = useState([]);
  const [exposts, exsetPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [password2, setPassword2] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);
  //const [followingcnt, setFollowingcnt] = useState(999);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //console.log(authUser);
        setUser(authUser);

      }
      else {
        setUser(null);
      }
    })
    return () => {
      unsubscribe();
    }
  }, [user, username]);


  const signUp = (event) => {
    event.preventDefault();
    if(password === password2){
    auth
    .createUserWithEmailAndPassword(email,password)
    .then((authUser) => {
      //auth.setCustomUserClaims(auth.currentUser.uid, { phone: "+2443234243" })
      authUser.user.sendEmailVerification();
      authUser.user.updateProfile({
        displayName: username,
        photoURL: 'https://firebasestorage.googleapis.com/v0/b/projecc-af5ce.appspot.com/o/sitedata%2Fd.570462.30244.s3.1-f5f5f5-bm9uZQ-800x800.jpg?alt=media&token=224edbd3-7c36-4374-98cb-32a03d43cc6e'
      });
      db.collection("userpfp").doc(auth.currentUser.displayName).set({photourl: 'https://firebasestorage.googleapis.com/v0/b/projecc-af5ce.appspot.com/o/sitedata%2Fd.570462.30244.s3.1-f5f5f5-bm9uZQ-800x800.jpg?alt=media&token=224edbd3-7c36-4374-98cb-32a03d43cc6e'});
      auth.signOut();
      alert("Please, verify your email!");
    })
    .catch((error) => alert(error.message));
   }
    else{
      alert("Passwords don't match")
    }
  }
  
  function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
  
  const signIn = (event) => {
    event.preventDefault();
    auth
    .signInWithEmailAndPassword(email,password)
    .then((authUser) => {
      var user = auth.currentUser;
      
      if (user.emailVerified) {
        db.collection("users").doc(auth.currentUser.displayName).set({timestamp: serverTimestamp()});
        db.collection('follow').doc('following').collection(auth.currentUser.displayName).doc(auth.currentUser.displayName).set({timestamp:serverTimestamp()});
        
        sleep(500).then(() => {
        window.location.reload();});
        // email is verified.
        // alert(user.customClaims.phone)
      } else {
        auth.signOut();
        alert("Email is not verified!")
      }
    })
    .catch((error) => alert(error.message));

   
  }

  const forgotPass = (event) => {
    event.preventDefault();
    auth
    .sendPasswordResetEmail(email)
    .then((authUser) => {
      alert("Email Sent!")
      window.location.reload();
    })
    .catch((error) => alert(error.message));
  }
  const resetPass = (event) => {
    event.preventDefault();
    auth
    .sendPasswordResetEmail(auth.currentUser.email)
    .then((authUser) => {
      alert("Email Sent!")
      window.location.reload();
    })
    .catch((error) => alert(error.message));
  }
  useEffect(() => {
    
    db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot => {
      
      
  db.collection('follow').doc('following').collection(auth.currentUser.displayName).onSnapshot(snp => {
    
        const followinggg = [];
        const pst = []
        snp.docs.forEach(i => followinggg.push(i.id))
        snapshot.docs.forEach(doc => 
          {if(followinggg.includes(doc.data().username)) 
        pst.push(
          {id: doc.id,
          post: doc.data()}
          )}
          )
          
          setPosts(pst);
    }) })
  }, []);
  useEffect(() => {
    db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot => {
  db.collection('follow').doc('following').collection(auth.currentUser.displayName).onSnapshot(snp => {
    
    const nofollowinggg = [];
    const nopst = []
    snp.docs.forEach(i => nofollowinggg.push(i.id))
    snapshot.docs.forEach(doc => 
      {if(nofollowinggg.includes(doc.data().username) && doc.data().username !== auth.currentUser.displayName) 
    nopst.push(
      {id: doc.id,
      post: doc.data()}
      )}
      )
      
      nosetPosts(nopst);
}) })
}, []);

  useEffect(() => {

    db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot => {
        
  db.collection('follow').doc('following').collection(auth.currentUser.displayName).onSnapshot(snp => {
    const followingg = [];
    const pst = []
    snp.docs.forEach(i => followingg.push(i.id))
  

        snapshot.docs.forEach(doc => 
          {if(!followingg.includes(doc.data().username)) 
        pst.push(
          {id: doc.id,
          post: doc.data()}
          )}
          )
          
          exsetPosts(pst);
    })})
  }, []);

  useEffect(() => {

    db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot => {
    const pst = []

    snapshot.docs.forEach(doc => 
          {if(doc.data().username === auth.currentUser.displayName) 
        pst.push(
          {id: doc.id,
          post: doc.data()}
          )}
          )
          
          mysetPosts(pst);
    })

  }, []);

  useEffect(() => {

    
    db.collection('stories').orderBy('timestamp','desc').onSnapshot(snapshot => {
       
        db.collection('follow').doc('following').collection(auth.currentUser.displayName).onSnapshot(snp => {
          const stry = []
          const following = [];
          snp.docs.forEach(i => following.push(i.id))
        
        snapshot.docs.forEach(doc => 
          {if(following.includes(doc.data().username)) 
            stry.push(
          {id: doc.id,
            story: doc.data()}
          )}
          )
          
          setStories(stry);})
    })
  }, []);


  const [userss, setUserss] = useState([]);
  
    useEffect(() => {

        db.collection('users').orderBy('timestamp','desc').onSnapshot(snapshot => {
          db.collection('follow').doc('following').collection(auth.currentUser.displayName).onSnapshot(snp => {
            const ysers = [];
            const cfollowing = [];
            snp.docs.forEach(i => cfollowing.push(i.id))
            snapshot.docs.forEach(doc => 
              {
                if(cfollowing.includes(doc.id)) {
                ysers.push( {
                id: doc.id,
                data: doc.data(),
                p: 0
              })}
              else {
                ysers.push( {
                id: doc.id,
                data: doc.data(),
                p: 1
              })}
            })
            setUserss(ysers);
            })  
        })

      }, []);

 
  useEffect(() => {
    db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot => {
      gsetPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })
  }, []); 


      Modal.setAppElement("#root");
      const [isOpen, setIsOpen] = useState(false);
      function toggleModal() {
        setIsOpen(!isOpen);      }
      const [isOpen1, setIsOpen1] = useState(false);
      function toggleModal1() {
        setIsOpen1(!isOpen1);      }
      const [isOpen5, setIsOpen5] = useState(false);
      function toggleModal5() {
        setIsOpen5(!isOpen5);      }
      const [isOpen100, setIsOpen100] = useState(false);
      function toggleModal100() {
        setIsOpen100(!isOpen100);      }
        const [isOpen101, setIsOpen101] = useState(false);
      function toggleModal101() {
        setIsOpen101(!isOpen101);      }
        const [isOpen102, setIsOpen102] = useState(false);
      function toggleModal102() {
        setIsOpen102(!isOpen102);      }
        const [isOpen103, setIsOpen103] = useState(false);
        function toggleModal103() {
          setIsOpen103(!isOpen103);      }
        /* 
      const [newname, setNewname] = useState('');


     const updateName = (event) => {
            event.preventDefault();
    user
    .updateProfile({  displayName: newname})
    .catch((error) => alert(error.message));
  }
*/

  var yesterday = firebase.firestore.Timestamp.now();
  yesterday.seconds = yesterday.seconds - (24*60*60);
  //console.log(yesterday);
  db.collection("stories").where("timestamp",">",yesterday)
      .get().then(function(querySnapshote) {
        querySnapshote.forEach(function(doc) {
          //console.log(doc.id," => ",doc.data().timestamp);
        });
      })
  .catch(function(error) {
        //console.log("Error stories: ", error);
  });

  db.collection("stories").where("timestamp","<",yesterday)
    .get().then(function(querySnapshote) {
      querySnapshote.forEach(element => {
        element.ref.delete();
      });
    })



    /*Modal.setAppElement("#root");
    const [isOpen101, setIsOpen101] = useState(false);
    function toggleModal101() {
      setIsOpen101(!isOpen101);      }


      const [mynumber, setnumber] = useState("");
      const [otp, setotp] = useState('');
      const [show, setshow] = useState(false);
      const [final, setfinal] = useState('');
    
      const phonen = (event) => {

          event.preventDefault();
          let verify = new firebase.auth.RecaptchaVerifier('recaptcha-container');
          //var user = auth.currentUser;
          //var username = user.displayName;
          const auth2 = auth;
          //auth.signOut();
          
          auth2
          .signInWithPhoneNumber(mynumber, verify)
          .then((result) => {
              setfinal(result);
              alert("code sent")
              setshow(true);
          })
              .catch((err) => {
                  alert(err);
                });
      }
    
      const ValidateOtp = (event) => {
        event.preventDefault();
          if (otp === null || final === null)
              return;
              
          var user = auth.currentUser;
          //var username = user.displayName;
          final.confirm(otp).then((result) => {
              // success

              user.updateProfile({
                phoneNum: auth.currentUser.phoneNumber
              });

              var phn = user.phoneNum;
              alert(phn)
              alert(username)
          }).catch((err) => {
              alert("Wrong code");
          })
      }*/


      


      const [inputText, setInputText] = useState("");
      
  let inputHandler = (e) => {
    var lowerCase = e.target.value.toLowerCase();
    setInputText(lowerCase);
  };

  

  return (
    <div className="App">

      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://firebasestorage.googleapis.com/v0/b/projecc-af5ce.appspot.com/o/sitedata%2FPicture2.png?alt=media&token=e4709b46-5227-48c4-bec2-16c97bd1286e"
          alt=""
          width="125" 
          height="25"
        />
        {user?.displayName ? 
        (
          <div> 
            

            <button className="button-6" onClick={toggleModal102}><img src={user.photoURL} className='pfp20' /> {user.displayName}&nbsp;</button>
                          <Modal
                            isOpen={isOpen102}
                            onRequestClose={toggleModal102}
                            contentLabel="My dialog"
                            //className="mymodal"
                            overlayClassName="myoverlay"
                            closeTimeoutMS={250}>
                              <button className="button-7" onClick={toggleModal102}>Close</button>
                              <br/><br/>
                              <center>
                              <h1>My Profile: </h1>
                              <br/>
                              <img src={user.photoURL} className='pfp'/><h3>{user.displayName}</h3></center>
                              <div className="app__posts"> 
            {
                myposts.map(({id, post}) => (
                  <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} fl={2}></Post>
                )) 
            }
            </div>

                              </Modal>


                              <button className="button-6" onClick={toggleModal103}>Notifications</button>
                          <Modal
                            isOpen={isOpen103}
                            onRequestClose={toggleModal103}
                            contentLabel="My dialog"
                            className="mymodal"
                            overlayClassName="myoverlay"
                            closeTimeoutMS={250}>
                            {
                                noposts.map(({post}) => (
                                <div>
                                  <strong>{post.username}</strong> has posted a new post
                                  </div>
                                )) 

                            }
                              <button className="button-7" onClick={toggleModal103}>Close</button>
                            </Modal>

            <button className="button-6" onClick={toggleModal101}>Search</button>
                          <Modal
                            isOpen={isOpen101}
                            onRequestClose={toggleModal101}
                            contentLabel="My dialog"
                            className="mymodal"
                            overlayClassName="myoverlay"
                            closeTimeoutMS={250}>
                              

            <div className='search'>
      <input type = 'text' className='inputtext' onChange={inputHandler} placeholder='Search'/>
      <table>
                <tr><th>Username</th><th></th><th>Last login date</th></tr>

      {
             userss.map(({id, data, p}) => (
               

              (() => {
              
                if(id.toLowerCase().includes(inputText) && auth.currentUser.displayName !== id)
           {
                return (<Userlist key={id} user={auth.currentUser} username={id} lastlogin={data.timestamp} fl={p}></Userlist>)
    }
    else
                return (<div></div>)
              })()


             ))
      } 
      </table>
      </div>
      <button className="button-6" onClick={toggleModal101}>Close</button>
    </Modal>

             <button className="button-6" onClick={toggleModal5}>Settings</button>
                          <Modal
                            isOpen={isOpen5}
                            onRequestClose={toggleModal5}
                            contentLabel="My dialog"
                            className="mymodal"
                            overlayClassName="myoverlay"
                            closeTimeoutMS={250}>
                              
{/*
                              <button className="button-7" onClick={toggleModal101}>Enable 2FA</button>
             <Modal isOpen={isOpen101} 
                            onRequestClose={toggleModal101}
                            contentLabel="My dialog"
                            className="mymodal"
                            overlayClassName="myoverlay"
                            closeTimeoutMS={250}>
                              <center>
                          <form className="app__signup">

                          <div>
                          <div style={{ display: !show ? "block" : "none" }}>
                    <input className='inputtext' value={mynumber} onChange={(e) => { 
                       setnumber(e.target.value) }}
                        placeholder="phone number" />
                    <br /><br />
                    <div id="recaptcha-container"></div>
                    <button className="button-7" onClick={phonen}>Send OTP</button>
                </div>
                <div style={{ display: show ? "block" : "none" }}>
                    <input type="text" className='inputtext' placeholder={"Enter your OTP"}
                        onChange={(e) => { setotp(e.target.value) }}></input>
                    <br /><br />
                    <button className="button-7" onClick={ValidateOtp}>Verify</button>
                </div>

                </div> 

                              <input type="submit" className="button-7" onClick={(e) => [ValidateOtp(e), toggleModal101(e)]} value='SignIn'/>



                          </form>
                          <button className="button-7" onClick={toggleModal101}>Close</button> </center>
                          </Modal> 
                       


                              <form className="update__name">
                              <input type="text" placeholder='Change Username' value={newname} onChange={(e) => setNewname(e.target.value)}/><br/>
                              <input type="submit" className="submitbutton" onClick={updateName} value='Change Username'/>


                          </form>*/}      

                          <ChangePFP user={auth.currentUser}/>
                          <input type="submit" className="button-7" onClick={resetPass} value='Reset Password?'/>

                          <button className="button-7" onClick={toggleModal5}>Close</button>
                          </Modal>
        <ImageUpload username={user.displayName}/>
        <StoryUpload username={user.displayName}/>
          <input type="submit" className="button-6" onClick={() => [auth.signOut(),window.location.reload()]} value='Logout' />
          <TranslatorWidget sourceLanguageCode="en" className="translator"/>
          </div>
          ): (
          <div>
              
                          <button className="button-6" onClick={toggleModal}>SignUp</button>
                          <Modal
                            isOpen={isOpen}
                            onRequestClose={toggleModal}
                            contentLabel="My dialog"
                            className="mymodal"
                            overlayClassName="myoverlay"
                            closeTimeoutMS={250}>
                              <center>
                          <form className="app__signup">
                              <input type="text"  className='inputtext' placeholder='username' value={username} onChange={(e) => setUsername(e.target.value)}/><br/>
                              <input type="text"  className='inputtext'  placeholder='email' value={email} onChange={(e) => setEmail(e.target.value)}/><br/>
                              <input type="password"  className='inputtext' placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)}/><br/>
                              <input type="password"  className='inputtext' placeholder='retype password' value={password2} onChange={(e) => setPassword2(e.target.value)}/><br/>
                              <input type="submit" className="button-7" onClick={(e) => [signUp(e), toggleModal(e)]} value='SignUp'/>
                          </form>
                          <Login/>
                          <button className="button-7" onClick={toggleModal}>Close</button> </center>
                          </Modal>


                          <button className="button-6" onClick={toggleModal1}>SignIn</button>
                          <Modal
                                        isOpen={isOpen1}
                                        onRequestClose={toggleModal1}
                                        contentLabel="My dialog"
                                        className="mymodal"
                                        overlayClassName="myoverlay"
                                        closeTimeoutMS={250}>
                          <center>
                          <form className="app__signup">
                              <input type="text"  className='inputtext'  placeholder='email' value={email} onChange={(e) => setEmail(e.target.value)}/><br/>
                              <input type="password" className='inputtext' placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)}/><br/>
                              <input type="submit" className="button-7" onClick={(e) => [signIn(e), toggleModal1(e)]} value='SignIn'/>
                          </form>
                          <Login/>
                          <button className="button-7" onClick={toggleModal100}>Forgot Password?</button>
                          <Modal
                                        isOpen={isOpen100}
                                        onRequestClose={toggleModal100}
                                        contentLabel="My dialog"
                                        className="mymodal"
                                        overlayClassName="myoverlay"
                                        closeTimeoutMS={250}>
                                         <form className="app__signin">
                              <input type="text"  className='inputtext'  placeholder='Enter email' value={email} onChange={(e) => setEmail(e.target.value)}/><br/>
                              <input type="submit" className="button-7" onClick={(e) => [forgotPass(e), toggleModal100(e)]} value='Send Email'/>
                          </form>
                          <button className="button-7" onClick={toggleModal100}>Close</button>
                                        </Modal>
                          <button className="button-7" onClick={toggleModal1}>Close</button></center>
                          </Modal>
                          <TranslatorWidget sourceLanguageCode="en" className="translator"/>
        </div>
          )
        }
      </div>
<br/>

    {user?.displayName ? 
        (<div>
          <div className='stories'>
          <center>
    <br/>
                <div className="app__stories"> 
                {
                  stories.map(({id, story}) => (
                    <Story key={id} username={story.username} imageUrl={story.imageUrl}></Story>
                  ))
                }
              </div>
    </center></div>

            <div className="app__posts"> 
            {
                posts.map(({id, post}) => (
                  (() => {
                    if(auth.currentUser.displayName === post.username)
                            {return (<Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} fl={2}></Post>)}
                    else
                            {return (<Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} fl={0}></Post>)}
                  })()
                )) 
            }
            </div>

            <center><h1>Explore posts from other users:</h1></center>

            <div className="app__posts"> 
            {
                exposts.map(({id, post}) => (
                  <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} fl={1}></Post>
                )) 
            }
            </div>
  
  </div>
         ): (

          <div>
            <center><h1>Explore posts from our users:</h1></center>

         <div className="app__posts"> 
         
         {
             gposts.map(({id, post}) => (
               <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} fl={2}></Post>
             )) 
         }
         </div></div>
         
         )}


    </div>
  );
}

export default App;
