


const facebook_login = () =>{
    var provider = new firebase.auth.FacebookAuthProvider();

    firebase.auth().signInWithPopup(provider).then(function(result) {
        
        var user = result.user;
        window.name = user.displayName;
        console.log("user=====>", user.displayName)
        window.location = 'chat.html'
        
        
      }).catch(function(error) {
        console.log(error.message)
      });
}

const google_login = () =>{

    var provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider).then(function(result) {
        var user = result.user;
        window.name = user.displayName;
        console.log("user=====>", user.displayName)
        window.location = 'chat.html'
      }).catch(function(error) {
        
        console.log(error.message)
      });

}


console.log("user=====>", window.name)
var myName = window.name;

console.log("user=====>", myName)

function sendMessage() {
    // get message
    var message = document.getElementById("message").value;

    // save in database
    firebase.database().ref("messages").push().set({
        "sender": myName,
        "message": message
    });

    // prevent form from submitting
    return false;
}

firebase.database().ref("messages").on("child_added", function (snapshot) {
    var html = "";
    // give each message a unique ID
    html += "<li id='message-" + snapshot.key + "'>";
    // show delete button if message is sent by me
    if (snapshot.val().sender == myName) {
        html += "<button data-id='" + snapshot.key + "' onclick='deleteMessage(this);'" + "class = 'btn-delete'>";
            html += "Delete";
        html += "</button>";
    }
    html += snapshot.val().sender + ": " + snapshot.val().message;
    html += "</li>";

    document.getElementById("messages").innerHTML += html;
});

function deleteMessage(self) {
    // get message ID
    var messageId = self.getAttribute("data-id");
 
    // delete message
    firebase.database().ref("messages").child(messageId).remove();
}
 
// attach listener for delete message
firebase.database().ref("messages").on("child_removed", function (snapshot) {
    // remove message node
    document.getElementById("message-" + snapshot.key).innerHTML = "This message has been removed";
});