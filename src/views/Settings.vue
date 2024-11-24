<template>
    <div class="settings">
        <h1>Settings</h1>
        <form @submit.prevent="changePassword">
            <div class="form-group">
                <label for="currentPassword">Current Password</label>
                <input type="password" v-model="currentPassword" id="currentPassword" required />
            </div>
            <div class="form-group">
                <label for="newPassword">New Password</label>
                <input type="password" v-model="newPassword" id="newPassword" required />
            </div>
            <div class="form-group">
                <label for="confirmPassword">Confirm New Password</label>
                <input type="password" v-model="confirmPassword" id="confirmPassword" required />
            </div>
            <button type="submit">Change Password</button>
            <p v-if="error" class="error">{{ error }}</p>
            <p v-if="success" class="success">{{ success }}</p>
        </form>
    </div>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';

export default {
    setup() {
        const currentPassword = ref('');
        const newPassword = ref('');
        const confirmPassword = ref('');
        const error = ref(null);
        const success = ref(null);

        const changePassword = async () => {
            if (newPassword.value !== confirmPassword.value) {
                error.value = "Les mots de passe ne correspondent pas.";
                return;
            }

            try {
                const token = localStorage.getItem('token'); // Récupère le token JWT

                const response = await axios.post('http://localhost:5000/api/change-password', {
                    currentPassword: currentPassword.value,
                    newPassword: newPassword.value,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}` // Inclut le token dans les en-têtes
                    }
                });

                if (response.status === 200) {
                    success.value = "Mot de passe changé avec succès.";
                    error.value = null;
                    // Réinitialiser les champs
                    currentPassword.value = '';
                    newPassword.value = '';
                    confirmPassword.value = '';
                }
            } catch (err) {
                console.error('Erreur lors du changement de mot de passe:', err);
                error.value = "Une erreur s'est produite. Veuillez réessayer.";
                success.value = null;
            }
        };


        return {
            currentPassword,
            newPassword,
            confirmPassword,
            changePassword,
            error,
            success,
        };
    },
};
</script>

<style scoped>
.settings {
    max-width: 400px;
    margin: auto;
}

.error {
    color: red;
}

.success {
    color: green;
}
</style>