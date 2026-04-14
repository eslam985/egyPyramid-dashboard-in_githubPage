<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-900 px-4">
        <div class="max-w-md w-full bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700">
            <h2 class="text-3xl font-bold text-white text-center mb-8">تسجيل الدخول</h2>

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
import { supabase } from '../services/supabase';

export default {
    data() { 
        return { 
            email: '', 
            password: '', 
            loading: false 
        }; 
    },
    methods: {
        async handleLogin() {
            this.loading = true;

            try {
                // تسجيل الدخول المباشر عبر سوبابيز بدون الحاجة لسيرفر وسيط
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: this.email,
                    password: this.password,
                });

                if (error) throw error;

                // سوبابيز تخزن التوكن تلقائياً في الـ LocalStorage
                // ولكن إذا كان كودك القديم يعتمد على 'user_token' يدوياً:
                localStorage.setItem('user_token', data.session.access_token);
                
                this.$router.push('/');
            } catch (e) {
                alert('خطأ: ' + (e.message || 'بيانات الدخول غير صحيحة'));
            } finally {
                this.loading = false;
            }
        }
    }
};
</script>