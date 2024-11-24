<template>
  <div class="day-detail">
    <h3>Détails pour {{ day.day }} {{ day.date }}</h3>
    <label for="horaire-debut">Horaire début</label>
    <input type="time" v-model="horaireDebut" id="horaire-debut"><br>
    <label for="horaire-fin">Horaire fin</label>
    <input type="time" v-model="horaireFin" id="horaire-fin">
    <input type="button" value="Valider" @click="validerHoraires">
    <button @click="close">Fermer</button>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
  props: {
    day: {
      type: Object,
      required: true
    }
  },
  setup(props, { emit }) {
    const horaireDebut = ref('');
    const horaireFin = ref('');

    const close = () => {
      emit('close');
    };

    const validerHoraires = async () => {
      if (horaireDebut.value && horaireFin.value) {
        console.log('Valider horaires:', horaireDebut.value, horaireFin.value);

        try {
          const token = localStorage.getItem('token'); // Récupérer le token JWT depuis le stockage local.
          console.log(props.day.day, props.day.date, horaireDebut.value, horaireFin.value);

          // Créer les chaînes de caractères au format requis par MySQL
          const startDateTime = `${props.day.date} ${horaireDebut.value}:00`; // Format YYYY-MM-DD HH:MM:SS
          const endDateTime = `${props.day.date} ${horaireFin.value}:00`; // Format YYYY-MM-DD HH:MM:SS

          console.log('startDateTime:', startDateTime);
          console.log('endDateTime:', endDateTime);

          const response = await fetch('http://localhost:5000/api/schedule', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}` // Inclure le token JWT dans les en-têtes
            },
            body: JSON.stringify({
              day: props.day.date, // Utiliser props.day.date pour envoyer la date au format YYYY-MM-DD
              startDateTime, // Envoi au format YYYY-MM-DD HH:MM:SS
              endDateTime     // Envoi au format YYYY-MM-DD HH:MM:SS
            })
          });
          console.log(response);

          if (response.ok) {
            alert('Horaires enregistrés avec succès !');
            // Réinitialiser les champs après l'enregistrement
            horaireDebut.value = '';
            horaireFin.value = '';
            close();
          } else {
            alert('Erreur lors de l\'enregistrement des horaires.');
          }
        } catch (error) {
          console.error('Erreur lors de l\'enregistrement des horaires:', error);
          alert('Erreur lors de l\'enregistrement des horaires.');
        }
      } else {
        alert('Veuillez renseigner les deux horaires.');
      }
    };

    return {
      close,
      validerHoraires,
      horaireDebut,
      horaireFin,
      day: props.day
    };
  }
});
</script>

<style scoped>
.day-detail {
  position: fixed;
  top: 20%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  background-color: white;
  border: 1px solid #ccc;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}
</style>