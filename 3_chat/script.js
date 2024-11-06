
let btnSubmit = document.querySelector('.submit-message');
let btnNavigation = document.querySelector('.geolocation');
const chat = document.getElementById('chatWindow');
const messageInput = document.getElementById('messageInput');

const socket = new WebSocket('wss://echo-ws-service.herokuapp.com');

socket.onopen = () => {
  console.log('WebSocket connection opened');
};

socket.onerror = (error) => {
  console.error('WebSocket error: ' + error);
};

socket.onmessage = (event) => {
  console.log('Received message: ' + event.data);
  const message = JSON.parse(event.data);
  saveMessage(message);
  displayMessages(getAllMessages());
};


function sendMessage(event) {
  event.preventDefault();
  const input = document.querySelector("#messageInput");
  const messageText = input.value;
  if (!messageText.trim()) {
    return;
  }

  const message = {
    userId: "user1",
    timestamp: Date.now(),
    text: messageText,
    text: `Latitude: ${latitude}, Longitude: ${longitude}`,
  };
  
  socket.send(JSON.stringify(message));
  saveMessage(message);
  input.value = "";
  displayMessages(getAllMessages());
}

function saveMessage(message) {
  const currentMessages = getAllMessages();
  currentMessages.push(message);
  localStorage.setItem("chatMessages", JSON.stringify(currentMessages));
}

function getAllMessages() {
  const storedMessages = localStorage.getItem("chatMessages");
  return storedMessages ? JSON.parse(storedMessages) : [];
}

function displayMessages(messages) {
  const chatBox = document.querySelector("#chatWindow");
  chatBox.innerHTML = ""; 

  messages.forEach((message) => {
    const messageDiv = document.createElement("div");
    messageDiv.textContent = `${new Date(message.timestamp).toLocaleString()} - ${message.userId}: ${message.text}`;
    chatBox.appendChild(messageDiv);
  });

}

function geolocationMap() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function(position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      console.log('aa')
    });
  } else {
    console.log("Geolocation is not available on this device");
  }
};


btnSubmit.addEventListener('click', sendMessage)
btnNavigation.addEventListener('click', geolocationMap)

