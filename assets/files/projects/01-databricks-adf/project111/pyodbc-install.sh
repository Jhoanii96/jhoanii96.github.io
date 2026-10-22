
#!/bin/bash
sudo apt-get update && ACCEPT_EULA=Y apt-get install "/Volumes/.../msodbcsql17_17_10_1_1_1_amd64.deb" -y
pip install '/Volumes/.../pyodbc-4.0.34-cp38-cp38-manylinux_2_24_x86_64.whl' --force-reinstall