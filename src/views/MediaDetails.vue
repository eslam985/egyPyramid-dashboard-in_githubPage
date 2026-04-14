<template>
    <!-- زر العودة -->
    <button @click="$router.push('/')"
        class="back-btn flex items-center gap-2 text-primary font-bold text-lg p-4 hover:underline transition">
        <i class="fa fa-arrow-right"></i> العودة للرئيسية
    </button>
    <MediaDetailsSkeleton v-if="!mediaData.title" />
    <div v-else class="media-details-container my-card max-w-[1400px] mx-auto mt-5 px-2 md:p-5 flex flex-col gap-5 rounded-2xl">
        <!-- رأس الصفحة: صورة + معلومات قابلة للتعديل -->
        <div class="details-header flex flex-col md:flex-row-reverse justify-evenly gap-6 mb-8">
            <!-- جانب الصورة -->
            <div class="poster-side flex-shrink-0">
                <img :src="mediaData.poster_url" :alt="mediaData.title"
                    class="max-w-[300px] aspect-[1/1]  rounded-xl shadow-lg">
            </div>

            <!-- جانب النماذج -->
            <div class="info-side flex-1">
                <div class="edit-form-container">
                    <!-- شبكة من 3 عواميد للحقول القصيرة -->
                    <div class="form-grid grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <!-- عنوان العمل -->
                        <div class="form-group">
                            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">عنوان
                                العمل</label>
                            <input v-model="mediaData.title"
                                class="form-control w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-secondary-dark text-gray-900 dark:text-gray-100">
                        </div>
                        <!-- TMDB ID -->
                        <div class="form-group">
                            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">TMDB
                                ID</label>
                            <input v-model="mediaData.tmdb_id"
                                class="form-control w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-secondary-dark text-gray-900 dark:text-gray-100">
                        </div>
                        <!-- ID العمل (قراءة فقط) -->
                        <div class="form-group">
                            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">ID العمل
                                (id)</label>
                            <input v-model="mediaData.id" readonly
                                class="form-control w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 cursor-not-allowed">
                        </div>
                        <!-- Slug -->
                        <div class="form-group">
                            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">الرابط
                                اللطيف
                                (slug)</label>
                            <input v-model="mediaData.slug"
                                class="form-control w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-secondary-dark text-gray-900 dark:text-gray-100">
                        </div>
                        <!-- نوع الميديا -->
                        <div class="form-group">
                            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">نوع الميديا
                                (media_type)</label>
                            <input v-model="mediaData.media_type"
                                class="form-control w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-secondary-dark text-gray-900 dark:text-gray-100">
                        </div>
                        <!-- سنة الإنتاج -->
                        <div class="form-group">
                            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">سنة الإنتاج
                                (year)</label>
                            <input v-model="mediaData.year"
                                class="form-control w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-secondary-dark text-gray-900 dark:text-gray-100">
                        </div>
                        <!-- المدة ISO -->
                        <div class="form-group">
                            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">المدة
                                (duration_iso)</label>
                            <input v-model="mediaData.duration_iso" placeholder="ISO 8601"
                                class="form-control w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-secondary-dark text-gray-900 dark:text-gray-100">
                        </div>
                        <!-- التصنيفات -->
                        <div class="form-group">
                            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">التصنيفات
                                (labels)</label>
                            <input v-model="mediaData.labels" placeholder="مثال: أكشن, دراما"
                                class="form-control w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-secondary-dark text-gray-900 dark:text-gray-100">
                        </div>
                        <!-- حالة البلوجر -->
                        <div class="form-group">
                            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">حالة
                                البلوجر (blogger_status)</label>
                            <select v-model="mediaData.blogger_status"
                                class="form-control w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-secondary-dark text-gray-900 dark:text-gray-100">
                                <option value="draft">مسودة</option>
                                <option value="published">منشور</option>
                            </select>
                        </div>
                        <!-- النوع -->
                        <div class="form-group">
                            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">النوع
                                (category)</label>
                            <select v-model="mediaData.category"
                                class="form-control w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-secondary-dark text-gray-900 dark:text-gray-100">
                                <option value="movie">فيلم</option>
                                <option value="tv">مسلسل</option>
                            </select>
                        </div>
                        <!-- التقييم -->
                        <div class="form-group">
                            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">التقييم
                                (rating)</label>
                            <input v-model="mediaData.rating" placeholder="مثال: 8.5"
                                class="form-control w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-secondary-dark text-gray-900 dark:text-gray-100">
                        </div>
                        <!-- وقت العرض -->
                        <div class="form-group">
                            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">وقت العرض
                                (runtime)</label>
                            <input v-model="mediaData.runtime" placeholder="مثال: 120 دقيقة"
                                class="form-control w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-secondary-dark text-gray-900 dark:text-gray-100">
                        </div>
                    </div>

                    <!-- رابط البوستر (يمتد على عمود واحد) -->
                    <div class="form-group mb-4">
                        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">رابط
                            البوستر</label>
                        <input v-model="mediaData.poster_url"
                            class="form-control w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-secondary-dark text-gray-900 dark:text-gray-100">
                    </div>

                    <!-- قصة العمل (textarea) -->
                    <div class="form-group mb-6">
                        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">قصة
                            العمل</label>
                        <textarea v-model="mediaData.story"
                            class="form-control w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-secondary-dark text-gray-900 dark:text-gray-100 min-h-[200px] max-w-full"></textarea>
                    </div>

                    <!-- زر الحفظ -->
                    <button @click="saveMediaDetails" :disabled="isSaving"
                        class="btn-primary bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed">
                        {{ isSaving ? 'جاري الحفظ...' : 'حفظ التعديلات' }}
                    </button>
                </div>
            </div>
        </div>

        <!-- قسم الحلقات -->
        <div class="episodes-section">
            <div class="ep-header flex items-center justify-between mb-4">
                <h2 class="text-2xl font-bold text-gray-800 dark:text-white">إدارة الحلقات</h2>
                <button @click="addNewEpisodeRow"
                    class="btn-add bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg transition">
                    إضافة حلقة جديدة
                </button>
            </div>

            <!-- شبكة الحلقات -->
            <div class="episodes-grid grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4"
                v-if="mediaData.episodes && mediaData.episodes.length > 0">
                <div v-for="ep in mediaData.episodes" :key="ep.id"
                    class="ep-card my-card flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                    <span class="font-medium text-gray-700 dark:text-gray-300">حلقة {{ ep.episode_number }}</span>
                    <div class="actions flex items-center gap-3">
                        <button @click="manageLinks(ep.id)"
                            class="btn-links text-primary hover:text-primary-dark font-bold transition">
                            السيرفرات
                        </button>
                        <button @click="handleSyncClick(ep)" :class="[
                            'btn-sync transition font-medium',
                            ep?.is_synced
                                ? 'text-green-600 dark:text-green-400 hover:text-green-700'
                                : 'text-amber-600 dark:text-amber-400 hover:text-amber-700'
                        ]">
                            {{ ep?.is_synced ? 'منشور (اضغط للتحديث)' : 'نشر الآن' }}
                        </button>
                        <button @click="deleteEpisode(ep.id)"
                            class="btn-delete-ep text-red-500 hover:text-red-700 transition text-3xl leading-none">
                            ×
                        </button>
                    </div>
                </div>
            </div>
            <div class="empty-state my-card p-8 text-center text-gray-500 dark:text-gray-400 rounded-xl">
                <p>لا توجد حلقات مضافة بعد. اضغط على "إضافة حلقة جديدة".</p>
            </div>
        </div>

        <!-- مودال إدارة السيرفرات -->
        <div v-if="showLinksModal"
            class="modal-overlay-sub fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            @click.self="showLinksModal = false">
            <div class="modal-content-sub my-card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 rounded-xl">
                <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-4">إدارة سيرفرات الحلقة: {{
                    selectedEpisodeId }}</h3>
                <div v-for="link in links" :key="link.id" class="link-row flex gap-3 mb-3">
                    <input v-model="link.server_name" @blur="updateLink(link)" placeholder="اسم السيرفر"
                        class="server-name w-1/3 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-secondary-dark text-gray-900 dark:text-gray-100">
                    <input v-model="link.url" @blur="updateLink(link)" placeholder="الرابط"
                        class="server-url flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-secondary-dark text-gray-900 dark:text-gray-100">
                    <button @click="deleteLink(link.id)"
                        class="bg-red-500 hover:bg-red-700 text-white px-3 rounded-lg transition">
                        ×
                    </button>
                </div>
                <div
                    class="footer--content-sub flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button @click="addNewLink(selectedEpisodeId)"
                        class="btn-add bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg transition">
                        إضافة سيرفر جديد
                    </button>
                    <button @click="showLinksModal = false"
                        class="close-btn bg-gray-500 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition">
                        إغلاق
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<!-- لم يعد هناك حاجة لـ style scoped، يمكن إزالته بالكامل، أو الاحتفاظ به فقط لتجاوزات نادرة إن وجدت -->
<style scoped>
/* يمكن ترك هذا الملف فارغاً، أو إضافة أي تجاوزات ضرورية لا يمكن تحقيقها بـ Tailwind */
</style>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'; // أضفنا onUnmounted
import { useRoute } from 'vue-router';
import Swal from 'sweetalert2'; // أضف هذا السطر ليعمل التنبيه
import { supabaseClient } from '../services/supabase';
import MediaDetailsSkeleton from '../components/MediaDetailsSkeleton.vue';
import { notifySuccess, notifyError, notifyLoading, confirmAction } from '../utils/alerts';

// احذف import api from '../services/api'
const route = useRoute();
const mediaData = ref({});
const links = ref([]);
const showLinksModal = ref(false);
const selectedEpisodeId = ref(null);
const props = defineProps(['search', 'id']);
const isSaving = ref(false); // أضف هذا المتغير
let mediaChannel = null;

onMounted(async () => {
    // 1. تحميل البيانات الأساسية أولاً
    await loadMedia();

    // 2. مسح أي قنوات قديمة عالقة (الخطوة الدفاعية)
    await supabaseClient.removeAllChannels();

    // 3. إضافة تأخير بسيط (100ms) لضمان إتمام عملية المسح في السيرفر
    setTimeout(async () => {

        // 4. إنشاء القناة الجديدة
        mediaChannel = supabaseClient
            .channel(`media-details-${route.params.id}`) // استخدم ID العمل في الاسم لجعله فريداً
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'medias',
                filter: `id=eq.${route.params.id}`
            }, (payload) => {
                console.log('🔄 تحديث لحظي للعمل...');
                loadMedia();
            });

        // 5. بدء الاشتراك
        mediaChannel.subscribe((status) => {
            if (status === 'SUBSCRIBED') {
                console.log('✅ قناة التفاصيل تعمل بنجاح');
            }
        });

    }, 100);
});

onUnmounted(async () => {
    if (mediaChannel) {
        // حذف القناة عند الخروج لمنع استهلاك الـ Quota
        await supabaseClient.removeChannel(mediaChannel);
        console.log('🚿 تم تنظيف قناة التفاصيل');
    }
});

const loadMedia = async () => {
    try {
        const { data, error } = await supabaseClient.from('medias').select('*, episodes(*)').eq('id', route.params.id).single();
        if (!error) mediaData.value = data;
        // تم حذف الـ forEach هنا لمنع الضغط على سيرفر بلوجر
    } catch (e) { console.error(e); }
};

// --- منطق السيرفرات ---
const manageLinks = async (epId) => {
    selectedEpisodeId.value = epId;
    showLinksModal.value = true;
    const { data: resData } = await supabaseClient.from('links').select('*').eq('episode_id', epId);
    links.value = resData;
};

const updateLink = async (link) => {
    // تم حذف URLSearchParams لأن سوبابيز تتعامل مع JSON مباشرة
    await supabaseClient
        .from('links')
        .update({
            server_name: link.server_name,
            url: link.url
        })
        .eq('id', link.id);
};

const addNewLink = async (epId) => {
    await supabaseClient.from('links').insert([{ episode_id: epId, server_name: 'New Server', url: '' }]);
    manageLinks(epId);
};

// --- منطق الحلقات ---
const addNewEpisodeRow = async () => {
    const { value: epNum } = await Swal.fire({
        title: 'إضافة حلقة جديدة',
        input: 'text',
        inputLabel: 'رقم الحلقة',
        inputPlaceholder: 'أدخل رقم الحلقة (مثلاً 5)',
        showCancelButton: true
    });

    if (epNum) {
        await supabaseClient.from('episodes').insert([{ media_id: route.params.id, episode_number: epNum }]);
        notifySuccess('تمت إضافة الحلقة');
        loadMedia();
    }
};

const deleteEpisode = async (epId) => {
    const result = await confirmAction("لن تتمكن من استرجاع هذه الحلقة بعد الحذف!");
    if (result.isConfirmed) {
        await supabaseClient.from('episodes').delete().eq('id', epId);
        notifySuccess('تم حذف الحلقة بنجاح');
        loadMedia();
    }
};

const deleteLink = async (linkId) => {
    const result = await confirmAction("سيتم حذف رابط السيرفر نهائياً.");
    if (result.isConfirmed) {
        await supabaseClient.from('links').delete().eq('id', linkId);
        links.value = links.value.filter(l => l.id !== linkId);
    }
};


const saveMediaDetails = async () => {
    isSaving.value = true;
    try {
        await supabaseClient.from('medias').update(mediaData.value).eq('id', route.params.id);
        notifySuccess('تم تحديث بيانات العمل بنجاح');
        await loadMedia();
    } catch (e) {
        notifyError(e.message || 'فشل في حفظ البيانات'); // ✅ سوبابيز تضع الخطأ في e.message    
    } finally {
        isSaving.value = false;
    }
};
// داخل الـ Script في Vue


const handleSyncClick = async (ep) => {
    // إظهار تنبيه بسيط يشير إلى أننا نقوم بالفحص حالياً
    Swal.fire({
        title: 'جاري التحقق...',
        text: 'يتم فحص حالة الحلقة على بلوجر...',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    // ننتظر نتيجة الفحص الحقيقية
    const isStillOnBlogger = await checkSyncStatus(ep);

    // إغلاق تنبيه "جاري التحقق"
    Swal.close();

    // الآن نستخدم النتيجة التي عادت من الدالة مباشرة
    if (!isStillOnBlogger) {
        // إذا لم تكن موجودة، ابدأ النشر فوراً
        await syncToBlogger(ep);
    } else {
        // إذا كانت موجودة، نستخدم SweetAlert بدلاً من alert
        Swal.fire({
            icon: 'info',
            title: 'الحلقة موجودة بالفعل',
            text: 'هذه الحلقة تم العثور عليها مسبقاً على بلوجر.',
            confirmButtonText: 'حسناً'
        });
    }
};

const syncToBlogger = async (ep) => {
    try {
        notifyLoading('جاري المزامنة... يرجى الانتظار'); // استخدام دالة الـ loading

        const res = await api.post(`/episodes/${ep.id}/sync`);

        if (res.data.status === 'success') {
            ep.is_synced = true;
            notifySuccess(res.data.message || 'تم نشر الحلقة بنجاح!');
        } else {
            notifyError(res.data.error || 'حدث خطأ غير معروف أثناء النشر.');
        }
    } catch (e) {
        console.error(e);
        notifyError('فشل الاتصال بالسيرفر - تأكد من تشغيل الباك-إند.');
    }
};
const checkSyncStatus = async (ep) => {
    const postId = ep.medias?.blogger_post_id;
    if (!postId) return false; // لا يوجد مقال

    try {
        const res = await api.get(`/blogger/check-status/${postId}`);
        if (res.data.status === 'not_found') {
            await api.post(`/episodes/${ep.id}/reset-sync`);
            ep.is_synced = false; // تحديث الواجهة
            return false; // الحلقة غير موجودة
        }
        return true; // الحلقة موجودة
    } catch (e) {
        console.error("فحص الحالة فشل");
        return false;
    }
};
</script>