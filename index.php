<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="PWA application de chat">

  <meta name="theme-color" content="#FFE1C4">
  <title>PWA Chat</title>
  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"> 
  <link rel="apple-touch-icon" href="chat180x180.png">
  <link rel="icon" type="image/png" sizes="32x32" href="img/icons/chat32x32.png">
  <link rel="manifest" href="manifest.webmanifest">
  <style>
    .color-primary-0 { color: #2C4870 }	/* Main Primary color */
    .color-primary-1 { color: #758AA8 }
    .color-primary-2 { color: #4C668C }
    .color-primary-3 { color: #142E54 }
    .color-primary-4 { color: #051A38 }
  </style>
</head>
<body>
  <i class="far fa-comment-alt"></i>
  <div class="container">
    <div class="jumbotron bg-primary">
      <h1 class="text-center">CHAT<span class="fas fa-camera"></span></h1>
      <form action="">
        <div class="form-group row">
          <br>
          <div class="col-sm-3">
            <label for="name">Prénom</label>
          </div>
          <div class="col-sm-6">
            <input type="text" class="form-control" id="name">
          </div>
        </div>
        <div class="form-group row">
          <div class="col-sm-3">
            <label for="message">Message</label>
          </div>
          <div class="col-sm-6">
            <input type="textarea" class="form-control" id="message">
          </div>
        </div>
        <button class="btn btn-success float-right m-2" type="submit" id="submit" >Envoyer</button>
        <br>
        <textarea class="form-control"  id="idstate" cols=50 rows=4 readonly> </textarea> 
      </form>
    </div>
  </div>
  <script>

// Check if service worker is available. 
if ('serviceWorker' in navigator) {
  // alert ('navok');
  navigator.serviceWorker.register('sw.js').then(function(registration) {
    console.log('SW registration succeeded with scope:', registration.scope);
  }).catch(function(e) {
    console.log('SW registration failed with error:', e);
  });
}
//else {alert('nav ko')};

if(window.caches){
    caches.open("PWA-CHAT").then(
      (cache)=>{
        cache.addAll([
          'index.php',
          'sw.js'
        ])
      }
    )
}
function getLocaltime() {
  var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
  var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().substring(11, 19) ;
  return localISOTime;
  }
    let name=document.getElementById('name');
    let message=document.getElementById('message');
    let submit=document.getElementById('submit');

    if (localStorage.getItem('name')){
      name.value = localStorage.getItem('name');
    }

    submit.addEventListener('click', (event)=>{
     
      event.preventDefault();
      if (name.value=="" || message.value==""){
        alert('vous devez saisir votre nom ou un message');
      }else {
        localStorage.setItem ('name', name.value);
        //creation array pour stocker nom+message
        let messages = [];
        // si il y a deja des message ds le localStorage on les met dans l'array pour pouvoir ajouter le nouveau
        if (localStorage.getItem('messages')){
          messages=JSON.parse(localStorage.getItem('messages'));
          messages.forEach(element => {
            // cf video
          });
        }
        let item = {
            'name':name.value,
            'message':message.value,
            'time':getLocaltime()
        }
        messages.push(item);
        //
        txt = document.getElementById("idstate")
        txt.value = "";
          for (var i = messages.length - 1; i>=0 ; i--) {
            txt.value += messages[i]['time'] + ' ' + messages[i]['name'] + ' / ' + messages[i]['message'] + '\r\n' ;
          }
        //
        console.log(messages)
        localStorage.setItem('messages',JSON.stringify(messages));
      }
    })
  </script>
  </body>
</html>