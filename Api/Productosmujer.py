from fastapi import APIRouter
from scraping.ProductosMujer import obtener_productos_mujer

router = APIRouter()

@router.get("/productosmujer")
def productosmujer():
    return obtener_productos_mujer()