import React, { useState } from 'react'
import { db,storage } from './firebase';
import { serverTimestamp } from "firebase/firestore";
import Modal from "react-modal";
import './button-7.css'

function StoryUpload({username}) {
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
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
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        db.collection("stories").add({
                            timestamp: serverTimestamp(),
                            imageUrl: url,
                            username: username
                        });

                        setProgress(0);
                        setImage(null);
                    })
            }
        )
    }

    Modal.setAppElement("#root"); 

    const [isOpen6, setIsOpen6] = useState(false);

    function toggleModal6() {
      setIsOpen6(!isOpen6);
    }

    return (
        <a>
            <button onClick={toggleModal6} className='button-6'>Upload Story</button>
                          <Modal
                            isOpen={isOpen6}
                            onRequestClose={toggleModal6}
                            contentLabel="My dialog"
                            className="mymodal"
                            overlayClassName="myoverlay"
                            closeTimeoutMS={250}>
                <progress value={progress} max="100" /><br/>
                <input type='file' className='button-7' onChange={handleChange}/><br/>
                <input type='submit' className='button-7' value='Upload' onClick={handleUpload}/>
                <br/>
                <button onClick={toggleModal6} className='button-7r'>Close</button>
                          </Modal>
                          </a>
    )
}

export default StoryUpload