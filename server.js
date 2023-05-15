const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const packageDef = protoLoader.loadSync('todo.proto', {});
const grpcObj = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObj.todoPackage;

const server = new grpc.Server();
server.bind("0.0.0.0:4000", grpc.ServerCredentials.createInsecure());
server.addService(todoPackage.Todo.service, {
    "createTodo": createTodo,
    "readTodos": readTodos,
    "readTodosStream": readTodosStream
});
server.start();

const todos = [];
function createTodo (call, callback) {
    const todoItem = {
        ...call.request,
        "id": todos.length + 1,
    };
    todos.push(todoItem);
    callback(null, todoItem);
}
function readTodos (call, callback) {
    callback(null, {"items": todos});
}
function readTodosStream (call, callback) {
    todos.forEach(t => call.write(t));
    call.end();
}
