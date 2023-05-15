const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const packageDef = protoLoader.loadSync('todo.proto', {});
const grpcObj = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObj.todoPackage;

const text = process.argv[2];

const client = new todoPackage.Todo("localhost:4000", grpc.credentials.createInsecure());

client.createTodo({
    "id": -1,
    text
}, (err, response) => {
    console.log("Recieved from server: " + JSON.stringify(response));
});

client.readTodos({}, (err, response) => {
    console.log("Recieved from server: " + JSON.stringify(response));
});

const call = client.readTodosStream();
call.on("data", item => {
    console.log('received data from server: ' + JSON.stringify(item));
});

call.on("end", e => console.log('server done!'));