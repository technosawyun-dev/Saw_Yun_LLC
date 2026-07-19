from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session, joinedload
from app.db.session import get_db
from app.models.project import Project, ProjectScreenshot
from app.schemas.project import (
    ProjectCreate, ProjectUpdate, ProjectSummaryOut, ProjectDetailOut,
    ScreenshotOut, ScreenshotPositionUpdate, PlatformLiteral,
)
from app.core.deps import require_admin
from app.services.storage import save_upload, delete_file

router = APIRouter(tags=["projects"])


def _to_summary(project: Project) -> ProjectSummaryOut:
    cover = project.screenshots[0].image_url if project.screenshots else None
    return ProjectSummaryOut(
        id=project.id, slug=project.slug, title=project.title, tagline=project.tagline,
        status=project.status, live_demo_url=project.live_demo_url, sort_order=project.sort_order,
        cover_image_url=cover,
    )


# Public

@router.get("/api/projects", response_model=list[ProjectSummaryOut])
def list_projects(db: Session = Depends(get_db)):
    projects = (
        db.query(Project).options(joinedload(Project.screenshots))
        .order_by(Project.sort_order.asc(), Project.created_at.desc()).all()
    )
    return [_to_summary(p) for p in projects]


@router.get("/api/projects/{slug}", response_model=ProjectDetailOut)
def get_project(slug: str, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.slug == slug).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


# Admin

@router.get("/api/admin/projects/{id}", response_model=ProjectDetailOut, dependencies=[Depends(require_admin)])
def get_project_admin(id: int, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.post("/api/admin/projects", response_model=ProjectDetailOut, dependencies=[Depends(require_admin)])
def create_project(body: ProjectCreate, db: Session = Depends(get_db)):
    if db.query(Project).filter(Project.slug == body.slug).first():
        raise HTTPException(status_code=400, detail="A project with this slug already exists")
    project = Project(**body.model_dump())
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@router.put("/api/admin/projects/{id}", response_model=ProjectDetailOut, dependencies=[Depends(require_admin)])
def update_project(id: int, body: ProjectUpdate, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    # exclude_unset (not exclude_none): a field explicitly sent as null means
    # "clear this," and must still be applied — only fields the client never
    # included in the request body at all should be left untouched.
    data = body.model_dump(exclude_unset=True)
    if "slug" in data and data["slug"] != project.slug:
        if db.query(Project).filter(Project.slug == data["slug"]).first():
            raise HTTPException(status_code=400, detail="A project with this slug already exists")
    for field, value in data.items():
        setattr(project, field, value)
    db.commit()
    db.refresh(project)
    return project


@router.delete("/api/admin/projects/{id}", status_code=204, dependencies=[Depends(require_admin)])
def delete_project(id: int, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    for shot in project.screenshots:
        delete_file(shot.image_url)
    db.delete(project)
    db.commit()


@router.post("/api/admin/projects/{id}/screenshots", response_model=ScreenshotOut, dependencies=[Depends(require_admin)])
async def add_screenshot(
    id: int,
    platform: PlatformLiteral = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    project = db.query(Project).filter(Project.id == id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    image_url = await save_upload(file)
    existing_count = db.query(ProjectScreenshot).filter(
        ProjectScreenshot.project_id == id, ProjectScreenshot.platform == platform
    ).count()
    shot = ProjectScreenshot(project_id=id, platform=platform, image_url=image_url, sort_order=existing_count)
    db.add(shot)
    db.commit()
    db.refresh(shot)
    return shot


@router.delete("/api/admin/projects/{id}/screenshots/{screenshot_id}", status_code=204, dependencies=[Depends(require_admin)])
def delete_screenshot(id: int, screenshot_id: int, db: Session = Depends(get_db)):
    shot = db.query(ProjectScreenshot).filter(
        ProjectScreenshot.id == screenshot_id, ProjectScreenshot.project_id == id
    ).first()
    if not shot:
        raise HTTPException(status_code=404, detail="Screenshot not found")
    delete_file(shot.image_url)
    db.delete(shot)
    db.commit()


@router.patch("/api/admin/projects/{id}/screenshots/{screenshot_id}", response_model=ScreenshotOut, dependencies=[Depends(require_admin)])
def update_screenshot_position(id: int, screenshot_id: int, body: ScreenshotPositionUpdate, db: Session = Depends(get_db)):
    shot = db.query(ProjectScreenshot).filter(
        ProjectScreenshot.id == screenshot_id, ProjectScreenshot.project_id == id
    ).first()
    if not shot:
        raise HTTPException(status_code=404, detail="Screenshot not found")
    shot.focal_x = body.focal_x
    shot.focal_y = body.focal_y
    shot.zoom = body.zoom
    db.commit()
    db.refresh(shot)
    return shot
