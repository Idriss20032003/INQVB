// Fonction pour ouvrir le pop-up
import socket from "./scenes/world-scene.js"
function openPopup() {
    var popup = document.getElementById("popup");
    popup.style.display = "block";
    popup.style.transform = "translateY(-100%)";
  }
  
  // Fonction pour fermer le pop-up
  function closePopup() {
    var popup = document.getElementById("popup");
    popup.style.transform = "translateY(0)";
    setTimeout(function() {
      popup.style.display = "none";
    }, 500); // Attendre 0.5 seconde pour la fin de l'animation avant de cacher le pop-up
  }
  
  // Simulation de l'entrée d'un joueur dans l'espace de travail (à remplacer par votre logique WebSocket réelle)
  function PlayerEntry() {
    openPopup();
  }
  
  // Appeler la fonction pour simuler l'entrée d'un joueur (à remplacer par votre logique WebSocket réelle)
  
socket.on('connect', () => {
  PlayerEntry();
})