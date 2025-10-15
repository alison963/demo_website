from selenium import webdriver
from selenium.webdriver.remote.webdriver import WebDriver

import playwright



chrome_options = webdriver.ChromeOptions()
chrome_options.add_argument("--disable-web-security")
chrome_options.add_argument("--disable-xss-auditor")

# launch Chrome

driver = webdriver.Chrome(executable_path="./chromedriver", options=chrome_options)
url = "http://localhost:3000"
driver.get(url)

inputs = driver.find_elements("tag name", "input")
if inputs:
    print("Selenium: Input fields found")