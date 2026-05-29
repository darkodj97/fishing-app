from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from database import get_db
from datetime import datetime
from typing import Optional, List
import models
import schemas
import auth
import cloudinary
import cloudinary.uploader

cloudinary.config(
    cloud_name="dupcx8x2m",
    api_key="158472753541539",
    api_secret="d1HMaVfCXe194tNNH0pNb48Yz6M"
)

router = APIRouter(prefix="/catches", tags=["catches"])

@router.post("/", response_model=schemas.CatchResponse)
async def create_catch(
    fish_type: str = Form(...),
    weight_kg: float = Form(...),
    bait: str = Form(...),
    caught_at: datetime = Form(...),
    note: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    image_url = None

    if image:
        contents = await image.read()
        result = cloudinary.uploader.upload(contents, folder="fishing-app")
        image_url = result["secure_url"]

    db_catch = models.Catch(
        user_id=current_user.id,
        fish_type=fish_type,
        weight_kg=weight_kg,
        bait=bait,
        caught_at=caught_at.replace(tzinfo=None),
        image_url=image_url,
        note=note
    )
    db.add(db_catch)
    db.commit()
    db.refresh(db_catch)
    return db_catch

@router.get("/", response_model=List[schemas.CatchResponse])
def get_my_catches(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    catches = db.query(models.Catch).filter(
        models.Catch.user_id == current_user.id
    ).order_by(models.Catch.caught_at.desc()).all()
    return catches

@router.get("/{catch_id}", response_model=schemas.CatchResponse)
def get_catch(
    catch_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    catch = db.query(models.Catch).filter(
        models.Catch.id == catch_id,
        models.Catch.user_id == current_user.id
    ).first()
    if not catch:
        raise HTTPException(status_code=404, detail="Catch not found")
    return catch

@router.delete("/{catch_id}")
def delete_catch(
    catch_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    catch = db.query(models.Catch).filter(
        models.Catch.id == catch_id,
        models.Catch.user_id == current_user.id
    ).first()
    if not catch:
        raise HTTPException(status_code=404, detail="Catch not found")
    db.delete(catch)
    db.commit()
    return {"message": "Catch deleted"}

@router.put("/{catch_id}", response_model=schemas.CatchResponse)
async def update_catch(
    catch_id: int,
    fish_type: str = Form(...),
    weight_kg: float = Form(...),
    bait: str = Form(...),
    caught_at: datetime = Form(...),
    note: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    catch = db.query(models.Catch).filter(
        models.Catch.id == catch_id,
        models.Catch.user_id == current_user.id
    ).first()
    if not catch:
        raise HTTPException(status_code=404, detail="Catch not found")

    if image:
        contents = await image.read()
        result = cloudinary.uploader.upload(contents, folder="fishing-app")
        catch.image_url = result["secure_url"]

    catch.fish_type = fish_type
    catch.weight_kg = weight_kg
    catch.bait = bait
    catch.caught_at = caught_at.replace(tzinfo=None)
    catch.note = note

    db.commit()
    db.refresh(catch)
    return catch