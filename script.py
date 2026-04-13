from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup
import time

url = "https://www.superdry.com.co/hombre-superdry-productos"

with sync_playwright() as p:
    navegador = p.chromium.launch(headless=False)
    pagina = navegador.new_page()
    
    pagina.goto(url)
    time.sleep(4)
    
    
    while True:
        
            boton = pagina.locator("text=Mostrar más")
            
            if boton.count() ==0:
                break
            pagina.mouse.wheel(0, 4000)
            pagina.wait_for_timeout(3000)
            
            try:
                boton.first.click()
                pagina.wait_for_timeout(3000)
            except Exception:
                break
            
        
    html = pagina.content() 


    soup = BeautifulSoup(html, 'html.parser')
    productos = soup.find_all('span', class_='vtex-product-summary-2-x-productBrand vtex-product-summary-2-x-productBrand--main vtex-product-summary-2-x-brandName vtex-product-summary-2-x-brandName--main t-body')
    
    for producto in productos: 
        nombre_producto = producto.get_text(strip=True)
        print(nombre_producto)
    print(len(productos))
    navegador.close()
    