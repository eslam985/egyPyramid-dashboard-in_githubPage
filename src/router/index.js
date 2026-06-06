import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import MediaDetails from '../views/MediaDetails.vue';
import LoginView from '../views/LoginView.vue';
import DatabaseView from '../views/DatabaseView.vue'; // استيراد الصفحة الجديدة
import { supabaseClient } from '../services/supabase'; // تأكد من المسار الصحيح

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/media/:id', name: 'MediaDetails', component: MediaDetails, props: true },
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/database', name: 'Database', component: DatabaseView } // إضافة المسار
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

// 3. الحارس الأمني (Navigation Guard)
router.beforeEach(async (to, from, next) => {
  // جلب الجلسة مباشرة من سوبابيز
  const { data: { session } } = await supabaseClient.auth.getSession();

  // إذا كان المستخدم لا يملك جلسة نشطة ويحاول دخول صفحة غير الـ login
  if (to.name !== 'Login' && !session) {
    next({ name: 'Login' });
  }
  // إذا كان المستخدم لديه جلسة ويحاول العودة لصفحة الـ login
  else if (to.name === 'Login' && session) {
    next({ name: 'Home' });
  }
  else {
    next();
  }
});

export default router;