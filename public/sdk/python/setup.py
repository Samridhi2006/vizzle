from setuptools import setup, find_packages

with open("README.md", encoding="utf-8") as f:
    long_description = f.read()

setup(
    name="vizzle",
    version="1.0.0",
    description="Python SDK for the Vizzle Virtual Try-On API",
    long_description=long_description,
    long_description_content_type="text/markdown",
    author="Vizzle Team",
    author_email="support@vizzle.ai",
    url="https://github.com/AdvayaBGSCET/team-mountain-dew",
    packages=find_packages(),
    python_requires=">=3.9",
    install_requires=[],   # zero external dependencies — uses stdlib only
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
        "Topic :: Software Development :: Libraries :: Python Modules",
        "Topic :: Internet :: WWW/HTTP",
    ],
    keywords="vizzle virtual try-on fashion ai api sdk",
)
