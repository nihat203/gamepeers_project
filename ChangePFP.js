import React, { useState } from 'react'
import { db, storage } from './firebase';
import "./imageUpload.css";
import "./button-7.css"
import "./pfp.css"
import Modal from "react-modal";

function ChangePFP({user}) {
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);    

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        
        const uploadTask = storage.ref(`pfp/${image.name}`).put(image);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                console.log(error);
                alert(error.message);
            },
            () => {
                storage
                    .ref("pfp")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        user.updateProfile({
                            photoURL: url
                          })
                        db.collection("userpfp").doc(user.displayName).set({photourl: url});
                        setProgress(0);
                        setImage(null);
                    })
            }

        )

    }

    Modal.setAppElement("#root"); 

    const [isOpen2, setIsOpen2] = useState(false);

    function toggleModal2() {
      setIsOpen2(!isOpen2);
    }

    return (
        <a>
            <button className='button-7' onClick={toggleModal2}>Change Profile Picture</button>
                          <Modal
                            isOpen={isOpen2}
                            onRequestClose={toggleModal2}
                            contentLabel="My dialog"
                            className="mymodal"
                            overlayClassName="myoverlay"
                            closeTimeoutMS={250}>
                <progress value={progress} max="100" /><br/>
                <input type='file' className='button-7' onChange={handleChange}/><br/>
                <input type='submit' value='Upload' className='button-7' onClick={handleUpload}/>
                <br/>
                <button className='button-7' onClick={toggleModal2}>Close</button>
                          </Modal>
                          </a>
    )
}

export default ChangePFP