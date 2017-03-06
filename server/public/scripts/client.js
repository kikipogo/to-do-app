console.log('sourced!');
$(document).ready(function(){
  console.log('jquery was correctly sourced!');
  getTaskData();
  function getTaskData() {
    $.ajax({
      type: 'GET',
      url: '/to-do',
      success: function(response) { // once we've gotten repsonse build HTML and append to DOM
      console.log('response', response); // response is an array of task objects
      $('#taskShelf').empty(); // clears the tasks in the #taskShelf
      for (var i = 0; i < response.length; i++) {
        var currentTask = response[i]; // Loops through tasks - This is an object
        var checked = ''; // create empty checked variable
        var completeClass = '';
        if (currentTask.status) { // if true checked is checked
          checked = 'checked'
          completeClass = 'taskComplete'
        }
        var $newTask = $('<tr>'); // Creating a new row for each task
        $newTask.data('id', currentTask.id);
        $newTask.append('<td><input value="' + currentTask.description + '" class="taskDescription '+ completeClass + '" ></td>');
        $newTask.append('<td><input type="checkbox" ' + checked + ' class="taskStatus"></td>');
        $newTask.append('<td><button value="' + currentTask.id + '" class="deleteButton">Delete</button></td>');
        $newTask.append('<td><button class="saveButton">Save</button></td>');
        $('#taskShelf').append($newTask);
      }
      bindCheckBoxEvent();
    }
  });
}

function bindCheckBoxEvent(){
  $('.taskStatus').change(function(){
    if (this.checked){
      $(this).parent().parent().find('.taskDescription').addClass('taskComplete');
    }else{
      $(this).parent().parent().find('.taskDescription').removeClass('taskComplete');
    }
  });
}

$('#newTaskForm').on('submit', function(event){
  event.preventDefault(); // prevent form functionality defaults
  var newTaskObject = {};
  var formFields = $(this).serializeArray(); // serializeArray puts this into object format
  formFields.forEach(function (field) {
    newTaskObject[field.name] = field.value;
  });
  newTaskObject.status = false; // default status is false
  $.ajax({
    type: 'POST',
    url: '/to-do/new',
    data: newTaskObject,
    success: function(response){
      console.log(response);
      getTaskData();
      $('#newTaskForm > input').val('');
    }
  });
});

$('#taskShelf').on('click', '.deleteButton', function(){
  var idOfTaskToDelete = $(this).parent().parent().data().id;
  console.log('The id to delete is: ', idOfTaskToDelete);
  // for waldo, number 48 -> /books/delete/48
  $.ajax({
    type: 'DELETE',
    url: '/to-do/delete/' + idOfTaskToDelete,
    success: function(response) {
      console.log(response);
      getTaskData();
    }
  })
});

$('#taskShelf').on('click', '.saveButton', function(){
  var idOfTaskToSave = $(this).parent().parent().data().id;
  var descriptionOfTaskToSave = $(this).parent().parent().find('.taskDescription').val();
  var statusOfTaskToSave = $(this).parent().parent().find('.taskStatus').prop("checked");
  var taskObjectToSave = {
    task: descriptionOfTaskToSave,
    status: statusOfTaskToSave,
  };
  // for waldo, number 48 -> /books/save/48
  $.ajax({
    type: 'PUT',
    url: '/to-do/save/' + idOfTaskToSave,
    data: taskObjectToSave,
    success: function(response) {
      console.log(response);
      getTaskData();
    }
  })
});

}); // end document ready
