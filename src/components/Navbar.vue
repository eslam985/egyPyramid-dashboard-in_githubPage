  <template>

    <nav class="  mx-auto grid  grid-cols-1 md:grid-cols-2 gap-4 p-4 shadow-md  z-50 sticky top-px my-card">
      <div class=" flex gap-4">
        <router-link to="/database"
          class="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 transition flex items-center gap-2">
          <i class="fa fa-database"></i> قاعدة البيانات
        </router-link>

        <button class=" relative z-60 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
          @click="triggerOpen">
          <i class="fa fa-plus"></i> إضافة عمل
        </button>


        <button class="bg-[#ea580c] text-white px-4 py-0 rounded hover:bg-yellow-600 cursor-pointer"
          @click="triggerPublisher">
          🚀 تشغيل محرك النشر
        </button>
        <button @click="logout"
          class="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 shadow-sm hover:shadow">
          تسجيل خروج
        </button>
      </div>

      <div class="flex gap-4">
        <div class="flex flex-row-reverse w-full">
          <div
            class="px-5 py-2.5 bg-primary text-white border border-primary rounded-l-lg flex items-center justify-center">
            <i class="fa fa-search"></i>
          </div>

          <input v-model="searchQuery" type="text" placeholder="ابحث..."
            class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-r-lg bg-white dark:bg-gray-800 text-gray-100 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all">
        </div>
        <div
          class="font-bold  max-w-50 text-3xl text-yellow-500 tracking-[-0.5px] whitespace-nowrap px-4 py-1 rounded-lg shadow-md bg-[linear-gradient(135deg,#8a8000_0,#000000_80%)]">

          <a href="/egyPyramid-dashboard-in_githubPage/#/"> EGY PYRMID</a>

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