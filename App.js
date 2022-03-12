import React, { useState, useEffect } from 'react';
import './App.css';
import { db,auth } from './firebase';
import ImageUpload from './ImageUpload';
import StoryUpload from './StoryUpload';
import Post from './Post';
import Story from './Story';
import Login from './Login';
import "./styles.css";
import "./button-7.css"
import "./inputtext.css"
import "./inputstyles.css";
import TranslatorWidget from 'react-translate-widget';
import Modal from "react-modal";
import firebase from "firebase/compat/app";

function App() {
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);

  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log(authUser);
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

    auth
    .createUserWithEmailAndPassword(email,password)
    .then((authUser) => {
      authUser.user.sendEmailVerification();
      authUser.user.updateProfile({
        displayName: username
      });
      auth.signOut();
      alert("Email sent");
    })
    .catch((error) => alert(error.message));

  }

  const signIn = (event) => {
    event.preventDefault();
    auth
    .signInWithEmailAndPassword(email,password)
    .then((authUser) => {
      var user = auth.currentUser;
      if (user.emailVerified) {
        // email is verified.
      } else {
        auth.signOut();
        alert("Email is not verified!")
      }
    })
    .catch((error) => alert(error.message));
  }


  useEffect(() => {
    db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })
  }, []);
  
  useEffect(() => {
    db.collection('stories').orderBy('timestamp','desc').onSnapshot(snapshot => {
      setStories(snapshot.docs.map(doc => ({
        id: doc.id,
        story: doc.data()
      })));
    })
  }, []);

  
      Modal.setAppElement("#root");

      const [isOpen, setIsOpen] = useState(false);

      function toggleModal() {
        setIsOpen(!isOpen);
      }
      
  

      const [isOpen1, setIsOpen1] = useState(false);

      function toggleModal1() {
        setIsOpen1(!isOpen1);
      }

      const [isOpen5, setIsOpen5] = useState(false);

      function toggleModal5() {
        setIsOpen5(!isOpen5);
      }

      const [newname, setNewname] = useState('');

      const updateName = (event) => {
    event.preventDefault();

    user
    .updateProfile({  displayName: newname})
    .catch((error) => alert(error.message));

  }


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
             <button className="button" onClick={toggleModal5}>Settings</button>
                          <Modal
                            isOpen={isOpen5}
                            onRequestClose={toggleModal5}
                            contentLabel="My dialog"
                            className="mymodal"
                            overlayClassName="myoverlay"
                            closeTimeoutMS={250}>
                              
                              <form className="update__name">
                              <input type="text" placeholder='Change Username' value={newname} onChange={(e) => setNewname(e.target.value)}/><br/>
                              <input type="submit" className="submitbutton" onClick={updateName} value='Change Username'/>
                          </form>

                          <button className="button" onClick={toggleModal5}>Close</button>
                          </Modal>
        <ImageUpload username={user.displayName}/>
        <StoryUpload username={user.displayName}/>
          <input type="submit" className="submitbutton"onClick={() => auth.signOut()} value='Logout' />
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
                          <form className="app__signin">
                              <input type="text"  className='inputtext'  placeholder='email' value={email} onChange={(e) => setEmail(e.target.value)}/><br/>
                              <input type="password" className='inputtext' placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)}/><br/>
                              <input type="submit" className="button-7" onClick={(e) => [signIn(e), toggleModal1(e)]} value='SignIn'/>
                          </form>
                          <Login/>
                          <button className="button-7" onClick={toggleModal1}>Close</button></center>
                          </Modal>
                          <TranslatorWidget sourceLanguageCode="en" className="translator"/>
        </div>
          )
        }
      </div>
<br/>

    <center>
    Stories:
    <br/>
      <div className="app__stories"> 
      {
        stories.map(({id, story}) => (
          <Story key={id} username={story.username} imageUrl={story.imageUrl}></Story>
        ))
      }
    </div>
    </center>

      <div className="app__posts"> 
      {
        posts.map(({id, post}) => (
          <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl}></Post>
        ))
      }
  </div>
      


    </div>
  );
}

export default App;
