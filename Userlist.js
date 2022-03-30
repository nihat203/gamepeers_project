import React from 'react';
import "./button-7.css"
import { db } from './firebase';
import { serverTimestamp } from "firebase/firestore";
  
function Userlist( {user, username, lastlogin, fl } ) {
  const follow = (event) => {
    event.preventDefault();
    db.collection('follow').doc('following').collection(user.displayName).doc(username).set({timestamp:serverTimestamp()})
  }
  const unfollow = (event) => {
    event.preventDefault();
    db.collection('follow').doc('following').collection(user.displayName).doc(username).delete()
  }
    function timeDifference(date1,date2) {
        var difference = date2 - date1;
        //alert(difference)    
        var daysDifference = Math.floor(difference/1000/60/60/24);
        difference -= daysDifference*1000*60*60*24
    
        var hoursDifference = Math.floor(difference/1000/60/60);
        difference -= hoursDifference*1000*60*60
    
        var minutesDifference = Math.floor(difference/1000/60);
        difference -= minutesDifference*1000*60
    
        var secondsDifference = Math.floor(difference/1000);
    if(daysDifference === 0){
    if(hoursDifference === 0)
    {
        if(minutesDifference === 0)
        return secondsDifference + 's ago';



          return minutesDifference + 'm' + 
          secondsDifference + 's ago';
    }

        return   hoursDifference + 'h' + 
          minutesDifference + 'm' + 
          secondsDifference + 's ago';
        }
          
          return  daysDifference + 'd' + 
          hoursDifference + 'h' + 
          minutesDifference + 'm' + 
          secondsDifference + 's ago';
          
    }
    const dt = Math.ceil(Date.now());
    return (
            <tr>
              
              <td>{username}</td>

              
            <td>
              
              
                {fl === 1 ? (
          <button
            className="button-6"
            type='submit'
            onClick={follow}>
              Follow
            </button>)
            : (
            <button
            className="button-6"
            type='submit'
            onClick={unfollow}>
              Unfollow
            </button>
            )}      
          
          </td>
          
          <td>&nbsp;&nbsp;&nbsp;   {(timeDifference(lastlogin.seconds*1000, dt)).toString()}</td>
          
          
          </tr>
    )
}
export default Userlist