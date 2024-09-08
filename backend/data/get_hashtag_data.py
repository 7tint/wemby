import time
import logging
from models import Player
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from webdriver_manager.chrome import ChromeDriverManager

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


def scrape_projections():
    url = "https://hashtagbasketball.com/fantasy-basketball-projections"

    logging.info("Setting up Chrome driver")
    driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()))

    try:
        logger.info(f"Starting scrape for URL: {url}")
        driver.get(url)

        # Wait for the "Show" button to be clickable and click it
        show_button = WebDriverWait(driver, 5).until(
            EC.element_to_be_clickable((By.NAME, "ctl00$ContentPlaceHolder1$DDSHOW"))
        )
        show_button.click()

        # Wait for the "All" option to be clickable and click it (identify by text)
        all_option = WebDriverWait(driver, 5).until(
            EC.element_to_be_clickable((By.XPATH, "//option[text()='All']"))
        )
        all_option.click()

        logger.info("Waiting for table to update")
        time.sleep(5)

        page_source = driver.page_source

        logger.info("Parsing HTML")
        soup = BeautifulSoup(page_source, "html.parser")

        players = []
        table = soup.find("table", {"id": "ContentPlaceHolder1_GridView1"})

        if table:
            tbody = table.find("tbody")
            rows = tbody.find_all("tr")[1:]
            for row in rows:
                cols = row.find_all("td")
                if cols[0].text == "R#":
                    continue
                # player = Player(
                #     rank=int(cols[0].text.strip()),
                #     adp=float(cols[1].text.strip()) if cols[1].text.strip() else 140.0,
                #     name=cols[2].text.strip(),
                # )
                # players.append(player)
        return players

    finally:
        driver.quit()
