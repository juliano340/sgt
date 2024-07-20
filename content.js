// Função para criar e exibir um modal
function createModal(title, content, confirmCallback = null) {
    // Remover modal existente, se houver
    const existingModal = document.getElementById('custom-modal');
    if (existingModal) {
        existingModal.remove();
    }

    // Criar o elemento modal
    const modal = document.createElement('div');
    modal.id = 'custom-modal';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '1000';

    // Criar o conteúdo do modal
    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = 'white';
    modalContent.style.padding = '20px';
    modalContent.style.borderRadius = '8px';
    modalContent.style.width = '80%';
    modalContent.style.maxWidth = '600px';
    modalContent.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.25)';

    // Criar o título do modal
    const modalTitle = document.createElement('h2');
    modalTitle.innerText = title;
    modalContent.appendChild(modalTitle);

    // Criar o conteúdo do modal
    const modalBody = document.createElement('div');
    modalBody.innerHTML = content;
    modalContent.appendChild(modalBody);

    // Criar o botão de fechar
    const closeButton = document.createElement('button');
    closeButton.innerText = 'Fechar';
    closeButton.style.marginTop = '20px';
    closeButton.addEventListener('click', () => {
        modal.remove();
    });
    modalContent.appendChild(closeButton);

    // Criar o botão de confirmação, se necessário
    if (confirmCallback) {
        const confirmButton = document.createElement('button');
        confirmButton.innerText = 'Confirmar';
        confirmButton.style.marginTop = '20px';
        confirmButton.style.marginLeft = '10px';
        confirmButton.addEventListener('click', () => {
            confirmCallback();
            modal.remove();
        });
        modalContent.appendChild(confirmButton);
    }

    // Adicionar o conteúdo ao modal
    modal.appendChild(modalContent);

    // Adicionar o modal ao corpo do documento
    document.body.appendChild(modal);

    // Adicionar eventos de clique para os botões de exclusão e aprovação
    const deleteButtons = modal.querySelectorAll('.delete-test-button');
    deleteButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const testId = event.target.getAttribute('data-test-id');
            createModal('Confirmar Exclusão de Teste', 'Você deseja excluir este teste?', () => {
                deleteTest(testId);
            });
        });
    });

    const approvalSelects = modal.querySelectorAll('.approval-status');
    approvalSelects.forEach(select => {
        select.addEventListener('change', (event) => {
            const testId = event.target.getAttribute('data-test-id');
            const approved = event.target.value === '' ? null : parseInt(event.target.value);

            fetch(`${API_BASE_URL}/tests/${testId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ approved })
            })
            .then(response => response.json())
            .then(data => {
                console.log('Teste atualizado com sucesso:', data);
                alert('Status do teste atualizado com sucesso!');
            })
            .catch(error => {
                console.error('Erro ao atualizar teste:', error);
                alert('Erro ao atualizar teste.');
            });
        });
    });
}

// Função para formatar data
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses são baseados em zero
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${day}/${month}/${year} - ${hours}:${minutes}:${seconds}`;
}

// Função para copiar texto para a área de transferência
function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    alert(`Texto copiado: ${text}`);
}

// Função para excluir um teste
function deleteTest(testId) {
    fetch(`${API_BASE_URL}/tests/${testId}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        console.log('Teste excluído com sucesso:', data);
        alert('Teste excluído com sucesso!');
        const testItem = document.getElementById(`test-item-${testId}`);
        if (testItem) {
            testItem.remove();
        }
    })
    .catch(error => {
        console.error('Erro ao excluir teste:', error);
        alert('Erro ao excluir teste.');
    });
}

// Função para pegar o nome do desenvolvedor
function getDeveloperName() {
    const developerElement = document.querySelector('.user_cf.cf_15.attribute .value a');
    if (developerElement) {
        return developerElement.innerText;
    } else {
        console.error('Elemento do desenvolvedor não encontrado.');
        return 'Desenvolvedor não encontrado';
    }
}


// Função principal para inicializar a extensão
function initializeExtension() {
    console.log('Extensão inicializada');

    window.addEventListener('load', () => {
        const targetURL = "https://redmine.dw.net.br/issues/";
        const currentURL = window.location.href;

        if (currentURL.includes(targetURL)) {
            const caseNumber = currentURL.match(/issues\/(\d+)/);
            if (caseNumber && caseNumber[1]) {
                console.log(`Oi! Você está em uma página do Redmine. Número do caso: ${caseNumber[1]}`);
            } else {
                console.log("Oi! Você está em uma página do Redmine, mas não foi possível encontrar o número do caso.");
            }

            // Adicionar botão "Registrar Teste" antes do link "Editar"
            const editLink = document.querySelector('a.icon.icon-edit[onclick*="showAndScrollTo"][accesskey="e"]');
            if (editLink) {
                const registerButton = document.createElement('a');
                registerButton.innerText = '🧪 Novo teste';

                registerButton.addEventListener('click', () => {
                    console.log('Botão Registrar Teste clicado!');

                    // Mostrar confirmação antes de registrar o teste
                    createModal('Confirmar Registro de Teste', 'Você deseja registrar um novo teste?', () => {
                        // Recuperar usuário salvo
                        const selectedUserId = localStorage.getItem('selectedUserId');
                        console.log('Usuário selecionado:', selectedUserId); // Log para verificar o usuário selecionado
                        if (!selectedUserId) {
                            alert('Nenhum usuário selecionado. Por favor, selecione um usuário no popup da extensão.');
                            return;
                        }

                        const developerName = getDeveloperName();
                        const caseId = caseNumber[1];

                        // Registrar teste
                        fetch(`${API_BASE_URL}/tests`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ case_id: caseId, user_id: selectedUserId, developer_name: developerName })
                        })
                        .then(response => response.json())
                        .then(data => {
                            console.log('Teste registrado com sucesso:', data);
                            const testIdText = `#TEST_ID:${data.id}`;
                            copyToClipboard(testIdText);
                            alert('Teste registrado com sucesso!');
                        })
                        .catch(error => {
                            console.error('Erro ao registrar teste:', error);
                            alert('Erro ao registrar teste.');
                        });
                    });
                });

                // Inserir o botão "Registrar Teste" antes do link "Editar"
                editLink.parentNode.insertBefore(registerButton, editLink);

                // Adicionar botão "VER TESTES" antes do link "Editar"
                const viewTestsButton = document.createElement('a');
                viewTestsButton.innerText = '📝 Ver testes';

                viewTestsButton.addEventListener('click', () => {
                    console.log('Botão VER TESTES clicado!');

                    // Buscar e exibir testes relacionados ao caso
                    fetch(`${API_BASE_URL}/tests?case_id=${caseNumber[1]}`)
                        .then(response => response.json())
                        .then(data => {
                            if (data.tests && data.tests.length > 0) {
                                let testsContent = `
                                    <table style="width: 100%; border-collapse: collapse;">
                                        <thead>
                                            <tr>
                                                <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">ID</th>
                                                <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Usuário</th>
                                                <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Desenvolvedor</th>
                                                <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Data</th>
                                                <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Aprovado</th>
                                                <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>`;
                                data.tests.forEach(test => {
                                    const formattedDate = formatDate(test.timestamp);
                                    testsContent += `
                                        <tr id="test-item-${test.id}">
                                            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${test.id}</td>
                                            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${test.username}</td>
                                            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${test.developer_name}</td>
                                            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${formattedDate}</td>
                                            <td style="padding: 8px; border-bottom: 1px solid #ddd;">
                                                <select class="approval-status" data-test-id="${test.id}">
                                                    <option value="" ${test.approved === null ? 'selected' : ''}>Não definido</option>
                                                    <option value="1" ${test.approved === 1 ? 'selected' : ''}>Aprovado</option>
                                                    <option value="0" ${test.approved === 0 ? 'selected' : ''}>Rejeitado</option>
                                                </select>
                                            </td>
                                            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><button class="delete-test-button" data-test-id="${test.id}">Excluir</button></td>
                                        </tr>`;
                                });
                                testsContent += `
                                        </tbody>
                                    </table>`;
                                createModal('Testes Relacionados ao Caso', testsContent);
                            } else {
                                createModal('Testes Relacionados ao Caso', 'Nenhum teste encontrado para este caso.');
                            }
                        })
                        .catch(error => {
                            console.error('Erro ao buscar testes:', error);
                            createModal('Erro', 'Erro ao buscar testes.');
                        });
                });

                // Inserir o botão "VER TESTES" antes do link "Editar"
                editLink.parentNode.insertBefore(viewTestsButton, editLink);
            }
        }
    });
}

// Inicializar a extensão
initializeExtension();

// Ouvir mensagens do popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.selectedUserId) {
        console.log('Usuário selecionado recebido:', request.selectedUserId);
        localStorage.setItem('selectedUserId', request.selectedUserId);
    }
});
