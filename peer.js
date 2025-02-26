const net = require('net');

// Porta e lista de peers conhecidos
const PORT = process.argv[2] || 4000;
const PEERS = process.argv.slice(3); // Ex: ['localhost:4001', 'localhost:4002']

// Lista para armazenar conexões ativas
const connections = [];

// Servidor para aceitar conexões
const server = net.createServer((socket) => {
  console.log('Novo peer conectado:', socket.remoteAddress + ':' + socket.remotePort);
  
  // Quando receber dados, mostrar no console
  socket.on('data', (data) => {
    console.log(`Mensagem recebida: ${data.toString().trim()}`);
  });

  // Adicionar socket na lista de conexões
  connections.push(socket);
});

// Iniciar o servidor
server.listen(PORT, () => {
  console.log(`Peer escutando na porta ${PORT}`);
});

// Conectar a peers conhecidos
PEERS.forEach((peer) => {
  const [host, port] = peer.split(':');
  const socket = net.connect(port, host, () => {
    console.log(`Conectado ao peer ${host}:${port}`);
    connections.push(socket);
  });

  socket.on('data', (data) => {
    console.log(`Mensagem recebida de ${host}:${port} => ${data.toString().trim()}`);
  });
});

// Exemplo de envio de mensagem para todos
process.stdin.on('data', (data) => {
  connections.forEach((conn) => {
    conn.write(data);
  });
});