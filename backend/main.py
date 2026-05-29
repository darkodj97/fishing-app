from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
import models
from routers import users, catches, leaderboard

# Kreira tabele u bazi ako ne postoje
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Fishing App API")

# CORS - dozvoljava React frontendu da komunicira sa API-jem
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registruj rutere
app.include_router(users.router)
app.include_router(catches.router)
app.include_router(leaderboard.router)

@app.get("/")
def root():
    return {"message": "Fishing App API radi!"}