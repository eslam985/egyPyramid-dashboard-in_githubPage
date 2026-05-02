import logging
import os
from datetime import datetime

def get_beast_logger(name="TheBeast"):
    # 1. إعداد الفورمات الموحد (الساعة:الدقيقة:الثانية AM/PM)
    log_format = "%(asctime)s [%(levelname)s] %(name)s: %(message)s"
    date_format = "%I:%M:%S %p"

    # 2. إنشاء اللوجر
    logger = logging.getLogger(name)
    logger.setLevel(logging.INFO)

    # منع تكرار الهاندلرز (عشان كولاب ميكررش الأسطر)
    if not logger.handlers:
        # أ: هاندلر الكونسول (عشان تشوف قدامك)
        c_handler = logging.StreamHandler()
        c_handler.setFormatter(logging.Formatter(log_format, date_format))
        logger.addHandler(c_handler)

        # ب: هاندلر الملف (عشان الاسترداد - الصندوق الأسود)
        # سيتم إنشاء ملف باسم logs_2026-05-02.log مثلاً
        log_filename = f"log_{datetime.now().strftime('%Y-%m-%d')}.log"
        f_handler = logging.FileHandler(log_filename, encoding="utf-8")
        f_handler.setFormatter(logging.Formatter(log_format, date_format))
        logger.addHandler(f_handler)

    return logger