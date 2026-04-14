<template>
  <div id="app">
    <main class="w-full max-w-[1400px] mx-auto py-4 md:p-8">
      <!-- مكون مراقبة التحميل (إذا كان موجوداً) -->
      <DownloadMonitor />

      <!-- رأس الصفحة مع الفلاتر -->
      <header class="dashboard-header flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white">
          إدارة المحتوى ({{ totalCount }})
        </h2>

        <div class="filters-bar flex flex-wrap items-center gap-2">
          <!-- أزرار حالة النشر -->
          <button @click="currentStatus = 'all'" class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="currentStatus === 'all' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'">
            الكل
          </button>
          <button @click="currentStatus = 'published'"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="currentStatus === 'published' ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'">
            ✅ منشور
          </button>
          <button @click="currentStatus = 'draft'" class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="currentStatus === 'draft' ? 'bg-amber-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'">
            ⏳ غير منشور
          </button>

          <!-- تحديد النوع -->
          <select v-model="currentCategory"
            class="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-none focus:ring-2 focus:ring-primary outline-none">
            <option value="all">كل الأنواع</option>
            <option value="tv">مسلسلات</option>
            <option value="movie">أفلام</option>
          </select>
        </div>
      </header>

      <!-- شبكة البطاقات -->
      <div class="grid grid-cols-3   sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2 md:gap-4 p-2">
        <template v-if="loading">
          <MediaSkeleton v-for="i in 12" :key="'skeleton-' + i" />
        </template>

        <template v-else-if="mediaList.length > 0">
          <MediaCard v-for="item in mediaList" :key="item.id" :media="item" @delete="handleDelete(item.id)"
            @toggle-blogger="handleToggleBlogger(item)" />
        </template>

        <!-- حالة عدم وجود نتائج -->
        <div v-else class="col-span-full text-center py-12">
          <p class="text-gray-500 dark:text-gray-400 text-lg">لا توجد نتائج تطابق الفلاتر المحددة.</p>
        </div>
      </div>

      <!-- Pagination -->
      <div class="pagination flex items-center justify-center gap-2 mt-8" v-if="totalPages > 1">
        <button @click="loadMediaList(currentPage - 1)" :disabled="currentPage <= 1"
          class="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-700 transition">
          السابق
        </button>

        <span class="px-4 py-2 text-gray-700 dark:text-gray-300">
          صفحة {{ currentPage }} من {{ totalPages }}
        </span>

        <button @click="loadMediaList(currentPage + 1)" :disabled="currentPage >= totalPages"
          class="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-700 transition">
          التالي
        </button>
      </div>
    </main>
  </div>
</template>

<script setup>
import Swal from 'sweetalert2';
import { ref, computed, onMounted, watch, onUnmounted } from 'vue';
import { supabaseClient } from '../services/supabase'; // تأكد أنه استيراد واحد فقط
import MediaCard from '../components/MediaCard.vue';
import DownloadMonitor from '../components/DownloadMonitor.vue';
import MediaSkeleton from '../components/MediaSkeleton.vue';

// احذف سطر import api من هنا تماماً

const props = defineProps({
  search: {
    type: String,
    default: ''
  }
});

const mediaList = ref([]);
const loading = ref(false);
const currentStatus = ref('all');
const currentCategory = ref('all');
const currentPage = ref(1);
const totalPages = ref(1);
const totalCount = ref(0); // العدد الإجمالي للعناصر (للعرض في العنوان)


// 2. جوه الـ onMounted، زود الـ channel بعد استدعاء loadMediaList
onMounted(() => {
  // 1. التحميل الأولي للبيانات
  loadMediaList(1);

  // 2. تفعيل المزامنة اللحظية مرة واحدة فقط
  const channel = supabaseClient
    .channel('public:medias_list')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'medias' }, (payload) => {
      console.log('تحديث لحظي: جاري تحديث القائمة...');
      loadMediaList(currentPage.value);
    })
    .subscribe();
});

onUnmounted(() => {
  supabaseClient.channel('public:medias_list').unsubscribe();
});

// دالة جلب البيانات
const loadMediaList = async (page = 1) => {
  loading.value = true;
  try {
    const limit = 32; // نفس العدد اللي انت محدده في الـ Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // بداية الاستعلام
    let query = supabaseClient
      .from('medias')
      .select('*', { count: 'exact' });

    // فلتر الحالة (منشور / مسودة)
    if (currentStatus.value === 'published') {
      query = query.eq('is_published', true);
    } else if (currentStatus.value === 'draft') {
      query = query.eq('is_published', false);
    }

    // فلتر النوع (فيلم / مسلسل)
    if (currentCategory.value !== 'all') {
      query = query.eq('category', currentCategory.value);
    }

    // فلتر البحث (Search)
    if (props.search) {
      query = query.ilike('title', `%${props.search}%`);
    }

    const { data, error, count } = await query
      .range(from, to)
      .order('created_at', { ascending: false });

    if (error) throw error;

    mediaList.value = data || [];
    totalCount.value = count || 0;
    totalPages.value = Math.ceil(totalCount.value / limit);
    currentPage.value = page;

  } catch (error) {
    console.error('خطأ في جلب البيانات من سوبابيز:', error);
  } finally {
    loading.value = false;
  }
};

// مراقبة تغير الفلاتر أو البحث
watch(
  [() => props.search, currentStatus, currentCategory],
  () => {
    loadMediaList(1); // العودة للصفحة الأولى
  }
);



const handleDelete = async (id) => {
  const result = await Swal.fire({
    title: 'هل أنت متأكد؟',
    text: "سيتم حذف هذا العمل نهائياً من قاعدة البيانات!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'نعم، احذف',
    cancelButtonText: 'تراجع',
    background: '#1f2937',
    color: '#ffffff'
  });

  if (result.isConfirmed) {
    try {
      const { error } = await supabaseClient
        .from('medias')
        .delete()
        .eq('id', id);

      if (error) throw error;

      mediaList.value = mediaList.value.filter(item => item.id !== id);
      totalCount.value -= 1;

      Swal.fire({
        icon: 'success',
        title: 'تم الحذف',
        timer: 1500,
        showConfirmButton: false,
        background: '#1f2937',
        color: '#ffffff'
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'فشل الحذف',
        text: error.message,
        background: '#1f2937',
        color: '#ffffff'
      });
    }
  }
};

</script>