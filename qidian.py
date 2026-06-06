import logging
import os
import time
import urllib.parse
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support import expected_conditions as EC

header = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
    "Referer": "https://qidian.com/",
    "Sec-Ch-Ua-Platform": '"Windows"',
    "Priority": "u=0, i",
}


class Book:
    def __init__(self, bid: int, driver: webdriver.Chrome):
        self.bid = bid
        try:
            driver.get("https://www.qidian.com/book/{}/".format(bid))
            WebDriverWait(driver, 60).until(
                EC.presence_of_element_located((By.ID, "bookCatalogSection"))
            )
            self.name = driver.find_element(
                By.ID, "bookName").get_attribute("innerText")
            self.chapters = []
            chapters_ul = driver.find_element(
                By.CLASS_NAME, class_="volume-chapters")
            chapters_a = chapters_ul.find_elements(
                By.CLASS_NAME, class_="chapter-name")
            for i in chapters_a:
                parsed = urllib.parse.urlparse(i.get_attribute("href"))
                self.chapters.append(Chapter(i.get_attribute(
                    "innerText"), parsed._replace(scheme='https').geturl()))
        except TimeoutException:
            logging.warning(
                "TimeoutException: bookCatalogSection, url: {}".format(driver.current_url))

    def __str__(self):
        return str(self.__dict__)

    def __repr__(self):
        return str(self.__dict__)


class Chapter:
    def __init__(self, name: str, url: str):
        self.name = name
        self.url = url

    def __str__(self):
        return str(self.__dict__)

    def __repr__(self):
        return str(self.__dict__)


def main():
    logging.basicConfig(level=logging.INFO)
    chrome_path = os.path.join(os.getcwd(), "chrome-win64")
    user_data_dir = os.path.join(chrome_path, "UserData")
    binary_location = os.path.join(chrome_path, "chrome.exe")
    ser = webdriver.ChromeService(executable_path="chromedriver.exe")
    options = webdriver.ChromeOptions()
    if user_data_dir:
        os.makedirs(user_data_dir, exist_ok=True)
        options.add_argument("user-data-dir={}".format(user_data_dir))
    if binary_location and os.path.exists(binary_location):
        options.binary_location = binary_location
    try:
        driver = webdriver.Chrome(service=ser, options=options)
        logging.info(Book(1041604040, driver))
        driver.close()
    finally:
        driver.quit()
    pass

    pass


if __name__ == "__main__":
    main()
