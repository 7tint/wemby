import time
import logging
from models import Player
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


def parse_position(position):
    # Format of "PG/SG" or "C"
    return position.split("/")


def get_numerator(fraction):
    fraction = fraction[1:-1]
    return float(fraction.split("/")[0])


def get_denominator(fraction):
    fraction = fraction[1:-1]
    return float(fraction.split("/")[1])


def parse_auction(value):
    if value == "$":
        return 0.0
    return float(value[1:])


def fix_abbreviations(abbreviation):
    if abbreviation == "PHO":
        return "PHX"
    if abbreviation == "UTA":
        return "UTAH"
    if abbreviation == "WAS":
        return "WSH"
    return abbreviation


def scrape_projections():
    url = "https://hashtagbasketball.com/fantasy-basketball-projections"

    driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()))
    driver.maximize_window()

    try:
        logger.info(f"Starting projections scrape for URL: {url}")
        driver.get(url)

        # Toggle to ALL players
        dropdown = driver.find_element(By.NAME, "ctl00$ContentPlaceHolder1$DDSHOW")
        dropdown.click()
        time.sleep(1)
        all_option = driver.find_element(By.XPATH, "//option[text()='All']")
        all_option.click()

        logger.info("Waiting for table to update")
        time.sleep(3)

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
                player = {
                    "rank": int(cols[0].text.strip()),
                    "adp": (
                        float(cols[1].text.strip()) if cols[1].text.strip() else 140.0
                    ),
                    "name": cols[2].text.strip(),
                    "positions": parse_position(cols[3].text.strip()),
                    "team": fix_abbreviations(cols[4].text.strip()),
                    "gp": float(cols[5].text.strip()),
                    "mpg": float(cols[6].text.strip()),
                    "fgm": get_numerator(
                        cols[7].find("span", class_="float-end").text.strip()
                    ),
                    "fga": get_denominator(
                        cols[7].find("span", class_="float-end").text.strip()
                    ),
                    "ftm": get_numerator(
                        cols[8].find("span", class_="float-end").text.strip()
                    ),
                    "fta": get_denominator(
                        cols[8].find("span", class_="float-end").text.strip()
                    ),
                    "3pm": float(cols[9].find("span").text.strip()),
                    "pts": float(cols[10].find("span").text.strip()),
                    "reb": float(cols[11].find("span").text.strip()),
                    "ast": float(cols[12].find("span").text.strip()),
                    "stl": float(cols[13].find("span").text.strip()),
                    "blk": float(cols[14].find("span").text.strip()),
                    "to": float(cols[15].find("span").text.strip()),
                    "total": float(cols[16].find("span").text.strip()),
                }
                players.append(player)
        return players

    finally:
        driver.quit()


def scrape_past_year_stats():
    url = "https://hashtagbasketball.com/fantasy-basketball-rankings"

    driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()))
    driver.maximize_window()

    try:
        logger.info(f"Starting rankings scrape for URL: {url}")
        driver.get(url)

        # Toggle to ALL players
        dropdown1 = driver.find_element(By.NAME, "ctl00$ContentPlaceHolder1$DDSHOW")
        dropdown1.click()
        time.sleep(1)
        all_option = driver.find_element(By.XPATH, "//option[text()='All']")
        all_option.click()
        logger.info("Waiting for table to update p.1")
        time.sleep(3)

        # Toggle to past year stats; second option in dropdown (value = 1)
        dropdown2 = driver.find_element(By.NAME, "ctl00$ContentPlaceHolder1$DDDURATION")
        dropdown2.click()
        time.sleep(1)
        past_year_option = driver.find_element(
            By.XPATH, '//*[@id="ContentPlaceHolder1_DDDURATION"]/option[2]'
        )
        past_year_option.click()

        logger.info("Waiting for table to update p.2")
        time.sleep(3)

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
                player = {
                    "rank": int(cols[0].text.strip()),
                    "name": cols[1].text.strip(),
                    "positions": parse_position(cols[2].text.strip()),
                    "team": fix_abbreviations(cols[3].text.strip()),
                    "gp": float(cols[4].text.strip()),
                    "mpg": float(cols[5].text.strip()),
                    "fgm": get_numerator(
                        cols[6].find("span", class_="float-end").text.strip()
                    ),
                    "fga": get_denominator(
                        cols[6].find("span", class_="float-end").text.strip()
                    ),
                    "ftm": get_numerator(
                        cols[7].find("span", class_="float-end").text.strip()
                    ),
                    "fta": get_denominator(
                        cols[7].find("span", class_="float-end").text.strip()
                    ),
                    "3pm": float(cols[8].find("span").text.strip()),
                    "pts": float(cols[9].find("span").text.strip()),
                    "reb": float(cols[10].find("span").text.strip()),
                    "ast": float(cols[11].find("span").text.strip()),
                    "stl": float(cols[12].find("span").text.strip()),
                    "blk": float(cols[13].find("span").text.strip()),
                    "to": float(cols[14].find("span").text.strip()),
                    "total": float(cols[15].find("span").text.strip()),
                }
                players.append(player)
        return players

    finally:
        driver.quit()


def scrape_auction_data():
    url = "https://hashtagbasketball.com/fantasy-basketball-auction-values"

    driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()))
    driver.maximize_window()

    try:
        logger.info(f"Starting auctions scrape for URL: {url}")
        driver.get(url)

        # Toggle to ALL players
        dropdown = driver.find_element(By.NAME, "ctl00$ContentPlaceHolder1$DDSHOW")
        dropdown.click()
        time.sleep(1)
        all_option = driver.find_element(By.XPATH, "//option[text()='All']")
        all_option.click()

        logger.info("Waiting for table to update")
        time.sleep(3)

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
                player = {
                    "name": cols[1].text.strip(),
                    "valued_at": parse_auction(cols[7].text.strip()),
                    "yahoo_avg": parse_auction(cols[8].text.strip()),
                    "espn_avg": parse_auction(cols[9].text.strip()),
                    "blend_avg": parse_auction(cols[10].text.strip()),
                }
                players.append(player)
        return players

    finally:
        driver.quit()
