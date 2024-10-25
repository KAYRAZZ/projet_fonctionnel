<template>
    <div>
      <div class="controls">
        <button @click="prevWeek">Previous Week</button>
        <button @click="nextWeek">Next Week</button>
        <input type="date" v-model="selectedDateString" @change="onDateChange">
      </div>
      <div class="calendar">
        <div class="day" v-for="(day, index) in daysWithDates" :key="index">
            <div>
                <div>{{ day.day }}</div>
                <div>{{ day.date }}</div>
            </div>
            <div id="info">

            </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  
  export default {
    setup() {
      // Propriétés réactives
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const daysWithDates = ref([]);
      const selectedDate = ref(new Date());
      const selectedDateString = ref(selectedDate.value.toISOString().slice(0, 10));
  
      // Fonction pour générer les dates
      const generateDates = () => {
        daysWithDates.value = []; // Clear the previous dates
        const firstDayOfWeek = selectedDate.value.getDate() - selectedDate.value.getDay() + 1; // Get the first day of the selected week (Monday)
        const currentMonth = selectedDate.value.getMonth();
        const currentYear = selectedDate.value.getFullYear();
  
        for (let i = 0; i < 7; i++) { // Generate dates for 1 week (7 days)
          const date = new Date(currentYear, currentMonth, firstDayOfWeek + i);
          daysWithDates.value.push({
            day: days[i % 7],
            date: date.getDate()
          });
        }
      };
  
      // Fonction pour aller à la semaine précédente
      const prevWeek = () => {
        selectedDate.value.setDate(selectedDate.value.getDate() - 7);
        selectedDateString.value = selectedDate.value.toISOString().slice(0, 10);
        generateDates();
      };
  
      // Fonction pour aller à la semaine suivante
      const nextWeek = () => {
        selectedDate.value.setDate(selectedDate.value.getDate() + 7);
        selectedDateString.value = selectedDate.value.toISOString().slice(0, 10);
        generateDates();
      };
  
      // Fonction pour gérer le changement de date
      const onDateChange = () => {
        selectedDate.value = new Date(selectedDateString.value);
        generateDates();
      };
  
      // Initialiser le calendrier lors du montage du composant
      onMounted(() => {
        generateDates();
      });
  
      // Retourner les valeurs et méthodes à utiliser dans le template
      return {
        daysWithDates,
        selectedDateString,
        prevWeek,
        nextWeek,
        onDateChange,
      };
    },
  };
  </script>
  
  <style scoped>
  .controls {
    margin-bottom: 10px;
  }
  
  .calendar {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .day {
    display: flex;
    flex-direction: column;
    width: 150px;
    height: 150px;
    border: 1px solid #ccc;
    background-color: #f9f9f9;
    text-align: center;
  }
  </style>
  