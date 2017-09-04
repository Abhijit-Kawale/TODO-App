console.log("Is Script File Loading");
const RESPONSE_DONE = 4;
const STATUS_OK = 200;
const TODOS_LIST_ID = "todos_list_div";
const TODOS_LIST_ACTIVE = "todos_list_active";
const TODOS_LIST_COMPLETE = "todos_list_complete";
const TODOS_LIST_DELETE = "todos_list_delete";
const NEW_TODO_INPUT_ID = "new_todo_input";

// IF you want to run a function everytime the page loads
// window.onload OR document.onload
// HW : Differences : Subtle difference when this method is called
// window.onload - more widely supported
//
window.onload = getTodosAJAX();

// addTodos
// id = "todos_list_div"
// todos_data_json =
// parent = div
function addTodoElements(id, todos_data_json){

    var todos = JSON.parse(todos_data_json);

    var parent = document.getElementById(id);
    // HW : Figure out "encouraged" view of doing this
    //parent.innerHTML = "";

    if (parent){

        // todos { id : {todo object}, id : {todo:object} ..}
        var active_list = document.getElementById(TODOS_LIST_ACTIVE);
        active_list.innerHTML = "";
        if(active_list){
            Object.keys(todos).forEach(
                function(key){
                    if(todos[key].status=="ACTIVE"){
                        var todo_element = createTodoElement(key,todos[key]);
                        active_list.appendChild(todo_element);
                    }
                }
            )
        }

        var complete_list = document.getElementById(TODOS_LIST_COMPLETE);
        complete_list.innerHTML = "";
        if(complete_list){
            Object.keys(todos).forEach(
                function(key){
                    if(todos[key].status=="COMPLETE"){
                        var todo_element = createTodoElement(key,todos[key]);
                        complete_list.appendChild(todo_element);
                    }
                }
            )
        }

        var delete_list = document.getElementById(TODOS_LIST_DELETE);
        delete_list.innerHTML = "";
        if(delete_list){
            Object.keys(todos).forEach(
                function(key){
                    if(todos[key].status=="DELETED"){
                        var todo_element = createTodoElement(key,todos[key]);
                        delete_list.appendChild(todo_element);
                    }
                }
            )
        }

        /*Object.keys(todos).forEach(

            function(key) {
                var todo_element = createTodoElement(key, todos[key]);
                parent.appendChild(todo_element);
            }
        )*/
    }
}
// id : 1
// todo_object : {title: A Task, status : ACTIVE}
function createTodoElement(id, todo_object){

    var todo_element = document.createElement("div");
    if (todo_object.status == "ACTIVE"){

        var complete_button = document.createElement("input");
        // complete_button.innerText = "Mark as Complete";
        complete_button.setAttribute("onclick", "completeTodoAJAX("+id+")");
        complete_button.setAttribute("class", "breathHorizontal");
        complete_button.setAttribute("type","checkbox");
        complete_button.setAttribute("id","checkbox");
        todo_element.appendChild(complete_button);
    }

    if (todo_object.status == "COMPLETE"){

        var active_button = document.createElement("input");
        // active_button.innerText = "Mark as Active";
        active_button.setAttribute("onclick", "activeTodoAJAX("+id+")");
        active_button.setAttribute("class", "breathHorizontal");
        active_button.setAttribute("type","checkbox");
        active_button.setAttribute("checked","checked");
        active_button.setAttribute("id","checkbox");
        todo_element.appendChild(active_button);
    }
    //todo_element.innerText = todo_object.title;
    // HW: Read custom data-* attributes
    todo_element.append(todo_object.title);

    todo_element.setAttribute(
        "data-id", id
    );

    todo_element.setAttribute(
        "class", "todoStatus"+ todo_object.status + " " + "breathVertical"
    );



    if (todo_object.status != "DELETED"){
        // HW : Add this functionality
        // Add Delete Buttons for ACTIVE, COMPLETE TODO ITEMS
        // add a delete button
        // HW : Write this code
        var delete_button = document.createElement("button");
        delete_button.innerText = "X";
        delete_button.setAttribute("onclick", "deleteTodoAJAX("+id+")");
        delete_button.setAttribute("class", "breathHorizontal");
        delete_button.setAttribute("id","delete");
        todo_element.appendChild(delete_button);
    }




    return todo_element;

}
// Repo URL - https://github.com/malikankit/todo-august-28

function getTodosAJAX(){

    // xhr - JS object for making requests to server via JS
    var xhr = new XMLHttpRequest();
    //
    xhr.open("GET", "/api/todos", true);

    xhr.onreadystatechange = function(){

        if (xhr.readyState == RESPONSE_DONE){

            if(xhr.status == STATUS_OK){
                console.log(xhr.responseText);
                addTodoElements(TODOS_LIST_ID, xhr.responseText);
            }
        }
    }// end of callback

    xhr.send(data=null);

}

function addTodoAJAX(){

    var title= document.getElementById(NEW_TODO_INPUT_ID).value;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/todos", true);
    // the data in this body will be of this form
    xhr.setRequestHeader(
        "Content-type", "application/x-www-form-urlencoded");

    // HW : Read format of X-W-F-U-E
    // HW : Look up encodeURI
    var data = "todo_title=" + encodeURI(title);

    xhr.onreadystatechange = function(){

        if (xhr.readyState == RESPONSE_DONE) {
            if (xhr.status == STATUS_OK) {
                addTodoElements(TODOS_LIST_ID, xhr.responseText);
            }
            else {
                console.log(xhr.responseText);
            }
        }
    }

    xhr.send(data);

}

function completeTodoAJAX(id){

    // Make a AJAX Request to update todo with the above id
    // If Response is 200 : refreshTodoElements


    var xhr = new XMLHttpRequest();
    xhr.open("PUT", "/api/todos/"+id, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    data = "todo_status=COMPLETE";


    xhr.onreadystatechange = function() {

        if (xhr.readyState == RESPONSE_DONE) {
            if (xhr.status == STATUS_OK) {
                addTodoElements(TODOS_LIST_ID, xhr.responseText);
            }
            else {
                console.log(xhr.responseText);
            }
        }
    }



    xhr.send(data);

    // The body can contain these parameters (XWFUE format)
    //todo_title=newtitle
    //todo_status= ACTIVE/COMPLETE/DELETED

}

function deleteTodoAJAX(id){

    // Make a AJAX Request to update todo with the above id
    // If Response is 200 : refreshTodoElements


    var xhr = new XMLHttpRequest();
    xhr.open("DELETE", "/api/todos/"+id, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    data = "todo_status=DELETE";

    xhr.onreadystatechange = function(){

        if (xhr.readyState == RESPONSE_DONE) {
            if (xhr.status == STATUS_OK) {
                addTodoElements(TODOS_LIST_ID, xhr.responseText);
            }
            else {
                console.log(xhr.responseText);
            }
        }
    }



    xhr.send(data=null);

    // The body can contain these parameters (XWFUE format)
    //todo_title=newtitle
    //todo_status= ACTIVE/COMPLETE/DELETED

}

function activeTodoAJAX(id){

    // Make a AJAX Request to update todo with the above id
    // If Response is 200 : refreshTodoElements


    var xhr = new XMLHttpRequest();
    xhr.open("PUT", "/api/todos/"+id, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    data = "todo_status=ACTIVE";

    xhr.onreadystatechange = function(){

        if (xhr.readyState == RESPONSE_DONE) {
            if (xhr.status == STATUS_OK) {
                addTodoElements(TODOS_LIST_ID, xhr.responseText);
            }
            else {
                console.log(xhr.responseText);
            }
        }
    }



    xhr.send(data);

    // The body can contain these parameters (XWFUE format)
    //todo_title=newtitle
    //todo_status= ACTIVE/COMPLETE/DELETED

}