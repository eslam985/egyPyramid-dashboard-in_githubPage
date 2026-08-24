<template>
  <nav class="sticky top-0 z-50 my-card p-2 md:p-4 shadow-md bg-white dark:bg-gray-900 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
    
    <!-- القسم الأول: أزرار التحكم والروابط -->
    <!-- تم استخدام flex متجاوب بدلاً من grid لمنع تمدد الأزرار بشكل مشوه -->
    <div class="flex flex-wrap items-center gap-2 md:gap-4 order-2 md:order-1">
      <button 
        @click="logout"
        class="text-xs md:text-base bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2.5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 shadow-sm"
      >
        <i class="fa fa-sign-out-alt ml-1"></i> تسجيل خروج
      </button>

      <button 
        @click="triggerOpen"
        class="text-xs md:text-base bg-blue-500 text-white px-4 py-2.5 rounded-lg hover:bg-blue-600 transition-all shadow-sm flex items-center gap-1.5"
      >
        <i class="fa fa-plus"></i> إضافة عمل
      </button>

      <router-link 
        to="/database"
        class="text-xs md:text-base bg-gray-700 hover:bg-gray-600 text-white px-4 py-2.5 rounded-lg transition shadow-sm flex items-center gap-1.5"
      >
        <i class="fa fa-database"></i> DB
      </router-link>
    </div>

    <!-- القسم الثاني: شريط البحث وشعار الموقع -->
    <!-- يظهر في الشاشات الصغيرة بالأعلى (عبر ترتيب order-1) لتجربة مستخدم أفضل -->
    <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:max-w-xl order-1 md:order-2">
      
      <!-- اللوجو / اسم الموقع -->
      <router-link 
        to="/"
        class="text-center font-bold text-2xl text-yellow-500 tracking-tight whitespace-nowrap px-4 py-2 rounded-lg shadow-md bg-[linear-gradient(135deg,#8a8000_0,#000000_80%)] sm:order-2"
      >
        EGY PYRAMID
      </router-link>

      <!-- حقل البحث المعدل والمصلح برمجياً وبصرياً -->
      <div class="flex flex-row w-full sm:order-1" dir="ltr">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="ابحث هنا..."
          class="w-full px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-700 rounded-l-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-right"
        >
        <div class="px-4 py-2.5 bg-primary text-white border border-primary rounded-r-lg flex items-center justify-center cursor-pointer">
          <i class="fa fa-search"></i>
        </div>
      </div>

    </div>

  </nav>
</template>


<script setup>
import { ref, watch } from 'vue';
import api from '../services/api';
import { useRouter } from 'vue-router';
import { supabaseClient } from '../services/supabase';
const searchQuery = ref('');
const isPublishing = ref(false);
const emit = defineEmits(['update-search', 'open-add-modal']);
const router = useRouter();

let debounceTimer;

// دالة البحث الذكي
// داخل Navbar.vue
const performSearch = async (query) => {
  if (!query) {
    emit('update-search', '');
    return;
  }

  if (/^\d+$/.test(query)) {
    try {
      // بما أن baseURL هو /api، سيصبح المسار النهائي: /api/search/id/{query}
      // غير هذا السطر
      const response = await api.get(`/api/search/id/${query}`);

      if (response.data && response.data.length > 0) {
        emit('update-search', response.data[0].media_title);
      }
    } catch (e) {
      console.error("خطأ في جلب البيانات:", e);
    }
  } else {
    emit('update-search', query);
  }
};

watch(searchQuery, (newVal) => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    performSearch(newVal);
  }, 300);
});
const logout = async () => {
  await supabaseClient.auth.signOut(); // إغلاق الجلسة في سوبابيز (محلياً وعلى السيرفر)
  router.push('/login'); // التوجيه لصفحة تسجيل الدخول
};

const triggerPublisher = async () => {
  isPublishing.value = true;
  try {
    const response = await api.post('/publisher/run');
    alert("✅ " + response.data.message);
  } catch (e) {
    alert("❌ فشل الاتصال");
  } finally {
    isPublishing.value = false;
  }
};

const triggerOpen = () => {
  console.log("الزرار تم الضغط عليه!");
  emit('open-add-modal');
};
</script>