const ordens = [];
const deletedOrdens = [];
let currentEditingOrder = null;
let currentFileOrder = null;

document.addEventListener('DOMContentLoaded', () => {
    const fetchOrders = async () => {
        try {
            const response = await fetch('/ordensdecompras');
            if (!response.ok) {
                throw new Error('Sem resposta do servidor');
            }
            const orders = await response.json();
            ordens.push(...orders);
            displayOrdem(ordens.filter(ordem => ordem.status !== 'Deletada'), 'orders');
            displayOrdem(ordens.filter(ordem => ordem.status === 'Deletada'), 'deleted');
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
                ${section === 'orders' ?
                (ordem.status === 'Pendente' ?
                    `<button class="btn-edit" onclick="editOrdem(${ordem.id})"><img src="editar.png" alt="Editar"></button>
                    <button class="btn-approve" onclick="approveOrdem(${ordem.id})"><img src="aprovada.png" alt="Aprovar"></button>
                    <button class="btn-reject" onclick="rejectOrdem(${ordem.id})"><img src="reprovada.png" alt="Reprovar"></button>
                    <button class="btn-delete" onclick="deleteOrdem(${ordem.id})"><img src="lixeira.png" alt="Excluir"></button>` : '') :
                ''
            }
                ${section === 'orders' ?
                (ordem.status === 'Aprovada' ?
                    `<button class="btn-reject" onclick="rejectOrdem(${ordem.id})"><img src="reprovada.png" alt="Reprovar"></button>
                    <button class="btn-delete" onclick="deleteOrdem(${ordem.id})"><img src="lixeira.png" alt="Excluir"></button>
                    <button class="btn-finalizar" onclick="finalizarOrdem(${ordem.id})"><img src="finalizado.png" alt="Finalizar"></button>` : '') :
                ''
            }
                ${section === 'orders' ?
                (ordem.status === 'Reprovada' ?
                    `<button class="btn-edit" onclick="editOrdem(${ordem.id})"><img src="editar.png" alt="Editar"></button>
                    <button class="btn-approve" onclick="approveOrdem(${ordem.id})"><img src="aprovada.png" alt="Aprovar"></button>
                    <button class="btn-delete" onclick="deleteOrdem(${ordem.id})"><img src="lixeira.png" alt="Excluir"></button>` : '') :
                ''
            } 
                 ${section === 'orders' ?
                (ordem.status === 'Finalizada' ?
                    `<button class="btn-invoice" onclick="abrirNotaFiscal('${ordem.id}')"><img src="notafiscal.png" alt="Nota Fiscal"></button>` : '') :
                ''
            }                          
            </div>
        `;
            ordemGrid.appendChild(ordemItem);
        });
    }

    function getStatusColor(status) {
        switch (status) {
            case 'Pendente':
                return '#FFD700';
            case 'Aprovada':
                return 'green';
            case 'Reprovada':
                return 'red';
            case 'Deletada':
                return 'lightgray';
            case 'Finalizada':
                return 'blue'
            default:
                return 'white';
        }
    }

    fetchOrders();
});

async function createOrdem() {
    const date = document.getElementById('createDate').value;
    const observacao = document.getElementById('createObservacao').value;
    const value = parseFloat(document.getElementById('createValue').value);
    if (isNaN(value) || value <= 0) {
        alert('Por favor, preencha um valor válido.');
        return;
    }
    if (!date) {
        alert('Por favor, preencha a data.');
        return;
    }
    const newOrdem = { dataOrdem: date, observacao, status: 'Pendente', valorOrdem: value };
    console.log('Enviando ordem:', newOrdem);
    const response = await fetch('/ordensdecompras', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newOrdem)
    });
    if (!response.ok) {
        alert('Erro ao criar a ordem. Por favor, tente novamente.');
        return;
    }
    const createdOrder = await response.json();
    ordens.push(createdOrder);
    alert('Ordem criada com sucesso! ID: ' + createdOrder.id);
    location.reload();
}
function openCreateModal() {
    document.getElementById('createModal').style.display = 'flex';
}
function closeCreateModal() {
    document.getElementById('createModal').style.display = 'none';
}

function saveEdit() {
    const date = document.getElementById('editDate').value;
    const observacao = document.getElementById('editObservacao').value;
    const value = parseFloat(document.getElementById('editValue').value);
    if (currentEditingOrder) {
        currentEditingOrder.dataOrdem = date;
        currentEditingOrder.observacao = observacao;
        currentEditingOrder.valorOrdem = value;
        fetch(`/ordensdecompras/${currentEditingOrder.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                valorOrdem: value,
                dataOrdem: date,
                observacao: observacao
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao atualizar a ordem');
                }
                return response.json();
            })
            .then(updatedOrder => {
                const index = ordens.findIndex(ordem => ordem.id === updatedOrder.id);
                if (index !== -1) {
                    ordens[index] = updatedOrder;
                }
                alert('Ordem editada com sucesso!');
                location.reload();
            });
    }
}
function editOrdem(id) {
    currentEditingOrder = ordens.find(ordem => ordem.id === id);
    if (currentEditingOrder) {
        document.getElementById('editDate').value = currentEditingOrder.dataOrdem;
        document.getElementById('editObservacao').value = currentEditingOrder.observacao;
        document.getElementById('editValue').value = currentEditingOrder.valorOrdem;
        document.getElementById('editModal').style.display = 'flex';
    }
}
function closeModal() {
    document.getElementById('editModal').style.display = 'none';
}
async function approveOrdem(id) {
    const ordem = ordens.find(ordem => ordem.id === id);
    if (ordem) {
        const response = await fetch(`/ordensdecompras/${id}/aprovar`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: 'Aprovada' })
        });

        if (!response.ok) {
            throw new Error('Sem resposta do servidor');
        }
        ordem.status = 'Aprovada';
        alert('Ordem aprovada com sucesso!');
        location.reload();
    }
}

async function rejectOrdem(id) {
    const ordem = ordens.find(ordem => ordem.id === id);
    if (ordem) {
        const response = await fetch(`/ordensdecompras/${id}/reprovar`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: 'Reprovada' })
        });
        if (!response.ok) {
            throw new Error('Sem resposta do servidor');
        }
        ordem.status = 'Reprovada';
        alert('Ordem reprovada com sucesso!');
        location.reload();
    }
}
async function deleteOrdem(id) {
    if (confirm(`Você tem certeza que deseja marcar a ordem ${id} como deletada?`)) {
        const ordem = ordens.find(ordem => ordem.id === id);
        if (ordem) {
            const response = await fetch(`/ordensdecompras/${id}/deletar`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: 'Deletada' })
            });
            if (!response.ok) {
                throw new Error('Erro ao atualizar a ordem no servidor');
            }
            ordem.status = 'Deletada';
            alert('Ordem deletada com sucesso!');
            location.reload();
        }
    }
}
function openFileUpload() {
    const fileInput = document.getElementById('fileUpload');
    fileInput.click();
}
async function finalizarOrdem(id) {
    const ordem = ordens.find(ordem => ordem.id === id);
    if (ordem) {
        openFileUpload();
        const fileInput = document.getElementById('fileUpload');
        fileInput.onchange = async () => {
            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];
                const validExtensions = ['.pdf', '.png', '.jpg', '.jpeg'];
                const fileExtension = file.name.slice(((file.name.lastIndexOf(".") - 1) >>> 0) + 2).toLowerCase();
                if (validExtensions.includes(`.${fileExtension}`)) {
                    const response = await fetch(`/ordensdecompras/${id}/finalizar`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ status: 'Finalizada' })
                    });
                    if (!response.ok) {
                        throw new Error('Erro ao atualizar a ordem no servidor');
                    }
                    ordem.status = 'Finalizada';
                    alert('Ordem finalizada com sucesso!');
                    location.reload();
                } else {
                    alert('Você deve adicionar um arquivo PDF, PNG ou JPG válido.');
                }
            }
        };
    }
}


















async function abrirNotaFiscal(ordemId) {
    try {
        const response = await fetch(`/abrirNotaFiscal?id=${ordemId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/octet-stream'
            }
        });
        if (!response.ok) {
            throw new Error('Erro ao buscar nota fiscal');
        }
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
        setTimeout(() => {
            window.URL.revokeObjectURL(url);
        }, 100);

    } catch (error) {
        alert(error.message);
    }
}
function openNav() {
    var sidebar = document.getElementById("mySidebar");
    sidebar.classList.toggle("open");
}

function toggleForm() {
    var formContainer = document.getElementById("formContainer");
    if (formContainer.style.display === "none" || formContainer.style.display === "") {
        formContainer.style.display = "block";
        document.querySelector(".toggle-btn").textContent = "Ocultar";
        updateOrders();
    } else {
        formContainer.style.display = "none";
        document.querySelector(".toggle-btn").textContent = "Filtros";
    }
}

function showSection(section) {
    document.getElementById('orders').style.display = section === 'orders' ? 'flex' : 'none';
    document.getElementById('deleted').style.display = section === 'deleted' ? 'flex' : 'none';
}

function showPermissions() {
    const currentOrderId = prompt("Digite o tipo do usuário para gerenciar permissões:");
    if (currentOrderId) {
        let permissions = [];
        let checkboxesHtml = '';

        if (currentOrderId === 'usuario') {
            permissions = [
                { name: 'Criar ordem', enabled: true, checked: true },
                { name: 'Visualizar nota fiscal', enabled: true, checked: true },
                { name: 'Editar ordem', enabled: false, checked: false },
                { name: 'Aprovar ordem', enabled: false, checked: false },
                { name: 'Reprovar ordem', enabled: false, checked: false },
                { name: 'Deletar ordem', enabled: false, checked: false }
            ];
        } else if (currentOrderId === 'admin') {
            permissions = [
                { name: 'Criar ordem', enabled: true, checked: true },
                { name: 'Editar ordem', enabled: true, checked: true },
                { name: 'Visualizar nota fiscal', enabled: true, checked: true },
                { name: 'Aprovar ordem', enabled: true, checked: true },
                { name: 'Reprovar ordem', enabled: true, checked: true },
                { name: 'Deletar ordem', enabled: true, checked: true }
            ];
        } else {
            permissions = [{ name: 'Tipo de usuário desconhecido', enabled: false, checked: false }];
        }

        permissions.forEach(permission => {
            checkboxesHtml += `
                <div class="permission-item">
                    <input type="checkbox" id="perm-${permission.name.replace(/\s+/g, '-')}" ${permission.enabled ? '' : 'disabled'} ${permission.checked ? 'checked' : ''}>
                    <label for="perm-${permission.name.replace(/\s+/g, '-')}" contenteditable="${currentOrderId === 'admin'}">${permission.name}</label>
                </div>
            `;
        });

        const permissionsModal = document.getElementById('telapermissao');
        permissionsModal.innerHTML = `
            <div class="modal-content">
                <span class="close" onclick="closePermissionsModal()">&times;</span>
                <h2>Permissões do usuário ${currentOrderId}</h2>
                <div class="permissions-list">${checkboxesHtml}</div>
                <button class="save-button" onclick="savePermissions()">Salvar</button>
            </div>
        `;
        permissionsModal.style.display = 'flex';
    }
}

function closePermissionsModal() {
    document.getElementById('telapermissao').style.display = 'none';
}

function savePermissions() {
    const checkboxes = document.querySelectorAll('#telapermissao .permission-item input[type="checkbox"]');
    const permissions = [];

    checkboxes.forEach(checkbox => {
        permissions.push({
            name: checkbox.nextElementSibling.textContent,
            checked: checkbox.checked
        });
    });

    console.log('Permissões salvas:', permissions);

    closePermissionsModal();
}
function logout() {
    window.location.href = "http://localhost:8080/login";
}

displayOrdem(ordens, 'orders');
displayOrdem(deletedOrdens, 'deleted');
