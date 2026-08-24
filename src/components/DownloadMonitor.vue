<template>
  <div>
    <!-- الحاوية العائمة لمتابعة التحميلات -->
    <!-- 🌟 تم إضافة كلاس transform translate-z-0 لتسريع عتاد الموبايل GPU -->
    <div
      class="fixed bottom-10 right-4 w-[400px] max-h-96 overflow-y-auto overflow-x-hidden z-50 flex flex-col flex-col-reverse gap-2 transform translate-z-0">

      <button @click="showModal = true"
        class="w-[150px] items-start bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2">
        <i class="fa fa-plus-circle"></i>
        <span>مهمة جديدة</span>
      </button>

      <!-- هنا نستخدم مصفوفة activeTasks مباشرة لأنها أصبحت تأتي مفلترة وجاهزة من السيرفر وخفيفة جداً -->
      <div v-for="task in activeTasks" :key="task.id"
        class="progress-item bg-gradient-to-br from-gray-900 to-black border border-amber-600/30 rounded-xl p-3 shadow-lg text-[10px] w-full">
        <div class="flex items-center justify-between mb-2 gap-1">
          <span class="task-name font-semibold text-amber-500 truncate max-w-[100%]">{{ task.task_name }}</span>

          <!-- 🌟 تم استبدال animate-pulse بأنيميشن أيقونة دوران fa-spin خفيف جداً يرحم معالج الموبايل -->
          <span class="status-text text-[10px] max-w-[40%] truncate flex items-center gap-1"
            :class="task.status_message.includes('جاري الرفع') ? 'text-cyan-400' : 'text-gray-300'">
            <i v-if="task.status_message.includes('جاري الرفع')" class="fa fa-spinner fa-spin text-[8px]"></i>
            {{ task.status_message }}
          </span>

          <span class="percent text-amber-500 font-mono text-[12px]">{{ task.progress_percent }}%</span>
        </div>

        <div class="mini-progress-bar h-1.5 bg-gray-700 rounded-full overflow-hidden">
          <div class="fill h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-500 ease-out"
            :style="{ width: task.progress_percent + '%' }"></div>
        </div>
      </div>
    </div>

    <!-- مودال إضافة مهمة جديدة -->
    <div v-if="showModal"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
      @click.self="showModal = false">
      <div class="my-card bg-white dark:bg-secondary-dark w-full max-w-md rounded-2xl shadow-card p-6">
        <header class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-bold text-gray-800 dark:text-white">إضافة مهمة سحب جديدة</h3>
          <button @click="showModal = false"
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition">
            <i class="fa fa-times text-xl"></i>
          </button>
        </header>

        <form @submit.prevent="submitTask">
          <div class="space-y-4">
            <!-- رابط المصدر -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">رابط المصدر</label>
              <input v-model="taskUrl" type="text" placeholder="https://example.com/file.mp4" required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-secondary-dark text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary transition" />
            </div>
            <!-- اسم المهمة -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">اسم المهمة</label>
              <input v-model="taskName" type="text" placeholder="فيلم XYZ" required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-secondary-dark text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary transition" />
            </div>
          </div>

          <div class="flex gap-3 justify-end mt-6">
            <button type="button" @click="showModal = false"
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition font-medium">
              إلغاء
            </button>
            <button type="submit"
              class="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition font-medium">
              ابدأ السحب والمعالجة
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { supabaseClient } from '../services/supabase.js';

const showModal = ref(false);
const taskUrl = ref('');
const taskName = ref('');
const activeTasks = ref([]);

let channel = null;
let initTimer = null; // 👈 1. متغير لحفظ التايمر ومنع تسريبه في الخلفية

// جلب البيانات الأولية
const fetchTasks = async () => {
  const { data, error } = await supabaseClient
    .from('download_tasks')
    .select('id, task_name, status, status_message, progress_percent')
    .eq('status', 'processing')
    .order('created_at', { ascending: false });

  if (!error) activeTasks.value = data || [];
};

// إرسال مهمة جديدة لقاعدة البيانات
const submitTask = async () => {
  try {
    const { error } = await supabaseClient.from('download_tasks').insert([
      {
        source_url: taskUrl.value,
        task_name: taskName.value,
        status: 'idle',
        status_message: 'Waiting for Beast...',
        progress_percent: 0
      }
    ]);

    if (error) throw error;

    showModal.value = false;
    taskUrl.value = '';
    taskName.value = '';
  } catch (error) {
    alert('❌ فشل في إرسال المهمة: ' + error.message);
  }
};

onMounted(async () => {
  // تدمير أي قنوات قديمة باسم tasks-monitor فوراً قبل البدء
  try {
    const existingChannel = supabaseClient.getChannels().find(c => c.topic === 'realtime:tasks-monitor');
    if (existingChannel) {
      await supabaseClient.removeChannel(existingChannel);
    }
  } catch (e) {
    console.log("لا توجد قنوات متداخلة");
  }

  // حفظ التايمر في متغير لتتمكن دالة onUnmounted من قتله إذا غادر المستخدم الصفحة
  initTimer = setTimeout(async () => {
    await fetchTasks();

    // بناء القناة بالكامل بشكل منفصل
    const myChannel = supabaseClient.channel('tasks-monitor');

    myChannel.on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'download_tasks' },
      (payload) => {
        if (payload.eventType === 'INSERT') {
          if (payload.new.status === 'processing') {
            activeTasks.value.unshift(payload.new);
          }
        } else if (payload.eventType === 'UPDATE') {
          const index = activeTasks.value.findIndex(t => t.id === payload.new.id);

          if (payload.new.status === 'processing') {
            if (index !== -1) {
              activeTasks.value[index] = payload.new;
            } else {
              activeTasks.value.unshift(payload.new);
            }
          } else {
            if (index !== -1) {
              activeTasks.value.splice(index, 1);
            }
          }
        } else if (payload.eventType === 'DELETE') {
          activeTasks.value = activeTasks.value.filter(t => t.id !== payload.old.id);
        }
      }
    );

    // حفظ النسخة الجاهزة فقط في المتغير العلوي وتشغيل الاشتراك
    channel = myChannel;
    channel.subscribe();

  }, 150);
});

// التنظيف الصارم لحماية رامات الموبايل ومنع تداخل القنوات
onUnmounted(async () => {
  // 👈 2. قتل التايمر فوراً لو كان حياً لمنع تشغيل الكود بعد الخروج من الصفحة
  if (initTimer) {
    clearTimeout(initTimer);
  }

  // 👈 3. إغلاق وإزالة القناة يدوياً وبشكل صريح
  if (channel) {
    await supabaseClient.removeChannel(channel);
    channel = null;
  }
});
</script>
