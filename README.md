---
title: EgyPyramid Guardian Ultra
emoji: 🛡️
colorFrom: blue
colorTo: red
sdk: docker
app_file: app.py
pinned: false
---

# 🚀 EgyPyramid Guardian Ultra

**نظام أتمتة متكامل لإدارة وتحميل ونشر المحتوى المرئي**  
(فيلم / مسلسل – حلقات)  
مصمم لتقليل التدخل البشري عبر أتمتة جلب البيانات، المعالجة، التوزيع على سيرفرات الاستضافة، والنشر التلقائي على بلوجر.

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D)](https://vuejs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Google Colab](https://img.shields.io/badge/Colab-F9AB00?style=for-the-badge&logo=googlecolab&color=525252)](https://colab.research.google.com/)

---

## 🏗️ هندسة النظام (System Architecture)

يعتمد النظام على بنية **تعتمد على الأحداث (Event-Driven)** مكونة من ثلاث طبقات رئيسية:

- **طبقة التحكم (الواجهة ولوحة التحكم):** مبنية باستخدام Vue.js، تتيح للمستخدم إضافة مهام التحميل وإدارة النشر عبر Supabase كـ"وسيط بيانات".
- **طبقة المعالجة (العامل/التحميل):** تطبيق يعمل في بيئة خارجية (Google Colab / Kaggle) يقوم بسحب الكود برمجياً من GitHub، ومراقبة جداول المهام في Supabase، وتنفيذ عمليات التحميل والمعالجة الثقيلة.
- **طبقة النشر (الناشر):** محرك ذكي يحول بيانات العمل الفني (فيلم/حلقة) إلى قالب HTML/CSS ديناميكي وينشرها تلقائياً على Blogger مع إدراج روابط السيرفرات المختارة.

---

## 🛠️ التكنولوجيات المستخدمة (Tech Stack)

| المكون               | التقنية                                                                                                          |
| :------------------- | :--------------------------------------------------------------------------------------------------------------- |
| **الواجهة الأمامية** | Vue.js (Vite) – لوحة تحكم تفاعلية                                                                                |
| **الخلفية API**      | FastAPI (Python) – إدارة الطلبات والربط بين الخدمات                                                              |
| **قاعدة البيانات**   | Supabase (PostgreSQL) – "العقل المدبر" الذي يخزن المهام والبيانات والحالات                                       |
| **العمال الخارجيون** | Google Colab, Kaggle – تنفيذ المهام الثقيلة (تحميل، معالجة)                                                      |
| **الذكاء الاصطناعي** | Gemini, Groq – توليد البيانات الوصفية والوصف والتحليل                                                            |
| **مصادر البيانات**   | TMDB, OMDB, IMDb – جلب تفاصيل الأفلام والمسلسلات                                                                 |
| **معالجة الوسائط**   | Cloudinary – تحويل الصيغ وضغط الصور وتغيير الحجم                                                                 |
| **سيرفرات الاستريم** | Archive.org, Doodstream, Lulustream, Mixdrop, Streamtape, Telegram (مباشر), VK, Voe – رفع واستضافة ملفات الفيديو |
| **النشر**            | Blogger API – نشر تلقائي بقوالب ديناميكية                                                                        |

---

## ⚙️ كيف يعمل التدفق (Workflow)

1. **إنشاء مهمة:**  
   المستخدم يضغط على زر `➕ مهمة تحميل جديدة` في لوحة التحكم، يملأ الاسم والرابط ← يتم إدراج سجل في جدول `download_tasks` في Supabase بحالة `idle`.

2. **اكتشاف العامل:**  
   دفتر ملاحظات Google Colab (أو سكريبت Kaggle) يراقب باستمرار جدول `download_tasks`.  
   يقوم بسحب أحدث كود من GitHub (باستخدام توكن للمستودعات الخاصة) ويشغل حلقة `ultimate_beast_worker()`.

3. **التحميل والمعالجة:**
   - العامل يلتقط أقدم مهمة `idle`، يحدث حالتها إلى `processing`، ويبدأ التحميل.
   - يجلب البيانات الوصفية من TMDB/OMDB/IMDb، يولد وصفاً باستخدام Gemini/Groq، ويرفع الفيديو إلى عدة سيرفرات استريم (Doodstream, Voe، وغيرها).
   - يتم معالجة الصور عبر Cloudinary (تحويل إلى WebP، تغيير الحجم).
   - تُحفظ جميع البيانات النهائية (تفاصيل الحلقة، الروابط، البوستر) في جداول `episodes` و`links`.

4. **اكتمال المهمة:**  
   تُحذف المهمة الأصلية من `download_tasks` بعد نجاح المعالجة.

5. **النشر:**
   - عندما يضغط المستخدم على زر `🚀 تشغيل محرك النشر` لعنصر وسائط، يتحقق الناشر من حالته.
   - إذا لم يكن منشوراً (حالة ≠ `published`)، يقوم بتجميع قالب HTML غني (مع CSS، JS، وسوم meta، ترميز Schema.org) باستخدام البيانات المخزنة.
   - يتم إرسال المنشور إلى Blogger عبر API الخاص به، مع تضمين جميع روابط الاستريم المجمعة.
   - تُحدث حالة الوسائط إلى `published` (أو `synced`).

> **ملاحظة:** العامل والناشر مفصولان تماماً. العامل يعمل خارجياً (Colab/Kaggle) بينما يتم تشغيل الناشر من لوحة التحكم.

---

## 🧩 هيكل المشروع (Project Structure)

➜  projects git:(main) ✗ /media/es/DDrive/projects/web-Veo/egyPyramid-guardian-ultra/          
➜  egyPyramid-guardian-ultra git:(main) ✗ ls -la && mytree 
total 147
drwxrwxrwx 1 es es  4096 Apr  1 20:12 .
drwxrwxrwx 1 es es     0 Mar 30 11:45 ..
drwxrwxrwx 1 es es     0 Mar 30 12:28 api
-rwxrwxrwx 1 es es 43310 Apr  1 20:14 db.txt
drwxrwxrwx 1 es es     0 Mar 30 11:45 downloader
-rwxrwxrwx 1 es es  1876 Mar 30 13:11 .env
drwxrwxrwx 1 es es  4096 Mar 31 02:21 .git
-rwxrwxrwx 1 es es   716 Mar 30 12:31 .gitignore
-rwxrwxrwx 1 es es   405 Mar 30 11:45 index.html
drwxrwxrwx 1 es es  4096 Mar 30 11:45 node_modules
-rwxrwxrwx 1 es es   562 Mar 30 11:45 package.json
-rwxrwxrwx 1 es es 49262 Mar 30 11:45 pnpm-lock.yaml
-rwxrwxrwx 1 es es    35 Mar 30 11:45 pnpm-workspace.yaml
drwxrwxrwx 1 es es     0 Mar 30 11:56 public
drwxrwxrwx 1 es es  4096 Mar 30 11:45 publisher
drwxrwxrwx 1 es es     0 Mar 30 11:45 __pycache__
-rwxrwxrwx 1 es es  3852 Mar 30 11:45 readme.md
-rwxrwxrwx 1 es es  9315 Apr  1 20:16 README.md
-rwxrwxrwx 1 es es   205 Mar 30 11:45 requirements.txt
drwxrwxrwx 1 es es     0 Mar 30 11:45 services
drwxrwxrwx 1 es es  4096 Mar 30 11:45 src
drwxrwxrwx 1 es es     0 Mar 30 11:46 venv
-rwxrwxrwx 1 es es   175 Mar 30 11:57 vercel.json
-rwxrwxrwx 1 es es   676 Mar 30 12:11 vite.config.js
.
├── api
│   └── index.py
├── db.txt
├── downloader
│   ├── engine.py
│   ├── __init__.py
│   ├── main_downloader.py
│   └── processors.py
├── index.html
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── public
├── publisher
│   ├── __init__.py
│   ├── main_publisher.py
│   ├── templates_store.py
│   └── utils.py
├── readme.md
├── README.md
├── requirements.txt
├── services
│   ├── blogger_api.py
│   ├── __init__.py
│   └── supabase_db.py
├── src
│   ├── App.vue
│   ├── assets
│   │   ├── style.css
│   │   └── vue.svg
│   ├── components
│   │   ├── AddMediaModal.vue
│   │   ├── DownloadMonitor.vue
│   │   ├── MediaCard.vue
│   │   ├── MediaDetailsSkeleton.vue
│   │   ├── MediaSkeleton.vue
│   │   └── Navbar.vue
│   ├── main.js
│   ├── router
│   │   └── index.js
│   ├── services
│   │   ├── api.js
│   │   └── supabase.js
│   ├── utils
│   │   └── alerts.js
│   └── views
│       ├── DatabaseView.vue
│       ├── HomeView.vue
│       ├── LoginView.vue
│       └── MediaDetails.vue
├── vercel.json
└── vite.config.js

13 directories, 40 files
➜  egyPyramid-guardian-ultra git:(main) ✗ 


---

## 🚀 البدء (Getting Started)

### المتطلبات الأساسية

- Python 3.9+
- Node.js & npm (لتطوير الواجهة)
- مشروع Supabase (يحتوي على الجداول: `download_tasks`, `episodes`, `links`, `medias`)
- مفاتيح API لـ TMDB، OMDB، Gemini، Groq، Cloudinary، إلخ.

### التطوير المحلي

1. **استنساخ المستودع:**
   ```bash
   git clone https://github.com/eslam985/egyPyramid-blogger-guardian-ultra.git
   cd egyPyramid-blogger-guardian-ultra
   ```

إعداد الخلفية:
python -m venv venv
source venv/bin/activate # أو `venv\Scripts\activate` في ويندوز
pip install -r requirements.txt

أنشئ ملف .env يحتوي على جميع مفاتيح API وبيانات اعتماد Supabase.

إعداد الواجهة:

npm install
npm run build # يبني الملفات في static/dist

تشغيل FastAPI:
uvicorn app:app --reload

ستكون لوحة التحكم متاحة على http://localhost:8000.

العامل (Colab):
افتح دفتر Colab المرفق، ضع توكن GitHub (إذا كان المستودع خاصاً)، وشغل الخلايا. سيبدأ العامل بالاستماع للمهام.

🖥️ الاستخدام (Usage)
إضافة مهمة تحميل:
من لوحة التحكم، اضغط على الزر الأخضر ➕، أدخل اسماً ورابط المصدر. ستظهر المهمة في قائمة الانتظار.

مراقبة التقدم:
مكون DownloadMonitor يعرض تحديثات الحالة الفورية من Supabase.

النشر:
لأي فيلم/حلقة معالجة، اضغط على 🚀 تشغيل محرك النشر للنشر الفوري. إذا كان منشوراً بالفعل، يظهر الزر "منشور (اضغط للتحديث)" لتحديث المنشور.

إدارة الروابط:
استخدم زر السيرفرات على كل حلقة لعرض/تعديل روابط الاستريم المرفوعة.

🤝 المساهمة (Contributing)
نرحب بالمساهمات! يرجى فتح Issue أو إرسال Pull Request لأي تحسينات أو إصلاحات.

📄 الترخيص (License)
هذا المشروع مرخص بموجب رخصة MIT – راجع ملف LICENSE للتفاصيل.

🙏 شكر وتقدير
بُني المشروع استلهاماً من الحاجة إلى أتمتة أرشفة ونشر المحتوى.

شكراً لجميع المكتبات مفتوحة المصدر وواجهات البرمجة (APIs) التي جعلت هذا ممكناً.
