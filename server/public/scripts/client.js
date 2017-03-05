console.log('sourced!');
$(document).ready(function(){
  console.log('jquery was correctly sourced!');
  getTaskData();
  function getTaskData() {
    $.ajax({
      type: 'GET',
      url: '/to-do',
      success: function(response) {
        console.log('response', response); // response is an array of book objects
        $('#taskShelf').empty(); // clears the books in the #bookShelf
        for (var i = 0; i < response.length; i++) {
          var currentTask = response[i]; // Loops through books - This is an object
          var checked = '';
          if (currentTask.status) {
            checked = 'checked'
          }
          var $newTask = $('<tr>'); // Creating a new row for each book
          $newTask.data('id', currentTask.id);
          $newTask.append('<td><input value="' + currentTask.description + '" class="taskDescription"></td>');
          $newTask.append('<td><input type="checkbox" ' + checked + ' class="taskStatus"></td>');
          $newTask.append('<td><button value="' + currentTask.id + '" class="deleteButton">Delete</button></td>');
          $newTask.append('<td><button class="saveButton">Save</button></td>');
          $('#taskShelf').append($newTask);
        }
      }
    });
  }

  $('#newTaskForm').on('submit', function(event){
    event.preventDefault();
    var newTaskObject = {};
    var formFields = $(this).serializeArray();
    formFields.forEach(function (field) {
      newTaskObject[field.name] = field.value;
    });
    newTaskObject.status = false;
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
