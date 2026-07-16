from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float, func
from sqlalchemy.orm import relationship
from app.db.session import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String, unique=True, index=True, nullable=False)
    title = Column(String, nullable=False)
    tagline = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    status = Column(String, nullable=False, default="in_development")  # live|in_development
    live_demo_url = Column(String, nullable=True)
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    screenshots = relationship(
        "ProjectScreenshot", back_populates="project", cascade="all, delete-orphan",
        order_by="ProjectScreenshot.sort_order",
    )


class ProjectScreenshot(Base):
    __tablename__ = "project_screenshots"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    platform = Column(String, nullable=False)  # ios|android|web|windows
    image_url = Column(String, nullable=False)
    sort_order = Column(Integer, default=0)
    # Where/how the image is framed inside its device mockup, matching the
    # CSS object-position/scale used to render it on the public site — lets
    # the admin reposition or zoom the crop without re-uploading the image.
    focal_x = Column(Float, nullable=False, default=50.0)
    focal_y = Column(Float, nullable=False, default=50.0)
    zoom = Column(Float, nullable=False, default=1.0)

    project = relationship("Project", back_populates="screenshots")
