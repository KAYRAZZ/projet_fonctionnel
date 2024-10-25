<template>
    <div>
      <div class="controls">
        <button @click="prevWeek">Previous Week</button>
        <button @click="nextWeek">Next Week</button>
        <input type="date" v-model="selectedDateString" @change="onDateChange">
      </div>
      <div class="calendar">
        <div class="day" v-for="(day, index) in daysWithDates" :key="index" @click="showDetail(day)">
          <div>
            <div>{{ day.day }}</div>
            <div>{{ day.date }}</div>
          </div>
          <div id="info"></div>
        </div>
      </div>
      <DayDetail v-if="isDetailVisible" :day="selectedDay" @close="closeDetail" />
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import DayDetail from '../components/DayDetail.vue'; // Importer le composant
  
  export default {
    components: {
      DayDetail // Enregistrer le composant
    },
    setup() {
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const daysWithDates = ref([]);
      const selectedDate = ref(new Date());
      const selectedDateString = ref(selectedDate.value.toISOString().slice(0, 10));
      const isDetailVisible = ref(false);
      const selectedDay = ref(null);
  
      const generateDates = () => {
        daysWithDates.value = [];
        const firstDayOfWeek = selectedDate.value.getDate() - selectedDate.value.getDay() + 1;
        const currentMonth = selectedDate.value.getMonth();
        const currentYear = selectedDate.value.getFullYear();
  
        for (let i = 0; i < 7; i++) {
          const date = new Date(currentYear, currentMonth, firstDayOfWeek + i);
          daysWithDates.value.push({
            day: days[i % 7],
            date: date.getDate()
          });
        }
      };
  
      const prevWeek = () => {
        selectedDate.value.setDate(selectedDate.value.getDate() - 7);
        selectedDateString.value = selectedDate.value.toISOString().slice(0, 10);
        generateDates();
      };
  
      const nextWeek = () => {
        selectedDate.value.setDate(selectedDate.value.getDate() + 7);
        selectedDateString.value = selectedDate.value.toISOString().slice(0, 10);
        generateDates();
      };
  
      const onDateChange = () => {
        selectedDate.value = new Date(selectedDateString.value);
        generateDates();
      };
  
      const showDetail = (day) => {
        selectedDay.value = day;
        isDetailVisible.value = true;
      };
  
      const closeDetail = () => {
        isDetailVisible.value = false;
        selectedDay.value = null;
      };
  
      onMounted(() => {
        generateDates();
      });
  
      return {
        daysWithDates,
        selectedDateString,
        prevWeek,
        nextWeek,
        onDateChange,
        showDetail,
        closeDetail,
        isDetailVisible,
        selectedDay
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
    cursor: pointer; /* Indique que c'est cliquable */
  }
  </style>
  