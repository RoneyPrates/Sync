let ordens = [];
const deletedOrdens = [];
let currentEditingOrder = null;
let produtosSelecionados = [];

document.addEventListener('DOMContentLoaded', () => {
    const usuarioId = sessionStorage.getItem('usuarioId');
    const usuarioTipo = sessionStorage.getItem('usuarioTipo');

    if (!usuarioId || !usuarioTipo) {
        console.error("Erro: usuarioId ou usuarioTipo não encontrado no sessionStorage");
        window.location.href = "/login";
    } else {
        console.log("Usuário ID e Tipo recuperados do sessionStorage:", usuarioId, usuarioTipo);
    }

    fetchOrders(usuarioId, usuarioTipo);
    document.getElementById('aplicarFiltros').addEventListener('click', aplicarFiltros);
});

const fetchOrders = async (usuarioId, usuarioTipo) => {

    const ordemGrid = document.getElementById('ordensBanco');

    const numSkeletons = 5;

    let skeletonsHTML = '';
    for (let i = 0; i < numSkeletons; i++) {
        skeletonsHTML += `
            <div class="skeleton-container">
                <div class="skeleton skeleton-title"></div>
                <div class="skeleton skeleton-line"></div>
                <div class="skeleton skeleton-line"></div>
                <div class="skeleton skeleton-line short"></div>
            </div>
        `;
    }


    ordemGrid.innerHTML = skeletonsHTML;
    try {
        const response = await fetch('/ordensdecompras');
        if (!response.ok) {
            throw new Error('Sem resposta do servidor');
        }

        const ordensBanco = await response.json();
        console.log('Ordens recebidas do servidor:', ordensBanco);
        ordensBanco.forEach(ordem => {
            console.log(`Ordem ID ${ordem.id}: Filial ID da ordem ${ordem.filial?.id}`);
        });

        let ordensFiltradas = ordensBanco;

        if (usuarioTipo === 'admin') {
            ordensFiltradas = ordensBanco;
        } else if (usuarioTipo === 'user') {
            ordensFiltradas = ordensBanco.filter(ordem => {
                console.log('Ordem:', ordem);
                console.log('ID do usuário da ordem:', ordem.usuario?.id);
                return Number(ordem.usuario?.id) === Number(usuarioId);
            });
        } else if (usuarioTipo === 'gerente') {
            const filialIdGerente = sessionStorage.getItem('filialId');
            console.log('ID da filial do gerente:', filialIdGerente);

            if (filialIdGerente) {
                ordensFiltradas = ordensBanco.filter(ordem => Number(ordem.filial?.id) === Number(filialIdGerente));
            } else {
                console.error('Filial do gerente não encontrada.');
                ordensFiltradas = [];
            }
        }


        console.log('Ordens filtradas:', ordensFiltradas);

        ordens = ordensFiltradas;
        displayOrdens(ordensFiltradas);
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
        ordemItem.style.backgroundColor = '#e0f7fa';
        ordemItem.style.color = 'black';
        const statusColor = getStatusColor(ordem.status);
        ordemItem.style.border = `5px solid ${statusColor}`;
        ordemItem.style.borderRadius = '10px';
        ordemItem.innerHTML = `
            <p><strong>Número da Ordem:</strong> ${ordem.id}</p>
            <p><strong>Data da Ordem:</strong> ${ordem.dataOrdem}</p>
            <p><strong>Valor da Ordem:</strong> ${ordem.valorOrdem}</p>
            <p><strong>Status:</strong> <span style="color: ${statusColor};">${ordem.status}</span></p>
            <p><strong>Observação:</strong> ${ordem.observacao}</p>
            <p><strong>Usuário:</strong> ${ordem.usuario.nome}</p>
            <p><strong>Filial:</strong> ${ordem.filial.nome}</p>
            <div class="buttons">
                ${section === 'ordensBanco' ?
            (ordem.status === 'Pendente' ?
                `<button class="btn-edit" onclick="editOrdem(${ordem.id})"><img src="editar.png" alt="Editar"></button>
                <button class="btn-approve" onclick="compraAprovada(${ordem.id})"><img src="compraaprovada.png" alt="Aprovar"></button>
                <button class="btn-reject" onclick="rejectOrdem(${ordem.id})"><img src="reprovada.png" alt="Reprovar"></button>
                <button class="btn-produto" onclick="abrirProdutos(${ordem.id})"><img src="visualizar.png" alt="Visualizar Produtos"></button>
                <button class="btn-delete" onclick="deleteOrdem(${ordem.id})"><img src="lixeira.png" alt="Excluir"></button>` : '') : ''
        }
                ${section === 'ordensBanco' ?
            (ordem.status === 'Compra Aprovada' ?
                `<button class="btn-approve" onclick="compraEfetuada(${ordem.id})"><img src="compraefetuada.png" alt="Aprovar"></button>
                <button class="btn-produto" onclick="abrirProdutos(${ordem.id})"><img src="visualizar.png" alt="Visualizar Produtos"></button>` : '') : ''
        }
                ${section === 'ordensBanco' ?
            (ordem.status === 'Compra Efetuada' ?
                `<button class="btn-produto" onclick="abrirProdutos(${ordem.id})"><img src="visualizar.png" alt="Visualizar Produtos"></button>
                <button class="btn-invoice" onclick="abrirNotaFiscal('${ordem.id}')"><img src="notafiscal.png" alt="Nota Fiscal"></button>
                <button class="btn-finalizar" onclick="finalizarOrdem(${ordem.id})"><img src="finalizado.png" alt="Finalizar"></button>` : '') : ''
        }                
                ${section === 'ordensBanco' ?
            (ordem.status === 'Reprovada' ?
                `<button class="btn-produto" onclick="abrirProdutos(${ordem.id})"><img src="visualizar.png" alt="Visualizar Produtos"></button>` : '') : ''
        } 
                ${section === 'ordensBanco' ?
            (ordem.status === 'Finalizada' ?
                `<button class="btn-produto" onclick="abrirProdutos(${ordem.id})"><img src="visualizar.png" alt="Visualizar Produtos"></button>
                <button class="btn-invoice" onclick="abrirNotaFiscal('${ordem.id}')"><img src="notafiscal.png" alt="Nota Fiscal"></button>` : '') : ''
        }                          
            </div>
            
        `;

        ordemGrid.appendChild(ordemItem);
    });

}

function getStatusColor(status) {
    switch (status) {
        case 'Pendente':
            return '#FFC107';
        case 'Compra Aprovada':
            return '#4CAF50';
        case 'Compra Efetuada':
            return '#388E3C';
        case 'Reprovada':
            return '#D32F2F';
        case 'Deletada':
            return '#9E9E9E';
        case 'Finalizada':
            return '#1976D2';
    }
}

function getProdutosSelecionados() {
    return produtosSelecionados.map(produto => ({
        produtoId: produto.produto_id,
        quantidade: produto.quantidade,
        valorUnitario: produto.valor_unitario,
        valorTotal: produto.valor_total
    }));
}

async function createOrdem() {
    const date = document.getElementById('createDate').value;
    const observacao = document.getElementById('createObservacao').value;

    const nomeUsuario = sessionStorage.getItem('nomeUsuario');
    const filialId = sessionStorage.getItem('filialId');

    if (!date || !nomeUsuario || !filialId) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    const valorTotal = produtosSelecionados.reduce((total, produto) => total + produto.valor_total, 0);
    console.log("Valor total calculado:", valorTotal);

    const valorOrdem = valorTotal > 0 ? valorTotal : 0;

    const newOrdem = {
        dataOrdem: date,
        observacao: observacao,
        status: 'Pendente',
        valorOrdem: valorOrdem,
        nomeUsuario: nomeUsuario,
        usuario: { id: sessionStorage.getItem('usuarioId') },
        filial: { id: filialId }
    };

    try {
        const responseOrdem = await fetch('/ordensdecompras', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newOrdem)
        });

        if (!responseOrdem.ok) {
            const errorData = await responseOrdem.json();
            throw new Error(errorData.message || 'Erro ao criar a ordem');
        }

        const ordemCriada = await responseOrdem.json();

        if (produtosSelecionados.length > 0) {
            const produtos = getProdutosSelecionados();
            const responseProdutos = await fetch(`/ordensdecompras/${ordemCriada.id}/produtos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(produtos)  // Enviando os produtos corretamente
            });

            if (!responseProdutos.ok) {
                const errorData = await responseProdutos.json();
                throw new Error(errorData.message || 'Erro ao adicionar produtos na ordem');
            }
        }

        alert('Ordem criada com sucesso!');
        location.reload();
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao criar a ordem: ' + error.message);
    }
}

function openCreateModal() {
    document.getElementById('createModal').style.display = 'flex';
}

function closeCreateModal() {
    document.getElementById('createModal').style.display = 'none';
    document.getElementById('produtoModal').style.display = 'none';
}

function abrirModalProduto() {
    document.getElementById('produtoModal').style.display = 'flex';
    carregarProdutos();
}

async function carregarProdutos(ordemId) {
    try {
        const response = await fetch('/api/produtos');
        if (!response.ok) {
            throw new Error('Erro ao carregar os produtos');
        }

        const produtos = await response.json();
        console.log('Produtos recebidos:', produtos);

        const ordem = ordens.find(o => o.id === ordemId);
        const produtosSelecionados = ordem ? ordem.produtos : [];

        const produtoList = document.getElementById('produtoList').getElementsByTagName('tbody')[0];
        produtoList.innerHTML = '';

        if (Array.isArray(produtos)) {
            const produtosAtivos = produtos.filter(produto => produto.ativo);
            console.log('Produtos Ativos:', produtosAtivos);

            if (produtosAtivos.length > 0) {
                produtosAtivos.forEach(produto => {
                    const produtoNaOrdem = produtosSelecionados.find(p => p.produto_id === produto.id);
                    const quantidade = produtoNaOrdem ? produtoNaOrdem.quantidade : 1;
                    const preco = produtoNaOrdem ? produtoNaOrdem.valor_unitario : produto.preco || 0;

                    const row = produtoList.insertRow();
                    row.innerHTML = `
    <td class="campos">${produto.nome}</td>
    <td>
        <div class="campos">
            <label for="quantidade_${produto.id}">Quantidade:</label>
            <input type="number" id="quantidade_${produto.id}" min="1" value="${quantidade}">
            <label for="preco_${produto.id}">Preço:</label>
            <input type="number" id="preco_${produto.id}" min="0" step="0.01" value="${preco}">
            <button type="button" id="adicionarProduto_${produto.id}" onclick="adicionarOuRemoverProduto(${produto.id}, '${produto.nome}')">
                ${produtoNaOrdem ? 'Remover' : 'Adicionar'}
            </button>
                            </div>
                        </td>
                    `;
                });
            } else {
                console.log('Nenhum produto ativo encontrado.');
            }
        } else {
            console.error('A estrutura dos dados não é um array:', produtos);
        }

        const produtoListDiv = document.getElementById('produtoListDiv');
        if (produtoListDiv) {
            produtoListDiv.style.display = 'block';
        } else {
            console.error('Elemento produtoListDiv não encontrado.');
        }

    } catch (error) {
        console.error('Erro ao carregar os produtos:', error);
        alert('Erro ao carregar produtos: ' + error.message);
    }
}

function adicionarOuRemoverProduto(id, nome) {
    const quantidade = parseFloat(document.getElementById(`quantidade_${id}`).value);
    const preco = parseFloat(document.getElementById(`preco_${id}`).value);

    console.log('Preço:', preco);
    console.log('Quantidade:', quantidade);

    if (isNaN(preco) || preco <= 0 || isNaN(quantidade) || quantidade <= 0) {
        alert('Por favor, insira valores válidos para preço e quantidade.');
        return;
    }

    const produtoIndex = produtosSelecionados.findIndex(produto => produto.produto_id === id);

    if (produtoIndex === -1) {
        const produtoSelecionado = {
            produto_id: id,
            nome,
            quantidade,
            valor_unitario: preco,
            valor_total: preco * quantidade
        };
        produtosSelecionados.push(produtoSelecionado);
    } else {
        produtosSelecionados[produtoIndex].quantidade = quantidade;
        produtosSelecionados[produtoIndex].valor_total = preco * quantidade;
    }

    console.log('Produtos Selecionados após a alteração:', produtosSelecionados);

    atualizarValorTotal();

    const botao = document.getElementById(`adicionarProduto_${id}`);
    if (produtoIndex === -1) {
        botao.innerText = 'Remover';
    } else {
        botao.innerText = 'Adicionar';
    }

    document.getElementById(`quantidade_${id}`).value = quantidade;
    document.getElementById(`preco_${id}`).value = preco;
}

function atualizarValorTotal() {
    let valorTotal = produtosSelecionados.reduce((acc, produto) => acc + produto.valor_total, 0);
    document.getElementById('createValue').value = valorTotal.toFixed(2);
}

function inicializarModais() {
    document.getElementById('produtoModal').style.display = 'none';
    document.getElementById('produtoModalEdicao').style.display = 'none';
}
window.onload = inicializarModais;

async function carregarProdutosEdicao(ordemId) {
    try {
        const ordem = ordens.find(o => o.id === ordemId);
        if (!ordem) {
            console.error('Ordem não encontrada.');
            return;
        }

        const response = await fetch('/ordensdecompras/${id}/produtos');
        if (!response.ok) {
            throw new Error('Erro ao carregar os produtos');
        }

        const produtos = await response.json();
        console.log('Produtos recebidos:', produtos);

        const produtosSelecionados = ordem.produtos || [];

        const produtoList = document.getElementById('produtoList').getElementsByTagName('tbody')[0];
        produtoList.innerHTML = '';

        if (Array.isArray(produtos)) {
            const produtosAtivos = produtos.filter(produto => produto.ativo);
            console.log('Produtos Ativos:', produtosAtivos);

            if (produtosAtivos.length > 0) {
                produtosAtivos.forEach(produto => {
                    const produtoNaOrdem = produtosSelecionados.find(p => p.produto_id === produto.id);
                    const quantidade = produtoNaOrdem ? produtoNaOrdem.quantidade : 1;
                    const preco = produtoNaOrdem ? produtoNaOrdem.valor_unitario : produto.preco || 0;

                    const row = produtoList.insertRow();
                    row.innerHTML = `
                        <td class="campos">${produto.nome}</td>
                        <td>
                            <div class="campos">
                                <label for="quantidade_${produto.id}">Quantidade:</label>
                                <input type="number" id="quantidade_${produto.id}" min="1" value="${quantidade}">
                                <label for="preco_${produto.id}">Preço:</label>
                                <input type="number" id="preco_${produto.id}" min="0" step="0.01" value="${preco}">
                                <button type="button" id="adicionarProduto_${produto.id}" onclick="adicionarOuRemoverProduto(${produto.id}, '${produto.nome}')">
                                    ${produtoNaOrdem ? 'Remover' : 'Adicionar'}
                                </button>
                            </div>
                        </td>
                    `;
                });
            } else {
                console.log('Nenhum produto ativo encontrado.');
            }
        } else {
            console.error('A estrutura dos dados não é um array:', produtos);
        }

        const produtoListDiv = document.getElementById('produtoListDiv');
        if (produtoListDiv) {
            produtoListDiv.style.display = 'block';
        } else {
            console.error('Elemento produtoListDiv não encontrado.');
        }

    } catch (error) {
        console.error('Erro ao carregar os produtos:', error);
        alert('Erro ao carregar produtos: ' + error.message);
    }
}

function editarOrdem(id) {
    currentEditingOrder = ordens.find(ordem => Number(ordem.id) === Number(id));

    if (currentEditingOrder) {
        document.getElementById('editDate').value = currentEditingOrder.dataOrdem;
        document.getElementById('editObservacao').value = currentEditingOrder.observacao;
        document.getElementById('editValue').value = currentEditingOrder.valorOrdem;
        document.getElementById('editModal').style.display = 'flex';
    } else {
        console.log('Ordem não encontrada');
        alert('Ordem não encontrada');
    }
}

async function saveEdit() {
    const date = document.getElementById('editDate').value;
    const observacao = document.getElementById('editObservacao').value;
    const valorTotal = parseFloat(document.getElementById('editValue').value);

    if (!date || !observacao || !valorTotal) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    const updatedOrdem = {
        dataOrdem: date,
        observacao: observacao,
        valorOrdem: valorTotal
    };

    try {
        const response = await fetch(`/ordensdecompras/${currentEditingOrder.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedOrdem)
        });

        if (!response.ok) {
            throw new Error('Erro ao editar a ordem');
        }

        const ordemAtualizada = await response.json();

        const index = ordens.findIndex(ordem => ordem.id === ordemAtualizada.id);
        if (index !== -1) {
            ordens[index] = ordemAtualizada;
        }

        alert('Ordem editada com sucesso!');
        location.reload();
    } catch (error) {
        console.error('Erro ao salvar a edição:', error);
        alert('Erro ao salvar a edição da ordem: ' + error.message);
    }
}
function abrirModalProdutoEdicao() {
    document.getElementById('produtoModal').style.display = 'flex';
    carregarProdutosEdicao();
}
function closeModal() {
    document.getElementById('editModal').style.display = 'none';
}

async function compraAprovada(id) {
    const ordem = ordens.find(ordem => ordem.id === id);
    if (ordem) {
        const response = await fetch(`/ordensdecompras/${id}/aprovarcompra`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: 'Compra Aprovada' })
        });

        if (!response.ok) {
            throw new Error('Sem resposta do servidor');
        }
        ordem.status = 'Compra Aprovada';
        alert('Ordem aprovada com sucesso!');
        location.reload();
    }
}
async function compraEfetuada(id) {
    const pdfFile = await solicitarPdf();
    if (!pdfFile || pdfFile.type !== 'application/pdf') {
        alert('Por favor, envie um arquivo PDF antes de completar a compra.');
        return;
    }

    const formData = new FormData();
    formData.append('pdfFile', pdfFile);

    const pdfResponse = await fetch('/uploadPdf', {
        method: 'POST',
        body: formData
    });

    if (!pdfResponse.ok) {
        alert('Erro ao enviar o PDF. Tente novamente.');
        return;
    }

    const ordem = ordens.find(ordem => ordem.id === id);
    if (ordem) {
        const response = await fetch(`/ordensdecompras/${id}/efetuarcompra`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: 'Compra Efetuada' })
        });

        if (!response.ok) {
            throw new Error('Sem resposta do servidor');
        }

        ordem.status = 'Compra Efetuada';
        alert('Ordem aprovada com sucesso!');
        location.reload();
    }
}
function solicitarPdf() {
    return new Promise((resolve, reject) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.pdf';

        input.onchange = () => {
            const file = input.files[0];
            resolve(file);
        };
        input.click();
    });
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
    const ordem = ordens.find(ordem => ordem.id === id);
    if (ordem) {
        const response = await fetch(`/ordensdecompras/${id}/finalizar`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: 'Finalizada' })
        });
        if (!response.ok) {
            throw new Error('Sem resposta do servidor');
        }
        ordem.status = 'Finalizada';
        alert('Ordem finalizada com sucesso!');
    }
}
function abrirNotaFiscal(id) {
    window.open(`/notasfiscais/ordem/${id}/baixar`, '_blank');
}
function abrirProdutos(ordemId) {
    fetch(`/ordensdecompras/${ordemId}/produtos`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao buscar produtos da ordem");
            }
            return response.json();
        })
        .then(ordem => {
            console.log("Dados recebidos da API:", ordem);
            const produtosContainer = document.getElementById('produtosContainer');
            const tabelaProdutos = document.getElementById('produtosTabela');
            const alertaSemProdutos = document.getElementById('alertaSemProdutos');
            produtosContainer.style.display = 'block';
            if (ordem && ordem.produtos && ordem.produtos.length > 0) {
                let produtosList = '';
                ordem.produtos.forEach(produto => {
                    produtosList += `
                        <tr>
                            <td>${produto.produto.nome}</td>
                            <td>${produto.quantidade}</td>
                            <td>${produto.valorUnitario}</td>
                            <td>${produto.valorTotal}</td>
                        </tr>
                    `;
                });

                tabelaProdutos.innerHTML = produtosList;
                alertaSemProdutos.style.display = 'none';
                tabelaProdutos.style.display = 'table';
            } else {
                tabelaProdutos.style.display = 'none';
                alertaSemProdutos.style.display = 'block';
            }
        })
        .catch(error => {
            console.error("Erro ao obter produtos:", error);
            alert("Houve um erro ao carregar os produtos.");
        });
}

function fecharProdutos() {
    const produtosContainer = document.getElementById('produtosContainer');
    produtosContainer.style.display = 'none';
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

async function buscarNomeFilial(idFilial) {
    try {
        const response = await fetch(`/api/filial/${idFilial}`);
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

async function buscarNomeUsuario(usuarioId) {
    try {
        const response = await fetch(`/api/usuarios/${usuarioId}`);
        if (!response.ok) {
            throw new Error('Erro ao buscar o nome do Usuário');
        }
        const usuario = await response.json();
        console.log('Usuário encontrado:', usuario);

        const nomeUsuario = usuario.nome;
        const idFilial = usuario.filial?.id;

        document.getElementById('nomeUsuario').innerText = nomeUsuario;

        if (idFilial) {
            await buscarNomeFilial(idFilial);
        } else {
            document.getElementById('nomeFilial').innerText = 'Nenhuma filial associada.';
        }
        return { nomeUsuario, idFilial };
    } catch (error) {
        console.error('Erro:', error);
        document.getElementById('nomeUsuario').innerText = 'Erro ao carregar nome do Usuário.';
        document.getElementById('nomeFilial').innerText = 'Erro ao carregar nome da filial.';
        return null;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const usuarioId = sessionStorage.getItem('usuarioId');

    if (usuarioId) {
        console.log('Usuário ID recuperado do sessionStorage:', usuarioId);
        buscarNomeUsuario(usuarioId);
    } else {
        console.error('Usuário não logado');
        document.getElementById('nomeUsuario').innerText = 'Usuário não logado.';
        document.getElementById('nomeFilial').innerText = 'Nenhuma filial associada.';
    }
});

function openNav() {
    var menu = document.getElementById("menu");
    menu.classList.toggle("open");
}
function showSection(section) {
    document.getElementById('ordensBanco').style.display = section === 'ordensBanco' ? 'flex' : 'none';
    document.getElementById('deleted').style.display = section === 'deleted' ? 'flex' : 'none';
}
function logout() {
    sessionStorage.removeItem("usuarioId");
    window.location.href = "/login";
}
function cadastroProdutos() {
    window.location.href = "/cadastroProdutos";
}
function cadastroUsuarios() {
    window.location.href = "/cadastroUsuarios";
}
function cadastroFiliais() {
    window.location.href = "/cadastroFiliais";
}
displayOrdem(ordens, 'ordensBanco');
displayOrdem(deletedOrdens, 'deleted');
