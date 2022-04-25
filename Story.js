import React, { useState } from 'react'
import Modal from "react-modal";
import "./story.css";
import "./button-7.css"


function Story( { username,  imageUrl } ) {
  Modal.setAppElement("#root"); 

  const [isOpen7, setIsOpen7] = useState(false);

  function toggleModal7() {
    setIsOpen7(!isOpen7);
  }
  return (
    <a className="story">

<button type="submit" className="buttonn" onClick={toggleModal7}>
 <img className="btnimg" src={imageUrl} width="90" height="90"/>
</button>

    <Modal
      isOpen={isOpen7}
      onRequestClose={toggleModal7}
      contentLabel="My dialog"
      className="mymodal"
      overlayClassName="myoverlay"
      closeTimeoutMS={270}>
        

 
        
        <div className="post__header">

        <h3>{username}</h3>
        </div>
        
        
        <img onError={(event) => event.target.style.display = 'none'} className="post__image" src={imageUrl}/>
        
      { /* <video onError={(event) => event.target.style.display = 'none'} controls className="post__image" muted 
         src={imageUrl} type="video/mp4">
        </video>*/}
                <button className="button-r" onClick={toggleModal7}>Close</button>
                          </Modal>  
                          
                          
                </a>
  )
}

export default Story