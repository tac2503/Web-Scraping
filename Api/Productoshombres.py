from fastapi import APIRouter
from scraping.ProductosHombres import obtener_productos_hombres

router = APIRouter()

@router.get("/productoshombres")
def productoshombres():
    return obtener_productos_hombres()