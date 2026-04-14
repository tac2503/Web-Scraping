from playwright.sync_api import sync_playwright
import time

def obtener_productos_hombres():
    url = "https://www.superdry.com.co/hombre-superdry-productos"

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()

        page.goto(url)
        time.sleep(4)

        # cargar todo
        while True:
            boton = page.locator("text=Mostrar más")

            if boton.count() == 0:
                break

            page.mouse.wheel(0, 4000)
            page.wait_for_timeout(2000)

            try:
                boton.first.click()
                page.wait_for_timeout(2000)
            except Exception:
                break

        
        cards = page.locator("div.vtex-flex-layout-0-x-flexCol--main_shelf")

        productos = []

        for i in range(cards.count()):
            card = cards.nth(i)

            nombre = None
            precio = None
            mas_colores = "No"

            try:
                nombre = card.locator("span").first.text_content()
            except Exception:
                pass

            try:
                precio_locator = card.locator("p:has-text('$')").first
                precio = precio_locator.evaluate("""
                el => el.childNodes[0].textContent
                """).strip()
            except Exception:
                pass
            try: 
                colores = card.locator("p:has-text('Disponible en más colores')").first
                if colores.count() > 0:
                    mas_colores = "Si"
            except Exception:
                pass

            productos.append({
                "nombre": nombre.strip() if nombre else None,
                "precio": precio.strip() if precio else None,
                "mas_colores": mas_colores
            })

            # print(nombre, precio, mas_colores)

        browser.close()
        return productos

    


if __name__ == "__main__":
    obtener_productos_hombres()