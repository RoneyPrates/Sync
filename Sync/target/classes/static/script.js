const ordens = [];
const deletedOrdens = [];
const permissoes = [];
const cadastroProdutos = [];
const cadastroUsuarios = [];
const cadastroFiliais = [];
let currentEditingOrder = null;

document.addEventListener('DOMContentLoaded', () => {
    fetchOrders();
    document.getElementById('aplicarFiltros').addEventListener('click', aplicarFiltros);
});
const fetchOrders = async () => {
    try {
        const response = await fetch('/ordensdecompras');
        if (!response.ok) {
            throw new Error('Sem resposta do servidor');
        }
        const ordensBanco = await response.json();
        ordens.push(...ordensBanco);
        displayOrdens();
    } catch (error) {
        console.error('Erro ao buscar ordens:', error);
        document.getElementById('ordensBanco').innerHTML = '<p>Erro ao carregar ordens.</p>';
    }
};
function displayOrdens(filteredOrdens = ordens) {
    displayOrdem(filteredOrdens.filter(ordem => ordem.status !== 'Deletada'), 'ordensBanco');
    displayOrdem(filteredOrdens.filter(ordem => ordem.status === 'Deletada'), 'deleted');
}
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
            <p><strong>Usuário:</strong> ${ordem.nomeUsuario}</p>
            <div class="buttons">
                ${section === 'ordensBanco' ?
                (ordem.status === 'Pendente' ?
                    `<button class="btn-edit" onclick="editOrdem(${ordem.id})"><img src="editar.png" alt="Editar"></button>
                    <button class="btn-approve" onclick="approveOrdem(${ordem.id})"><img src="aprovada.png" alt="Aprovar"></button>
                    <button class="btn-reject" onclick="rejectOrdem(${ordem.id})"><img src="reprovada.png" alt="Reprovar"></button>
                    <button class="btn-produto" onclick="abrirProdutos(${ordem.id})"><img src="visualizar.png" alt="Visualizar Produtos"></button>                    
                    <button class="btn-delete" onclick="deleteOrdem(${ordem.id})"><img src="lixeira.png" alt="Excluir"></button>` : '') :
                ''
            }
                ${section === 'ordensBanco' ?
                (ordem.status === 'Aprovada' ?
                    `<button class="btn-reject" onclick="rejectOrdem(${ordem.id})"><img src="reprovada.png" alt="Reprovar"></button>
                    <button class="btn-delete" onclick="deleteOrdem(${ordem.id})"><img src="lixeira.png" alt="Excluir"></button>
                    <button class="btn-produto" onclick="abrirProdutos(${ordem.id})"><img src="visualizar.png" alt="Visualizar Produtos"></button>                                        
                    <button class="btn-finalizar" onclick="finalizarOrdem(${ordem.id})"><img src="finalizado.png" alt="Finalizar"></button>` : '') :
                ''
            }
                ${section === 'ordensBanco' ?
                (ordem.status === 'Reprovada' ?
                    `<button class="btn-edit" onclick="editOrdem(${ordem.id})"><img src="editar.png" alt="Editar"></button>
                    <button class="btn-approve" onclick="approveOrdem(${ordem.id})"><img src="aprovada.png" alt="Aprovar"></button>
                    <button class="btn-produto" onclick="abrirProdutos(${ordem.id})"><img src="visualizar.png" alt="Visualizar Produtos"></button>                    
                    <button class="btn-delete" onclick="deleteOrdem(${ordem.id})"><img src="lixeira.png" alt="Excluir"></button>` : '') :
                ''
            } 
                 ${section === 'ordensBanco' ?
                (ordem.status === 'Finalizada' ?
                    `<button class="btn-produto" onclick="abrirProdutos(${ordem.id})"><img src="visualizar.png" alt="Visualizar Produtos"></button>                    
                    <button class="btn-invoice" onclick="abrirNotaFiscal('${ordem.id}')"><img src="notafiscal.png" alt="Nota Fiscal"></button>` : '') :
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
    const newOrdem = { dataOrdem: date, observacao, status: 'Pendente', valorOrdem: value, nomeUsuario: 'admin' };
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
async function finalizarOrdem(id) {
    window.open("https://cadastro.emissornfe.sebrae.com.br/", "_blank");
    fileInput.click();
}
function abrirFiltros() {
    document.querySelector(".abrirFiltros").textContent = "Filtros";
    document.getElementById('formContainer').style.display = 'block';
}
function aplicarFiltros() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const nomeUsuario = document.getElementById('nomeUsuario').value;
    const numeroOrdem = document.getElementById('numeroOrdem').value;
    const status = document.getElementById('status').value;

    const filteredOrders = ordens.filter(ordem => {
        return (!startDate || new Date(ordem.dataOrdem) >= new Date(startDate)) &&
            (!endDate || new Date(ordem.dataOrdem) <= new Date(endDate)) &&
            (!nomeUsuario || ordem.nomeUsuario && ordem.nomeUsuario.includes(nomeUsuario)) &&
            (!numeroOrdem || ordem.id.toString().includes(numeroOrdem)) &&
            (!status || ordem.status === status);
    });
    displayOrdens(filteredOrders);
    document.getElementById('formContainer').style.display = 'none';
}
async function buscarNomeFilial(id) {
    try {
        const response = await fetch(`/api/filial/${id}`);
        if (!response.ok) {
            throw new Error('Erro ao buscar o nome da filial');
        }
        const filial = await response.json();
        const nomeFilial = filial.nome;
        document.getElementById('nomeFilial').innerText = nomeFilial;
    } catch (error) {
        console.error('Erro:', error);
        document.getElementById('nomeFilial').innerText = 'Erro ao carregar nome da filial.';
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const id = 1;
    buscarNomeFilial(id);
});
async function buscarNomeUsuario(id) {
    try {
        const response = await fetch(`/api/usuarios/${id}`);
        if (!response.ok) {
            throw new Error('Erro ao buscar o nome do Usuário');
        }
        const usuario = await response.json();
        const nomeUsuario = usuario.nome;
        document.getElementById('nomeUsuario').innerText = nomeUsuario;
    } catch (error) {
        console.error('Erro:', error);
        document.getElementById('nomeUsuario').innerText = 'Erro ao carregar nome do Usuário.';
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const id = 1;
    buscarNomeUsuario(id);
});









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
    var menu = document.getElementById("menu");
    menu.classList.toggle("open");
}
function showSection(section) {
    document.getElementById('ordensBanco').style.display = section === 'ordensBanco' ? 'flex' : 'none';
    document.getElementById('deleted').style.display = section === 'deleted' ? 'flex' : 'none';
    document.getElementById('permissoes').style.display = section === 'permissoes' ? 'flex' : 'none';
    document.getElementById('cadastroProdutos').style.display = section === 'cadastroProdutos' ? 'flex' : 'none';
    document.getElementById('cadastroUsuarios').style.display = section === 'cadastroUsuarios' ? 'flex' : 'none';
    document.getElementById('cadastroFiliais').style.display = section === 'cadastroFiliais' ? 'flex' : 'none';
}
function logout() {
    window.location.href = "http://localhost:8080/login";
}

displayOrdem(ordens, 'ordensBanco');
displayOrdem(deletedOrdens, 'deleted');
displayOrdem(permissoes,'permissoes');
displayOrdem(cadastroProdutos,'cadastroProdutos');
displayOrdem(cadastroUsuarios, 'cadastroUsuarios');
displayOrdem(cadastroFiliais,'cadastroFiliais');
