$(document).ready(function(){
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDtlyy1KpJXhyV98mkCbHFXmzvEfYKYlV8",
    authDomain: "week11-d2733.firebaseapp.com",
    databaseURL: "https://week11-d2733.firebaseio.com",
    storageBucket: "week11-d2733.appspot.com",
    messagingSenderId: "960307550827"
  };
  firebase.initializeApp(config);

  // Firebase database reference

  var dbUser = firebase.database().ref().child('user');
 
  var photoURL;
  var $img = $('img');

  // REGISTER DOM ELEMENTS
  const $email = $('#email');
  const $password = $('#password');
  const $btnSignIn = $('#btnSignIn');
  const $btnSignUp = $('#btnSignUp');
  const $btnSignOut = $('#btnSignOut');
  const $hovershadow = $('.hover-shadow');
  const $btnSubmit = $('#btnSubmit');
  const $signInfo = $('#sign-info');
  const $file = $('#file');
  const $profileName = $('#profile-name');
  const $profileOccupation = $('#profile-occupation');
  const $profileAge = $('#profile-age');
  const $profileDescriptions = $('#profile-descriptions');
  const $profileEmail = $('#profile-email');

  const $InputOccupation = $('#input_occu');
  const $InputAge = $('#input_age');
  const $InputDescriptions = $('#input_des');

  // Hovershadow
  $hovershadow.hover(
    function(){
      $(this).addClass("mdl-shadow--4dp");
    },
    function(){
      $(this).removeClass("mdl-shadow--4dp");
    }
  );

  var storageRef = firebase.storage().ref();

  function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    var file = evt.target.files[0];

    var metadata = {
      'contentType': file.type
    };

    // Push to child path.
    // [START oncomplete]
    storageRef.child('images/' + file.name).put(file, metadata).then(function(snapshot) {
      console.log('Uploaded', snapshot.totalBytes, 'bytes.');
      console.log(snapshot.metadata);
      photoURL = snapshot.metadata.downloadURLs[0];
      console.log('File available at', photoURL);
    }).catch(function(error) {
      // [START onfailure]
      console.error('Upload failed:', error);
      // [END onfailure]
    });
    // [END oncomplete]
  }

  window.onload = function() {
    $file.change(handleFileSelect);
    // $file.disabled = false;
  }

  // SignIn/SignUp/SignOut Button status
  var user = firebase.auth().currentUser;
  if (user) {
    $btnSignIn.attr('disabled', 'disabled');
    $btnSignUp.attr('disabled', 'disabled');
    $btnSignOut.removeAttr('disabled')
  } else {
    $btnSignOut.attr('disabled', 'disabled');
    $btnSignIn.removeAttr('disabled')
    $btnSignUp.removeAttr('disabled')
  }

  // Sign In
  $btnSignIn.click(function(e){
    const email = $email.val();
    const pass = $password.val();
    const auth = firebase.auth();
    // signIn
    const promise = auth.signInWithEmailAndPassword(email, pass);
    promise.catch(function(e){
      console.log(e.message);
      $signInfo.html(e.message);
    });
    promise.then(function(){
      console.log('SignIn User');
    });
  });

  // SignUp
  $btnSignUp.click(function(e){
    const email = $email.val();
    const pass = $password.val();
    const auth = firebase.auth();
    // signUp
    const promise = auth.createUserWithEmailAndPassword(email, pass);
    promise.catch(function(e){
      console.log(e.message);
      $signInfo.html(e.message);
    });
    promise.then(function(user){
      console.log("SignUp user is "+user.email);
      const dbUserid = dbUser.child(user.uid);
      dbUserid.push({email:user.email});
    });
  });

  // Listening Login User
  firebase.auth().onAuthStateChanged(function(user){
    var use = firebase.auth().currentUser;
    if(user) {
      console.log(user);
      const loginName = user.displayName || user.email;
      const dbUserid = dbUser.child(use.uid);
      var $occu = dbUserid.child('Occupation');
      var $age = dbUserid.child('Age');
      var $des = dbUserid.child('Descriptions');
      $signInfo.html(loginName+" is login...");
      $btnSignIn.attr('disabled', 'disabled');
      $btnSignUp.attr('disabled', 'disabled');
      $btnSignOut.removeAttr('disabled')
      $profileName.html(user.displayName);
      $profileEmail.html(user.email);
      $img.attr("src",user.photoURL);
      $age.on('value', function(snap){
        $profileAge.html(snap.val());
      });
      $occu.on('value', function(snap){
        $profileOccupation.html(snap.val());
      });

      $des.on('value', function(snap){
        $profileDescriptions.html(snap.val());
      });
    } else {
      console.log("not logged in");
      $profileName.html("N/A");
      $profileprofileDescriptions.html("N/A");
      $profileprofileOccupation.html("N/A");
      $profileprofileAge.html("N/A");
      $profileEmail.html('N/A');
      $img.attr("src","");
    }
  });

  // SignOut
  $btnSignOut.click(function(){
    firebase.auth().signOut();
    console.log('LogOut');
    $signInfo.html('No one login...');
    $btnSignOut.attr('disabled', 'disabled');
    $btnSignIn.removeAttr('disabled')
    $btnSignUp.removeAttr('disabled')
  });

  // Submit
  $btnSubmit.click(function(){
    var user = firebase.auth().currentUser;
    const $userName = $('#userName').val();
    const dbUserid = dbUser.child(user.uid);
    var occu = $InputOccupation.val();
    var age = $InputAge.val();
    var des = $InputDescriptions.val();
    dbUserid.set({Age:age, Descriptions:des, Occupation:occu});
    var $occu = dbUserid.child('Occupation');
    var $age = dbUserid.child('Age');
    var $des = dbUserid.child('Descriptions');
      $age.on('value', function(snap){
        $profileAge.html(snap.val());
      });
      $occu.on('value', function(snap){
        $profileOccupation.html(snap.val());
      });

      $des.on('value', function(snap){
        $profileDescriptions.html(snap.val());
      });
    const promise = user.updateProfile({
      displayName: $userName,
      photoURL: photoURL
    });

    promise.then(function() {
      console.log("Update successful.");
      user = firebase.auth().currentUser;
      if (user) {
        $profileName.html(user.displayName);
        $profileEmail.html(user.email);
        $img.attr("src",user.photoURL);
        const loginName = user.displayName || user.email;
        $signInfo.html(loginName+" is login...");
      }
    });
  });

});
