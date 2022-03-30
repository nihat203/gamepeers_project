import React, { useState } from 'react'
import { db,storage } from './firebase';
import { serverTimestamp } from "firebase/firestore";
import "./imageUpload.css";
import "./button-7.css"
import "./inputtext.css"
import Modal from "react-modal";

function ImageUpload({username}) {
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState('');
    

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
                        db.collection("posts").add({
                            timestamp: serverTimestamp(),
                            caption: caption,
                            imageUrl: url,
                            username: username
                        });
                        setProgress(0);
                        setCaption("");
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
            <button className='button-6' onClick={toggleModal2}>Upload Image/Video</button>
                          <Modal
                            isOpen={isOpen2}
                            onRequestClose={toggleModal2}
                            contentLabel="My dialog"
                            className="mymodal"
                            overlayClassName="myoverlay"
                            closeTimeoutMS={250}>
                <progress value={progress} max="100" /><br/>
                <input type='text' className='inputtext' placeholder='Enter a caption' onChange={event => setCaption(event.target.value)}/><br/>
                <input type='file' className='button-7' onChange={handleChange}/><br/>
                <input type='submit' value='Upload' className='button-7' onClick={handleUpload}/>
                <br/>
                <button onClick={toggleModal2} className='button-7'>Close</button>
                          </Modal>
                          </a>
    )
}

export default ImageUpload