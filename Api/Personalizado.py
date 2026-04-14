from fastapi import APIRouter
from scraping.DisponibilidadProducto import obtener_stock_producto

router = APIRouter()

@router.get("/personalizado")
def personalizado(url: str):
    url = url.strip().strip('"').strip("'")
    return obtener_stock_producto(url)

