from playwright.sync_api import sync_playwright
import time


def obtener_stock_producto(url_producto):
    DISPONIBILIDAD_JS ="""
    el => el.childNodes[1].textContent
    """
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()

        page.goto(url_producto)
        time.sleep(4)

        stock = {
            "Talla s:": " ",
            "Talla m:": " ",
            "Talla l:": " ",
            "Talla xl:": " ",
            "Talla xxl:": " ",
            "Talla única:": "No"
        }
        if page.locator("div[role='button']").filter(has_text="U").count() > 0:
            stock["Talla única:"] = "Si"
            return stock
        tallas = ["S", "M", "L", "XL", "XXL"]
        claves = ["Talla s:", "Talla m:", "Talla l:", "Talla xl:", "Talla xxl:"]
        
        for talla, clave in zip(tallas, claves):
                
            boton = page.locator(f"div[role='button']").filter(has_text=talla)
                
                

            if boton.count() > 0:
                btn = boton.first

                
                clases = btn.get_attribute("class") or ""

                if "unavailable" in clases:
                    stock[clave] = "Agotado"    
                else:
                    try:
                        btn.click()
                        page.wait_for_timeout(2000)

                        card = page.locator("div.vtex-product-availability-0-x-container")
                        disponibilidad = card.evaluate(DISPONIBILIDAD_JS).strip()

                        stock[clave] = disponibilidad if disponibilidad else "Sin info"

                    except Exception as e:
                        print(f"Error con talla {talla}:", e)
                        stock[clave] = "Error"

            else:
                stock[clave] = "Agotado"

    return stock
    
