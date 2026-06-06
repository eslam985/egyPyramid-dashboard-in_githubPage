<template>
    <!-- زر العودة -->
    <button @click="$router.push('/')"
        class="back-btn flex items-center gap-2 text-primary font-bold text-lg p-4 hover:underline transition">
        <i class="fa fa-arrow-right"></i> العودة للرئيسية
    </button>
    <MediaDetailsSkeleton v-if="!mediaData.title" />
    <div class="media-details-container max-w-450 mx-auto mt-5 p-5 grid grid-cols-1 md:grid-cols-12 gap-8">

        <div class="md:col-span-7">

            <!-- جانب النماذج -->
            <div class="info-side flex-1">
                                    <!-- جانب الصورة -->
                    <div class="flex justify-center poster-side shrink-0 my-3">
                        <img :src="mediaData.poster_url" :alt="mediaData.title"
                            class="max-w-75 aspect-square  rounded-xl shadow-lg">
                    </div>

                <div class="edit-form-container">
                    <!-- شبكة الحقول الديناميكية -->
                    <!-- شبكة الحقول -->
                    <div class="form-grid grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <!-- 1. الحقول الديناميكية -->
                        <div v-for="field in fields" :key="field.key" class="form-group">
                            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{{
                                field.label }}</label>
                            <input v-model="mediaData[field.key]"
                                class="form-control w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-secondary-dark text-gray-900 dark:text-gray-100">
                        </div>


                        <div class="form-group">
                            <label
                                class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">النوع</label>
                            <select v-model="mediaData.category"
                                class="form-control w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-secondary-dark text-gray-900 dark:text-gray-100">
                                <option value="movie">فيلم</option>
                                <option value="tv">مسلسل</option>
                                <option value="series">مسلسل (Series)</option>
                            </select>
                        </div>
                        <!-- الحقول المنطقية (Boolean) -->
                        <div
                            class="form-group flex items-center justify-between p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-secondary-dark">
                            <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">جاهز
                                (is_ready)</label>
                            <input type="checkbox" v-model="mediaData.is_ready"
                                class="w-5 h-5 accent-primary cursor-pointer">
                        </div>

                        <div
                            class="form-group flex items-center justify-between p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-secondary-dark">
                            <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">تم الإخطار
                                (is_notified)</label>
                            <input type="checkbox" v-model="mediaData.is_notified"
                                class="w-5 h-5 accent-primary cursor-pointer">
                        </div>

                        <div
                            class="form-group flex items-center justify-between p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-secondary-dark">
                            <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">تم النشر فيسبوك
                                (is_facebook_posted)</label>
                            <input type="checkbox" v-model="mediaData.is_facebook_posted"
                                class="w-5 h-5 accent-primary cursor-pointer">
                        </div>
                        <!-- 3. حقل ID -->
                        <div class="form-group">
                            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">ID
                                العمل
                                (id)</label>
                            <input v-model="mediaData.id" readonly
                                class="form-control w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 cursor-not-allowed">
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
                            class="form-control w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-secondary-dark text-gray-900 dark:text-gray-100 min-h-50 max-w-full"></textarea>
                    </div>

                    <!-- زر الحفظ -->
                    <button @click="saveMediaDetails" :disabled="isSaving"
                        class="btn-primary bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed">
                        {{ isSaving ? 'جاري الحفظ...' : 'حفظ التعديلات' }}
                    </button>
                </div>
            </div>
        </div>

        <div class="md:col-span-5">

            <!-- قسم السيزون -->
            <div v-if="(mediaData.media_type === 'series' || mediaData.media_type === 'tv')" class="seasons-nav mb-6">
                <div class="flex items-center justify-between mb-3">
                    <h3 class="text-lg font-bold text-gray-800 dark:text-white">اختر السيزون:</h3>
                    <button @click="addNewSeason"
                        class="text-sm bg-gray-200 dark:bg-gray-700 hover:bg-primary hover:text-white px-2 py-1 rounded-lg transition">
                        + إضافة سيزون
                    </button>
                </div>

                <div class="flex gap-2 overflow-x-auto pb-2">
                    <button v-for="season in seasons" :key="season.id"
                        @click="selectedSeasonId = season.id; loadEpisodes(season.id)" :class="['px-4 py-2 rounded-lg font-bold transition flex items-center gap-2',
                            selectedSeasonId === season.id
                                ? 'bg-primary text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300']">

                        <span>سيزون {{ season.season_number }}</span>

                        <span @click.stop="deleteSeason(season)"
                            class="ml-1 px-1.5 py-0.5 rounded-md text-[10px] hover:bg-red-500 hover:text-white transition cursor-pointer">
                            ✕
                        </span>
                    </button>
                </div>
            </div>
            <!-- قسم الحلقات -->
            <div class="episodes-section">
                <div class="ep-header flex items-center justify-between mb-4">
                    <h2 class="text-2xl font-bold text-gray-800 dark:text-white">إدارة الحلقات</h2>
                    <button @click="addNewEpisodeRow"
                        v-if="mediaData.media_type === 'series' || mediaData.media_type === 'tv' || mediaData.media_type === 'movie'"
                        class="btn-add bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg transition">
                        إضافة حلقة جديدة
                    </button>
                </div>

                <!-- شبكة الحلقات -->
                <div class="episodes-grid grid grid-cols-2 gap-4 mb-4"
                    v-if="mediaData.episodes && mediaData.episodes.length > 0">
                    <div v-for="ep in mediaData.episodes" :key="ep.id"
                        class="ep-card my-card flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary transition">

                        <div class="flex flex-col">
                            <span class="font-bold text-gray-800 dark:text-white text-lg">حلقة {{ ep.episode_number
                                }}</span>
                            <span class="text-[10px] text-gray-400 font-mono">
                                S-ID: {{ ep.season_id || 'N/A' }} | EP-ID: {{ ep.id }}
                            </span>
                        </div>

                        <div class="actions flex items-center gap-3">
                            <button @click="manageLinks(ep.id)"
                                class="btn-links text-primary hover:text-primary-dark font-bold transition">
                                السيرفرات
                            </button>
                            <button @click="handleSyncClick(ep)" :class="[
                                'btn-sync transition font-medium text-sm px-2 py-1 rounded-md',
                                ep?.is_synced
                                    ? 'text-green-600 bg-green-50 dark:bg-green-900/20'
                                    : 'text-amber-600 bg-amber-50 dark:bg-amber-900/20'
                            ]">
                                {{ ep?.is_synced ? 'منشور' : 'نشر الآن' }}
                            </button>
                            <button @click="deleteEpisode(ep)"
                                class="btn-delete-ep text-red-500 hover:text-red-700 transition text-2xl font-bold">
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
const seasons = ref([]); // لتخزين السيزونات
const selectedSeasonId = ref(null); // لتخزين السيزون المختار حالياً
const links = ref([]);
const showLinksModal = ref(false);
const selectedEpisodeId = ref(null);
const props = defineProps(['search', 'id']);
const isSaving = ref(false); // أضف هذا المتغير
let mediaChannel = null;
// قائمة الحقول التي تريد التحكم بها ديناميكياً
const fields = [
    { key: 'title', label: 'العنوان (title)' },
    { key: 'tmdb_id', label: 'TMDB ID' },
    { key: 'slug', label: 'الرابط اللطيف (slug)' },
    { key: 'media_type', label: 'نوع الميديا (media_type)' },
    { key: 'year', label: 'سنة الإنتاج' },
    { key: 'duration_iso', label: 'المدة (duration_iso)' },
    { key: 'labels', label: 'التصنيفات (labels)' },
    { key: 'rating', label: 'التقييم (rating)' },
    { key: 'runtime', label: 'وقت العرض (runtime)' },
];
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
        // 1. جلب بيانات العمل الأساسية
        const { data: media, error } = await supabaseClient
            .from('medias')
            .select('*')
            .eq('id', route.params.id)
            .single();

        if (error) throw error;
        mediaData.value = media;

        // 2. إذا كان مسلسلاً، نجلب السيزونات
        if (media.media_type === 'series' || media.media_type === 'tv') {
            const { data: sData } = await supabaseClient
                .from('seasons')
                .select('*')
                .eq('media_id', media.id)
                .order('season_number', { ascending: true });

            seasons.value = sData || [];

            // اختيار السيزون الأول تلقائياً إذا وجد
            if (seasons.value.length > 0) {
                selectedSeasonId.value = seasons.value[0].id;
                loadEpisodes(selectedSeasonId.value);
            }
        } else {
            // إذا كان فيلماً، نجلب الحلقات مباشرة (بما أن الفلم له حلقة واحدة أو علاقة مباشرة)
            loadEpisodesByMedia(media.id);
        }
    } catch (e) { console.error(e); }
};
const addNewSeason = async () => {
    // 1. طلب رقم السيزون من المستخدم
    const { value: seasonNum } = await Swal.fire({
        title: 'إضافة سيزون جديد',
        input: 'number',
        inputLabel: 'رقم السيزون',
        inputPlaceholder: 'أدخل رقم السيزون (مثلاً 2)',
        showCancelButton: true,
        inputValidator: (value) => {
            if (!value) return 'يجب إدخال رقم السيزون!';
        }
    });

    if (seasonNum) {
        // 2. التحقق من التكرار (Check if season exists)
        const exists = seasons.value.some(s => s.season_number == seasonNum);

        if (exists) {
            Swal.fire({
                icon: 'error',
                title: 'خطأ',
                text: `السيزون رقم ${seasonNum} موجود بالفعل!`
            });
            return; // إيقاف التنفيذ
        }

        // 3. الإضافة لقاعدة البيانات
        const { error } = await supabaseClient
            .from('seasons')
            .insert([{
                media_id: route.params.id,
                season_number: parseInt(seasonNum)
            }]);

        if (error) {
            notifyError('فشل إضافة السيزون');
        } else {
            notifySuccess('تمت إضافة السيزون بنجاح');
            loadMedia(); // تحديث القائمة
        }
    }
};
const deleteSeason = async (season) => {
    // 1. استعلام سريع لعدد الحلقات
    const { count } = await supabaseClient
        .from('episodes')
        .select('*', { count: 'exact', head: true })
        .eq('season_id', season.id);

    // 2. نص التحذير الديناميكي
    const seasonName = `سيزون ${season.season_number}`;

    // 3. طلب التأكيد بالكتابة
    const { value: confirmText } = await Swal.fire({
        title: 'هل أنت متأكد؟',
        text: `هذا الإجراء سيحذف ${seasonName} و${count} حلقة مرتبطة به نهائياً. اكتب "${seasonName}" للتأكيد.`,
        input: 'text',
        inputPlaceholder: 'اكتب اسم السيزون هنا...',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'احذف الآن',
        cancelButtonText: 'إلغاء',
        inputValidator: (value) => {
            if (value !== seasonName) {
                return 'اسم التأكيد غير مطابق!';
            }
        }
    });

    // 4. إذا تطابق النص، ننفذ الحذف
    if (confirmText === seasonName) {
        const { error } = await supabaseClient
            .from('seasons')
            .delete()
            .eq('id', season.id);

        if (error) {
            notifyError('فشل الحذف');
        } else {
            notifySuccess('تم حذف السيزون');
            selectedSeasonId.value = null;
            loadMedia();
        }
    }
};
// دالة لجلب الحلقات إذا كان العمل "مسلسل" (مرتبط بسيزون)
const loadEpisodes = async (seasonId) => {
    const { data: eps } = await supabaseClient
        .from('episodes')
        .select('*')
        .eq('season_id', seasonId)
        .order('episode_number', { ascending: true });

    mediaData.value.episodes = eps || [];
};

// دالة لجلب الحلقات إذا كان العمل "فيلم" (مرتبط بالميديا مباشرة)
const loadEpisodesByMedia = async (mediaId) => {
    const { data: eps } = await supabaseClient
        .from('episodes')
        .select('*')
        .eq('media_id', mediaId)
        .order('episode_number', { ascending: true });

    mediaData.value.episodes = eps || [];
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
    // 1. طلب رقم الحلقة
    const { value: epNum } = await Swal.fire({
        title: 'إضافة حلقة جديدة',
        input: 'number', // يفضل استخدام number لمنع إدخال نصوص
        inputLabel: 'رقم الحلقة',
        inputPlaceholder: 'أدخل رقم الحلقة',
        showCancelButton: true
    });

    if (epNum) {
        // 2. التحقق من التكرار داخل السيزون المختار (أو الميديا إذا كان فيلماً)
        const isDuplicate = mediaData.value.episodes.some(
            ep => ep.episode_number == epNum
        );

        if (isDuplicate) {
            Swal.fire({
                icon: 'error',
                title: 'خطأ',
                text: `الحلقة رقم ${epNum} موجودة بالفعل في هذا السيزون!`
            });
            return;
        }

        // 3. التحضير للإضافة (ربطها بالسيزون المختار إذا كان متاحاً)
        const insertData = {
            media_id: route.params.id,
            episode_number: parseInt(epNum)
        };

        // إذا كان هناك سيزون مختار، نضيف الـ season_id
        if (selectedSeasonId.value) {
            insertData.season_id = selectedSeasonId.value;
        }

        // 4. تنفيذ الإضافة
        const { error } = await supabaseClient.from('episodes').insert([insertData]);

        if (error) {
            notifyError('فشل في إضافة الحلقة');
        } else {
            notifySuccess('تمت إضافة الحلقة بنجاح');
            // إعادة تحميل البيانات بناءً على السياق الحالي
            if (selectedSeasonId.value) {
                loadEpisodes(selectedSeasonId.value);
            } else {
                loadEpisodesByMedia(route.params.id);
            }
        }
    }
};
const deleteEpisode = async (ep) => {
    // 1. إعداد اسم التأكيد
    const epName = `حلقة ${ep.episode_number}`;

    // 2. طلب التأكيد بالكتابة
    const { value: confirmText } = await Swal.fire({
        title: 'هل أنت متأكد؟',
        text: `سيتم حذف "${epName}" نهائياً مع كافة السيرفرات التابعة لها. اكتب "${epName}" للتأكيد.`,
        input: 'text',
        inputPlaceholder: 'اكتب رقم الحلقة هنا...',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'احذف الحلقة',
        cancelButtonText: 'إلغاء',
        inputValidator: (value) => {
            if (value !== epName) {
                return 'اسم التأكيد غير مطابق!';
            }
        }
    });

    // 3. التنفيذ
    if (confirmText === epName) {
        try {
            // حذف الروابط أولاً (مهم جداً لتجنب قيود قاعدة البيانات Foreign Key)
            await supabaseClient.from('links').delete().eq('episode_id', ep.id);

            // حذف الحلقة
            const { error } = await supabaseClient.from('episodes').delete().eq('id', ep.id);

            if (error) throw error;

            notifySuccess('تم حذف الحلقة والروابط التابعة لها');
            loadMedia();
        } catch (e) {
            notifyError('فشل في حذف الحلقة');
            console.error(e);
        }
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
    if (!mediaData.value.id) return;

    isSaving.value = true;
    try {
        // 1. تنقية البيانات: نرسل فقط الحقول الموجودة فعلياً في جدول medias
        // نستثني 'episodes' وأي حقول علاقات أخرى
        const { episodes, ...dataToUpdate } = mediaData.value;

        // 2. التنفيذ الفعلي
        const { error } = await supabaseClient
            .from('medias')
            .update(dataToUpdate)
            .eq('id', route.params.id);

        if (error) throw error;

        notifySuccess('✅ تم تحديث بيانات العمل بنجاح في السيرفر');

        // 3. إعادة تحميل البيانات لضمان المزامنة
        await loadMedia();

    } catch (e) {
        console.error('Save Error:', e);
        notifyError(e.message || 'فشل في حفظ البيانات - تأكد من صلاحيات قاعدة البيانات');
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