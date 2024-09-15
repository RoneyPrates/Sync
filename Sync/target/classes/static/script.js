const ordens = [];
const deletedOrdens = [];
let currentEditingOrder = null;
let currentFileOrder = null;

document.addEventListener('DOMContentLoaded', () => {
    const fetchOrders = async () => {
        try {
            const response = await fetch('/ordensdecompras'); // Chama o endpoint JSON
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const orders = await response.json();
            ordens.push(...orders); // Preenche o array global de ordens
            displayOrdem(ordens, 'orders');
        } catch (error) {
            console.error('Erro ao buscar ordens:', error);
            document.getElementById('orders').innerHTML = '<p>Erro ao carregar ordens.</p>';
        }
    };

    function displayOrdem(ordens, section) {
        const ordemGrid = document.getElementById(section);
        ordemGrid.innerHTML = '';

        ordens.forEach(ordem => {
            const ordemItem = document.createElement('div');
            ordemItem.className = 'ordem-item';
            ordemItem.style.backgroundColor = getStatusColor(ordem.status);
            ordemItem.innerHTML = `
                <p><strong>Número da Ordem:</strong> ${ordem.id}</p>
                <p><strong>Data da Ordem:</strong> ${ordem.dataOrdem}</p>
                <p><strong>Valor da Ordem:</strong> ${ordem.valorOrdem}</p>
                <p><strong>Status:</strong> ${ordem.status}</p>
                <p><strong>Observação:</strong> ${ordem.observacao}</p>
                <div class="buttons">
                    ${section === 'orders' ? `<button class="btn-edit" onclick="editOrdem(${ordem.id})"><img src="editar.png" alt="Editar"></button>` : ''}
                    ${ordem.file ? `<button class="btn-invoice" onclick="viewInvoice('${ordem.file}')"><img src="notafiscal.png" alt="Nota Fiscal"></button>` : ''}
                    ${section === 'orders' ? `<button class="btn-approve" onclick="approveOrdem(${ordem.id})"><img src="aprovada.png" alt="Aprovar"></button>` : ''}
                    ${section === 'orders' ? `<button class="btn-reject" onclick="rejectOrdem(${ordem.id})"><img src="reprovada.png" alt="Reprovar"></button>` : ''}
                    ${section === 'orders' ? `<button class="btn-delete" onclick="deleteOrdem(${ordem.id})"><img src="lixeira.png" alt="Excluir"></button>` : ''}
                    ${section === 'orders' ? `<button class="btn-finalizar" onclick="finalizarOrdem(${ordem.id})"><img src="finalizado.png" alt="Finalizar"></button>` : ''}
                </div>
            `;
            ordemGrid.appendChild(ordemItem);
        });
    }

    function getStatusColor(status) {
        switch (status) {
            case 'Pendente':
                return '#FFD700'; // Amarelo Ouro
            case 'Aprovada':
                return 'green'; // Verde
            case 'Reprovada':
                return 'red'; // Vermelho
            case 'Deletada':
                return 'lightgray'; // Cinza Claro
            default:
                return 'white'; // Branco
        }
    }

    fetchOrders();
});

function editOrdem(id) {
    currentEditingOrder = ordens.find(ordem => ordem.id === id);
    if (currentEditingOrder) {
        document.getElementById('editId').value = currentEditingOrder.id;
        document.getElementById('editValue').value = currentEditingOrder.valorOrdem; // Corrigido
        document.getElementById('editDate').value = currentEditingOrder.dataOrdem;
        document.getElementById('editObservacao').value = currentEditingOrder.observacao;
        document.getElementById('editModal').style.display = 'flex';
    }
}

function closeModal() {
    document.getElementById('editModal').style.display = 'none';
}

function saveEdit() {
    const id = document.getElementById('editId').value;
    const value = parseFloat(document.getElementById('editValue').value);
    const date = document.getElementById('editDate').value;
    const observacao = document.getElementById('editObservacao').value;

    if (currentEditingOrder) {
        currentEditingOrder.valorOrdem = value;
        currentEditingOrder.dataOrdem = date;
        currentEditingOrder.observacao = observacao;

        // Atualizar a exibição
        displayOrdem(ordens, 'orders');

        // Fechar o modal
        closeModal();
    }
}

function openCreateModal() {
    document.getElementById('createModal').style.display = 'flex';
}

function closeCreateModal() {
    document.getElementById('createModal').style.display = 'none';
}

function createOrdem() {
    const value = parseFloat(document.getElementById('createValue').value);
    const date = document.getElementById('createDate').value;
    const id = ordens.length ? Math.max(...ordens.map(o => o.id)) + 1 : 1;
    const observacao = document.getElementById('createObservacao').value;

    const newOrdem = { id, valorOrdem: value, dataOrdem: date, status: 'Pendente', observacao, file: '' };
    ordens.push(newOrdem);

    // Atualizar a exibição
    displayOrdem(ordens, 'orders');

    // Fechar o modal
    closeCreateModal();
}

function viewInvoice(file) {
    window.open(file, '_blank');
}

function deleteOrdem(id) {
    if (confirm(`Você tem certeza que deseja excluir a ordem ${id}?`)) {
        const ordemIndex = ordens.findIndex(ordem => ordem.id === id);
        if (ordemIndex !== -1) {
            ordens[ordemIndex].status = 'Deletado';
            deletedOrdens.push(ordens[ordemIndex]);
            ordens.splice(ordemIndex, 1);
            displayOrdem(ordens, 'orders');
            displayOrdem(deletedOrdens, 'deleted');

            alert(`Ordem ${id} excluída`);
        }
    }
}

async function approveOrdem(id) {
    const ordem = ordens.find(ordem => ordem.id === id);
    if (ordem) {
        try {
            // Enviar uma requisição para atualizar o status no backend
            const response = await fetch(`/ordensdecompras/${id}/aprovar`, {
                method: 'PATCH', // Ou o método apropriado para sua API
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: 'Aprovada' })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Atualizar o status da ordem localmente
            ordem.status = 'Aprovada';

            // Atualizar a exibição
            displayOrdem(ordens, 'orders');
        } catch (error) {
            console.error('Erro ao aprovar a ordem:', error);
            alert('Erro ao aprovar a ordem.');
        }
    }
}

async function rejectOrdem(id) {
    const ordem = ordens.find(ordem => ordem.id === id);
    if (ordem) {
        try {
            // Enviar uma requisição para atualizar o status no backend
            const response = await fetch(`/ordensdecompras/${id}/rejeitar`, {
                method: 'PATCH', // Ou o método apropriado para sua API
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: 'Reprovada' })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Atualizar o status da ordem localmente
            ordem.status = 'Reprovada';

            // Atualizar a exibição
            displayOrdem(ordens, 'orders');
        } catch (error) {
            console.error('Erro ao rejeitar a ordem:', error);
            alert('Erro ao rejeitar a ordem.');
        }
    }
}

function openNav() {
    var sidebar = document.getElementById("mySidebar");
    sidebar.classList.toggle("open");
}

function logout() {
    window.location.href = "http://localhost:8080/login";
}

function toggleForm() {
    var formContainer = document.getElementById("formContainer");
    if (formContainer.style.display === "none" || formContainer.style.display === "") {
        formContainer.style.display = "block";
        document.querySelector(".toggle-btn").textContent = "Ocultar";
    } else {
        formContainer.style.display = "none";
        document.querySelector(".toggle-btn").textContent = "Filtros";
    }
}

function showSection(section) {
    document.getElementById('orders').style.display = section === 'orders' ? 'flex' : 'none';
    document.getElementById('deleted').style.display = section === 'deleted' ? 'flex' : 'none';
}

function openFileModal(ordem) {
    currentFileOrder = ordem;
    document.getElementById('fileOrderId').value = ordem.id;
    document.getElementById('fileModal').style.display = 'flex';
}

function closeFileModal() {
    document.getElementById('fileModal').style.display = 'none';
}

function uploadFile() {
    const fileInput = document.getElementById('fileUpload');
    if (currentFileOrder) {
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const fileUrl = URL.createObjectURL(file); // Simula o upload do arquivo
            currentFileOrder.file = fileUrl;
            currentFileOrder.status = 'Finalizado'; // Define o status como aprovado
        } else {
            // Se nenhum arquivo foi anexado, muda o status para 'Pendente'
            currentFileOrder.status = 'Aprovado';
            currentFileOrder.file = '';
        }
        closeFileModal();
        displayOrdem(ordens, 'orders');
    }
}

let currentOrderId = null;

function showPermissions() {
    currentOrderId = prompt("Digite o ID da ordem para gerenciar permissões:");
    if (currentOrderId) {
        document.getElementById('permissionsModal').style.display = 'flex';
    }
}

function closePermissionsModal() {
    document.getElementById('permissionsModal').style.display = 'none';
}

// Exibir ordens de compra ao carregar a página
displayOrdem(ordens, 'orders');
displayOrdem(deletedOrdens, 'deleted');
