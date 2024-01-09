/*Evènements se déroulant au chargement de la page*/
document.addEventListener("DOMContentLoaded", function () {
  //Déclarations des variables de bloc
  var storedTasks = localStorage.getItem('tasks');
  var storedDescriptions = localStorage.getItem('descriptions');
  var taskList = document.getElementById('Mes_taches');
  
  //Vérifie si les valeurs des 2 inputs sont enregistrées dans le localstorage
  if (storedTasks && storedDescriptions) {
    var tasksArray = JSON.parse(storedTasks);
    var descriptionsArray = JSON.parse(storedDescriptions);

    tasksArray.forEach(function (text, index) {
      var description = descriptionsArray[index];
      addTask(taskList, text, description);
    });
  }

  //Affiche l'état des taches au chargement de la page 
  loadTaskStates();
});


//_______________________________________________________________________________________________________________________________________________
//Evènement se déroulant lorsqu'on appuie sur la touche entrée
document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    add();
  }
});


//_____________________________________________________________________________________________________________________________________________
//fonction pour changer la couleur de fond de la page
function Light_Dark() {
  var toggleSwitch = document.getElementById('toggleSwitch');
  var body = document.body;

  if (toggleSwitch.checked) {
    // Mode sombre : changer la couleur de fond en jaune
    body.style.backgroundColor = 'var(--color1)';
  } else {
    // Mode normal : revenir à la couleur de fond par défaut
    body.style.backgroundColor = ''; // Ceci réinitialise à la valeur par défaut définie dans le CSS
  }
}


//_____________________________________________________________________________________________________________________________________________
//Fonction pour créer une nouvelle tache
function addTask(taskList, text, description) {
  // Déclaration des variables
  var newTask = document.createElement('div');
  newTask.className = "elements";


  // Création d'une nouvelle tache
  newTask.innerHTML = `
    <div class="box1">
    
      <input type="text" id="first" value="Titre : ${text}" disabled>
      <button id="btn1" onclick="check(this)" title="Terminer">
        <span class="button_top"><img src="img/verifie.png" alt="check"></span>
      </button>
    </div>
    <div class="box2">
      <input type="text" id="second" value="${description}" disabled>
      <button id="btn2" onclick="deleteTask(this)" title="Supprimer">
        <span class="button_top"><img src="img/poubelle.png" alt="delete"></span>
      </button>
    </div>
  `;

  taskList.appendChild(newTask);
}


//_____________________________________________________________________________________________________________________________________________
//Fonction pour ajouter la tache sur la page et dans le localstorage
function add() {
  //Déclaration globales des variables de la fonction
  var taskInput = document.querySelector('input[name="task"]');
  var taskList = document.getElementById('Mes_taches');

  //Vérifie le contenu du placeholder avant de savoir quoi faire
  if (taskInput.placeholder == "Donner un titre à la tache") {
    //Vérifie si le champ est vide pour alerter un message
    if (taskInput.value.trim() === "") {
      alert("Veuillez entrer une valeur dans l'input.");
      return;
    }
    else{
    taskInput.placeholder = "Ajouter une description";

    }
    //Appelle de la fonction pour ajouter une nouvelle tache
    addTask(taskList, taskInput.value, "");

    //Déclaration des variables 
    var storedTasks = localStorage.getItem('tasks');
    var storedDescriptions = localStorage.getItem('descriptions');

    // Sauvegarde de la tâche dans le localStorage
    var tasksArray = storedTasks ? JSON.parse(storedTasks) : [];
    tasksArray.push(taskInput.value);
    localStorage.setItem('tasks', JSON.stringify(tasksArray));

     // Sauvegarde de la description dans le localStorage
    var descriptionsArray = storedDescriptions ? JSON.parse(storedDescriptions) : [];
    descriptionsArray.push("");
    localStorage.setItem('descriptions', JSON.stringify(descriptionsArray));
    
    //Remet le champ de l'input à vide
    taskInput.value = '';
  } 

  //Vérifie le contenu du placeholder avant de savoir quoi faire
  else if (taskInput.placeholder == "Ajouter une description") {
    if (taskInput.value.trim() === "") {
      alert("Veuillez entrer une valeur dans l'input.");
      return;
    }
    //Déclaration  des variables
    var currentTask = taskList.lastChild;
    var secondInput = currentTask.querySelector('#second');
    var index = Array.from(taskList.children).indexOf(currentTask);

    secondInput.value = taskInput.value;

    var storedDescriptions = localStorage.getItem('descriptions');
    var descriptionsArray = storedDescriptions ? JSON.parse(storedDescriptions) : [];
    descriptionsArray[index] = taskInput.value;
    localStorage.setItem('descriptions', JSON.stringify(descriptionsArray));

    //Remet le champ de l'input à vide
    taskInput.value = '';
    taskInput.placeholder = "Donner un titre à la tache";
  }
}

//_____________________________________________________________________________________________________________________________________
//Fonction pour marquée la tache comme terminée
function check(button) {
  var firstInput = button.parentNode.parentNode.querySelector('#first');
  var index = Array.from(button.closest('#Mes_taches').children).indexOf(button.closest('.elements'));

  if (firstInput.style.textDecoration === 'line-through') {
    firstInput.style.textDecoration = 'none';
    firstInput.style.backgroundColor = "var(--color5)";
    updateTaskState(index, false);
  } else {
    firstInput.style.textDecoration = 'line-through';
    firstInput.style.backgroundColor = "#b35a62";
    updateTaskState(index, true);
  }
}


//_____________________________________________________________________________________________________________________________________
// Fonction pour mettre à jour l'état de la tache
function updateTaskState(index, isCompleted) {
  //Déclaration globale des fonctions
  var storedTaskStates = localStorage.getItem('taskStates');
  var taskStates = storedTaskStates ? JSON.parse(storedTaskStates) : [];

  // Mettre à jour ou ajouter l'état de la tache courante
  taskStates[index] = isCompleted;

  // Sauvegarder la tache mis à jour dans localStorage
  localStorage.setItem('taskStates', JSON.stringify(taskStates));
}

//_____________________________________________________________________________________________________________________________________
// Charger les états des tâches lors du chargement de la page
function loadTaskStates() {
  //Déclaration globale des variables
  var storedTaskStates = localStorage.getItem('taskStates');
  var taskStates = storedTaskStates ? JSON.parse(storedTaskStates) : [];
  var taskElements = document.querySelectorAll('#Mes_taches .elements');

  taskElements.forEach(function (taskElement, index) {
    var firstInput = taskElement.querySelector('#first');
    if (taskStates[index]) {
      firstInput.style.textDecoration = 'line-through';
      firstInput.style.backgroundColor = "#b35a62";

    }
  });

}
//____________________________________________________________________________________________________________________________________________________________________________________________________
// Fonction pour supprimer la tache sur la page et dans le local storage
function deleteTask(button) {
  // Déclaration globale des variables
  var taskDiv = button.parentNode.parentNode;
  var index = Array.from(taskDiv.parentNode.children).indexOf(taskDiv);
  var storedTasks = localStorage.getItem('tasks');
  var storedDescriptions = localStorage.getItem('descriptions');
  var tasksArray = storedTasks ? JSON.parse(storedTasks) : [];
  var descriptionsArray = storedDescriptions ? JSON.parse(storedDescriptions) : [];
  var storedTaskStates = localStorage.getItem('taskStates');
  var taskStates = storedTaskStates ? JSON.parse(storedTaskStates) : [];

  // Supprimer la tache de la page
  taskDiv.remove();

  // Supprimer la tache du tableau tasksArray et descriptionsArray
  tasksArray.splice(index, 1);
  descriptionsArray.splice(index, 1);

  // Supprimer l'état correspondant dans le tableau taskStates
  taskStates.splice(index, 1);

  // Mettre à jour le localStorage
  localStorage.setItem('tasks', JSON.stringify(tasksArray));
  localStorage.setItem('descriptions', JSON.stringify(descriptionsArray));
  localStorage.setItem('taskStates', JSON.stringify(taskStates));
}

//___________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
//Fonction pour afficher les taches terminées
function showchecktask() {
  //Déclaration de variable
  var taskInput = document.querySelector('input[name="task"]');
  var mainbtn = document.getElementById("mainbtn");
  var searchdiv = document.querySelector(".search"); // Utiliser querySelector
  var taskElements = document.querySelectorAll('#Mes_taches .elements');
  
  //Parcour chaque élémént des taches afin de voir s'il est déja terminé ou pas
  taskElements.forEach(function (taskElement) {
    var firstInput = taskElement.querySelector('#first');

    if (firstInput.style.textDecoration === 'line-through') {
      taskElement.style.display = 'block';  // Afficher la tâche
    } else {
      taskElement.style.display = 'none';   // Masquer la tâche
    }
  });

  

  taskInput.disabled  =true; //Désactive l'input
  mainbtn.disabled  =true;  //Désactive le button
  // Afficher l'élément avec la classe "search"
  if (searchdiv) {
    searchdiv.style.display = "none";   // Vérifier si l'élément avec la classe "search" existe avant de modifier sa propriété
  }
}

//_______________________________________________________________________________________________________________________________________________
//Fontion pour affiher toutes les taches
function showalltask() {
  //Déclaration des variables
  var taskElements = document.querySelectorAll('#Mes_taches .elements');
  var taskInput = document.querySelector('input[name="task"]');
  var mainbtn = document.getElementById("mainbtn");
  var searchDiv = document.querySelector(".search");

  taskElements.forEach(function (taskElement) {
    taskElement.style.display = 'block';  // Afficher la tâche
  });

  taskInput.disabled = false;  //Déactive l'input
  mainbtn.disabled = false;    //Désactive le button

  // Afficher l'élément avec la classe "search"
  if (searchDiv) {
    searchDiv.style.display = "block"; // Vérifier si l'élément avec la classe "search" existe avant de modifier sa propriété
  }
}

//_______________________________________________________________________________________________________________________________________________
//Fonction por filtrer les taches dans la barre de navigation
function filterTasks() {
  //Déclaration des variables
  var searchInput = document.getElementById('search');
  var filter = searchInput.value.toLowerCase();
  var taskElements = document.querySelectorAll('#Mes_taches .elements');

  //Parcour chaque élémént des taches afin de les filtrer 
  taskElements.forEach(function (taskElement) {
    var firstInput = taskElement.querySelector('#first');
    var secondInput = taskElement.querySelector('#second');
    var title = firstInput.value.toLowerCase();
    var desc = secondInput.value.toLowerCase();

    if (title.indexOf(filter)  > -1 || desc.indexOf(filter) > -1) {
      taskElement.style.display = 'block';  // Afficher la tâche
    } else {
      taskElement.style.display = 'none';   // Masquer la tâche
    }
  });

  
}
