from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from Api import Personalizado, Productosmujer, Productoshombres

app = FastAPI(title="Web Scraping API")

app.add_middleware(
	CORSMiddleware,
	allow_origins=["*"],
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)

app.include_router(Personalizado.router)
app.include_router(Productosmujer.router)
app.include_router(Productoshombres.router)
