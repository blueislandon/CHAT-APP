const socket = io();

document.addEventListener('DOMContentLoaded', () => {
    const usernameInput = document.getElementById('username-input');
    const storedUsername = localStorage.getItem('username');
    const storedMessages = JSON.parse(localStorage.getItem('messages')) || [];

    if (storedUsername) {
        usernameInput.value = storedUsername;
        usernameInput.disabled = true;
    }

    const messageContainer = document.getElementById('message-container');
    storedMessages.forEach(data => {
        const messageElement = document.createElement('div');
        messageElement.textContent = `${data.username}: ${data.message}`;
        messageContainer.appendChild(messageElement);
    });

    document.getElementById('send-button').addEventListener('click', () => {
        const username = usernameInput.value.trim();
        const messageInput = document.getElementById('message-input');
        const message = messageInput.value.trim();

        if (username !== "" && message !== "") {
            const messageData = { username, message };
            socket.emit('chat message', messageData);

            messageInput.value = "";
        }
    });
});

socket.on('chat message', (data) => {
    const messageContainer = document.getElementById('message-container');
    const messageElement = document.createElement('div');
    messageElement.textContent = `${data.username}: ${data.message}`;
    messageContainer.appendChild(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;

    const messages = JSON.parse(localStorage.getItem('messages')) || [];
    messages.push(data);
    localStorage.setItem('messages', JSON.stringify(messages));
});

socket.on('clear messages', () => {
    localStorage.removeItem('messages');
    document.getElementById('message-container').innerHTML = '';
});
