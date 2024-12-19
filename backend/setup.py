from setuptools import setup, find_packages

setup(
    name="diary_backend",
    version="0.1.0",
    packages=find_packages(),
    include_package_data=True,
    install_requires=[
        "fastapi==0.104.1",
        "uvicorn==0.24.0",
        "sqlalchemy==2.0.23",
        "aiosqlite==0.19.0",
        "python-multipart==0.0.6",
        "anthropic==0.7.8",
        "python-dotenv==1.0.0",
    ],
)
