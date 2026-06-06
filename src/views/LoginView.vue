<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-900 px-4">
        <div class="max-w-md w-full bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700">
            <h2 class="text-3xl font-bold text-white text-center mb-8">تسجيل الدخول</h2>
            <p v-if="errorMessage" class="text-red-500 text-center mt-4">{{ errorMessage }}</p>
            <form @submit.prevent="handleLogin" class="space-y-6">
                <div>
                    <label class="block text-sm font-medium text-gray-400 mb-2">البريد الإلكتروني</label>
                    <input v-model="email" type="email" required
                        class="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-400 mb-2">كلمة المرور</label>
                    <input v-model="password" type="password" required
                        class="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" />
                </div>

                <button type="submit" :disabled="loading"
                    class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors flex justify-center items-center">
                    <span v-if="loading">جاري التحقق...</span>
                    <span v-else>دخول</span>
                </button>
            </form>
        </div>
    </div>
</template>

<script>
// استيراد عميل سوبابيز الذي قمت بإعداده مسبقاً
import { supabaseClient } from '../services/supabase';

export default {
    data() {
        return {
            email: '',
            password: '',
            loading: false,
            errorMessage: '' // أضف هذا المتغير
        };
    },
    methods: {
        async handleLogin() {
            this.loading = true;
            this.errorMessage = ''; // مسح أي خطأ قديم قبل المحاولة الجديدة

            try {
                const { data, error } = await supabaseClient.auth.signInWithPassword({
                    email: this.email,
                    password: this.password,
                });

                if (error) throw error;

                this.$router.push('/');
            } catch (e) {
                // بدلاً من alert، حدث المتغير ليظهر في الصفحة
                this.errorMessage = e.message === 'Invalid login credentials'
                    ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
                    : e.message;
            } finally {
                this.loading = false;
            }
        }
    }
};
</script>