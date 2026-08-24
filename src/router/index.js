import { createRouter, createWebHashHistory } from "vue-router";
import { supabaseClient } from "../services/supabase"; // الحفاظ على استيراد سوبابيز للحارس الأمني

const routes = [
  { 
    path: "/", 
    name: "Home", 
    component: () => import("../views/HomeView.vue") // 👈 تحميل ذكي عند الحاجة فقط
  },
  {
    path: "/media/:id",
    name: "MediaDetails",
    component: () => import("../views/MediaDetails.vue"), // 👈 تحميل ذكي
    props: true,
  },
  { 
    path: "/login", 
    name: "Login", 
    component: () => import("../views/LoginView.vue") // 👈 تحميل ذكي
  },
  { 
    path: "/database", 
    name: "Database", 
    component: () => import("../views/DatabaseView.vue") // 👈 تحميل ذكي
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// الحارس الأمني (Navigation Guard) كما هو بدون تغيير
router.beforeEach(async (to, from, next) => {
  const {
    data: { session },
  } = await supabaseClient.auth.getSession();

  if (to.name !== "Login" && !session) {
    next({ name: "Login" });
  } else if (to.name === "Login" && session) {
    next({ name: "Home" });
  } else {
    next();
  }
});

export default router;
