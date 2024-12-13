const socket = io();

document.addEventListener('DOMContentLoaded', () => {
    const messageContainer = document.getElementById('developer-message-container');
    const storedMessages = JSON.parse(localStorage.getItem('messages')) || [];

    const renderMessages = (messages) => {
        messageContainer.innerHTML = '';
        messages.forEach((data, index) => {
            const messageElement = document.createElement('div');
            messageElement.textContent = `${data.username}: ${data.message}`;
            messageElement.setAttribute('data-index', index);
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => {
                storedMessages.splice(index, 1);
                localStorage.setItem('messages', JSON.stringify(storedMessages));
                socket.emit('delete message', index);
                renderMessages(storedMessages);
            });
            messageElement.appendChild(deleteButton);
            messageContainer.appendChild(messageElement);
        });
    };

    renderMessages(storedMessages);

    document.getElementById('clear-messages-button').addEventListener('click', () => {
        localStorage.removeItem('messages');
        messageContainer.innerHTML = '';
        socket.emit('clear messages');
    });
});

socket.on('clear messages', () => {
    localStorage.removeItem('messages');
    document.getElementById('developer-message-container').innerHTML = '';
});

socket.on('delete message', (index) => {
    const messages = JSON.parse(localStorage.getItem('messages')) || [];
    messages.splice(index, 1);
    localStorage.setItem('messages', JSON.stringify(messages));
    const messageElements = document.querySelectorAll('#developer-message-container div');
    messageElements.forEach(element => {
        if (element.getAttribute('data-index') == index) {
            element.remove();
        }
    });
});
