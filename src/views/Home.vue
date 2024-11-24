<template>
    <div>
      <!-- Controls for navigating between weeks and selecting a date -->
      <div class="controls">
        <button @click="prevWeek">Previous Week</button>
        <button @click="nextWeek">Next Week</button>
        <input type="date" v-model="selectedDateString" @change="onDateChange">
      </div>
      
      <!-- Calendar displaying days and tasks -->
      <div class="calendar">
        <div class="day" v-for="(day, index) in daysWithDates" :key="index" @click="showDetail(day)">
          <div>
            <div>{{ day.day }}</div>
            <div>{{ day.date }}</div>
          </div>
          <div id="info">
            <ul>
              <li v-for="task in day.tasks" :key="task.id">
                {{ task.name }}<br>
                Personne: {{ task.username }}<br>
                Start: {{ formatTime(task.start_time) }}<br>
                End: {{ formatTime(task.end_time) }}
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <!-- Detail view for a selected day -->
      <DayDetail v-if="isDetailVisible" :day="selectedDay" @close="closeDetail" />
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import DayDetail from '../components/DayDetail.vue';
  
  export default {
    components: {
      DayDetail // Register the DayDetail component
    },
    setup() {
      // Define reactive properties
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const daysWithDates = ref([]);
      const selectedDate = ref(new Date());
      const selectedDateString = ref(selectedDate.value.toISOString().slice(0, 10));
      const isDetailVisible = ref(false);
      const selectedDay = ref(null);
  
      // Function to format a date as YYYY-MM-DD
      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
  
      // Function to format a time from ISO string to HH:MM
      const formatTime = (isoString) => {
        const date = new Date(isoString);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
      };
  
      // Function to fetch tasks for a specific date from the backend
      const fetchTasks = async (date) => {
        try {
          const token = localStorage.getItem('token'); // Retrieve the token from localStorage
          const response = await axios.get(`http://localhost:5000/tasks?date=${date}`, {
            headers: {
              Authorization: `Bearer ${token}` // Include the token in the request headers
            }
          });
  
          return response.data; // Return the fetched tasks
        } catch (error) {
          console.error('Error fetching tasks:', error);
          return []; // Return an empty array in case of error
        }
      };
  
      // Function to generate dates and fetch tasks for the current week
      const generateDates = async () => {
        daysWithDates.value = [];
        const firstDayOfWeek = selectedDate.value.getDate() - selectedDate.value.getDay() + 1;
        const currentMonth = selectedDate.value.getMonth();
        const currentYear = selectedDate.value.getFullYear();
  
        for (let i = 0; i < 7; i++) {
          const date = new Date(currentYear, currentMonth, firstDayOfWeek + i);
          const formattedDate = formatDate(date);
          const tasks = await fetchTasks(formattedDate);
          daysWithDates.value.push({
            day: days[i % 7],
            date: formattedDate,
            tasks: tasks
          });
        }
      };
  
      // Function to navigate to the previous week
      const prevWeek = async () => {
        selectedDate.value.setDate(selectedDate.value.getDate() - 7);
        selectedDateString.value = selectedDate.value.toISOString().slice(0, 10);
        await generateDates();
      };
  
      // Function to navigate to the next week
      const nextWeek = async () => {
        selectedDate.value.setDate(selectedDate.value.getDate() + 7);
        selectedDateString.value = selectedDate.value.toISOString().slice(0, 10);
        await generateDates();
      };
  
      // Function to handle date change
      const onDateChange = async () => {
        selectedDate.value = new Date(selectedDateString.value);
        await generateDates();
      };
  
      // Function to show details for a selected day
      const showDetail = (day) => {
        selectedDay.value = day;
        isDetailVisible.value = true;
      };
  
      // Function to close the detail view
      const closeDetail = () => {
        isDetailVisible.value = false;
        selectedDay.value = null;
      };
  
      // Fetch tasks and generate dates when the component is mounted
      onMounted(async () => {
        await generateDates();
      });
  
      // Return the reactive properties and methods to be used in the template
      return {
        daysWithDates,
        selectedDateString,
        prevWeek,
        nextWeek,
        onDateChange,
        showDetail,
        closeDetail,
        isDetailVisible,
        selectedDay,
        formatTime
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
    width: 200px;
    height: 450px;
    border: 1px solid #ccc;
    background-color: #f9f9f9;
    text-align: center;
    cursor: pointer;
  }
  </style>
