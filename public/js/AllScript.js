// //{!-- Push State --}}
//     var DOMAIN_NAME = 'http://localhost:3000';

//     function loadHome() {
//         history.pushState({}, "", DOMAIN_NAME + "/");
//     }
    
//     function loadRegister() {
//         history.pushState({}, "", DOMAIN_NAME + "/register");
//     }

//     function loadLogin() {
//         history.pushState({}, "", DOMAIN_NAME + "/login");
//     }

//     function loadLogout() {
//         history.pushState({}, "", DOMAIN_NAME + "/logout");
//     }

//     function loadPushState() {
//         history.pushState({}, "", DOMAIN_NAME + "/PushState");
//     }
// //{!-- Push State END --}}

// //{{!-- Compteur de Character --}}
//     function updateCharacterCount() {
//         let textarea = document.getElementById('myTextarea');
//         let imageInput = document.getElementById('imageInput');
//         let charCount = document.getElementById('charCount');
//         let submitButton = document.getElementsByClassName('tweetBox__tweetButton')[0];

//         let remainingChars = 280 - textarea.value.length;
//         charCount.textContent = remainingChars + ' caractères restants';

//         if (textarea.value.trim() === '' && (!imageInput.files || imageInput.files.length === 0)) {
//             submitButton.disabled = true;
//             submitButton.style.backgroundColor = "gray";
//         } else {
//             submitButton.disabled = false;
//             submitButton.style.backgroundColor = "#0069d9";
//         }
//     }

//     // Add event listener to image input
//     let imageInput = document.getElementById('imageInput');
//     imageInput.addEventListener('change', updateCharacterCount);
// //{{!-- Compteur de Character  END--}}


// //{{!-- SnackBar --}}

// function showSnackbar(message) {
//     var snackbar = document.getElementById("snackbar");
//     snackbar.innerText = message;
//     snackbar.classList.add("show");
//     setTimeout(function () {
//     snackbar.classList.remove("show");
//     }, 3000);
// }

//   // Trigger the snackbar with the message from the controller
// var message = "{{message}}";
// var messages = "{{messages}}";

// if (message) {
//     showSnackbar(message);
// }

// if (messages) {
//     showSnackbar(messages);
// }
// //{{!-- SnackBar END--}}

// //{{!-- Fonction d'envoie d'image du formulaire --}}

// function previewImage(event) {
//     var imageInput = event.target;
//     var preview = document.getElementById("preview");

//     var file = imageInput.files[0];
//     var reader = new FileReader();

//     reader.onload = function (e) {
//     preview.src = e.target.result;
//     };

//     reader.readAsDataURL(file);
// }
// //{{!-- Fonction d'envoie d'image du formulaire  END--}}

// //{{!-- Socket.io --}}

// export default {
//     data() {
//         return {
//             socketmessages: [], // Initialize the socketmessages data property
//         };
//     },
//     mounted() {
//     // Connect to the Socket.io server
//         const socket = io();

//     // Listen for new messages from the server
//         socket.on('newMessage', (message) => {
//             this.displayMessage(message);
//         });

//     // Fetch messages from the server
//     fetch('/messages')
//         .then((response) => response.json())
//         .then((data) => {
//         this.socketmessages = data.socketmessages;

//         // Display the fetched messages
//         this.socketmessages.forEach((message) => {
//         this.displayMessage(message);
//         });
//         })
//         .catch((error) => {
//         console.error('Error fetching messages:', error);
//         });
//     },
//     methods: {
//     displayMessage(message) {
//       // Display the message in your component's template
//     console.log('New message:', message);
//     },
//     },
// };
// //{{!-- Socket.io  END--}}
