document.getElementById('saveUser').addEventListener('click', () => {
    const username = document.getElementById('username').value;
    if (username) {
      console.log('Tentando registrar usuário:', username);
      fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao registrar usuário');
        }
        return response.json();
      })
      .then(data => {
        console.log('Usuário salvo com sucesso:', data);
        alert('Usuário salvo com sucesso!');
      })
      .catch(error => {
        console.error('Erro ao salvar usuário:', error);
        alert('Erro ao salvar usuário.');
      });
    } else {
      alert('Por favor, insira um nome de usuário.');
    }
  });
  