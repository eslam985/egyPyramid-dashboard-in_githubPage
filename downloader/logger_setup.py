def get_beast_logger(name="TheBeast"):
    log_format = "%(asctime)s [%(levelname)s] %(name)s: %(message)s"
    date_format = "%I:%M:%S %p"

    logger = logging.getLogger(name)
    logger.setLevel(logging.INFO)

    # 🟢 السطر السحري المنقذ 🟢
    # هذا السطر يمنع إرسال الرسائل للوجر الأساسي في كولاب، فيختفي التكرار فوراً
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
