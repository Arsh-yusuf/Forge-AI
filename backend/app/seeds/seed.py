from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.models.role import Role
from app.models.department import Department
from app.models.user import User

# -------------------------------------------------------
# Roles
# -------------------------------------------------------

ROLES = [
    "Plant Manager",
    "Maintenance Engineer",
    "Safety Officer",
    "Quality Engineer",
    "Operations Engineer"
]

# -------------------------------------------------------
# Departments
# -------------------------------------------------------

DEPARTMENTS = [
    "Maintenance",
    "Safety",
    "Production",
    "Quality",
    "Operations",
    "Utilities",
    "Warehouse"
]

# -------------------------------------------------------
# Demo Users
# -------------------------------------------------------

DEMO_USERS = [
    {
        "name": "Rajesh Kumar",
        "email": "plant.manager@apexsteel.com",
        "role": "Plant Manager",
        "department": "Production"
    },
    {
        "name": "Amit Verma",
        "email": "maintenance@apexsteel.com",
        "role": "Maintenance Engineer",
        "department": "Maintenance"
    },
    {
        "name": "Priya Singh",
        "email": "safety@apexsteel.com",
        "role": "Safety Officer",
        "department": "Safety"
    },
    {
        "name": "Neha Gupta",
        "email": "quality@apexsteel.com",
        "role": "Quality Engineer",
        "department": "Quality"
    },
    {
        "name": "Vikram Patel",
        "email": "operations@apexsteel.com",
        "role": "Operations Engineer",
        "department": "Operations"
    }
]


def seed_database(db: Session):

    # -------------------------------------------------------
    # Seed Roles
    # -------------------------------------------------------

    for role_name in ROLES:

        exists = db.query(Role).filter(
            Role.name == role_name
        ).first()

        if not exists:
            db.add(Role(name=role_name))

    db.commit()

    # -------------------------------------------------------
    # Seed Departments
    # -------------------------------------------------------

    for dept_name in DEPARTMENTS:

        exists = db.query(Department).filter(
            Department.name == dept_name
        ).first()

        if not exists:
            db.add(Department(name=dept_name))

    db.commit()

    # -------------------------------------------------------
    # Seed Demo Users
    # -------------------------------------------------------

    for demo_user in DEMO_USERS:

        exists = db.query(User).filter(
            User.email == demo_user["email"]
        ).first()

        if exists:
            continue

        role = db.query(Role).filter(
            Role.name == demo_user["role"]
        ).first()

        department = db.query(Department).filter(
            Department.name == demo_user["department"]
        ).first()

        user = User(
            full_name=demo_user["name"],
            email=demo_user["email"],
            password_hash=hash_password("Forge@123"),
            role_id=role.id,
            department_id=department.id
        )

        db.add(user)

    db.commit()

    print("✅ Database seeded successfully.")