function login(){

const username =
document.getElementById("username").value;

const password =
document.getElementById("password").value;

const message =
document.getElementById("message");

if(
username === "admin" &&
password === "admin123"
){

message.style.color = "lime";
message.innerHTML = "Login Successful";

setTimeout(()=>{

window.location.href =
"dashboard.html";

},1000);

}
else{

message.style.color = "red";
message.innerHTML =
"Invalid Username or Password";

}

}