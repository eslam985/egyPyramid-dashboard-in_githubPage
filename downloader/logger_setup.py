import logging  # 👈 هذا هو السطر الناقص الذي تسبب في الـ NameError
import os
from datetime import datetime

def get_beast_logger(name="TheBeast"):
    log_format = "%(asctime)s [%(levelname)s] %(name)s: %(message)s"
    date_format = "%I:%M:%S %p"

    # الآن سيعرف بايثون ما هو logging
    logger = logging.getLogger(name)
    logger.setLevel(logging.INFO)
    logger.propagate = False 

    if not logger.handlers:
        c_handler = logging.StreamHandler()
        c_handler.setFormatter(logging.Formatter(log_format, date_format))
        logger.addHandler(c_handler)

        log_filename = f"log_{datetime.now().strftime('%Y-%m-%d')}.log"
        f_handler = logging.FileHandler(log_filename, encoding="utf-8")
        f_handler.setFormatter(logging.Formatter(log_format, date_format))
        logger.addHandler(f_handler)

    return logger