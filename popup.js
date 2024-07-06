document.addEventListener('DOMContentLoaded', function () {
    const addUserButton = document.getElementById('addUser');
    const userSelect = document.getElementById('userSelect');
    const openDashboardButton = document.getElementById('openDashboard');

    // Função para carregar usuários no select
    function loadUsers() {
        fetch('http://localhost:3000/users')
            .then(response => response.json())
            .then(data => {
                userSelect.innerHTML = '';
                data.users.forEach(user => {
                    const option = document.createElement('option');
                    option.value = user.id;
                    option.textContent = user.username;
                    userSelect.appendChild(option);
                });
                // Selecionar usuário salvo no localStorage
                const savedUserId = localStorage.getItem('selectedUserId');
                if (savedUserId) {
                    userSelect.value = savedUserId;
                }
            })
            .catch(error => {
                console.error('Erro ao carregar usuários:', error);
                alert('Erro ao carregar usuários.');
            });
    }

    // Carregar usuários ao iniciar
    loadUsers();

    // Salvar usuário selecionado no localStorage e enviar mensagem ao content script
    userSelect.addEventListener('change', () => {
        const selectedUserId = userSelect.value;
        console.log('Salvando usuário selecionado no localStorage:', selectedUserId);
        localStorage.setItem('selectedUserId', selectedUserId);

        // Enviar mensagem ao content script
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { selectedUserId: selectedUserId });
        });
    });

    addUserButton.addEventListener('click', () => {
        const newUsername = document.getElementById('newUsername').value;
        if (newUsername) {
            console.log('Tentando adicionar usuário:', newUsername);
            fetch('http://localhost:3000/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: newUsername })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao adicionar usuário');
                }
                return response.json();
            })
            .then(data => {
                console.log('Usuário adicionado com sucesso:', data);
                alert('Usuário adicionado com sucesso!');
                loadUsers(); // Recarregar lista de usuários
            })
            .catch(error => {
                console.error('Erro ao adicionar usuário:', error);
                alert('Erro ao adicionar usuário.');
            });
        } else {
            alert('Por favor, insira um nome de usuário.');
        }
    });

    openDashboardButton.addEventListener('click', function () {
        window.open('http://localhost:3000/dashboard', '_blank');
    });
});
